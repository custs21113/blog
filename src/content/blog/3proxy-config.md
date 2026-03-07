---
title: Dockerized 3proxy 部署指南
date: 2026-03-07T23:02:00+08:00
updated: 2026-03-07T23:02:00+08:00
keywords: ["docker", "linux"]
featured: true
summary: "两种使用doker快速部署 3proxy 的操作指南"
---


本项目提供两种极简部署方式：**Docker Compose** (推荐) 和 **Dockerfile**。两种方式均已集成自生成配置功能，**无需挂载任何配置文件，无权限问题**。

#### 方式一：使用 Docker Compose (推荐)

最简单的部署方式，只需一个 YAML 文件。

##### 1. 准备文件
在服务器上创建 `docker-compose.yml` 文件，复制以下内容：

```yaml
version: '3.8'

services:
  proxy-server:
    image: ghcr.io/tarampampam/3proxy:latest
    container_name: 3proxy-core
    restart: always
    ports:
      - "${PROXY_HTTP_PORT:-3128}:3128"
      - "${PROXY_SOCKS_PORT:-1080}:1080"
    # 自动生成配置文件
    entrypoint:
      - /bin/sh
      - -c
      - |
        echo "
        nscache 65536
        nserver 8.8.8.8
        nserver 8.8.4.4
        auth strong
        users ${PROXY_USER:-user}:CL:${PROXY_PASS:-pass}
        allow ${PROXY_USER:-user}
        proxy -p3128
        socks -p1080
        " > /etc/3proxy/3proxy.cfg && /bin/3proxy /etc/3proxy/3proxy.cfg
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
```

##### 2. 启动服务
```bash
# 默认配置启动 (端口: 3128/1080, 账号: user, 密码: pass)
docker-compose up -d

# 自定义端口和密码启动
PROXY_HTTP_PORT=8080 PROXY_SOCKS_PORT=9090 PROXY_USER=admin PROXY_PASS=secure123 docker-compose up -d
```

---

#### 方式二：使用 Dockerfile 构建镜像

适用于需要分发自定义镜像或在 Kubernetes 等环境中使用的情况。

##### 1. 准备文件
在服务器上创建 `Dockerfile` 文件，复制以下内容：

```dockerfile
FROM ghcr.io/tarampampam/3proxy:latest

USER 0
ENV TZ=Asia/Shanghai
ENV PROXY_HTTP_PORT=3128
ENV PROXY_SOCKS_PORT=1080
ENV PROXY_USER=user
ENV PROXY_PASS=pass

RUN echo '#!/bin/sh' > /entrypoint.sh && \
    echo 'set -e' >> /entrypoint.sh && \
    echo 'cat > /etc/3proxy/3proxy.cfg <<EOF' >> /entrypoint.sh && \
    echo 'nscache 65536' >> /entrypoint.sh && \
    echo 'nserver 8.8.8.8' >> /entrypoint.sh && \
    echo 'nserver 8.8.4.4' >> /entrypoint.sh && \
    echo 'auth strong' >> /entrypoint.sh && \
    echo 'users ${PROXY_USER}:CL:${PROXY_PASS}' >> /entrypoint.sh && \
    echo 'allow ${PROXY_USER}' >> /entrypoint.sh && \
    echo 'proxy -p${PROXY_HTTP_PORT}' >> /entrypoint.sh && \
    echo 'socks -p${PROXY_SOCKS_PORT}' >> /entrypoint.sh && \
    echo 'EOF' >> /entrypoint.sh && \
    echo 'exec /bin/3proxy /etc/3proxy/3proxy.cfg' >> /entrypoint.sh && \
    chmod +x /entrypoint.sh

USER 61000
EXPOSE 3128 1080
ENTRYPOINT ["/entrypoint.sh"]
```

##### 2. 构建镜像
```bash
docker build -t my-3proxy .
```

##### 3. 运行容器
```bash
docker run -d \
  --name 3proxy \
  --restart always \
  -p 3128:3128 \
  -p 1080:1080 \
  -e PROXY_USER=admin \
  -e PROXY_PASS=secret123 \
  my-3proxy
```

---

#### 验证服务

无论使用哪种方式，服务启动后均可通过以下方式验证：

**1. 检查端口监听**
```bash
netstat -tulpn | grep -E '3128|1080'
```

**2. 测试 SOCKS5 代理**
```bash
curl --socks5 user:pass@localhost:1080 https://ifconfig.me
```

**3. 指纹浏览器配置**
- **协议**: SOCKS5
- **IP**: 服务器公网 IP
- **端口**: 1080
- **账号**: user (或自定义)
- **密码**: pass (或自定义)

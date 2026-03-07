---
title: 手动打包服务镜像并部署到服务器
date: 2026-03-07T23:02:00+08:00
updated: 2026-03-07T23:02:00+08:00
keywords: ["docker", "linux"]
featured: true
summary: "如何在不发布镜像的情况下部署 Docker 镜像"
---

有些时候我们并不希望把比较敏感的镜像发布到 Docker Hub 上，通常我们有几种方法可以解决这个问题。
1. 在服务器上直接构建镜像
2. 使用其他公有云免费服务(阿里云容器镜像服务（ACR）个人版、腾讯云容器镜像服务（TCR）、GitHub Container Registry)[^使用其他公有云免费服务]
3. 在开发环境构建镜像打包后部署到服务器上

今天我们来介绍下开发环境构建镜像打包后部署到服务器上的部署方式。

##### 1. 构建镜像
```bash
docker build -t xxx .

# mac arm64 打包 amd64

export DOCKER_DEFAULT_PLATFORM=linux/amd64
docker build -t rock-one-website:amd64 .

```
 
##### 2. 将镜像打包
```bash
docker save -o myapp.tar myapp:latest
# 使用 gzip 压缩 tar 包
docker save myapp:latest | gzip > myapp.tar.gz
```

##### 3. 使用scp发送压缩包到服务器

```bash
scp myapp.tar.gz user@server:/path/to/destination
```
##### 4. 从压缩包中加载镜像

```bash
docker load -i /path/to/destination/myapp.tar

# 如果是 gzip 压缩过的文件
gunzip -c myapp.tar.gz | docker load
# 或者
cat myapp.tar.gz | gunzip | docker load
```
##### 5. 运行镜像
```bash
docker run -d --name myapp-container myapp:latest
```



##### 引用
[^使用其他公有云免费服务]: [DockerHub被禁掉的应对之法](https://developer.aliyun.com/article/1649002)
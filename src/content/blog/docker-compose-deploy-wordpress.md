---
title: Docker Compose 快速部署 WordPress
date: 2026-03-08T10:42:00+08:00
updated: 2026-03-08T10:42:00+08:00
keywords: ["docker-compose", "wordpress"]
featured: true
summary: "使用 Docker Compose 快速部署 WordPress 所需的基础服务"
---

使用docker-compose快速部署wordpress所需的基础服务

##### docker-compose.yml
```yaml
services:
  db:
    image: mysql:8.0
    container_name: wp_db
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: ${MYSQL_DATABASE}
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
    command: --default-authentication-plugin=mysql_native_password
    volumes:
      - db_data:/var/lib/mysql
    networks:
      - wp_network

  wordpress:
    image: wordpress:latest
    container_name: wp_app
    restart: always
    ports:
      - "8080:80"
    environment:
      WORDPRESS_DB_HOST: ${WORDPRESS_DB_HOST}
      WORDPRESS_DB_USER: ${WORDPRESS_DB_USER}
      WORDPRESS_DB_PASSWORD: ${WORDPRESS_DB_PASSWORD}
      WORDPRESS_DB_NAME: ${WORDPRESS_DB_NAME}
    volumes:
      - wp_data:/var/www/html
    networks:
      - wp_network
    depends_on:
      - db

volumes:
  db_data:
  wp_data:

networks:
  wp_network:
    driver: bridge

```
##### .env
```text
# Database configuration
MYSQL_ROOT_PASSWORD=somewordpressroot
MYSQL_DATABASE=wordpress
MYSQL_USER=wordpress
MYSQL_PASSWORD=wordpress

# WordPress configuration
WORDPRESS_DB_HOST=db:3306
WORDPRESS_DB_USER=wordpress
WORDPRESS_DB_PASSWORD=wordpress
WORDPRESS_DB_NAME=wordpress

```

##### 部署步骤

1. 启动服务
```shell
docker-compose up -d
# 关闭服务
docker-compose down
```
2. 开放防火墙端口
```shell
ufw allow 8000/tcp
```
3. 访问wordpress后台并进行配置使用
`http://localhost:8080/wp-admin` 进行配置。

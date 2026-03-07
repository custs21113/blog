#!/bin/bash

DOCKER_DEFAULT_PLATFORM=linux/amd64
docker build -t blog:amd64 .

docker save blog:amd64 | gzip > blog_amd64.tar.gz

# 加载 .env 文件（假设与脚本在同一目录）
if [ -f .env ]; then
    source .env
else
    echo "错误：.env 文件不存在" >&2
    exit 1
fi


scp "blog_amd64.tar.gz" "root@$DEPLOY_HOST:$DESTINATION"

echo "已将文件 blog_amd64.tar.gz 复制到 $DEPLOY_HOST:$DESTINATION"
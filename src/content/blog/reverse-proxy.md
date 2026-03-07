---
title: nginx 反向代理的使用
date: 2026-03-07T23:45:00+08:00
updated: 2026-03-07T23:45:00+08:00
keywords: ["nginx", "reverse proxy"]
featured: true
summary: "Nginx反向代理实现多个服务在同一个IP的多个80端口上访问"
---

##### 通过反向代理实现多个服务在同一个IP的多个80端口上访问

```conf
server {
    listen       80;
    server_name  rockone.tech;
    location / {
        proxy_pass http://127.0.0.1:3000;

        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';

        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;

        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
server {
    listen 80;
    server_name nougat.icu;

    location / {
        proxy_pass http://127.0.0.1:3001;

        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';

        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;

        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

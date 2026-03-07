---
title: PostgreSQL集群部署
date: 2025-11-05T20:10:00+08:00
updated: 2025-11-05T20:10:00+08:00
keywords: ["hello", "world"]
featured: true
summary: "PostgreSQL集群部署相关内容"
---


#### 1. 多数据库实例部署PG主从集群

##### 1.1 使用init创建数据库实例

```bash
mkdir /var/lib/pgsql/primary
chown -R postgres:postgres /var/lib/pgsql/primary
chmod 700 /var/lib/pgsql/primary
su - postgres
initdb /var/lib/pgsql/primary
```

##### 1.2 创建 replicator 用户

```bash
su - postgres
psql -p postgres-primary-port -d postgres
```

```sql
-- 创建 replicator 用户
CREATE USER replicator WITH REPLICATION LOGIN PASSWORD 'replpass';
```

##### 1.3 配置replication

在同一台主机或者不同主机上的部署配置差异只有在 `pg_hba.conf` 上

```conf
# postgres.conf
wal_level = replica
max_wal_senders = 10
hot_standby = on
```

```conf
# pg_hba.conf
# TYPE  DATABASE        USER            ADDRESS                 METHOD
host    replication     replicator      0.0.0.0/0               md5
# 生产环境中可以将地址栏替换为具体的 IP 或域名
```

##### 1.4 启动 Primary 实例

```bash
su - postgres
pg_ctl -D /var/lib/pgsql/primary start
```

##### 1.5 初始化 Standby 实例

```bash
su - postgres
pg_basebackup -h postgres-primary -p postgres-primary-port -D /var/lib/pgsql/standby -U replicator -Fp -Xs -P -R
```

##### 1.6 启动 Standby 实例

```bash
mkdir /var/lib/pgsql/standby
chown -R postgres:postgres /var/lib/pgsql/standby
chmod 700 /var/lib/pgsql/standby
su - postgres
pg_ctl -D /var/lib/pgsql/standby -l /var/lib/pgsql/standby/logfile start
```

##### 1.7. docker-compose部署PG主从集群

###### docker-compose.yaml

```yaml
services:
  postgres-primary:
    image: postgres:16
    container_name: pg-primary
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: mydb
    ports:
      - "15432:5432"
    volumes:
      - ./master/data:/var/lib/postgresql/data
      - ./postgresql.conf:/etc/postgresql/postgresql.conf
      - ./pg_hba.conf:/etc/postgresql/pg_hba.conf
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    command: postgres -c config_file=/etc/postgresql/postgresql.conf -c hba_file=/etc/postgresql/pg_hba.conf

  postgres-replica1:
    image: postgres:16
    container_name: pg-replica1
    depends_on:
      - postgres-primary
    environment:
      PGPASSWORD: replpass
      POSTGRES_PASSWORD: postgres
    ports:
      - "15433:5432"
    volumes:
      - ./replica1/data:/var/lib/postgresql/data
      - ./setup-replica.sh:/setup-replica.sh
    entrypoint: ["/bin/bash", "/setup-replica.sh"]

  postgres-replica2:
    image: postgres:16
    container_name: pg-replica2
    depends_on:
      - postgres-primary
    environment:
      PGPASSWORD: replpass
      POSTGRES_PASSWORD: postgres
    ports:
      - "15434:5432"
    volumes:
      - ./replica2/data:/var/lib/postgresql/data
      - ./setup-replica.sh:/setup-replica.sh
    entrypoint: ["/bin/bash", "/setup-replica.sh"]
```

###### init.sql

```sql
-- init.sql
-- 创建 replicator 用户
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE rolname = 'replicator') THEN
      CREATE ROLE replicator WITH REPLICATION LOGIN PASSWORD 'replpass';
   END IF;
END
$do$;
```

###### setup-replica.sh
```bash
#!/bin/bash
set -e

PGDATA="/var/lib/postgresql/data"

if [ ! -s "$PGDATA/PG_VERSION" ]; then
  echo "Initializing replica..."
  rm -rf "$PGDATA"/*

  until pg_basebackup \
    -h postgres-primary \
		-p postgres-primary-port \
    -D "$PGDATA" \
    -U replicator \
    -Fp -Xs -P -R
  do
    echo "Waiting for primary..."
    sleep 3
  done

  echo "Fixing permissions..."
  chown -R postgres:postgres "$PGDATA"
  chmod 700 "$PGDATA"
fi

echo "Starting PostgreSQL as postgres user..."
exec gosu postgres postgres

```

###### postgresql.conf

```conf
# -----------------------------
# PostgreSQL configuration file
# -----------------------------

listen_addresses = '*'		# what IP address(es) to listen on;
# comma-separated list of addresses;
# defaults to 'localhost'; use '*' for all
# (change requires restart)
port = 5433				# (change requires restart)
max_connections = 100			# (change requires restart)
wal_level = replica			# minimal, replica, or logical
# (change requires restart)
max_wal_senders = 10		# max number of walsender processes
# (change requires restart)
max_replication_slots = 10	# max number of replication slots
# (change requires restart)
hot_standby = on			# "off" disallows queries during recovery
# (change requires restart)
```

###### pg_hba.conf

```conf
# PostgreSQL Client Authentication Configuration File
# ===================================================
# TYPE  DATABASE        USER            ADDRESS                 METHOD
# 新增一条记录，允许 replicator 用户从任何主机连接
host 		replication 		replicator 			0.0.0.0/0 							md5

```

#### 2. 使用 Patroni + etcd 部署 PG HA集群

#### 3. 使用CloudNativaPG 在k8s部署PG主从集群

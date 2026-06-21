# MySQL 数据库连接错误解决方案

## 🐛 错误信息

```
Could not create connection to database server. Attempted reconnect 3 times. Giving up.
Caused by: com.mysql.jdbc.exceptions.jdbc4.MySQLNonTransientConnectionException: Public Key Retrieval is not allowed
```

## 🔍 问题原因

1. **MySQL 连接配置问题** - `Public Key Retrieval is not allowed`
2. **数据库服务可能未启动**
3. **连接参数配置不正确**

## ✅ 解决方案

### 方案 1: 修改数据库连接 URL（推荐）

在后端配置文件中添加 `allowPublicKeyRetrieval=true` 参数。

#### Spring Boot 项目配置

**application.yml** 或 **application.properties**：

```yaml
# application.yml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/your_database?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
    username: your_username
    password: your_password
    driver-class-name: com.mysql.cj.jdbc.Driver
```

或

```properties
# application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/your_database?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

**关键参数**：
- `allowPublicKeyRetrieval=true` - 允许从服务器获取公钥
- `useSSL=false` - 关闭 SSL（本地开发）
- `serverTimezone=UTC` - 设置时区

### 方案 2: 检查 MySQL 服务是否运行

```bash
# macOS (Homebrew)
brew services start mysql

# 或
mysql.server start

# 检查 MySQL 状态
brew services list | grep mysql
```

### 方案 3: 使用 MySQL 8.0+ 兼容配置

如果使用 MySQL 8.0+，需要使用新的驱动和配置：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/your_database?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Shanghai
    driver-class-name: com.mysql.cj.jdbc.Driver
```

**注意**：
- 驱动类名改为 `com.mysql.cj.jdbc.Driver`（新版本）
- 旧版本是 `com.mysql.jdbc.Driver`（已废弃）

### 方案 4: 修改 MySQL 用户认证方式

登录 MySQL 并修改用户认证插件：

```sql
-- 登录 MySQL
mysql -u root -p

-- 修改用户认证方式
ALTER USER 'your_username'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';

-- 刷新权限
FLUSH PRIVILEGES;
```

### 方案 5: 检查数据库连接信息

确认以下信息正确：
- ✅ 数据库地址（localhost 或 127.0.0.1）
- ✅ 端口号（默认 3306）
- ✅ 数据库名称
- ✅ 用户名和密码
- ✅ 数据库是否已创建

## 🔧 完整配置示例

### application.yml

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/bty_db?useUnicode=true&characterEncoding=utf-8&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Shanghai
    username: root
    password: your_password
    driver-class-name: com.mysql.cj.jdbc.Driver
    hikari:
      minimum-idle: 5
      maximum-pool-size: 20
      connection-timeout: 30000
      idle-timeout: 600000
      max-lifetime: 1800000
```

### pom.xml 依赖

确保使用正确的 MySQL 驱动版本：

```xml
<!-- MySQL 8.0+ -->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.28</version>
</dependency>

<!-- 或 MySQL 5.7 -->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>5.1.49</version>
</dependency>
```

## 🧪 测试数据库连接

### 1. 命令行测试

```bash
# 测试连接
mysql -h localhost -P 3306 -u root -p

# 或
mysql -u root -p
```

### 2. 检查数据库是否存在

```sql
SHOW DATABASES;
CREATE DATABASE IF NOT EXISTS bty_db;
USE bty_db;
SHOW TABLES;
```

### 3. 检查用户权限

```sql
SHOW GRANTS FOR 'root'@'localhost';
```

## 📋 排查步骤

### 步骤 1: 检查 MySQL 服务

```bash
# macOS
brew services list | grep mysql

# 启动 MySQL
brew services start mysql
# 或
mysql.server start
```

### 步骤 2: 测试命令行连接

```bash
mysql -u root -p
# 输入密码后，看是否能连接成功
```

### 步骤 3: 检查配置文件

查看后端项目的配置文件：
- `application.yml`
- `application.properties`
- `application-dev.yml`

### 步骤 4: 添加连接参数

在连接 URL 后添加参数：
```
?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
```

### 步骤 5: 重启后端服务

修改配置后，重启 Spring Boot 应用。

## 🚨 常见错误及解决

### 错误 1: Public Key Retrieval is not allowed

**解决**：添加 `allowPublicKeyRetrieval=true`

### 错误 2: Access denied for user

**解决**：
1. 检查用户名和密码
2. 检查用户权限
3. 修改用户密码

```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;
```

### 错误 3: Unknown database

**解决**：创建数据库

```sql
CREATE DATABASE bty_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 错误 4: Communications link failure

**解决**：
1. 检查 MySQL 服务是否运行
2. 检查防火墙设置
3. 检查端口是否被占用

```bash
# 检查端口
lsof -i :3306
```

## 💡 推荐配置（完整）

```yaml
spring:
  datasource:
    # MySQL 8.0+
    url: jdbc:mysql://localhost:3306/bty_db?useUnicode=true&characterEncoding=utf-8&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Shanghai&rewriteBatchedStatements=true
    username: root
    password: your_password
    driver-class-name: com.mysql.cj.jdbc.Driver

    # HikariCP 连接池配置
    hikari:
      minimum-idle: 5
      maximum-pool-size: 20
      connection-timeout: 30000
      idle-timeout: 600000
      max-lifetime: 1800000
      connection-test-query: SELECT 1

# JPA 配置（如果使用）
  jpa:
    database-platform: org.hibernate.dialect.MySQL8Dialect
    show-sql: true
    hibernate:
      ddl-auto: update
```

## 🎯 快速解决方案

最快的方法是在数据库连接 URL 后添加：

```
?allowPublicKeyRetrieval=true&useSSL=false
```

例如：
```
jdbc:mysql://localhost:3306/bty_db?allowPublicKeyRetrieval=true&useSSL=false
```

然后重启后端服务即可。

---

**更新时间**: 2026-06-21
**问题类型**: 后端数据库连接
**影响范围**: 后端服务无法启动或连接数据库失败

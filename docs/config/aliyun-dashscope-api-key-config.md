# 阿里云通义万相 API 配置说明

## 📋 你的 API Key

```
sk-a0e31287ab314fc99efb9db7c6a4496b
```

---

## 🔧 配置方法

### ⚠️ 重要提醒

**请勿将 API Key 直接提交到代码仓库！**

建议使用以下方式之一：

---

### 方法 1: 使用环境变量（推荐）

#### 后端配置

**步骤 1: 设置环境变量**

```bash
# macOS/Linux
export ALIYUN_DASHSCOPE_API_KEY=sk-a0e31287ab314fc99efb9db7c6a4496b

# Windows
set ALIYUN_DASHSCOPE_API_KEY=sk-a0e31287ab314fc99efb9db7c6a4496b
```

**步骤 2: 配置文件使用环境变量**

```yaml
# application.yml
aliyun:
  dashscope-api-key: ${ALIYUN_DASHSCOPE_API_KEY}
```

---

### 方法 2: 使用配置文件（不提交到 git）

#### 后端配置

**步骤 1: 创建配置文件**

创建 `application-local.yml`（仅用于本地开发）:

```yaml
# application-local.yml（不要提交到 git）
aliyun:
  dashscope-api-key: sk-a0e31287ab314fc99efb9db7c6a4496b
```

**步骤 2: 添加到 .gitignore**

确保 `.gitignore` 中包含：

```
application-local.yml
application-secret.yml
*-secret.yml
```

**步骤 3: 使用配置文件**

```yaml
# application.yml
aliyun:
  dashscope-api-key: ${ALIYUN_DASHSCOPE_API_KEY:please-set-your-api-key}

# 激活本地配置
spring:
  profiles:
    active: local
```

---

### 方法 3: IntelliJ IDEA 运行配置

**步骤 1: 在 IDEA 中设置**

Run → Edit Configurations → Environment variables:

```
ALIYUN_DASHSCOPE_API_KEY=sk-a0e31287ab314fc99efb9db7c6a4496b
```

---

## 📝 后端完整配置示例

### application.yml

```yaml
# 阿里云配置
aliyun:
  # DashScope API Key（使用环境变量）
  dashscope-api-key: ${ALIYUN_DASHSCOPE_API_KEY}

  # 或使用本地配置文件（不提交到 git）
  # dashscope-api-key: 请在 application-local.yml 中设置
```

### application-local.yml（不要提交）

```yaml
# 本地开发配置（包含敏感信息，不要提交）
aliyun:
  dashscope-api-key: sk-a0e31287ab314fc99efb9db7c6a4496b
```

---

## 🧪 测试接口

配置完成后，测试接口是否正常：

### 使用 curl 测试

```bash
# 测试抠图接口
curl -X POST http://localhost:8082/api/food-diary/ai/smart-cutout \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "https://help.aliyun.com/static/images/dashscope-logo.png",
    "description": "logo"
  }'
```

### 预期响应

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "cutoutUrl": "https://..."
  }
}
```

---

## 🔐 安全建议

### ✅ 推荐做法

1. **使用环境变量** - 最安全的方式
2. **使用配置文件** - 添加到 .gitignore
3. **使用密钥管理服务** - 生产环境推荐

### ❌ 不要做

1. **不要提交到 git** - 会泄露到公开仓库
2. **不要写在前端代码** - 小程序端不能直接调用
3. **不要分享给别人** - API Key 是你的私人密钥

---

## 📊 调用量监控

### 查看调用量

访问 [阿里云 DashScope 控制台](https://dashscope.console.aliyun.com/) 查看：
- 本月调用次数
- 剩余免费额度
- 费用统计

### 设置告警

建议设置费用告警，避免超预算。

---

## 🚀 快速开始

1. **配置 API Key** - 选择上述方法之一
2. **启动后端服务** - 确保配置生效
3. **测试接口** - 使用 curl 测试
4. **小程序测试** - 完整测试抠图功能

---

## 📞 需要帮助？

如果配置遇到问题：
- 查看后端日志确认配置是否生效
- 测试接口是否正常返回
- 参考完整文档: `docs/backend-templates/AiCutoutBackendTemplate.java`

---

**更新时间**: 2026-06-21
**API Key 状态**: ✅ 已获取
**配置状态**: ⬜ 等待配置到后端
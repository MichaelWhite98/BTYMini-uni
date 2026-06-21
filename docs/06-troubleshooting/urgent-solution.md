# 🚨 紧急解决方案

## 问题诊断

### 1. setDevToken 未定义

**原因**: 代码已修改，但需要重新编译

**解决**:
```bash
# 在终端运行
npm run dev:mp-weixin
```

然后在微信开发者工具中点击"编译"。

### 2. 所有接口返回 502

**实际情况**: 不是真正的 502，而是后端返回了业务错误码

测试结果：
```bash
curl -X POST "http://192.168.31.185:8082/api/food-diary/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"code":"test123"}'

# 返回：
{"code":500,"msg":"系统错误","data":[]}
```

**原因**:
- HTTP 状态码是 200（正常）
- 业务状态码是 500（系统错误）
- 登录接口可能需要真实的微信 code

## ✅ 解决方案

### 方案 1: 重新编译并测试（推荐）

#### 步骤 1: 重新编译

```bash
# 终端
npm run dev:mp-weixin
```

#### 步骤 2: 在微信开发者工具中点击"编译"

#### 步骤 3: 在控制台运行测试

```javascript
// 直接测试后端接口
testBackendDirectly()
```

这会测试：
- 根路径是否可访问
- 登录接口是否正常
- 统计接口是否需要 token

### 方案 2: 获取真实 Token

#### 方法 A: 查看后端日志

1. 打开 IntelliJ IDEA
2. 查看控制台日志
3. 找到类似这样的日志：

```
用户登录成功，token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

4. 复制 token，在控制台运行：

```javascript
setRealToken('复制的token')
```

#### 方法 B: 使用后端测试接口

如果后端有测试登录接口：

```javascript
// 在控制台运行
uni.request({
  url: 'http://192.168.31.185:8082/api/food-diary/auth/test-login',
  method: 'POST',
  data: {
    phone: '13800138000',
    code: '123456'
  },
  success: (res) => {
    console.log('登录结果:', res)
    if (res.data.code === 200) {
      setRealToken(res.data.data.token)
      console.log('✅ Token 已保存')
    }
  }
})
```

#### 方法 C: 联系后端开发

联系后端开发人员，获取一个有效的测试 Token。

### 方案 3: 临时关闭后端认证

让后端开发在开发环境临时关闭认证：

```java
// 后端代码示例
@Profile("dev")
public class DevSecurityConfig {
    // 跳过 token 验证
}
```

### 方案 4: 使用真机调试

1. 点击微信开发者工具的"真机调试"
2. 用手机扫码打开小程序
3. 小程序会自动调用微信登录
4. 获取真实的 code 和 token

## 📋 快速命令（重新编译后可用）

```javascript
// 1. 测试后端接口
testBackendDirectly()

// 2. 设置测试 Token
setDevToken()

// 3. 设置真实 Token
setRealToken('你的token')

// 4. 检查登录状态
checkDevLogin()

// 5. 查看当前 Token
getToken()

// 6. 完整诊断
networkDiagnosis()
```

## 🔄 操作流程

```
┌─────────────────────────────────┐
│  1. 重新编译项目                  │
│     npm run dev:mp-weixin       │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  2. 微信开发者工具点击"编译"       │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  3. 控制台运行 testBackendDirectly()│
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  4. 根据测试结果选择方案           │
│  - 如果登录成功：Token 已保存      │
│  - 如果需要 Token：联系后端获取    │
│  - 如果后端错误：查看后端日志      │
└─────────────────────────────────┘
```

## 💡 常见问题

### Q1: 重新编译后还是 setDevToken 未定义？

**A**: 确保在微信开发者工具中也点击了"编译"按钮，而不仅仅是终端编译。

### Q2: testBackendDirectly 显示什么？

**A**: 会显示 4 个测试的结果：
1. 根路径测试
2. 登录接口测试
3. 统计接口测试（无 token）
4. 统计接口测试（有 token）

### Q3: 如何知道后端是否需要 Token？

**A**: 如果返回 `{"code":332,"msg":"token参数为空"}`，说明需要 Token。

### Q4: 后端返回 500 错误怎么办？

**A**:
1. 查看 IntelliJ IDEA 中的后端日志
2. 找到具体的错误信息
3. 联系后端开发解决

## 📞 需要帮助？

如果以上方案都无法解决，请提供：

1. `testBackendDirectly()` 的完整输出
2. 后端日志中的错误信息
3. 后端是否支持测试登录

---

**更新时间**: 2026-06-21
**下一步**: 重新编译项目，然后运行 `testBackendDirectly()`

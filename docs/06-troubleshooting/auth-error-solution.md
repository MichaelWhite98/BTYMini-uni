# 🚨 认证问题解决方案

## 问题诊断

### 错误信息
```
GET http://192.168.31.185:8082/api/food-diary/stats/monthly?month=2026-06 502 (Bad Gateway)
加载统计数据失败: Error: 请求失败: 502
```

### 实际问题

通过测试发现，**这不是 502 错误**，而是**需要登录认证**：

```bash
curl http://192.168.31.185:8082/api/food-diary/stats/monthly?month=2026-06

# 返回：
{"code":332,"data":[],"msg":"token参数为空"}
```

后端返回了 `code: 332`，表示 Token 为空或已过期。

## ✅ 解决方案

### 方案 1: 使用测试 Token（开发环境推荐）

#### 步骤 1: 在控制台设置测试 Token

打开微信开发者工具的控制台，运行：

```javascript
// 方法 1: 使用开发工具
import { setDevToken } from '@/utils/dev-login.js'
setDevToken()

// 方法 2: 直接在控制台运行
setDevToken()
```

#### 步骤 2: 刷新页面

设置 Token 后，刷新页面重新加载数据。

**注意**: 测试 Token 可能无法通过后端验证，如果仍然失败，请使用方案 2。

### 方案 2: 获取真实 Token（推荐）

#### 方法 A: 从后端日志获取

1. 查看 IntelliJ IDEA 控制台中的后端日志
2. 找到登录成功的日志，复制 Token
3. 在控制台运行：

```javascript
setRealToken('你从后端获取的真实Token')
```

#### 方法 B: 临时关闭后端认证

联系后端开发人员，在开发环境中临时关闭认证。

#### 方法 C: 使用测试账号登录

如果后端支持测试账号登录，可以使用：

```javascript
// 需要后端提供测试登录接口
uni.request({
  url: 'http://192.168.31.185:8082/api/food-diary/auth/test-login',
  method: 'POST',
  data: {
    phone: '13800138000',
    code: '123456'
  },
  success: (res) => {
    if (res.data.code === 200) {
      setRealToken(res.data.data.token)
      console.log('登录成功')
    }
  }
})
```

### 方案 3: 真机调试

在真机上测试，`uni.login()` 会正常工作：

1. 点击微信开发者工具的"预览"或"真机调试"
2. 用手机扫码打开小程序
3. 小程序会自动登录并获取 Token

## 🔧 已修复的问题

### 1. API 错误处理优化

修改了 `src/utils/food-diary/api.js`，正确处理业务状态码：

```javascript
// 修复前：只检查 HTTP 状态码
if (statusCode >= 200 && statusCode < 300) {
  if (resData.code === 200) {
    resolve(resData.data)
  } else {
    reject(new Error(resData.msg || '请求失败'))
  }
}

// 修复后：同时检查业务状态码
if (statusCode >= 200 && statusCode < 300) {
  if (resData.code === 200) {
    resolve(resData.data)
  } else if (resData.code === 332 || resData.code === 333) {
    // Token失效或为空
    clearToken()
    reject(new Error('登录已过期，请重新登录'))
  } else {
    reject(new Error(resData.msg || '请求失败'))
  }
}
```

### 2. 创建开发登录工具

创建了 `src/utils/dev-login.js`，提供便捷的 Token 管理方法：

- `setDevToken()` - 设置测试 Token
- `setRealToken(token)` - 设置真实 Token
- `clearDevToken()` - 清除 Token
- `checkDevLogin()` - 检查登录状态

## 📋 快速命令

在微信开发者工具控制台运行：

```javascript
// 检查登录状态
checkDevLogin()

// 设置测试 Token
setDevToken()

// 设置真实 Token
setRealToken('你的真实Token')

// 清除 Token
clearDevToken()

// 测试 API（设置 Token 后）
uni.request({
  url: 'http://192.168.31.185:8082/api/food-diary/stats/monthly?month=2026-06',
  header: {
    'Authorization': getToken()
  },
  success: console.log,
  fail: console.error
})
```

## 🎯 推荐流程

### 开发环境（模拟器）

1. 获取真实 Token：
   - 查看后端日志
   - 或联系后端开发获取测试 Token

2. 在控制台设置 Token：
   ```javascript
   setRealToken('真实Token')
   ```

3. 刷新页面测试

### 真机调试

1. 点击"真机调试"
2. 扫码在手机打开
3. 小程序会自动登录
4. 正常使用功能

### 生产环境

使用正常的微信登录流程，无需额外操作。

## 🐛 调试技巧

### 1. 检查请求头

在 Network 面板查看请求是否携带了 Token：

```
Request Headers:
  Authorization: Bearer xxx...
```

### 2. 检查 Token 有效性

```javascript
// 查看当前 Token
console.log('当前Token:', getToken())

// 测试 Token 有效性
uni.request({
  url: 'http://192.168.31.185:8082/api/food-diary/user/info',
  header: { 'Authorization': getToken() },
  success: (res) => {
    if (res.data.code === 200) {
      console.log('✅ Token 有效')
    } else if (res.data.code === 332) {
      console.log('❌ Token 无效或已过期')
    }
  }
})
```

### 3. 查看后端日志

在 IntelliJ IDEA 中查看后端日志，了解 Token 验证失败的详细原因。

## 📞 需要帮助？

如果以上方案都无法解决问题，请提供：

1. 后端日志中的错误信息
2. 请求的 Request Headers（是否包含 Authorization）
3. 响应的完整内容

---

**更新时间**: 2026-06-21
**相关文件**:
- `src/utils/food-diary/api.js` - API 封装
- `src/utils/dev-login.js` - 开发登录工具
- `src/App.vue` - 自动登录逻辑

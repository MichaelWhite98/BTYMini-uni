# 🎯 快速解决方案

## 问题：需要登录认证

```
错误: {"code":332,"data":[],"msg":"token参数为空"}
```

## ⚡ 快速解决

### 步骤 1: 在控制台运行

打开微信开发者工具的**控制台**，运行以下命令：

```javascript
// 设置测试 Token
setDevToken()
```

### 步骤 2: 刷新页面

重新加载页面，测试功能。

---

## 📝 如果仍然失败

说明后端需要真实的 Token，请使用以下方法：

### 方法 A: 从后端获取真实 Token

1. 查看 IntelliJ IDEA 中的后端日志
2. 找到登录成功的 Token
3. 在控制台运行：

```javascript
setRealToken('你的真实Token')
```

### 方法 B: 使用真机调试

1. 点击"真机调试"
2. 手机扫码打开小程序
3. 会自动登录并获取真实 Token

---

## 🔗 相关命令

```javascript
// 检查登录状态
checkDevLogin()

// 设置测试 Token
setDevToken()

// 设置真实 Token
setRealToken('token')

// 清除 Token
clearDevToken()

// 查看 Token
getToken()

// 网络诊断
networkDiagnosis()
```

---

**更新时间**: 2026-06-21

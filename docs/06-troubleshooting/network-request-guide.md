# 🚨 网络请求失败排查指南

## 问题描述

访问 `http://192.168.31.185:8082/` 时持续报错。

## 🔍 使用诊断工具

### 方法 1: 自动诊断

打开详情页时，会自动执行网络诊断，在控制台查看详细输出。

### 方法 2: 手动诊断

在微信开发者工具的控制台中输入：

```javascript
// 完整诊断
networkDiagnosis()

// 快速测试
quickTest()
```

## 📋 排查步骤

### 步骤 1: 检查微信开发者工具设置 ⭐⭐⭐

**这是最重要的一步！**

1. 打开微信开发者工具
2. 点击右上角 **"详情"**
3. 选择 **"本地设置"** 标签页
4. **必须勾选**以下选项：
   ```
   ☑️ 不校验合法域名、web-view（业务域名）、TLS版本以及HTTPS证书
   ☑️ 不校验安全域名、TLS版本以及HTTPS证书
   ```

**截图示例**：
```
┌─────────────────────────────────────┐
│  详情 > 本地设置                      │
├─────────────────────────────────────┤
│  ☑️ 不校验合法域名、web-view（业务域  │
│     名）、TLS版本以及HTTPS证书        │
│                                      │
│  ☑️ 不校验安全域名、TLS版本以及       │
│     HTTPS证书                        │
│                                      │
│  ☑️ 不校验 HTTPS 证书                │
└─────────────────────────────────────┘
```

### 步骤 2: 清除缓存

1. 点击菜单栏 **"工具"**
2. 选择 **"清除缓存"**
3. 点击 **"全部清除"**
4. 重新编译项目

### 步骤 3: 尝试不同的地址

修改 `src/main.js`，尝试不同的配置：

#### 方案 A: 使用 127.0.0.1（模拟器推荐）
```javascript
globalThis.__BTY_API_BASE__ = 'http://127.0.0.1:8082'
globalThis.__BTY_CUTOUT_API_BASE__ = 'http://127.0.0.1:8090'
```

#### 方案 B: 使用 localhost
```javascript
globalThis.__BTY_API_BASE__ = 'http://localhost:8082'
globalThis.__BTY_CUTOUT_API_BASE__ = 'http://localhost:8090'
```

#### 方案 C: 使用局域网 IP（真机调试推荐）
```javascript
globalThis.__BTY_API_BASE__ = 'http://192.168.31.185:8082'
globalThis.__BTY_CUTOUT_API_BASE__ = 'http://192.168.31.185:8090'
```

### 步骤 4: 检查后端服务

在终端运行：

```bash
# 测试本地访问
curl http://127.0.0.1:8082/api/food-diary/records

# 测试局域网访问
curl http://192.168.31.185:8082/api/food-diary/records

# 检查端口监听
lsof -i :8082
```

### 步骤 5: 检查防火墙

macOS 防火墙设置：
1. 系统偏好设置 → 安全性与隐私 → 防火墙
2. 点击"防火墙选项"
3. 确保允许 Java 的传入连接

或者临时关闭防火墙测试。

### 步骤 6: 检查网络代理

- 关闭系统代理或 VPN
- 确保网络直连

## 🧪 测试代码

在控制台运行以下代码测试：

```javascript
// 测试 1: 最简单的请求
uni.request({
  url: 'http://192.168.31.185:8082/api/food-diary/records',
  method: 'GET',
  success: (res) => console.log('✅ 成功:', res),
  fail: (err) => console.error('❌ 失败:', err)
})

// 测试 2: 带超时的请求
uni.request({
  url: 'http://192.168.31.185:8082/api/food-diary/records',
  method: 'GET',
  timeout: 10000,
  enableHttp2: false,
  enableQuic: false,
  enableCache: false,
  success: (res) => console.log('✅ 成功:', res),
  fail: (err) => console.error('❌ 失败:', err)
})

// 测试 3: 使用 127.0.0.1
uni.request({
  url: 'http://127.0.0.1:8082/api/food-diary/records',
  method: 'GET',
  success: (res) => console.log('✅ 成功:', res),
  fail: (err) => console.error('❌ 失败:', err)
})
```

## 🔄 临时解决方案

### 方案 1: 使用 127.0.0.1

如果局域网 IP 不工作，尝试使用 127.0.0.1：

```javascript
// src/main.js
globalThis.__BTY_API_BASE__ = 'http://127.0.0.1:8082'
globalThis.__BTY_CUTOUT_API_BASE__ = 'http://127.0.0.1:8090'
```

### 方案 2: 使用环境配置文件

使用我创建的配置文件：

```javascript
// src/main.js
import config from './config/env.config.js'

globalThis.__BTY_API_BASE__ = config.apiBase
globalThis.__BTY_CUTOUT_API_BASE__ = config.cutoutApiBase
```

然后在 `src/config/env.config.js` 中切换不同的配置方案。

## 📊 常见错误及解决方案

### 错误 1: "request:fail"

**原因**: 域名校验未关闭

**解决**:
- 检查微信开发者工具设置
- 确保勾选"不校验合法域名"选项

### 错误 2: "request:fail timeout"

**原因**: 请求超时

**解决**:
- 检查网络连接
- 增加 timeout 时间
- 检查后端服务是否响应慢

### 错误 3: "request:fail url not in domain list"

**原因**: URL 不在合法域名列表中

**解决**:
- 勾选"不校验合法域名"选项
- 或在微信公众平台配置合法域名

### 错误 4: "net::ERR_CONNECTION_REFUSED"

**原因**: 无法连接到服务器

**解决**:
- 检查后端服务是否运行
- 检查端口是否正确
- 检查防火墙设置

## 🎯 推荐配置

### 模拟器开发
```javascript
globalThis.__BTY_API_BASE__ = 'http://127.0.0.1:8082'
```

### 真机调试
```javascript
globalThis.__BTY_API_BASE__ = 'http://192.168.31.185:8082'
```

### 生产环境
```javascript
globalThis.__BTY_API_BASE__ = 'https://api.yourdomain.com'
```

## 📝 检查清单

完成以下检查：

- [ ] 微信开发者工具设置正确（最关键）
- [ ] 已清除缓存并重新编译
- [ ] 后端服务正常运行
- [ ] 端口监听正确
- [ ] 防火墙允许访问
- [ ] 网络代理已关闭
- [ ] 尝试了不同的地址配置

## 💡 调试技巧

### 1. 查看 Network 面板

在微信开发者工具中：
- 打开"Network"标签页
- 查看请求详情
- 检查 Request Headers 和 Response

### 2. 查看详细错误

在控制台运行诊断工具：
```javascript
networkDiagnosis()
```

### 3. 逐步测试

从最简单的请求开始测试：
```javascript
// 1. 测试根路径
uni.request({
  url: 'http://192.168.31.185:8082/',
  success: console.log,
  fail: console.error
})

// 2. 测试 API 路径
uni.request({
  url: 'http://192.168.31.185:8082/api/food-diary/records',
  success: console.log,
  fail: console.error
})
```

## 📞 如果还有问题

如果按照以上步骤操作后仍然有问题，请提供：

1. **控制台完整错误日志**（截图或复制文本）
2. **Network 面板的请求详情**
3. **微信开发者工具版本号**
4. **操作系统版本**
5. **后端服务状态**（运行 `lsof -i :8082` 的结果）

---

**更新时间**: 2026-06-21
**诊断工具**: `networkDiagnosis()`, `quickTest()`

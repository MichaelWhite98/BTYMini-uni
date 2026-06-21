# 502 Bad Gateway 排查报告

## 问题描述

访问 `http://192.168.31.185:8082/api/food-diary/records?pageNo=1&pageSize=5` 时出现 502 Bad Gateway 错误。

## 排查结果

### ✅ 服务状态检查

1. **端口监听检查**：
   ```
   tcp46  0  0  *.8082  *.*  LISTEN
   ```
   - ✅ 服务正常监听所有网卡（0.0.0.0:8082）
   - ✅ 端口：8082 正常

2. **本地访问测试**：
   ```bash
   curl http://127.0.0.1:8082/api/food-diary/records?pageNo=1&pageSize=5
   # 返回：HTTP/1.1 200
   ```
   - ✅ 本地访问正常

3. **局域网访问测试**：
   ```bash
   curl http://192.168.31.185:8082/api/food-diary/records?pageNo=1&pageSize=5
   # 返回：HTTP/1.1 200
   ```
   - ✅ 局域网访问正常

### ❌ 抠图服务检查

```
端口 8090 未被监听
```
- ❌ 抠图服务（8090）未启动

## 问题原因分析

**后端服务本身是正常的**，502 错误可能来自：

### 1. 微信开发者工具配置问题

**解决方案**：
- 打开微信开发者工具
- 点击右上角"详情"
- 选择"本地设置"
- ✅ 勾选"不校验合法域名、web-view（业务域名）、TLS版本以及HTTPS证书"
- ✅ 勾选"不校验安全域名、TLS版本以及HTTPS证书"

### 2. 小程序代码中的请求问题

检查以下内容：

#### 检查 API 请求地址
```javascript
// src/main.js
globalThis.__BTY_API_BASE__ = 'http://192.168.31.185:8082'
```

#### 检查请求方法
确保小程序端使用正确的请求方式：
```javascript
uni.request({
  url: `${globalThis.__BTY_API_BASE__}/api/food-diary/records`,
  method: 'GET',
  data: {
    pageNo: 1,
    pageSize: 5
  },
  success: (res) => {
    console.log('请求成功:', res)
  },
  fail: (err) => {
    console.error('请求失败:', err)
  }
})
```

### 3. 跨域问题

虽然后端服务已经配置了 CORS，但小程序可能还有跨域限制。

**解决方案**：
- 确保后端 CORS 配置正确
- 确保请求头设置正确

### 4. 网络代理问题

如果使用了网络代理，可能导致请求失败。

**解决方案**：
- 关闭系统代理或 VPN
- 确保网络直连

## 解决步骤

### 步骤 1：检查微信开发者工具设置

1. 打开微信开发者工具
2. 详情 → 本地设置
3. 勾选以下选项：
   - ✅ 不校验合法域名、web-view（业务域名）、TLS版本以及HTTPS证书
   - ✅ 不校验安全域名、TLS版本以及HTTPS证书

### 步骤 2：清除缓存并重新编译

1. 在微信开发者工具中点击"清缓存"
2. 选择"全部清除"
3. 重新编译项目：
   ```bash
   npm run dev:mp-weixin
   ```

### 步骤 3：查看详细错误信息

在微信开发者工具的控制台中查看详细错误信息：
- Network 面板：查看请求详情
- Console 面板：查看错误日志

### 步骤 4：测试简单请求

在详情页添加测试代码：
```javascript
// src/pages/detail/index.vue
onMounted(() => {
  // 测试 API 连接
  uni.request({
    url: 'http://192.168.31.185:8082/api/food-diary/records',
    method: 'GET',
    data: { pageNo: 1, pageSize: 5 },
    success: (res) => {
      console.log('✅ API 测试成功:', res)
    },
    fail: (err) => {
      console.error('❌ API 测试失败:', err)
    }
  })
})
```

## 其他需要启动的服务

### 抠图服务（8090 端口）

当前状态：❌ 未启动

需要启动抠图服务才能使用图片抠图功能。

## 验证清单

- [x] 后端服务（8082）正常运行
- [x] 端口监听配置正确
- [x] 局域网访问正常
- [ ] 微信开发者工具设置正确
- [ ] 小程序端请求代码正确
- [ ] 抠图服务（8090）已启动

## 更新日期

2026-06-21

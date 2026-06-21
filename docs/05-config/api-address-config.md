# 环境配置说明

## API 地址配置

项目中的后端 API 地址配置在 `src/main.js` 文件中：

```javascript
// 后端API服务地址配置
globalThis.__BTY_API_BASE__ = 'http://192.168.31.185:8082'

// 抠图服务地址配置
globalThis.__BTY_CUTOUT_API_BASE__ = 'http://192.168.31.185:8090'
```

## 配置场景

### 1. 本地开发（本机访问）
```javascript
globalThis.__BTY_API_BASE__ = 'http://127.0.0.1:8082'
globalThis.__BTY_CUTOUT_API_BASE__ = 'http://127.0.0.1:8090'
```

### 2. 局域网开发（手机/其他设备访问）
```javascript
globalThis.__BTY_API_BASE__ = 'http://192.168.31.185:8082'
globalThis.__BTY_CUTOUT_API_BASE__ = 'http://192.168.31.185:8090'
```

### 3. 生产环境
```javascript
globalThis.__BTY_API_BASE__ = 'https://api.yourdomain.com'
globalThis.__BTY_CUTOUT_API_BASE__ = 'https://cutout.yourdomain.com'
```

## 当前后端服务

- **bty-front 服务**: 端口 8082
  - 主要 API 服务
  - 食物记录、用户认证等

- **抠图服务**: 端口 8090
  - 图片主体识别
  - 图片抠图处理

## 局域网访问注意事项

### 1. 微信开发者工具配置

在微信开发者工具中，需要关闭域名校验：
- 详情 → 本地设置 → 勾选"不校验合法域名、web-view（业务域名）、TLS版本以及HTTPS证书"

### 2. 真机调试

真机调试时，确保：
- 手机和电脑在同一局域网
- 电脑防火墙允许相应端口访问
- 使用电脑的局域网 IP 地址

### 3. 查看本机 IP

macOS:
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

Windows:
```cmd
ipconfig
```

## 环境切换脚本（可选）

可以创建环境配置文件来管理不同环境：

### src/config/env.development.js
```javascript
export default {
  apiBase: 'http://192.168.31.185:8082',
  cutoutApiBase: 'http://192.168.31.185:8090'
}
```

### src/config/env.production.js
```javascript
export default {
  apiBase: 'https://api.yourdomain.com',
  cutoutApiBase: 'https://cutout.yourdomain.com'
}
```

### src/main.js（使用配置文件）
```javascript
import envConfig from './config/env.development.js'

globalThis.__BTY_API_BASE__ = envConfig.apiBase
globalThis.__BTY_CUTOUT_API_BASE__ = envConfig.cutoutApiBase
```

## 更新日期

2026-06-21

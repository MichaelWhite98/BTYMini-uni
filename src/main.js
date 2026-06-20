import { createSSRApp } from 'vue'
import App from './App.vue'

// 后端API服务地址配置
// 本地开发环境使用 127.0.0.1:8082 (bty-front服务)
// 生产环境需要替换为实际服务器地址（需 HTTPS）
globalThis.__BTY_API_BASE__ = 'http://127.0.0.1:8082'

// 抠图服务地址配置（兼容旧代码）
globalThis.__BTY_CUTOUT_API_BASE__ = 'http://127.0.0.1:8090'

export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}


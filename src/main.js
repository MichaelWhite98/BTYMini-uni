import { createSSRApp } from 'vue'
import App from './App.vue'

// 抠图服务地址配置
// 本地开发环境使用 127.0.0.1:8000
// 生产环境需要替换为实际服务器地址（需 HTTPS）
globalThis.__BTY_CUTOUT_API_BASE__ = 'http://127.0.0.1:8000'

export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}


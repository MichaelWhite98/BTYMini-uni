import { createSSRApp } from 'vue'
import App from './App.vue'

// 后端API服务地址配置
// 局域网开发环境使用 192.168.31.185:8082 (bty-front服务)
// 生产环境需要替换为实际服务器地址（需 HTTPS）
globalThis.__BTY_API_BASE__ = 'http://192.168.31.185:8082'

// 抠图服务地址配置（兼容旧代码）
globalThis.__BTY_CUTOUT_API_BASE__ = 'http://192.168.31.185:8090'

// 导入开发工具并导出到全局（方便控制台调用）
import { setDevToken, setRealToken, clearDevToken, checkDevLogin } from './utils/dev-login.js'
import { networkDiagnosis, quickTest } from './utils/network-diagnosis.js'
import { getToken } from './utils/food-diary/api.js'
import { testBackendDirectly } from './utils/test-backend.js'

// 导出到全局
globalThis.setDevToken = setDevToken
globalThis.setRealToken = setRealToken
globalThis.clearDevToken = clearDevToken
globalThis.checkDevLogin = checkDevLogin
globalThis.networkDiagnosis = networkDiagnosis
globalThis.quickTest = quickTest
globalThis.getToken = getToken
globalThis.testBackendDirectly = testBackendDirectly

export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}


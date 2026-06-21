/**
 * 环境配置
 * 可以根据不同环境切换 API 地址
 */

// 开发环境配置
const developmentConfig = {
  // 方案 1: 使用局域网 IP（推荐用于真机调试）
  apiBase: 'http://192.168.31.185:8082',
  cutoutApiBase: 'http://192.168.31.185:8090',

  // 方案 2: 使用本地地址（推荐用于模拟器）
  // apiBase: 'http://127.0.0.1:8082',
  // cutoutApiBase: 'http://127.0.0.1:8090',

  // 方案 3: 使用 localhost（某些情况下更稳定）
  // apiBase: 'http://localhost:8082',
  // cutoutApiBase: 'http://localhost:8090',
}

// 生产环境配置
const productionConfig = {
  apiBase: 'https://api.yourdomain.com',
  cutoutApiBase: 'https://cutout.yourdomain.com',
}

// 根据环境选择配置
const config = process.env.NODE_ENV === 'production'
  ? productionConfig
  : developmentConfig

export default config

/**
 * 使用方法:
 *
 * 方法 1: 在 main.js 中使用
 * import config from './config/env.config.js'
 * globalThis.__BTY_API_BASE__ = config.apiBase
 * globalThis.__BTY_CUTOUT_API_BASE__ = config.cutoutApiBase
 *
 * 方法 2: 直接修改上面的配置
 * 注释掉方案 1，取消注释方案 2 或 3
 */

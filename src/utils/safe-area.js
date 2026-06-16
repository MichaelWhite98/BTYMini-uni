/**
 * 安全区域适配工具
 * 处理灵动岛、刘海屏等特殊机型
 */

// 获取系统信息
export function getSystemInfo() {
  const systemInfo = uni.getSystemInfoSync()

  return {
    // 状态栏高度
    statusBarHeight: systemInfo.statusBarHeight || 20,

    // 安全区域
    safeArea: systemInfo.safeArea || {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      width: 0,
      height: 0
    },

    // 安全区域插入
    safeAreaInsets: systemInfo.safeAreaInsets || {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    },

    // 屏幕信息
    screenWidth: systemInfo.screenWidth || 375,
    screenHeight: systemInfo.screenHeight || 812,

    // 平台
    platform: systemInfo.platform || 'ios',

    // 机型
    model: systemInfo.model || '',

    // 是否为 iPhone X 及以上机型（有刘海或灵动岛）
    isIPhoneX: isIPhoneXSeries(systemInfo.model)
  }
}

// 判断是否为 iPhone X 系列机型
function isIPhoneXSeries(model) {
  if (!model) return false

  const iPhoneXModels = [
    'iPhone X',
    'iPhone XS',
    'iPhone XS Max',
    'iPhone XR',
    'iPhone 11',
    'iPhone 11 Pro',
    'iPhone 11 Pro Max',
    'iPhone 12',
    'iPhone 12 mini',
    'iPhone 12 Pro',
    'iPhone 12 Pro Max',
    'iPhone 13',
    'iPhone 13 mini',
    'iPhone 13 Pro',
    'iPhone 13 Pro Max',
    'iPhone 14',
    'iPhone 14 Plus',
    'iPhone 14 Pro',
    'iPhone 14 Pro Max',
    'iPhone 15',
    'iPhone 15 Plus',
    'iPhone 15 Pro',
    'iPhone 15 Pro Max',
    'iPhone 16',
    'iPhone 16 Plus',
    'iPhone 16 Pro',
    'iPhone 16 Pro Max'
  ]

  // 移除空格进行匹配
  const normalizedModel = model.replace(/\s/g, '')
  return iPhoneXModels.some(m => normalizedModel.includes(m.replace(/\s/g, '')))
}

// 设置 CSS 变量
export function setSafeAreaCSS() {
  const info = getSystemInfo()

  // 设置 CSS 变量到页面
  const root = document.documentElement
  if (root) {
    root.style.setProperty('--status-bar-height', `${info.statusBarHeight}px`)
    root.style.setProperty('--safe-area-top', `${info.safeAreaInsets.top}px`)
    root.style.setProperty('--safe-area-bottom', `${info.safeAreaInsets.bottom}px`)
    root.style.setProperty('--safe-area-left', `${info.safeAreaInsets.left}px`)
    root.style.setProperty('--safe-area-right', `${info.safeAreaInsets.right}px`)

    // 导航栏高度 = 状态栏高度 + 导航栏内容高度(44px)
    root.style.setProperty('--nav-bar-height', `${info.statusBarHeight + 44}px`)
  }

  return info
}

export default {
  getSystemInfo,
  setSafeAreaCSS
}

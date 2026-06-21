/**
 * 认证工具类
 * 提供 Token 管理、登录状态检查、用户信息缓存等功能
 */

const TOKEN_KEY = 'bty_food_diary_token'
const USER_INFO_KEY = 'bty_food_diary_user_info'
const TOKEN_EXPIRE_KEY = 'bty_token_expire'

// 登录状态管理
let loginResolve = null
let loginPromise = new Promise((resolve) => {
  loginResolve = resolve
})
let isLoginComplete = false

/**
 * 等待登录完成
 * @returns {Promise<boolean>} 登录是否成功
 */
export function waitForLogin() {
  if (isLoginComplete) {
    return Promise.resolve(!!getToken())
  }
  return loginPromise
}

/**
 * 标记登录完成（由 App.vue 调用）
 * @param {boolean} success - 登录是否成功
 */
export function markLoginComplete(success) {
  isLoginComplete = true
  if (loginResolve) {
    loginResolve(success)
    loginResolve = null
  }
}

/**
 * 检查登录是否已完成
 * @returns {boolean}
 */
export function isLoginReady() {
  return isLoginComplete
}

/**
 * 保存 Token
 * @param {string} token - 登录 Token
 * @param {number} expireTime - Token 过期时间（毫秒时间戳）
 */
export function setToken(token, expireTime) {
  try {
    uni.setStorageSync(TOKEN_KEY, token)
    if (expireTime) {
      uni.setStorageSync(TOKEN_EXPIRE_KEY, expireTime)
    } else {
      // 默认 7 天过期
      const defaultExpire = Date.now() + 7 * 24 * 60 * 60 * 1000
      uni.setStorageSync(TOKEN_EXPIRE_KEY, defaultExpire)
    }
    return true
  } catch (error) {
    console.error('保存 Token 失败:', error)
    return false
  }
}

/**
 * 获取 Token
 * @returns {string|null} Token 或 null（已过期或不存在）
 */
export function getToken() {
  try {
    const token = uni.getStorageSync(TOKEN_KEY)
    const expireTime = uni.getStorageSync(TOKEN_EXPIRE_KEY)

    // 检查是否存在
    if (!token) {
      return null
    }

    // 检查是否过期
    if (expireTime) {
      const now = Date.now()
      if (now > expireTime) {
        // Token 已过期，清除
        console.warn('Token 已过期，自动清除')
        clearToken()
        return null
      }
    }

    return token
  } catch (error) {
    console.error('获取 Token 失败:', error)
    return null
  }
}

/**
 * 清除 Token 和用户信息
 */
export function clearToken() {
  try {
    uni.removeStorageSync(TOKEN_KEY)
    uni.removeStorageSync(TOKEN_EXPIRE_KEY)
    uni.removeStorageSync(USER_INFO_KEY)
    return true
  } catch (error) {
    console.error('清除 Token 失败:', error)
    return false
  }
}

/**
 * 检查登录状态
 * @returns {boolean} 是否已登录
 */
export function isLoggedIn() {
  return !!getToken()
}

/**
 * 保存用户信息
 * @param {Object} userInfo - 用户信息对象
 */
export function setUserInfo(userInfo) {
  try {
    if (!userInfo) {
      console.warn('用户信息为空，不保存')
      return false
    }

    uni.setStorageSync(USER_INFO_KEY, JSON.stringify(userInfo))
    return true
  } catch (error) {
    console.error('保存用户信息失败:', error)
    return false
  }
}

/**
 * 获取用户信息
 * @returns {Object|null} 用户信息对象或 null
 */
export function getUserInfo() {
  try {
    const data = uni.getStorageSync(USER_INFO_KEY)
    if (!data) {
      return null
    }

    const userInfo = JSON.parse(data)
    return userInfo
  } catch (error) {
    console.error('获取用户信息失败:', error)
    return null
  }
}

/**
 * 更新用户信息（部分更新）
 * @param {Object} updates - 需要更新的字段
 */
export function updateUserInfo(updates) {
  try {
    const userInfo = getUserInfo()
    if (!userInfo) {
      console.warn('本地无用户信息，无法更新')
      return false
    }

    const newUserInfo = {
      ...userInfo,
      ...updates,
      updateTime: new Date().toISOString()
    }

    return setUserInfo(newUserInfo)
  } catch (error) {
    console.error('更新用户信息失败:', error)
    return false
  }
}

/**
 * 检查 Token 是否即将过期（提前刷新）
 * @param {number} threshold - 过期阈值（毫秒），默认提前 1 天
 * @returns {boolean} 是否即将过期
 */
export function isTokenExpiring(threshold = 24 * 60 * 60 * 1000) {
  try {
    const expireTime = uni.getStorageSync(TOKEN_EXPIRE_KEY)
    if (!expireTime) {
      return true
    }

    const now = Date.now()
    const remaining = expireTime - now

    return remaining < threshold
  } catch (error) {
    console.error('检查 Token 过期失败:', error)
    return true
  }
}

/**
 * 获取 Token 剩余有效时间
 * @returns {number} 剩余时间（毫秒），已过期返回 0
 */
export function getTokenRemainingTime() {
  try {
    const expireTime = uni.getStorageSync(TOKEN_EXPIRE_KEY)
    if (!expireTime) {
      return 0
    }

    const now = Date.now()
    const remaining = expireTime - now

    return remaining > 0 ? remaining : 0
  } catch (error) {
    console.error('获取 Token 剩余时间失败:', error)
    return 0
  }
}

/**
 * 格式化 Token 剩余时间显示
 * @returns {string} 格式化后的时间，如 "3天"、"12小时"
 */
export function formatTokenRemaining() {
  const remaining = getTokenRemainingTime()

  if (remaining === 0) {
    return '已过期'
  }

  const days = Math.floor(remaining / (24 * 60 * 60 * 1000))
  const hours = Math.floor(remaining / (60 * 60 * 1000))

  if (days > 0) {
    return `${days}天`
  } else if (hours > 0) {
    return `${hours}小时`
  } else {
    const minutes = Math.floor(remaining / (60 * 1000))
    return `${minutes}分钟`
  }
}

export default {
  setToken,
  getToken,
  clearToken,
  isLoggedIn,
  setUserInfo,
  getUserInfo,
  updateUserInfo,
  isTokenExpiring,
  getTokenRemainingTime,
  formatTokenRemaining,
  waitForLogin,
  markLoginComplete,
  isLoginReady
}
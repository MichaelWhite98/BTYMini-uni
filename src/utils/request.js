/**
 * 统一请求封装
 * 自动添加 Token、处理错误、Token 失效自动跳转登录
 */

import { getToken, setToken, clearToken, setUserInfo } from './auth.js'

// API 基础地址
const API_BASE = 'http://192.168.31.185:8082'

// 登录页面路径
const LOGIN_PAGE = '/pages/profile/index'

// 需要跳转登录的错误码
const AUTH_ERROR_CODES = [332, 333]

/**
 * 统一请求方法
 * @param {Object} options - 请求配置
 * @param {string} options.url - 请求路径（相对路径，会自动拼接 API_BASE）
 * @param {string} options.method - 请求方法
 * @param {Object} options.data - 请求数据
 * @param {Object} options.header - 请求头
 * @param {boolean} options.skipAuth - 是否跳过认证（登录接口使用）
 * @returns {Promise} 请求结果
 */
export const request = (options) => {
  const { url, method = 'GET', data, header = {}, skipAuth = false } = options

  // 自动添加 Token
  if (!skipAuth) {
    const token = getToken()
    if (token) {
      header['Authorization'] = token
      console.log('[Request] 添加 Authorization:', token.substring(0, 20) + '...')
    } else {
      console.warn('[Request] 未找到 Token，请求可能失败:', url)
    }
  }

  console.log('[Request]', method, url, { data, header })

  return new Promise((resolve, reject) => {
    uni.request({
      url: `${API_BASE}${url}`,
      method,
      data,
      header,
      success: (response) => {
        const { statusCode, data: resData } = response
        console.log('[Response]', statusCode, url, resData)

        // HTTP 状态码判断
        if (statusCode >= 200 && statusCode < 300) {
          // 业务状态码判断
          if (resData.code === 200) {
            resolve(resData.data)
          } else if (AUTH_ERROR_CODES.includes(resData.code)) {
            // Token 失效
            handleAuthError(resData.msg)
            reject(new Error(resData.msg || '登录已过期'))
          } else {
            // 其他业务错误
            reject(new Error(resData.msg || '请求失败'))
          }
        } else if (AUTH_ERROR_CODES.includes(statusCode)) {
          // HTTP 状态码表示认证失败
          handleAuthError('登录已过期')
          reject(new Error('登录已过期'))
        } else {
          reject(new Error(`请求失败: ${statusCode}`))
        }
      },
      fail: (err) => {
        console.error('[Request Failed]', url, err)
        reject(new Error(err.errMsg || '网络请求失败'))
      }
    })
  })
}

/**
 * 处理认证错误
 * 清除 Token 并跳转登录页
 */
const handleAuthError = (message) => {
  console.warn('[Auth Error] Token 失效:', message)

  // 清除本地存储
  clearToken()

  // 提示用户
  uni.showToast({
    title: '请重新登录',
    icon: 'none',
    duration: 2000
  })

  // 延迟跳转登录页
  setTimeout(() => {
    uni.switchTab({ url: LOGIN_PAGE })
  }, 1500)
}

/**
 * 文件上传
 */
export const uploadFile = (filePath, formData = {}) => {
  const token = getToken()

  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: `${API_BASE}/api/food-diary/media/upload`,
      filePath,
      name: 'file',
      formData,
      header: token ? { 'Authorization': token } : {},
      success: (response) => {
        const { statusCode, data } = response
        if (statusCode >= 200 && statusCode < 300) {
          const resData = typeof data === 'string' ? JSON.parse(data) : data
          if (resData.code === 200) {
            resolve(resData.data)
          } else if (AUTH_ERROR_CODES.includes(resData.code)) {
            handleAuthError(resData.msg)
            reject(new Error('登录已过期'))
          } else {
            reject(new Error(resData.msg || '上传失败'))
          }
        } else {
          reject(new Error(`上传失败: ${statusCode}`))
        }
      },
      fail: (err) => {
        reject(new Error(err.errMsg || '上传失败'))
      }
    })
  })
}

/**
 * 微信登录
 */
export const wxLogin = async (code) => {
  console.log('[Login] 开始登录, code:', code)

  const result = await request({
    url: '/api/food-diary/auth/login',
    method: 'POST',
    data: { code },
    skipAuth: true  // 登录接口跳过认证
  })

  console.log('[Login] 登录成功, result:', result)

  // 保存 Token 和用户信息
  if (result.token) {
    const saved = setToken(result.token)
    console.log('[Login] Token 保存结果:', saved)

    // 验证保存是否成功
    const savedToken = getToken()
    console.log('[Login] 验证保存的 Token:', savedToken ? '成功' : '失败')
  }
  if (result.userInfo) {
    setUserInfo(result.userInfo)
  }

  return result
}

/**
 * 退出登录
 */
export const logout = async () => {
  try {
    await request({
      url: '/api/food-diary/auth/logout',
      method: 'POST'
    })
  } catch (error) {
    // 忽略错误
  }
  clearToken()
}

export default {
  request,
  uploadFile,
  wxLogin,
  logout
}

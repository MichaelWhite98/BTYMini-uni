/**
 * 饮品记录后端API服务
 * 与 bty-front 后端服务对接
 */

const getApiBase = () => {
  if (typeof globalThis !== 'undefined' && globalThis.__BTY_API_BASE__) {
    return String(globalThis.__BTY_API_BASE__).replace(/\/$/, '')
  }
  return ''
}

const getMiniRuntime = () => {
  // 微信小程序环境
  if (typeof wx !== 'undefined' && wx.request) {
    return {
      request: wx.request,
      uploadFile: wx.uploadFile,
      getStorageSync: wx.getStorageSync,
      setStorageSync: wx.setStorageSync,
      removeStorageSync: wx.removeStorageSync
    }
  }
  // uni-app 环境
  if (typeof uni !== 'undefined' && uni.request) {
    return {
      request: uni.request,
      uploadFile: uni.uploadFile,
      getStorageSync: uni.getStorageSync,
      setStorageSync: uni.setStorageSync,
      removeStorageSync: uni.removeStorageSync
    }
  }
  return null
}

const TOKEN_KEY = 'bty_food_diary_token'
const USER_INFO_KEY = 'bty_food_diary_user_info'

/**
 * 获取存储的Token
 */
export const getToken = () => {
  const runtime = getMiniRuntime()
  if (!runtime) return null
  return runtime.getStorageSync(TOKEN_KEY) || null
}

/**
 * 设置Token
 */
export const setToken = (token) => {
  const runtime = getMiniRuntime()
  if (!runtime) return
  runtime.setStorageSync(TOKEN_KEY, token)
}

/**
 * 清除Token
 */
export const clearToken = () => {
  const runtime = getMiniRuntime()
  if (!runtime) return
  runtime.removeStorageSync(TOKEN_KEY)
  runtime.removeStorageSync(USER_INFO_KEY)
}

/**
 * 获取用户信息缓存
 */
export const getUserInfoCache = () => {
  const runtime = getMiniRuntime()
  if (!runtime) return null
  return runtime.getStorageSync(USER_INFO_KEY) || null
}

/**
 * 设置用户信息缓存
 */
export const setUserInfoCache = (userInfo) => {
  const runtime = getMiniRuntime()
  if (!runtime) return
  runtime.setStorageSync(USER_INFO_KEY, userInfo)
}

/**
 * 发起API请求
 */
const requestApi = ({ url, method = 'GET', data, header = {} }) => {
  const base = getApiBase()
  const runtime = getMiniRuntime()

  if (!base || !runtime) {
    return Promise.reject(new Error('API服务不可用'))
  }

  // 添加Token到请求头
  const token = getToken()
  if (token) {
    header['Authorization'] = token
  }

  return new Promise((resolve, reject) => {
    runtime.request({
      url: `${base}${url}`,
      method,
      data,
      header,
      success: (response) => {
        const statusCode = Number(response.statusCode || 0)
        if (statusCode >= 200 && statusCode < 300) {
          const resData = response.data
          if (resData.code === 200) {
            resolve(resData.data)
          } else {
            reject(new Error(resData.msg || '请求失败'))
          }
        } else if (statusCode === 332 || statusCode === 333) {
          // Token失效，清除本地存储
          clearToken()
          reject(new Error('登录已过期，请重新登录'))
        } else {
          reject(new Error(`请求失败: ${statusCode}`))
        }
      },
      fail: (err) => {
        reject(new Error(err.errMsg || '网络请求失败'))
      }
    })
  })
}

// ==================== 认证相关 ====================

/**
 * 微信登录
 */
export const wxLogin = async (code) => {
  const result = await requestApi({
    url: '/api/food-diary/auth/login',
    method: 'POST',
    data: { code }
  })

  if (result.token) {
    setToken(result.token)
  }
  if (result.userInfo) {
    setUserInfoCache(result.userInfo)
  }

  return result
}

/**
 * 退出登录
 */
export const logout = async () => {
  await requestApi({
    url: '/api/food-diary/auth/logout',
    method: 'POST'
  })
  clearToken()
}

// ==================== 用户相关 ====================

/**
 * 获取用户信息
 */
export const getUserInfo = async () => {
  const result = await requestApi({
    url: '/api/food-diary/user/info',
    method: 'GET'
  })
  setUserInfoCache(result)
  return result
}

/**
 * 更新用户信息
 */
export const updateUserInfo = async (params) => {
  return requestApi({
    url: '/api/food-diary/user/info',
    method: 'PUT',
    data: params
  })
}

/**
 * 获取用户统计数据
 */
export const getUserStats = async () => {
  return requestApi({
    url: '/api/food-diary/user/stats',
    method: 'GET'
  })
}

/**
 * 更新用户设置
 */
export const updateUserSettings = async (params) => {
  return requestApi({
    url: '/api/food-diary/user/settings',
    method: 'PUT',
    data: params
  })
}

// ==================== 饮品记录相关 ====================

/**
 * 获取记录列表
 */
export const getRecordList = async (params = {}) => {
  return requestApi({
    url: '/api/food-diary/records',
    method: 'GET',
    data: params
  })
}

/**
 * 获取记录详情
 */
export const getRecordDetail = async (id) => {
  return requestApi({
    url: `/api/food-diary/records/${id}`,
    method: 'GET'
  })
}

/**
 * 添加记录
 */
export const addRecord = async (recordData) => {
  return requestApi({
    url: '/api/food-diary/records',
    method: 'POST',
    data: recordData
  })
}

/**
 * 更新记录
 */
export const updateRecord = async (id, recordData) => {
  return requestApi({
    url: `/api/food-diary/records/${id}`,
    method: 'PUT',
    data: recordData
  })
}

/**
 * 删除记录
 */
export const deleteRecord = async (id) => {
  return requestApi({
    url: `/api/food-diary/records/${id}`,
    method: 'DELETE'
  })
}

/**
 * 切换收藏状态
 */
export const toggleFavorite = async (id) => {
  return requestApi({
    url: `/api/food-diary/records/${id}/favorite`,
    method: 'POST'
  })
}

// ==================== 统计相关 ====================

/**
 * 获取月度统计
 */
export const getMonthlyStats = async (month) => {
  return requestApi({
    url: '/api/food-diary/stats/monthly',
    method: 'GET',
    data: { month }
  })
}

/**
 * 获取日历索引
 */
export const getCalendarIndex = async (month) => {
  return requestApi({
    url: '/api/food-diary/stats/calendar',
    method: 'GET',
    data: { month }
  })
}

// ==================== 媒体相关 ====================

/**
 * 获取上传令牌
 */
export const getUploadToken = async (params) => {
  return requestApi({
    url: '/api/food-diary/media/upload-token',
    method: 'POST',
    data: params
  })
}

/**
 * 上传图片
 */
export const uploadImage = async (filePath, bizType = 'food-diary') => {
  const base = getApiBase()
  const runtime = getMiniRuntime()

  if (!base || !runtime) {
    return Promise.reject(new Error('API服务不可用'))
  }

  const token = getToken()

  return new Promise((resolve, reject) => {
    runtime.uploadFile({
      url: `${base}/api/food-diary/media/upload`,
      filePath,
      name: 'file',
      formData: { bizType },
      header: token ? { 'Authorization': token } : {},
      success: (response) => {
        const statusCode = Number(response.statusCode || 0)
        if (statusCode >= 200 && statusCode < 300) {
          const resData = JSON.parse(response.data)
          if (resData.code === 200) {
            resolve(resData.data)
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

// ==================== 抠图任务相关 ====================

/**
 * 创建抠图任务
 */
export const createCutoutTask = async (params) => {
  return requestApi({
    url: '/api/food-diary/cutout/tasks',
    method: 'POST',
    data: params
  })
}

/**
 * 查询抠图任务
 */
export const getCutoutTask = async (taskId) => {
  return requestApi({
    url: `/api/food-diary/cutout/tasks/${taskId}`,
    method: 'GET'
  })
}

// ==================== 店铺相关 ====================

/**
 * 搜索店铺
 */
export const searchStores = async (keyword, limit = 10) => {
  return requestApi({
    url: '/api/food-diary/stores/search',
    method: 'GET',
    data: { keyword, limit }
  })
}

/**
 * 获取附近店铺
 */
export const getNearbyStores = async (latitude, longitude, radius = 1000, limit = 10) => {
  return requestApi({
    url: '/api/food-diary/stores/nearby',
    method: 'GET',
    data: { latitude, longitude, radius, limit }
  })
}

// ==================== 勋章相关 ====================

/**
 * 获取勋章列表
 */
export const getMedalList = async () => {
  return requestApi({
    url: '/api/food-diary/medals',
    method: 'GET'
  })
}

/**
 * 检查新勋章
 */
export const checkNewMedals = async () => {
  return requestApi({
    url: '/api/food-diary/medals/check',
    method: 'POST'
  })
}

// 导出所有API
export default {
  // 认证
  wxLogin,
  logout,
  getToken,
  setToken,
  clearToken,
  // 用户
  getUserInfo,
  updateUserInfo,
  getUserStats,
  updateUserSettings,
  getUserInfoCache,
  setUserInfoCache,
  // 记录
  getRecordList,
  getRecordDetail,
  addRecord,
  updateRecord,
  deleteRecord,
  toggleFavorite,
  // 统计
  getMonthlyStats,
  getCalendarIndex,
  // 媒体
  getUploadToken,
  uploadImage,
  // 抠图
  createCutoutTask,
  getCutoutTask,
  // 店铺
  searchStores,
  getNearbyStores,
  // 勋章
  getMedalList,
  checkNewMedals
}
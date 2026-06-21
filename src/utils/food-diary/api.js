/**
 * 饮品记录后端API服务
 * 与 bty-admin 后端服务对接
 *
 * 重要说明：
 * 1. 所有请求会自动携带 Authorization 头（Token）
 * 2. Token 失效时会自动跳转到登录页
 * 3. 登录成功后会自动保存 Token
 */

import { request, uploadFile as uploadRequest, wxLogin as login, logout as logoutApi } from '../request.js'
import { getToken, setToken, clearToken, setUserInfo, getUserInfo as getCachedUserInfo } from '../auth.js'

// 导出 Token 相关方法（保持兼容）
export { getToken, setToken, clearToken }

// 导出登录方法
export const wxLogin = login

// 导出退出登录方法
export const logout = logoutApi

/**
 * 获取用户信息缓存
 */
export const getUserInfoCache = () => {
  return getCachedUserInfo()
}

/**
 * 设置用户信息缓存
 */
export const setUserInfoCache = (userInfo) => {
  setUserInfo(userInfo)
}

// ==================== 用户相关 ====================

/**
 * 获取用户信息
 */
export const getUserInfo = async () => {
  const result = await request({
    url: '/api/food-diary/user/info',
    method: 'GET'
  })
  setUserInfo(result)
  return result
}

/**
 * 更新用户信息
 */
export const updateUserInfo = async (params) => {
  return request({
    url: '/api/food-diary/user/info',
    method: 'PUT',
    data: params
  })
}

/**
 * 获取用户统计数据
 */
export const getUserStats = async () => {
  return request({
    url: '/api/food-diary/user/stats',
    method: 'GET'
  })
}

/**
 * 更新用户设置
 */
export const updateUserSettings = async (params) => {
  return request({
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
  return request({
    url: '/api/food-diary/records',
    method: 'GET',
    data: params
  })
}

/**
 * 获取记录详情
 */
export const getRecordDetail = async (id) => {
  return request({
    url: `/api/food-diary/records/${id}`,
    method: 'GET'
  })
}

/**
 * 添加记录
 */
export const addRecord = async (recordData) => {
  return request({
    url: '/api/food-diary/records',
    method: 'POST',
    data: recordData
  })
}

/**
 * 更新记录
 */
export const updateRecord = async (id, recordData) => {
  return request({
    url: `/api/food-diary/records/${id}`,
    method: 'PUT',
    data: recordData
  })
}

/**
 * 删除记录
 */
export const deleteRecord = async (id) => {
  return request({
    url: `/api/food-diary/records/${id}`,
    method: 'DELETE'
  })
}

/**
 * 切换收藏状态
 */
export const toggleFavorite = async (id) => {
  return request({
    url: `/api/food-diary/records/${id}/favorite`,
    method: 'POST'
  })
}

// ==================== 统计相关 ====================

/**
 * 获取月度统计
 */
export const getMonthlyStats = async (month) => {
  return request({
    url: '/api/food-diary/stats/monthly',
    method: 'GET',
    data: { month }
  })
}

/**
 * 获取日历索引
 */
export const getCalendarIndex = async (month) => {
  return request({
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
  return request({
    url: '/api/food-diary/media/upload-token',
    method: 'POST',
    data: params
  })
}

/**
 * 上传图片
 */
export const uploadImage = async (filePath, bizType = 'food-diary') => {
  return uploadRequest(filePath, { bizType })
}

// ==================== 抠图任务相关 ====================

/**
 * 创建抠图任务
 */
export const createCutoutTask = async (params) => {
  return request({
    url: '/api/food-diary/cutout/tasks',
    method: 'POST',
    data: params
  })
}

/**
 * 查询抠图任务
 */
export const getCutoutTask = async (taskId) => {
  return request({
    url: `/api/food-diary/cutout/tasks/${taskId}`,
    method: 'GET'
  })
}

// ==================== 店铺相关 ====================

/**
 * 搜索店铺
 */
export const searchStores = async (keyword, limit = 10) => {
  return request({
    url: '/api/food-diary/stores/search',
    method: 'GET',
    data: { keyword, limit }
  })
}

/**
 * 获取附近店铺
 */
export const getNearbyStores = async (latitude, longitude, radius = 1000, limit = 10) => {
  return request({
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
  return request({
    url: '/api/food-diary/medals',
    method: 'GET'
  })
}

/**
 * 检查新勋章
 */
export const checkNewMedals = async () => {
  return request({
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
/**
 * 位置服务工具类
 * 提供地图位置选择、权限检查、常用地点管理等功能
 */

// 常用地点存储键
const FREQUENT_LOCATIONS_KEY = 'frequent_locations'
const MAX_FREQUENT_LOCATIONS = 10

/**
 * 检查位置权限
 * @returns {Promise<boolean>} 是否有权限
 */
export const checkLocationPermission = async () => {
  try {
    const res = await new Promise((resolve, reject) => {
      uni.getSetting({
        success: resolve,
        fail: reject
      })
    })

    // 用户之前拒绝过
    if (res.authSetting && res.authSetting['scope.userLocation'] === false) {
      uni.showModal({
        title: '需要位置权限',
        content: '为了标记饮品饮用地点，需要获取您的位置信息。请在设置中开启位置权限',
        confirmText: '去设置',
        cancelText: '取消',
        success: (modalRes) => {
          if (modalRes.confirm) {
            uni.openSetting()
          }
        }
      })
      return false
    }

    return true
  } catch (error) {
    // 在开发环境或某些平台上，getSetting 可能不可用
    // 此时直接返回 true，让后续的 API 调用来处理权限问题
    console.warn('getSetting 不可用，跳过权限检查:', error.errMsg || error)
    return true
  }
}

/**
 * 打开地图选择位置
 * @param {Object} options - 配置选项
 * @param {boolean} options.saveToFrecent - 是否保存到常用地点（默认true）
 * @returns {Promise<Object|null>} 位置信息对象或null（用户取消）
 * @returns {string} name - 地点名称
 * @returns {string} address - 详细地址
 * @returns {number} latitude - 纬度
 * @returns {number} longitude - 经度
 */
export const chooseLocation = async (options = {}) => {
  const { saveToFrecent = true } = options

  try {
    // 先检查权限（在开发环境可能不可用，会返回 true）
    const hasPermission = await checkLocationPermission()
    if (!hasPermission) {
      return null
    }

    // 调用地图选择
    const result = await new Promise((resolve, reject) => {
      uni.chooseLocation({
        success: resolve,
        fail: reject
      })
    })

    // 构建位置信息对象
    const locationInfo = {
      name: result.name || '',
      address: result.address || '',
      latitude: result.latitude,
      longitude: result.longitude
    }

    // 保存到常用地点
    if (saveToFrecent && locationInfo.name) {
      await saveFrequentLocation(locationInfo)
    }

    return locationInfo
  } catch (error) {
    // 用户取消不报错
    if (error.errMsg && error.errMsg.includes('cancel')) {
      return null
    }

    // 权限被拒绝
    if (error.errMsg && (error.errMsg.includes('auth deny') || error.errMsg.includes('authorize'))) {
      uni.showModal({
        title: '需要位置权限',
        content: '请在设置中开启位置权限，以便选择饮品地点',
        confirmText: '去设置',
        success: (res) => {
          if (res.confirm) {
            uni.openSetting()
          }
        }
      })
      return null
    }

    // 其他错误
    console.error('选择位置失败:', error)
    uni.showToast({
      title: '选择地点失败，请重试',
      icon: 'none',
      duration: 2000
    })
    return null
  }
}

/**
 * 获取当前位置
 * @param {Object} options - 配置选项
 * @param {string} options.type - 坐标系类型，默认 'gcj02'
 * @param {boolean} options.showTip - 是否显示错误提示，默认 true
 * @returns {Promise<Object|null>} 位置信息对象或null
 */
export const getCurrentLocation = async (options = {}) => {
  const { type = 'gcj02', showTip = true } = options

  try {
    // 先检查权限（在开发环境可能不可用，会返回 true）
    const hasPermission = await checkLocationPermission()
    if (!hasPermission) {
      return null
    }

    // 获取位置
    const result = await new Promise((resolve, reject) => {
      uni.getLocation({
        type: type, // 国测局坐标系
        success: resolve,
        fail: reject
      })
    })

    return {
      latitude: result.latitude,
      longitude: result.longitude,
      speed: result.speed,
      accuracy: result.accuracy
    }
  } catch (error) {
    console.error('获取位置失败:', error)

    // 权限被拒绝
    if (error.errMsg && (error.errMsg.includes('auth deny') || error.errMsg.includes('authorize'))) {
      if (showTip) {
        uni.showModal({
          title: '需要位置权限',
          content: '请在设置中开启位置权限，以便获取您的当前位置',
          confirmText: '去设置',
          success: (res) => {
            if (res.confirm) {
              uni.openSetting()
            }
          }
        })
      }
      return null
    }

    // 其他错误
    if (showTip) {
      const errorMsg = getErrorMessage(error.errMsg)
      uni.showToast({
        title: errorMsg,
        icon: 'none',
        duration: 2000
      })
    }
    return null
  }
}

/**
 * 获取友好的错误提示信息
 * @param {string} errMsg - 错误信息
 * @returns {string} 友好的错误提示
 */
const getErrorMessage = (errMsg) => {
  if (!errMsg) return '操作失败，请重试'

  if (errMsg.includes('network')) {
    return '网络异常，请检查网络连接'
  }
  if (errMsg.includes('timeout')) {
    return '请求超时，请重试'
  }
  if (errMsg.includes('location')) {
    return '定位失败，请检查设备定位服务是否开启'
  }
  if (errMsg.includes('auth')) {
    return '权限被拒绝，请在设置中开启'
  }

  return '操作失败，请重试'
}

/**
 * 格式化位置信息为显示文本
 * @param {Object} location - 位置对象
 * @returns {string} 格式化后的文本
 */
export const formatLocationText = (location) => {
  if (!location) return ''

  // 优先使用名称，如果没有则使用地址
  return location.name || location.address || ''
}

/**
 * 保存常用地点
 * @param {Object} location - 位置信息
 * @returns {Promise<boolean>} 是否保存成功
 */
export const saveFrequentLocation = async (location) => {
  try {
    if (!location || !location.latitude || !location.longitude) {
      return false
    }

    // 获取已有的常用地点
    const locations = await getFrequentLocations()

    // 检查是否已存在相同地点（根据经纬度判断）
    const existingIndex = locations.findIndex(
      loc => Math.abs(loc.latitude - location.latitude) < 0.0001 &&
             Math.abs(loc.longitude - location.longitude) < 0.0001
    )

    if (existingIndex !== -1) {
      // 已存在，更新使用次数和时间
      locations[existingIndex].useCount = (locations[existingIndex].useCount || 0) + 1
      locations[existingIndex].lastUsed = Date.now()
    } else {
      // 不存在，添加新地点
      locations.push({
        ...location,
        useCount: 1,
        lastUsed: Date.now(),
        addedAt: Date.now()
      })
    }

    // 按使用次数和时间排序，保留前 MAX_FREQUENT_LOCATIONS 个
    locations.sort((a, b) => {
      if (b.useCount !== a.useCount) {
        return b.useCount - a.useCount
      }
      return b.lastUsed - a.lastUsed
    })

    const trimmedLocations = locations.slice(0, MAX_FREQUENT_LOCATIONS)

    // 保存到本地存储
    uni.setStorageSync(FREQUENT_LOCATIONS_KEY, JSON.stringify(trimmedLocations))

    return true
  } catch (error) {
    console.error('保存常用地点失败:', error)
    return false
  }
}

/**
 * 获取常用地点列表
 * @returns {Promise<Array>} 常用地点数组
 */
export const getFrequentLocations = async () => {
  try {
    const data = uni.getStorageSync(FREQUENT_LOCATIONS_KEY)
    if (!data) return []

    const locations = JSON.parse(data)
    return Array.isArray(locations) ? locations : []
  } catch (error) {
    console.error('获取常用地点失败:', error)
    return []
  }
}

/**
 * 删除常用地点
 * @param {number} index - 要删除的地点索引
 * @returns {Promise<boolean>} 是否删除成功
 */
export const deleteFrequentLocation = async (index) => {
  try {
    const locations = await getFrequentLocations()
    if (index < 0 || index >= locations.length) {
      return false
    }

    locations.splice(index, 1)
    uni.setStorageSync(FREQUENT_LOCATIONS_KEY, JSON.stringify(locations))

    return true
  } catch (error) {
    console.error('删除常用地点失败:', error)
    return false
  }
}

/**
 * 清空所有常用地点
 * @returns {Promise<boolean>} 是否清空成功
 */
export const clearFrequentLocations = async () => {
  try {
    uni.removeStorageSync(FREQUENT_LOCATIONS_KEY)
    return true
  } catch (error) {
    console.error('清空常用地点失败:', error)
    return false
  }
}

/**
 * 计算两点之间的距离（单位：米）
 * @param {number} lat1 - 点1纬度
 * @param {number} lng1 - 点1经度
 * @param {number} lat2 - 点2纬度
 * @param {number} lng2 - 点2经度
 * @returns {number} 距离（米）
 */
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const rad = (d) => d * Math.PI / 180.0
  const EARTH_RADIUS = 6378137 // 地球半径（米）

  const radLat1 = rad(lat1)
  const radLat2 = rad(lat2)
  const radLng1 = rad(lng1)
  const radLng2 = rad(lng2)

  const a = radLat1 - radLat2
  const b = radLng1 - radLng2

  let s = 2 * Math.asin(Math.sqrt(
    Math.pow(Math.sin(a / 2), 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)
  ))

  s = s * EARTH_RADIUS
  s = Math.round(s * 10000) / 10000

  return s
}

/**
 * 格式化距离显示
 * @param {number} distance - 距离（米）
 * @returns {string} 格式化后的距离文本
 */
export const formatDistance = (distance) => {
  if (!distance || distance < 0) return ''

  if (distance < 1000) {
    return `${Math.round(distance)}m`
  } else {
    return `${(distance / 1000).toFixed(1)}km`
  }
}

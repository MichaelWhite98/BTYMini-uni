/**
 * 位置服务工具类
 * 提供地图位置选择、权限检查等功能
 */

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
    if (res.authSetting['scope.userLocation'] === false) {
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
    console.error('检查位置权限失败:', error)
    return false
  }
}

/**
 * 打开地图选择位置
 * @returns {Promise<Object|null>} 位置信息对象或null（用户取消）
 * @returns {string} name - 地点名称
 * @returns {string} address - 详细地址
 * @returns {number} latitude - 纬度
 * @returns {number} longitude - 经度
 */
export const chooseLocation = async () => {
  try {
    // 先检查权限
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

    // 返回位置信息
    return {
      name: result.name || '',
      address: result.address || '',
      latitude: result.latitude,
      longitude: result.longitude
    }
  } catch (error) {
    // 用户取消不报错
    if (error.errMsg && error.errMsg.includes('cancel')) {
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
 * @returns {Promise<Object|null>} 位置信息对象或null
 */
export const getCurrentLocation = async () => {
  try {
    // 先检查权限
    const hasPermission = await checkLocationPermission()
    if (!hasPermission) {
      return null
    }

    // 获取位置
    const result = await new Promise((resolve, reject) => {
      uni.getLocation({
        type: 'gcj02', // 国测局坐标系
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
    uni.showToast({
      title: '获取位置失败，请检查定位权限',
      icon: 'none',
      duration: 2000
    })
    return null
  }
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

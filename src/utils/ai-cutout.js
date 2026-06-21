/**
 * AI 智能抠图工具
 * 基于阿里云通义万相 API 实现智能抠图功能
 */

const getApiBase = () => {
  if (typeof globalThis !== 'undefined' && globalThis.__BTY_API_BASE__) {
    return String(globalThis.__BTY_API_BASE__).replace(/\/$/, '')
  }
  return ''
}

/**
 * 智能抠图
 * @param {Object} options - 配置选项
 * @param {String} options.imageUrl - 图片 URL
 * @param {String} options.description - 主体描述（如：咖啡杯、食物）
 * @param {Boolean} options.returnMask - 是否返回蒙版
 * @returns {Promise<Object>} 抠图结果
 * @returns {String} return.cutoutUrl - 抠图结果 URL
 * @returns {String} return.maskUrl - 蒙版 URL（如果请求了蒙版）
 * @returns {Array} return.subjects - 识别到的主体列表
 */
export const smartCutout = async (options) => {
  const { imageUrl, description, returnMask = false } = options

  if (!imageUrl) {
    throw new Error('图片 URL 不能为空')
  }

  try {
    const response = await uni.request({
      url: `${getApiBase()}/api/food-diary/ai/smart-cutout`,
      method: 'POST',
      data: {
        imageUrl,
        description,
        returnMask
      },
      timeout: 30000 // 30 秒超时
    })

    if (response.statusCode === 200 && response.data.code === 200) {
      return response.data.data
    } else {
      throw new Error(response.data.msg || '抠图失败')
    }
  } catch (error) {
    console.error('AI 抠图失败:', error)

    // 友好的错误提示
    let errorMsg = '抠图失败'
    if (error.errMsg && error.errMsg.includes('timeout')) {
      errorMsg = '请求超时，请稍后重试'
    } else if (error.message) {
      errorMsg = error.message
    }

    throw new Error(errorMsg)
  }
}

/**
 * 批量主体识别
 * @param {String} imageUrl - 图片 URL
 * @returns {Promise<Object>} 识别结果
 * @returns {Array} return.subjects - 识别到的主体列表
 */
export const detectSubjects = async (imageUrl) => {
  if (!imageUrl) {
    throw new Error('图片 URL 不能为空')
  }

  try {
    const response = await uni.request({
      url: `${getApiBase()}/api/food-diary/ai/detect-subjects`,
      method: 'POST',
      data: { imageUrl },
      timeout: 30000
    })

    if (response.statusCode === 200 && response.data.code === 200) {
      return response.data.data
    } else {
      throw new Error(response.data.msg || '识别失败')
    }
  } catch (error) {
    console.error('主体识别失败:', error)
    throw error
  }
}

/**
 * 快速抠图（预定义描述）
 * @param {String} imageUrl - 图片 URL
 * @param {String} type - 类型：coffee/food/plate
 * @returns {Promise<Object>} 抠图结果
 */
export const quickCutout = async (imageUrl, type = 'coffee') => {
  const descriptions = {
    coffee: '咖啡杯或饮料杯',
    food: '食物或菜品',
    plate: '盘子或餐具',
    all: '所有主体'
  }

  const description = descriptions[type] || type

  return smartCutout({
    imageUrl,
    description,
    returnMask: false
  })
}

export default {
  smartCutout,
  detectSubjects,
  quickCutout
}

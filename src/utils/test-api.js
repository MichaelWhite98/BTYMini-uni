/**
 * API 连接测试工具
 * 用于验证后端服务连接是否正常
 */

import { getToken } from './food-diary/api.js'

/**
 * 测试后端 API 连接
 */
export const testApiConnection = async () => {
  const apiBase = globalThis.__BTY_API_BASE__ || 'http://192.168.31.185:8082'
  console.log('🔍 测试 API 连接:', apiBase)

  try {
    // 测试 1: 基础连接测试
    console.log('\n📍 测试 1: 基础连接')
    const test1 = await new Promise((resolve, reject) => {
      uni.request({
        url: `${apiBase}/api/food-diary/records`,
        method: 'GET',
        data: { pageNo: 1, pageSize: 5 },
        timeout: 5000,
        success: (res) => {
          console.log('✅ 基础连接成功:', res)
          resolve(res)
        },
        fail: (err) => {
          console.error('❌ 基础连接失败:', err)
          reject(err)
        }
      })
    })

    // 测试 2: 检查 Token
    console.log('\n📍 测试 2: Token 检查')
    const token = getToken()
    console.log('Token:', token || '未设置')

    // 测试 3: 检查抠图服务
    console.log('\n📍 测试 3: 抠图服务')
    const cutoutApiBase = globalThis.__BTY_CUTOUT_API_BASE__ || 'http://192.168.31.185:8090'
    try {
      const test3 = await new Promise((resolve, reject) => {
        uni.request({
          url: `${cutoutApiBase}/health`,
          method: 'GET',
          timeout: 3000,
          success: resolve,
          fail: reject
        })
      })
      console.log('✅ 抠图服务正常:', test3)
    } catch (err) {
      console.warn('⚠️  抠图服务未启动（可选）:', err.errMsg)
    }

    console.log('\n✅ API 连接测试完成')
    return true
  } catch (error) {
    console.error('\n❌ API 连接测试失败:', error)

    // 提供详细的错误信息
    console.log('\n📋 排查建议:')
    console.log('1. 检查微信开发者工具设置:')
    console.log('   - 详情 → 本地设置 → 勾选"不校验合法域名..."')
    console.log('2. 检查后端服务是否运行:')
    console.log('   - 在终端运行: curl http://192.168.31.185:8082/api/food-diary/records')
    console.log('3. 检查网络连接:')
    console.log('   - 确保手机/模拟器和电脑在同一局域网')

    return false
  }
}

/**
 * 快速测试方法 - 可以在任何页面调用
 *
 * 使用方法:
 * import { testApiConnection } from '@/utils/test-api.js'
 * testApiConnection()
 */

/**
 * 直接测试后端接口（绕过封装）
 */

export const testBackendDirectly = async () => {
  console.log('🔍 直接测试后端接口...\n')

  const apiBase = 'http://192.168.31.185:8082'

  // 测试 1: 测试根路径
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('测试 1: 根路径')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  try {
    const res1 = await new Promise((resolve, reject) => {
      uni.request({
        url: `${apiBase}/`,
        method: 'GET',
        success: resolve,
        fail: reject
      })
    })
    console.log('✅ 成功:', res1)
  } catch (err) {
    console.error('❌ 失败:', err)
  }

  // 测试 2: 测试登录接口
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('测试 2: 登录接口')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  try {
    const res2 = await new Promise((resolve, reject) => {
      uni.request({
        url: `${apiBase}/api/food-diary/auth/login`,
        method: 'POST',
        data: { code: 'test_code_' + Date.now() },
        success: resolve,
        fail: reject
      })
    })
    console.log('✅ HTTP 状态码:', res2.statusCode)
    console.log('✅ 响应数据:', res2.data)

    // 如果登录成功，保存 token
    if (res2.data && res2.data.code === 200 && res2.data.data && res2.data.data.token) {
      console.log('🎉 登录成功！Token:', res2.data.data.token)
      const { setToken } = require('./food-diary/api.js')
      setToken(res2.data.data.token)
      console.log('✅ Token 已保存')
    }
  } catch (err) {
    console.error('❌ 失败:', err)
  }

  // 测试 3: 测试统计接口（不带 token）
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('测试 3: 统计接口（不带 token）')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  try {
    const res3 = await new Promise((resolve, reject) => {
      uni.request({
        url: `${apiBase}/api/food-diary/stats/monthly`,
        method: 'GET',
        data: { month: '2026-06' },
        success: resolve,
        fail: reject
      })
    })
    console.log('✅ HTTP 状态码:', res3.statusCode)
    console.log('✅ 响应数据:', res3.data)
  } catch (err) {
    console.error('❌ 失败:', err)
  }

  // 测试 4: 测试统计接口（带测试 token）
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('测试 4: 统计接口（带测试 token）')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  try {
    const res4 = await new Promise((resolve, reject) => {
      uni.request({
        url: `${apiBase}/api/food-diary/stats/monthly`,
        method: 'GET',
        data: { month: '2026-06' },
        header: {
          'Authorization': 'test_token_' + Date.now()
        },
        success: resolve,
        fail: reject
      })
    })
    console.log('✅ HTTP 状态码:', res4.statusCode)
    console.log('✅ 响应数据:', res4.data)
  } catch (err) {
    console.error('❌ 失败:', err)
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📊 测试总结')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('\n根据测试结果：')
  console.log('1. 如果所有接口都返回 HTTP 200，说明网络正常')
  console.log('2. 如果返回 code: 332，说明需要登录')
  console.log('3. 如果返回 code: 500，说明后端有错误')
  console.log('\n💡 解决方案：')
  console.log('- 如果需要登录：联系后端获取测试 Token')
  console.log('- 如果后端错误：查看后端日志排查问题')
}

// 导出到全局
if (typeof globalThis !== 'undefined') {
  globalThis.testBackendDirectly = testBackendDirectly
}

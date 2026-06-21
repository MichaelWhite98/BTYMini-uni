/**
 * 网络诊断工具 - 详细版
 * 用于排查微信小程序网络请求问题
 */

import { getToken } from './auth.js'

/**
 * 完整的网络诊断
 */
export const networkDiagnosis = async () => {
  console.log('🔍 开始网络诊断...\n')

  const results = {
    apiBase: globalThis.__BTY_API_BASE__,
    cutoutApiBase: globalThis.__BTY_CUTOUT_API_BASE__,
    tests: []
  }

  // 获取当前 token
  const token = getToken()
  console.log('🔑 当前 Token:', token ? (token.substring(0, 20) + '...') : '无')

  // 测试 1: 检查 API Base 配置
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📋 测试 1: 检查 API 配置')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('API Base:', results.apiBase)
  console.log('Cutout API Base:', results.cutoutApiBase)
  console.log('')

  // 测试 2: 直接测试 HTTP 请求（不经过封装）
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📋 测试 2: 原始 HTTP 请求测试')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  const testUrl = `${results.apiBase}/api/food-diary/records?pageNo=1&pageSize=5`
  console.log('请求 URL:', testUrl)

  // 构建请求头
  const headers = {}
  if (token) {
    headers['Authorization'] = token
    console.log('📌 已添加 Authorization header')
  }

  try {
    const response = await new Promise((resolve, reject) => {
      console.log('发起请求...')
      uni.request({
        url: testUrl,
        method: 'GET',
        header: headers,
        timeout: 10000,
        enableHttp2: false,  // 禁用 HTTP/2
        enableQuic: false,   // 禁用 QUIC
        enableCache: false,  // 禁用缓存
        success: (res) => {
          console.log('✅ 请求成功回调触发')
          console.log('状态码:', res.statusCode)
          console.log('响应头:', res.header)
          console.log('响应数据:', res.data)
          resolve(res)
        },
        fail: (err) => {
          console.error('❌ 请求失败回调触发')
          console.error('错误信息:', err)
          console.error('错误详情:', JSON.stringify(err, null, 2))
          reject(err)
        },
        complete: (res) => {
          console.log('📡 请求完成')
          console.log('完整响应:', res)
        }
      })
    })

    results.tests.push({
      name: '原始 HTTP 请求',
      success: true,
      statusCode: response.statusCode,
      data: response.data
    })

    console.log('\n✅ 测试 2 通过\n')
  } catch (error) {
    results.tests.push({
      name: '原始 HTTP 请求',
      success: false,
      error: error
    })

    console.error('\n❌ 测试 2 失败')
    console.error('错误对象:', error)
    console.error('错误信息:', error.errMsg || error.message || error)

    // 分析错误原因
    if (error.errMsg) {
      if (error.errMsg.includes('timeout')) {
        console.error('\n⚠️  可能原因: 请求超时')
        console.error('解决方案: 检查网络连接，或增加 timeout 时间')
      } else if (error.errMsg.includes('fail')) {
        console.error('\n⚠️  可能原因: 网络请求失败')
        console.error('解决方案: 检查微信开发者工具设置')
        console.error('  1. 详情 → 本地设置')
        console.error('  2. 勾选"不校验合法域名、web-view（业务域名）、TLS版本以及HTTPS证书"')
      }
    }

    console.log('')
  }

  // 测试 3: 测试不同的 URL
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📋 测试 3: 测试其他端点')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  const testEndpoints = [
    '/api/food-diary/records',
    '/api/food-diary/user/info',
    '/'
  ]

  for (const endpoint of testEndpoints) {
    const url = `${results.apiBase}${endpoint}`
    console.log(`\n测试端点: ${endpoint}`)

    try {
      const res = await new Promise((resolve, reject) => {
        uni.request({
          url: url,
          method: 'GET',
          header: headers,
          timeout: 5000,
          success: resolve,
          fail: reject
        })
      })

      console.log(`  ✅ 成功: ${res.statusCode}`)
      results.tests.push({
        name: `端点 ${endpoint}`,
        success: true,
        statusCode: res.statusCode
      })
    } catch (err) {
      console.error(`  ❌ 失败: ${err.errMsg || err.message}`)
      results.tests.push({
        name: `端点 ${endpoint}`,
        success: false,
        error: err.errMsg || err.message
      })
    }
  }

  // 测试 4: 检查环境
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📋 测试 4: 环境信息')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  try {
    const systemInfo = uni.getSystemInfoSync()
    console.log('系统信息:', systemInfo)
    results.systemInfo = systemInfo
  } catch (err) {
    console.error('获取系统信息失败:', err)
  }

  // 总结
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📊 诊断总结')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  const successCount = results.tests.filter(t => t.success).length
  const totalCount = results.tests.length

  console.log(`测试通过: ${successCount}/${totalCount}`)
  console.log('\n测试结果:')
  results.tests.forEach((test, index) => {
    const icon = test.success ? '✅' : '❌'
    console.log(`  ${icon} ${test.name}`)
    if (test.error) {
      console.log(`     错误: ${test.error}`)
    }
  })

  // 建议
  if (successCount < totalCount) {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('💡 解决建议')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('\n1. 检查微信开发者工具设置:')
    console.log('   详情 → 本地设置 → 勾选以下选项:')
    console.log('   ☑️ 不校验合法域名、web-view（业务域名）、TLS版本以及HTTPS证书')
    console.log('   ☑️ 不校验安全域名、TLS版本以及HTTPS证书')
    console.log('\n2. 检查后端服务:')
    console.log('   确保后端服务正在运行')
    console.log('   在终端测试: curl http://192.168.31.185:8082/api/food-diary/records')
    console.log('\n3. 清除缓存:')
    console.log('   工具 → 清除缓存 → 全部清除')
    console.log('   然后重新编译项目')
  }

  return results
}

/**
 * 快速测试 - 可以在控制台直接调用
 */
export const quickTest = () => {
  const apiBase = globalThis.__BTY_API_BASE__ || 'http://192.168.31.185:8082'
  const token = getToken()

  console.log('🚀 快速测试开始')
  console.log('API Base:', apiBase)
  console.log('🔑 Token:', token ? (token.substring(0, 20) + '...') : '无')

  const headers = {}
  if (token) {
    headers['Authorization'] = token
  }

  uni.request({
    url: `${apiBase}/api/food-diary/records`,
    method: 'GET',
    header: headers,
    data: { pageNo: 1, pageSize: 5 },
    success: (res) => {
      console.log('✅ 成功!')
      console.log('状态码:', res.statusCode)
      console.log('数据:', res.data)
    },
    fail: (err) => {
      console.error('❌ 失败!')
      console.error('错误:', err)
      console.error('\n请在控制台运行以下命令查看详细诊断:')
      console.error('networkDiagnosis()')
    }
  })
}

// 导出到全局，方便在控制台调用
if (typeof globalThis !== 'undefined') {
  globalThis.networkDiagnosis = networkDiagnosis
  globalThis.quickTest = quickTest
}

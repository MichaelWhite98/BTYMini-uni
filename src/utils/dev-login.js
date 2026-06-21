/**
 * 开发环境模拟登录工具
 * 用于在微信开发者工具中测试需要认证的接口
 */

import { setToken, getToken } from './food-diary/api.js'

/**
 * 检查是否需要模拟登录
 */
export const checkDevLogin = () => {
  const token = getToken()

  if (!token) {
    console.warn('⚠️  未检测到登录态')
    console.log('\n📱 在微信开发者工具中，uni.login() 可能无法正常工作')
    console.log('💡 解决方案：\n')
    console.log('方案 1: 使用测试 Token（推荐）')
    console.log('  在控制台运行: setDevToken()')
    console.log('\n方案 2: 在真机上测试')
    console.log('  真机上 uni.login() 会正常工作\n')

    return false
  }

  console.log('✅ 已登录')
  return true
}

/**
 * 设置开发环境测试 Token
 * 注意：这只是绕过前端认证，后端仍然需要有效的 Token
 */
export const setDevToken = () => {
  // 这是一个测试 token，实际使用时需要从后端获取
  const testToken = 'test_dev_token_' + Date.now()

  setToken(testToken)
  console.log('✅ 已设置测试 Token:', testToken)
  console.log('⚠️  注意: 这只是前端的测试 Token')
  console.log('   后端可能仍然会验证 Token 的有效性')
  console.log('\n💡 如果后端返回 332 错误，说明需要真实的 Token')
  console.log('   请联系后端开发获取测试 Token，或使用以下方法：\n')
  console.log('方法 1: 从后端日志中获取真实 Token')
  console.log('方法 2: 使用真实手机号登录')
  console.log('方法 3: 在后端临时关闭认证\n')

  return testToken
}

/**
 * 使用真实 Token
 */
export const setRealToken = (token) => {
  if (!token) {
    console.error('❌ Token 不能为空')
    return
  }

  setToken(token)
  console.log('✅ 已设置 Token:', token.substring(0, 20) + '...')
}

/**
 * 清除 Token
 */
export const clearDevToken = () => {
  const { clearToken } = require('./food-diary/api.js')
  clearToken()
  console.log('✅ 已清除 Token')
}

// 导出到全局，方便在控制台调用
if (typeof globalThis !== 'undefined') {
  globalThis.setDevToken = setDevToken
  globalThis.setRealToken = setRealToken
  globalThis.clearDevToken = clearDevToken
  globalThis.checkDevLogin = checkDevLogin
}

export default {
  checkDevLogin,
  setDevToken,
  setRealToken,
  clearDevToken
}

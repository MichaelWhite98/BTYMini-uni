<script>
import { getSystemInfo } from '@/utils/safe-area.js'
import { wxLogin } from '@/utils/food-diary/api.js'
import { setToken, setUserInfo, getToken, isLoggedIn, isTokenExpiring, markLoginComplete } from '@/utils/auth.js'

export default {
  onLaunch() {
    // 获取系统信息并设置 CSS 变量
    const systemInfo = getSystemInfo()

    // 设置全局 CSS 变量
    const cssVars = {
      '--status-bar-height': `${systemInfo.statusBarHeight}px`,
      '--safe-area-top': `${systemInfo.safeAreaInsets.top}px`,
      '--safe-area-bottom': `${systemInfo.safeAreaInsets.bottom}px`,
      '--safe-area-left': `${systemInfo.safeAreaInsets.left}px`,
      '--safe-area-right': `${systemInfo.safeAreaInsets.right}px`,
      '--nav-bar-height': `${systemInfo.statusBarHeight + 44}px`
    }

    console.log('System Info:', systemInfo)

    // 自动登录
    this.autoLogin()
  },
  onShow() {},
  onHide() {},

  methods: {
    async autoLogin() {
      try {
        // 1. 检查是否已有token且未过期
        const token = getToken()
        if (token) {
          console.log('✅ 已有登录态')
          markLoginComplete(true)

          // 检查是否即将过期，需要刷新
          if (isTokenExpiring()) {
            console.log('⚠️  Token 即将过期，尝试刷新')
            await this.refreshLogin()
          }

          return
        }

        // 2. Token 无效或不存在，执行微信登录
        console.log('🔐 执行微信登录...')
        const loginRes = await new Promise((resolve, reject) => {
          uni.login({
            success: resolve,
            fail: reject
          })
        })

        if (loginRes.code) {
          // 3. 调用后端登录接口
          const result = await wxLogin(loginRes.code)

          // Token 已在 wxLogin 内部保存
          // 用户信息也已保存
          console.log('✅ 登录成功:', result.userInfo.nickname || '新用户')

          // 标记登录完成
          markLoginComplete(true)

          // 4. 如果是新用户，延迟引导完善信息
          if (result.isNewUser) {
            setTimeout(() => {
              uni.showModal({
                title: '欢迎加入百淘云',
                content: '完善个人信息，开启你的饮品记录之旅',
                confirmText: '去完善',
                cancelText: '稍后再说',
                success: (res) => {
                  if (res.confirm) {
                    uni.navigateTo({ url: '/pages/user/profile' })
                  }
                }
              })
            }, 2000)
          }
        } else {
          markLoginComplete(false)
        }
      } catch (error) {
        console.error('❌ 自动登录失败:', error)
        markLoginComplete(false)

        // 不强制登录，允许用户浏览
        console.log('💡 用户可以正常浏览，部分功能需要登录后使用')
      }
    },

    async refreshLogin() {
      try {
        const loginRes = await new Promise((resolve, reject) => {
          uni.login({
            success: resolve,
            fail: reject
          })
        })

        if (loginRes.code) {
          const result = await wxLogin(loginRes.code)
          // Token 已在 wxLogin 内部保存
          console.log('✅ Token 刷新成功')
        }
      } catch (error) {
        console.error('❌ Token 刷新失败:', error)
      }
    }
  }
}
</script>

<style lang="scss">
@use "@/styles/theme.scss" as *;
@use "@/styles/components.scss" as *;

/* 引入 uni-icons 样式 */
@import "@/styles/uni-icons.css";
</style>


<script>
import { getSystemInfo } from '@/utils/safe-area.js'
import { wxLogin, getToken } from '@/utils/food-diary/api.js'

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
        // 检查是否已有token
        const token = getToken()
        if (token) {
          console.log('已有登录态')
          return
        }

        // 获取微信登录code
        const loginRes = await new Promise((resolve, reject) => {
          uni.login({
            success: resolve,
            fail: reject
          })
        })

        if (loginRes.code) {
          // 调用后端登录接口
          const result = await wxLogin(loginRes.code)
          console.log('登录成功:', result)
        }
      } catch (error) {
        console.error('自动登录失败:', error)
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


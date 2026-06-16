<script>
import { getSystemInfo } from '@/utils/safe-area.js'

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

    // 小程序环境下，通过页面样式设置
    // 这些变量会在 theme.scss 中被使用
    console.log('System Info:', systemInfo)
  },
  onShow() {},
  onHide() {}
}
</script>

<style lang="scss">
@use "@/styles/theme.scss" as *;

/* 引入 uni-icons 样式 */
@import "@/styles/uni-icons.css";
</style>


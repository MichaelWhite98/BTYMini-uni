<template>
  <view class="profile-page">
    <!-- Top AppBar -->
    <view class="app-header">
      <view class="header-left">
        <button class="header-btn" @click="handleMenu">
          <uni-icons type="bars" size="24" color="#3d4947" />
        </button>
        <text class="header-title">百淘云</text>
      </view>
      <view class="header-right">
        <button class="header-btn" @click="handleSettings">
          <uni-icons type="settings" size="24" color="#3d4947" />
        </button>
        <view class="header-avatar">
          <image class="avatar-img" src="/static/images/avatar.png" mode="aspectFill" />
        </view>
      </view>
    </view>

    <!-- Main Content -->
    <scroll-view class="main-content" scroll-y :show-scrollbar="false">
      <!-- Profile Section -->
      <view class="profile-section">
        <view class="avatar-wrapper" @click="handleLogin">
          <view class="avatar-container">
            <image class="avatar-large" :src="user.avatar" mode="aspectFill" />
          </view>
          <button class="edit-btn">
            <uni-icons :type="loginStatus ? 'compose' : 'plus'" size="16" color="#ffffff" />
          </button>
        </view>
        <text class="profile-name">{{ user.name }}</text>
        <text class="profile-bio">{{ user.bio }}</text>

        <!-- Stats Row -->
        <view class="stats-row">
          <view class="stat-item" @click="goToMedals">
            <text class="stat-value">{{ user.stats.records }}</text>
            <text class="stat-label">记录</text>
          </view>
          <view class="stat-item" @click="goToMedals">
            <text class="stat-value">{{ user.stats.stores }}</text>
            <text class="stat-label">门店</text>
          </view>
          <view class="stat-item" @click="goToMedals">
            <text class="stat-value">{{ user.stats.favorites }}</text>
            <text class="stat-label">勋章</text>
          </view>
        </view>
      </view>

      <!-- Settings Groups -->
      <view class="settings-groups">
        <!-- Account Settings -->
        <view class="settings-group">
          <view class="group-header">
            <text class="group-title">账户设置</text>
          </view>
          <view class="group-content">
            <button class="settings-item" @click="goToProfile">
              <view class="item-left">
                <uni-icons type="person" size="24" color="#006860" />
                <text class="item-label">个人资料</text>
              </view>
              <uni-icons type="right" size="20" color="#bcc9c6" />
            </button>
            <button class="settings-item" @click="goToSecurity">
              <view class="item-left">
                <uni-icons type="locked" size="24" color="#006860" />
                <text class="item-label">安全设置</text>
              </view>
              <uni-icons type="right" size="20" color="#bcc9c6" />
            </button>
          </view>
        </view>

        <!-- App Preferences -->
        <view class="settings-group">
          <view class="group-header">
            <text class="group-title">应用偏好</text>
          </view>
          <view class="group-content">
            <button class="settings-item" @click="goToLanguage">
              <view class="item-left">
                <uni-icons type="sound" size="24" color="#006860" />
                <text class="item-label">语言设置</text>
              </view>
              <view class="item-right">
                <text class="item-value">{{ preferences.language }}</text>
                <uni-icons type="right" size="20" color="#bcc9c6" />
              </view>
            </button>
            <button class="settings-item" @click="goToNotifications">
              <view class="item-left">
                <uni-icons type="notification" size="24" color="#006860" />
                <text class="item-label">消息通知</text>
              </view>
              <uni-icons type="right" size="20" color="#bcc9c6" />
            </button>
            <view class="settings-item">
              <view class="item-left">
                <uni-icons type="moon" size="24" color="#006860" />
                <text class="item-label">深色模式</text>
              </view>
              <switch
                :checked="preferences.darkMode"
                color="#006860"
                @change="toggleDarkMode"
              />
            </view>
          </view>
        </view>

        <!-- Help & Support -->
        <view class="settings-group">
          <view class="group-header">
            <text class="group-title">帮助与支持</text>
          </view>
          <view class="group-content">
            <button class="settings-item" @click="goToAbout">
              <view class="item-left">
                <uni-icons type="info" size="24" color="#006860" />
                <text class="item-label">关于百淘云</text>
              </view>
              <uni-icons type="right" size="20" color="#bcc9c6" />
            </button>
            <button class="settings-item" @click="clearCache">
              <view class="item-left">
                <uni-icons type="trash" size="24" color="#006860" />
                <text class="item-label">清除缓存</text>
              </view>
              <text class="item-value">{{ cacheSize }}</text>
            </button>
            <button class="settings-item logout" @click="handleLogout">
              <uni-icons type="logout" size="24" color="#ba1a1a" />
              <text class="item-label logout">退出登录</text>
            </button>
          </view>
        </view>
      </view>

      <!-- Version Info -->
      <text class="version-text">版本号 v2.4.0 (Build 20240620)</text>

      <!-- Bottom Spacing -->
      <view class="bottom-spacing" />
    </scroll-view>

    <!-- Bottom Navigation -->
    <view class="bottom-nav">
      <view class="nav-item" @click="switchTab('home')">
        <uni-icons type="home" size="24" color="#3d4947" />
        <text class="nav-label">首页</text>
      </view>
      <view class="nav-item" @click="switchTab('stats')">
        <uni-icons type="bars" size="24" color="#3d4947" />
        <text class="nav-label">统计</text>
      </view>
      <view class="nav-item active" @click="switchTab('profile')">
        <uni-icons type="person" size="24" color="#006860" />
        <text class="nav-label">我的</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getUserInfo, getUserStats, updateUserSettings, logout, clearToken, wxLogin } from '@/utils/food-diary/api.js'
import { isLoggedIn, getUserInfo as getCachedUserInfo, setUserInfo, setToken, waitForLogin, getToken } from '@/utils/auth.js'

const isLoggedInState = ref(false)
const user = ref({
  name: '加载中...',
  avatar: '/static/images/avatar.png',
  bio: '热爱咖啡的极简主义者',
  stats: {
    records: 0,
    stores: 0,
    favorites: 0
  }
})

const preferences = ref({
  language: '简体中文',
  darkMode: false,
  notificationEnabled: true
})

const cacheSize = ref('124 MB')

// 登录状态
const loginStatus = computed(() => isLoggedInState.value)

// 加载用户数据
const loadUserData = async () => {
  // 检查登录状态
  isLoggedInState.value = isLoggedIn()

  if (!isLoggedInState.value) {
    user.value.name = '点击登录'
    user.value.bio = '登录后查看您的数据'
    user.value.stats = { records: 0, stores: 0, favorites: 0 }
    return
  }

  // 尝试从缓存获取
  const cachedUser = getCachedUserInfo()
  if (cachedUser) {
    user.value.name = cachedUser.nickname || '微信用户'
    user.value.avatar = cachedUser.avatar || '/static/images/avatar.png'
    user.value.bio = cachedUser.city ? `来自${cachedUser.city}` : '热爱咖啡的极简主义者'
  }

  // 从服务器获取最新数据
  try {
    const userInfo = await getUserInfo()
    user.value.name = userInfo.nickname || '微信用户'
    user.value.avatar = userInfo.avatar || '/static/images/avatar.png'
    user.value.bio = userInfo.city ? `来自${userInfo.city}` : '热爱咖啡的极简主义者'

    // 更新缓存
    setUserInfo(userInfo)
  } catch (error) {
    console.error('获取用户信息失败:', error)
    // 如果是 332 错误，清除登录状态
    if (error.message && error.message.includes('登录')) {
      isLoggedInState.value = false
      user.value.name = '点击登录'
      user.value.bio = '登录后查看您的数据'
    }
  }

  // 获取统计数据
  try {
    const stats = await getUserStats()
    user.value.stats.records = stats.totalRecords || 0
    user.value.stats.stores = stats.totalStores || 0
    user.value.stats.favorites = stats.medalCount || 0
  } catch (error) {
    console.error('获取用户统计失败:', error)
  }
}

const handleMenu = () => {
  console.log('Menu')
}

const handleSettings = () => {
  console.log('Settings')
}

const handleLogin = async () => {
  if (isLoggedInState.value) {
    // 已登录，跳转到个人资料页
    goToProfile()
    return
  }

  // 未登录，执行登录
  uni.showLoading({ title: '登录中...' })

  try {
    const loginRes = await new Promise((resolve, reject) => {
      uni.login({
        success: resolve,
        fail: reject
      })
    })

    const result = await wxLogin(loginRes.code)

    // 保存 Token
    setToken(result.token)

    // 保存用户信息
    setUserInfo(result.userInfo)

    uni.hideLoading()
    uni.showToast({ title: '登录成功', icon: 'success' })

    // 刷新数据
    await loadUserData()

    // 如果是新用户，引导完善信息
    if (result.isNewUser) {
      setTimeout(() => {
        uni.showModal({
          title: '完善信息',
          content: '是否完善个人信息？',
          success: (res) => {
            if (res.confirm) {
              goToProfile()
            }
          }
        })
      }, 1500)
    }
  } catch (error) {
    uni.hideLoading()
    console.error('登录失败:', error)
    uni.showModal({
      title: '登录失败',
      content: error.message || '请稍后重试',
      showCancel: false
    })
  }
}

const goToProfile = () => {
  if (!isLoggedInState.value) {
    handleLogin()
    return
  }
  uni.navigateTo({ url: '/pages/user/profile' })
}

const goToMedals = () => {
  uni.navigateTo({ url: '/pages/medals/index' })
}

const goToSecurity = () => {
  if (!isLoggedInState.value) {
    uni.showToast({ title: '请先登录', icon: 'none' })
    return
  }
  uni.showToast({ title: '安全设置', icon: 'none' })
}

const goToLanguage = () => {
  uni.showActionSheet({
    itemList: ['简体中文', 'English', '日本語'],
    success: (res) => {
      const languages = ['简体中文', 'English', '日本語']
      preferences.value.language = languages[res.tapIndex]
    }
  })
}

const goToNotifications = () => {
  if (!isLoggedInState.value) {
    uni.showToast({ title: '请先登录', icon: 'none' })
    return
  }
  uni.showToast({ title: '消息通知', icon: 'none' })
}

const toggleDarkMode = async (e) => {
  preferences.value.darkMode = e.detail.value
  if (isLoggedInState.value) {
    try {
      await updateUserSettings({ darkMode: e.detail.value })
    } catch (error) {
      console.error('更新设置失败:', error)
    }
  }
}

const goToAbout = () => {
  uni.showToast({ title: '关于百淘云', icon: 'none' })
}

const clearCache = () => {
  uni.showModal({
    title: '清除缓存',
    content: '确定要清除缓存吗？',
    success: (res) => {
      if (res.confirm) {
        uni.showLoading({ title: '清除中...' })
        setTimeout(() => {
          uni.hideLoading()
          cacheSize.value = '0 MB'
          uni.showToast({ title: '清除成功', icon: 'success' })
        }, 1000)
      }
    }
  })
}

const handleLogout = () => {
  if (!isLoggedInState.value) {
    uni.showToast({ title: '您还未登录', icon: 'none' })
    return
  }

  uni.showModal({
    title: '退出登录',
    content: '确定要退出登录吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await logout()
        } catch (error) {
          // 即使API失败也清除本地数据
          clearToken()
        }

        // 清除登录状态
        isLoggedInState.value = false

        uni.showToast({ title: '已退出', icon: 'success' })

        // 刷新数据
        setTimeout(() => {
          loadUserData()
        }, 500)
      }
    }
  })
}

const switchTab = (tab) => {
  const routes = {
    home: '/pages/index/index',
    stats: '/pages/monthly/index',
    profile: '/pages/profile/index'
  }
  if (tab === 'profile') return
  uni.switchTab({ url: routes[tab] })
}

onMounted(async () => {
  // 等待登录完成后再加载用户数据
  console.log('[Profile] 等待登录完成...')
  const loginSuccess = await waitForLogin()
  console.log('[Profile] 登录完成，结果:', loginSuccess)

  // 检查是否有 token
  const token = getToken()
  if (token) {
    console.log('[Profile] Token 存在，开始加载用户数据')
    loadUserData()
  } else {
    console.log('[Profile] Token 不存在，显示未登录状态')
    isLoggedInState.value = false
    user.value.name = '点击登录'
    user.value.bio = '登录后查看您的数据'
  }
})
</script>

<style lang="scss" scoped>
@use '@/styles/theme.scss' as *;

.profile-page {
  min-height: 100vh;
  background: $background;
  padding-bottom: 98px;
}

// Top AppBar
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  height: 88px;
  padding: 44px 20px 0;
  background: rgba(249, 249, 249, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left,
.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-btn {
  @include nav-button(40px);
}

.header-title {
  font-size: 18px;
  font-weight: $font-weight-bold;
  color: $primary;
}

.header-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  background: $primary-container;
}

.avatar-img {
  width: 100%;
  height: 100%;
}

// Main Content
.main-content {
  padding-top: 104px;
  padding-left: 20px;
  padding-right: 20px;
  height: calc(100vh - 88px);
}

// Profile Section
.profile-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 24px;
}

.avatar-wrapper {
  position: relative;
  margin-bottom: 12px;
}

.avatar-container {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  padding: 4px;
  background: $primary-gradient;
  box-shadow: 0 4px 16px rgba(0, 104, 96, 0.2);
}

.avatar-large {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4px solid $surface-container-lowest;
}

.edit-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: $primary-gradient;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid $surface-container-lowest;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &::after {
    border: none;
  }
}

.profile-name {
  font-size: 20px;
  font-weight: $font-weight-semibold;
  color: $on-surface;
  margin-bottom: 4px;
}

.profile-bio {
  font-size: 14px;
  color: $on-surface-variant;
  margin-bottom: 24px;
}

// Stats Row
.stats-row {
  display: flex;
  gap: 16px;
  width: 100%;
}

.stat-item {
  flex: 1;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(17, 153, 142, 0.08);
  transition: transform $duration-fast $ease-out;

  &:active {
    transform: scale(0.98);
  }
}

.stat-value {
  font-size: 24px;
  font-weight: $font-weight-semibold;
  color: $primary;
  display: block;
}

.stat-label {
  font-size: 12px;
  color: $on-surface-variant;
  margin-top: 4px;
  display: block;
}

// Settings Groups
.settings-groups {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.settings-group {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(17, 153, 142, 0.08);
}

.group-header {
  padding: 16px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}

.group-title {
  font-size: 13px;
  font-weight: $font-weight-bold;
  color: $on-surface-variant;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.group-content {
  display: flex;
  flex-direction: column;
}

.settings-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  width: 100%;
  background: transparent;
  border: none;
  transition: background $duration-fast $ease-out;

  &::after {
    border: none;
  }

  &:active {
    background: rgba(0, 131, 121, 0.05);
  }

  &.logout {
    justify-content: flex-start;
    gap: 16px;
  }

  &:not(:last-child) {
    border-bottom: 1px solid rgba(232, 232, 232, 0.5);
  }
}

.item-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.item-label {
  font-size: 16px;
  color: $on-surface;

  &.logout {
    font-weight: $font-weight-bold;
    color: $error;
  }
}

.item-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.item-value {
  font-size: 13px;
  color: $on-surface-variant;
}

// Version Text
.version-text {
  display: block;
  text-align: center;
  margin-top: 48px;
  font-size: 13px;
  color: $outline-variant;
}

// Bottom Spacing
.bottom-spacing {
  height: 32px;
}

// Bottom Navigation
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 98px;
  padding: 16px 16px calc(34px + 16px);
  background: rgba(249, 249, 249, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 -4px 20px rgba(17, 153, 142, 0.08);
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  border-radius: 12px;
  transition: all $duration-normal $ease-out;

  &.active {
    background: rgba(77, 254, 138, 0.3);
    font-weight: $font-weight-bold;
  }

  &:active {
    transform: scale(0.95);
  }
}

.nav-label {
  font-size: 10px;
  color: $on-surface-variant;
}

.nav-item.active .nav-label {
  color: $primary;
}
</style>

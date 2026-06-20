<template>
  <view class="profile-page">
    <!-- 顶部导航栏 -->
    <header class="app-header">
      <button class="nav-btn" @tap="handleMenu">
        <uni-icons type="bars" size="20"></uni-icons>
      </button>
      <text class="brand-title">百淘云</text>
      <view class="avatar-small">
        <image class="avatar-img" :src="userAvatar" mode="aspectFill" />
      </view>
    </header>

    <!-- 主内容 -->
    <scroll-view scroll-y class="main-content">
      <!-- 个人资料头部 -->
      <view class="profile-header">
        <view class="avatar-large-wrapper">
          <view class="avatar-large">
            <image class="avatar-img" :src="userAvatar" mode="aspectFill" />
          </view>
          <button class="edit-avatar-btn" @tap="handleEditAvatar">
            <uni-icons type="compose" size="20"></uni-icons>
          </button>
        </view>
        <text class="user-name">小明</text>
        <text class="user-bio">热爱咖啡的极简主义者</text>
        
        <!-- 统计数据 -->
        <view class="stats-row">
          <view class="stat-item">
            <text class="stat-number">{{ totalRecords }}</text>
            <text class="stat-label">记录</text>
          </view>
          <view class="stat-divider" />
          <view class="stat-item">
            <text class="stat-number">{{ totalStores }}</text>
            <text class="stat-label">店铺</text>
          </view>
          <view class="stat-divider" />
          <view class="stat-item">
            <text class="stat-number">{{ favoriteCount }}</text>
            <text class="stat-label">收藏</text>
          </view>
        </view>
      </view>

      <!-- 设置分组 -->
      <view class="settings-groups">
        <!-- 账号设置 -->
        <view class="settings-group">
          <text class="group-label">账号设置</text>
          <view class="settings-card">
            <button class="settings-item" @tap="handleProfile">
              <view class="item-icon">
                <uni-icons type="person" size="20"></uni-icons>
              </view>
              <text class="item-label">个人资料</text>
              <uni-icons type="forward" size="20" class="item-arrow"></uni-icons>
            </button>
            <view class="divider" />
            <button class="settings-item" @tap="handleSecurity">
              <view class="item-icon">
                <uni-icons type="locked" size="20"></uni-icons>
              </view>
              <text class="item-label">账号安全</text>
              <uni-icons type="forward" size="20" class="item-arrow"></uni-icons>
            </button>
          </view>
        </view>

        <!-- 应用偏好 -->
        <view class="settings-group">
          <text class="group-label">应用偏好</text>
          <view class="settings-card">
            <button class="settings-item" @tap="handleLanguage">
              <view class="item-icon">
                <uni-icons type="globe" size="20"></uni-icons>
              </view>
              <text class="item-label">语言设置</text>
              <view class="item-value">
                <text class="value-text">简体中文</text>
                <uni-icons type="forward" size="20" class="item-arrow"></uni-icons>
              </view>
            </button>
            <view class="divider" />
            <view class="settings-item">
              <view class="item-icon">
                <uni-icons type="sound" size="20"></uni-icons>
              </view>
              <text class="item-label">通知提醒</text>
              <switch
                :checked="notificationsEnabled"
                color="#ffca98"
                @change="handleNotificationToggle"
              />
            </view>
            <view class="divider" />
            <view class="settings-item">
              <view class="item-icon">
                <uni-icons type="eye-slash" size="20"></uni-icons>
              </view>
              <text class="item-label">深色模式</text>
              <switch
                :checked="darkModeEnabled"
                color="#ffca98"
                @change="handleDarkModeToggle"
              />
            </view>
          </view>
        </view>

        <!-- 帮助与支持 -->
        <view class="settings-group">
          <text class="group-label">帮助与支持</text>
          <view class="settings-card">
            <button class="settings-item" @tap="handleAbout">
              <view class="item-icon">
                <uni-icons type="info" size="20"></uni-icons>
              </view>
              <text class="item-label">关于我们</text>
              <uni-icons type="forward" size="20" class="item-arrow"></uni-icons>
            </button>
            <view class="divider" />
            <button class="settings-item" @tap="handleClearCache">
              <view class="item-icon">
                <uni-icons type="refresh" size="20"></uni-icons>
              </view>
              <text class="item-label">清理缓存</text>
              <text class="cache-size">124 MB</text>
            </button>
            <view class="divider" />
            <button class="logout-btn" @tap="handleLogout">
              <text class="logout-text">退出登录</text>
            </button>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部导航栏 -->
    <nav class="bottom-nav">
      <button class="nav-item" @tap="handleCalendar">
        <uni-icons type="calendar" size="20"></uni-icons>
      </button>
      <button class="nav-item" @tap="handleAdd">
        <uni-icons type="plus" size="24"></uni-icons>
      </button>
      <button class="nav-item active" @tap="handleProfileNav">
        <uni-icons type="person" size="20"></uni-icons>
      </button>
    </nav>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getRecords, clearAllRecords } from '@/utils/food-diary/index.js'

// 用户信息
const userAvatar = ref('https://lh3.googleusercontent.com/aida-public/AB6AXuAlbM0sTYmSEDgzQTSd0X5Lk5H8_HAhPjeFTrFLyiMNkbbMaNJTGZEgewH5ht6fOCWF3ENhmy3zTu9on14R5g6zxsaLDL803-7zopFzHwNTpeZsHwsJSQ-ZjOMNUoR6MPGxjj-Y6tsvVVPPoCBYnSb87Aq1onOqCLkoh3EoIs3ogHo2VzSYgoIu3lF31DGc83FQY-Co-ycM-A9y3t4PmGiTA1Bpp12gNQMq-hqIz3RlVjhUmRUQGphmKssXwnCF6MxKELbTK2qh6mE')

// 设置状态
const notificationsEnabled = ref(true)
const darkModeEnabled = ref(false)

// 统计数据
const records = ref([])

// 计算属性
const totalRecords = computed(() => records.value.length)

const totalStores = computed(() => {
  const stores = new Set()
  records.value.forEach(record => {
    const storeName = record.storeName || (record.location && record.location.name)
    if (storeName) stores.add(storeName)
  })
  return stores.size
})

const favoriteCount = computed(() => {
  return records.value.filter(record => record.isFavorite).length
})

// 加载数据
const loadData = () => {
  records.value = getRecords()
}

// 编辑头像
const handleEditAvatar = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      userAvatar.value = res.tempFilePaths[0]
      uni.showToast({ title: '头像已更新', icon: 'success' })
    }
  })
}

// 个人资料
const handleProfile = () => {
  uni.showToast({ title: '个人资料功能开发中', icon: 'none' })
}

// 账号安全
const handleSecurity = () => {
  uni.showToast({ title: '账号安全功能开发中', icon: 'none' })
}

// 语言设置
const handleLanguage = () => {
  uni.showActionSheet({
    itemList: ['简体中文', 'English'],
    success: ({ tapIndex }) => {
      uni.showToast({ 
        title: tapIndex === 0 ? '已切换为简体中文' : '已切换为English', 
        icon: 'success' 
      })
    }
  })
}

// 通知开关
const handleNotificationToggle = (e) => {
  notificationsEnabled.value = e.detail.value
  uni.showToast({ 
    title: e.detail.value ? '已开启通知' : '已关闭通知', 
    icon: 'success' 
  })
}

// 深色模式开关
const handleDarkModeToggle = (e) => {
  darkModeEnabled.value = e.detail.value
  uni.showToast({ 
    title: e.detail.value ? '深色模式开发中' : '已切换为浅色模式', 
    icon: 'none' 
  })
}

// 关于我们
const handleAbout = () => {
  uni.showModal({
    title: '关于百淘云',
    content: '百淘云 v1.0.0\n一款简洁优雅的美食记录应用\n\n记录每一杯咖啡的温度\n留住每一次美好的回忆',
    showCancel: false,
    confirmText: '知道了'
  })
}

// 清理缓存
const handleClearCache = () => {
  uni.showModal({
    title: '清理缓存',
    content: '清理缓存将删除所有本地记录数据，确定要继续吗？',
    confirmColor: '#ba1a1a',
    success: ({ confirm }) => {
      if (confirm) {
        clearAllRecords()
        records.value = []
        uni.showToast({ title: '缓存已清理', icon: 'success' })
      }
    }
  })
}

// 退出登录
const handleLogout = () => {
  uni.showModal({
    title: '退出登录',
    content: '确定要退出登录吗？',
    confirmColor: '#ba1a1a',
    success: ({ confirm }) => {
      if (confirm) {
        uni.showToast({ title: '已退出', icon: 'success' })
        setTimeout(() => {
          uni.reLaunch({ url: '/pages/food-diary/index/index' })
        }, 1000)
      }
    }
  })
}

// 菜单
const handleMenu = () => {
  uni.showActionSheet({
    itemList: ['导出数据', '分享应用', '意见反馈'],
    success: ({ tapIndex }) => {
      if (tapIndex === 0) {
        uni.showToast({ title: '导出功能开发中', icon: 'none' })
      } else if (tapIndex === 1) {
        uni.showToast({ title: '分享功能开发中', icon: 'none' })
      } else if (tapIndex === 2) {
        uni.showToast({ title: '感谢您的反馈', icon: 'success' })
      }
    }
  })
}

// 日历
const handleCalendar = () => {
  uni.navigateTo({ url: '/pages/food-diary/index/index' })
}

// 添加
const handleAdd = () => {
  uni.navigateTo({ url: `/pages/food-diary/add/index?date=${new Date().toISOString().slice(0, 10)}` })
}

// 个人中心导航
const handleProfileNav = () => {
  // 已经在个人中心页面
}

onShow(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
@use '@/styles/theme.scss' as *;

.profile-page {
  min-height: 100vh;
  background: var(--background);
  padding-bottom: 100px;
  animation: fadeIn 0.3s ease-out;
}

// 顶部导航栏
.app-header {
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: var(--status-bar-height);
  height: calc(var(--nav-bar-height));
  padding-left: $container-padding;
  padding-right: $container-padding;
  background: var(--background);
}

.nav-btn {
  @include nav-button;
}

.brand-title {
  font-size: 32px;
  font-weight: $font-weight-bold;
  line-height: 1;
  letter-spacing: -0.02em;
  background: $primary-gradient;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.avatar-small {
  @include btn-reset;
  width: $btn-size-md;
  height: $btn-size-md;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--primary-container);
  @include transition-base;

  &:active {
    transform: scale(0.9);
  }
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

// 主内容
.main-content {
  padding: 8px $container-padding 32px;
  max-width: 448px;
  margin: 0 auto;
  height: calc(100vh - 164px);
}

// 个人资料头部
.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin: 16px 0 32px;
  animation: slideUp 0.4s cubic-bezier(0.32, 0.72, 0, 1);
}

.avatar-large-wrapper {
  position: relative;
  margin-bottom: $spacing-md;
}

.avatar-large {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid var(--primary-container);
  box-shadow: $shadow-card;
}

.edit-avatar-btn {
  @include nav-button($btn-size-sm);
  position: absolute;
  bottom: 0;
  right: 0;
  background: $primary-gradient;
  color: var(--on-primary);
  box-shadow: 0 4px 12px rgba(17, 153, 142, 0.3);
}

.user-name {
  font-size: 24px;
  font-weight: $font-weight-bold;
  background: $primary-gradient;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 4px;
}

.user-bio {
  font-size: $font-size-body-sm;
  color: var(--on-surface-variant);
  margin-bottom: 16px;
}

// 统计数据行
.stats-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin-top: 8px;
  padding: 16px 24px;
  background: var(--surface);
  border-radius: $radius-xl;
  box-shadow: $shadow-card;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-number {
  font-size: 24px;
  font-weight: $font-weight-bold;
  background: $primary-gradient;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: $font-size-label-caps;
  color: var(--on-surface-variant);
  font-weight: $font-weight-semibold;
}

.stat-divider {
  width: 1px;
  height: 32px;
  background: var(--surface-container);
}

// 设置分组
.settings-groups {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.settings-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  animation: cardEnter 0.5s cubic-bezier(0.32, 0.72, 0, 1);
}

.group-label {
  font-size: $font-size-label-caps;
  font-weight: $font-weight-semibold;
  color: var(--on-surface-variant);
  padding: 0 8px;
}

.settings-card {
  background: var(--surface);
  border-radius: $radius-xl;
  padding: $spacing-lg;
  box-shadow: $shadow-card;
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  overflow: hidden;
  @include transition-base;

  &:active {
    transform: scale(0.99);
  }
}

.settings-item {
  @include btn-reset;
  width: 100%;
  display: flex;
  align-items: center;
  text-align: left;
  overflow: hidden;
  @include transition-base;

  &:active {
    transform: scale(0.98);
  }
}

.item-icon {
  width: $btn-size-md;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: $spacing-md;
  color: var(--primary);
  flex-shrink: 0;
}

.item-label {
  flex: 1;
  font-size: $font-size-body-lg;
  color: var(--on-surface);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-arrow {
  color: var(--outline);
  transition: all $duration-normal $ease-out;
}

.item-value {
  display: flex;
  align-items: center;
  gap: 4px;
}

.value-text {
  font-size: $font-size-body-sm;
  color: var(--on-surface-variant);
}

.divider {
  height: 1px;
  background: var(--surface-container);
  width: 100%;
}

.cache-size {
  font-size: $font-size-body-sm;
  color: var(--on-surface-variant);
}

.logout-btn {
  @include btn-reset;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 0;
  border-radius: $radius-default;
  @include transition-base;

  &:active {
    transform: scale(0.95);
    background: var(--error-container);
  }
}

.logout-text {
  font-size: $font-size-title-md;
  font-weight: $font-weight-semibold;
  color: var(--error);
}

// 底部导航栏
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 50;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 16px 24px;
  padding-bottom: calc(32px + var(--safe-area-bottom));
  background: rgba(250, 250, 250, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 -2px 16px rgba(17, 153, 142, 0.04);
}

.nav-item {
  @include nav-item-button;
}
</style>

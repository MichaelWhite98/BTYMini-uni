<template>
  <view class="monthly-page">
    <!-- Top AppBar -->
    <view class="app-header">
      <button class="header-btn" @click="goBack">
        <uni-icons type="left" size="24" color="#006860" />
      </button>
      <text class="header-title">本月详情</text>
      <view class="header-avatar">
        <image class="avatar-img" src="/static/images/avatar.png" mode="aspectFill" />
      </view>
    </view>

    <!-- Main Content -->
    <scroll-view class="main-content" scroll-y :show-scrollbar="false">
      <!-- Time Selector -->
      <view class="time-selector">
        <button class="selector-btn" @click="prevMonth">
          <uni-icons type="left" size="20" color="#3d4947" />
        </button>
        <view class="selector-content">
          <uni-icons type="calendar" size="20" color="#006860" />
          <text class="selector-text">{{ currentPeriod }}</text>
        </view>
        <button class="selector-btn" @click="nextMonth">
          <uni-icons type="right" size="20" color="#3d4947" />
        </button>
      </view>

      <!-- Main Stats Grid -->
      <view class="stats-grid">
        <view class="stat-card">
          <text class="stat-label">本月记录</text>
          <view class="stat-value-row">
            <text class="stat-value">{{ stats.totalRecords }}</text>
            <text class="stat-unit">杯</text>
          </view>
          <view class="stat-indicator primary" />
        </view>
        <view class="stat-card">
          <text class="stat-label">探访店铺</text>
          <view class="stat-value-row">
            <text class="stat-value secondary">{{ stats.totalShops }}</text>
            <text class="stat-unit">家</text>
          </view>
          <view class="stat-indicator secondary" />
        </view>
      </view>

      <!-- Beverage Distribution Card -->
      <view class="distribution-card">
        <view class="card-header">
          <text class="card-title">饮品分布</text>
          <uni-icons type="bars" size="24" color="#006860" />
        </view>
        <view class="distribution-list">
          <view
            v-for="(item, index) in distribution"
            :key="index"
            class="distribution-item"
          >
            <view class="distribution-header">
              <view class="distribution-label">
                <view class="distribution-dot" :style="{ background: item.color }" />
                <text class="distribution-name">{{ item.name }}</text>
              </view>
              <text class="distribution-count">{{ item.count }}杯 ({{ item.percent }}%)</text>
            </view>
            <view class="progress-bar">
              <view
                class="progress-fill"
                :style="{
                  width: item.percent + '%',
                  background: item.gradient
                }"
              />
            </view>
          </view>
        </view>
      </view>

      <!-- Top Shops List -->
      <view class="shops-section">
        <text class="section-title">最常光顾</text>
        <view class="shops-list">
          <view
            v-for="(shop, index) in topShops"
            :key="shop.id"
            class="shop-item"
            @click="goToShop(shop.id)"
          >
            <view class="shop-icon" :class="shop.type">
              <uni-icons :type="shop.icon" size="28" :color="shop.iconColor" />
            </view>
            <view class="shop-info">
              <text class="shop-name">{{ shop.name }}</text>
              <text class="shop-desc">{{ shop.description }}</text>
            </view>
            <view class="shop-count">
              <text class="count-value" :style="{ color: shop.iconColor }">{{ shop.count }}</text>
              <text class="count-label">次</text>
            </view>
          </view>
        </view>
      </view>

      <!-- Bottom Spacing -->
      <view class="bottom-spacing" />
    </scroll-view>

    <!-- Bottom Navigation -->
    <view class="bottom-nav">
      <view class="nav-item" @click="switchTab('home')">
        <uni-icons type="home" size="24" color="#3d4947" />
        <text class="nav-label">首页</text>
      </view>
      <view class="nav-item active" @click="switchTab('stats')">
        <uni-icons type="bars" size="24" color="#006860" />
        <text class="nav-label">统计</text>
      </view>
      <view class="nav-item" @click="switchTab('profile')">
        <uni-icons type="person" size="24" color="#3d4947" />
        <text class="nav-label">我的</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const currentPeriod = ref('2024年6月')

const stats = ref({
  totalRecords: 36,
  totalShops: 5
})

const distribution = ref([
  {
    name: '咖啡',
    count: 22,
    percent: 61,
    color: '#006860',
    gradient: 'linear-gradient(135deg, #008379 0%, #006d32 100%)'
  },
  {
    name: '茶饮',
    count: 10,
    percent: 28,
    color: '#006d32',
    gradient: '#006d32'
  },
  {
    name: '果汁',
    count: 4,
    percent: 11,
    color: '#23e373',
    gradient: '#23e373'
  }
])

const topShops = ref([
  {
    id: 1,
    name: 'Starbucks 星巴克',
    description: '咖啡专家 · 本月打卡',
    count: 12,
    type: 'coffee',
    icon: 'hand-up',
    iconColor: '#006860'
  },
  {
    id: 2,
    name: 'Luckin Coffee 瑞幸',
    description: '日常之选 · 本月打卡',
    count: 8,
    type: 'secondary',
    icon: 'hand-up',
    iconColor: '#006d32'
  },
  {
    id: 3,
    name: 'HeyTea 喜茶',
    description: '灵感之茶 · 本月打卡',
    count: 5,
    type: 'tertiary',
    icon: 'star',
    iconColor: '#2a655f'
  }
])

const goBack = () => {
  uni.navigateBack()
}

const prevMonth = () => {
  console.log('Previous month')
}

const nextMonth = () => {
  console.log('Next month')
}

const goToShop = (id) => {
  uni.navigateTo({ url: `/pages/store/index?id=${id}` })
}

const switchTab = (tab) => {
  const routes = {
    home: '/pages/index/index',
    stats: '/pages/monthly/index',
    profile: '/pages/profile/index'
  }
  if (tab === 'stats') return
  uni.switchTab({ url: routes[tab] })
}
</script>

<style lang="scss" scoped>
@use '@/styles/theme.scss' as *;

.monthly-page {
  min-height: 100vh;
  background: $surface;
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
  border: 2px solid $primary-fixed;
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

// Time Selector
.time-selector {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: $surface-container-lowest;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
  box-shadow: 0 10px 30px -5px rgba(17, 153, 142, 0.12);
}

.selector-btn {
  @include btn-reset;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background $duration-normal $ease-out;

  &:active {
    background: $surface-container;
  }
}

.selector-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.selector-text {
  font-size: 24px;
  font-weight: $font-weight-semibold;
  color: $on-surface;
}

// Stats Grid
.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: $surface-container-lowest;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 10px 30px -5px rgba(17, 153, 142, 0.12);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stat-label {
  font-size: 13px;
  font-weight: $font-weight-semibold;
  color: $on-surface-variant;
  margin-bottom: 8px;
}

.stat-value-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.stat-value {
  font-size: 36px;
  font-weight: $font-weight-bold;
  color: $primary;

  &.secondary {
    color: $secondary;
  }
}

.stat-unit {
  font-size: 16px;
  color: $on-surface-variant;
}

.stat-indicator {
  width: 48px;
  height: 4px;
  border-radius: 2px;
  margin-top: 16px;

  &.primary {
    background: $secondary-container;
  }

  &.secondary {
    background: $primary-container;
  }
}

// Distribution Card
.distribution-card {
  background: $surface-container-lowest;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 10px 30px -5px rgba(17, 153, 142, 0.12);
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.card-title {
  font-size: 24px;
  font-weight: $font-weight-semibold;
  color: $on-surface;
}

.distribution-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.distribution-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.distribution-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.distribution-label {
  display: flex;
  align-items: center;
  gap: 8px;
}

.distribution-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.distribution-name {
  font-size: 13px;
  font-weight: $font-weight-semibold;
  color: $on-surface;
}

.distribution-count {
  font-size: 13px;
  font-weight: $font-weight-semibold;
  color: $on-surface;
}

.progress-bar {
  height: 12px;
  background: $surface-container;
  border-radius: 6px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 6px;
  transition: width 0.3s ease;
}

// Shops Section
.shops-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 24px;
  font-weight: $font-weight-semibold;
  color: $on-surface;
  margin-bottom: 24px;
  padding-left: 4px;
}

.shops-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.shop-item {
  display: flex;
  align-items: center;
  gap: 16px;
  background: $surface-container-lowest;
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 10px 30px -5px rgba(17, 153, 142, 0.12);
  transition: transform $duration-normal $ease-out;

  &:active {
    transform: scale(0.98);
  }
}

.shop-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $surface;

  &.coffee {
    color: $primary;
  }

  &.secondary {
    color: $secondary;
  }

  &.tertiary {
    color: $tertiary;
  }
}

.shop-info {
  flex: 1;
}

.shop-name {
  font-size: 18px;
  font-weight: $font-weight-bold;
  color: $on-surface;
  display: block;
}

.shop-desc {
  font-size: 13px;
  font-weight: $font-weight-semibold;
  color: $on-surface-variant;
  display: block;
  margin-top: 4px;
}

.shop-count {
  text-align: right;
}

.count-value {
  font-size: 24px;
  font-weight: $font-weight-semibold;
}

.count-label {
  font-size: 13px;
  font-weight: $font-weight-semibold;
  color: $on-surface-variant;
  display: block;
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

<template>
  <view class="store-page">
    <!-- Top AppBar -->
    <view class="app-header">
      <button class="header-btn" @click="goBack">
        <uni-icons type="left" size="24" color="#006860" />
      </button>
      <text class="header-title">店铺详情</text>
      <button class="header-btn" @click="toggleFavorite">
        <uni-icons
          :type="isFavorite ? 'heart-filled' : 'heart'"
          size="24"
          :color="isFavorite ? '#006860' : '#006860'"
        />
      </button>
    </view>

    <!-- Main Content -->
    <scroll-view class="main-content" scroll-y :show-scrollbar="false">
      <!-- Hero Section -->
      <view class="hero-section">
        <!-- Background Gradient -->
        <view class="hero-bg" />

        <!-- Shop Logo -->
        <view class="logo-wrapper">
          <view class="logo-container">
            <image v-if="store.logo" class="logo-img" :src="store.logo" mode="aspectFill" />
            <view v-else class="logo-placeholder">
              <uni-icons type="shop" size="32" color="#6d7a77" />
            </view>
          </view>
          <view class="verified-badge">
            <uni-icons type="checkbox-filled" size="16" color="#006d32" />
          </view>
        </view>

        <!-- Shop Info -->
        <view class="shop-info">
          <text class="shop-name">{{ store.name }}</text>
          <view class="shop-location">
            <uni-icons type="location" size="18" color="#3d4947" />
            <text class="location-text">{{ store.address }}</text>
          </view>
        </view>

        <!-- Quick Stats -->
        <view class="quick-stats">
          <view class="stat-item">
            <text class="stat-label">消费记录</text>
            <text class="stat-value">{{ store.stats.records }}</text>
          </view>
          <view class="stat-item">
            <text class="stat-label">到店次数</text>
            <text class="stat-value">{{ store.stats.visits }}</text>
          </view>
          <view class="stat-item">
            <text class="stat-label">累计消费</text>
            <text class="stat-value">¥{{ store.stats.totalSpent }}</text>
          </view>
        </view>
      </view>

      <!-- Beverage Records Section -->
      <view class="records-section">
        <view class="section-header">
          <text class="section-title">饮品记录</text>
          <button class="view-all-btn" @click="viewAllRecords">
            <text class="view-all-text">全部记录</text>
            <uni-icons type="right" size="16" color="#006860" />
          </button>
        </view>

        <view class="records-list">
          <view
            v-for="record in records"
            :key="record.id"
            class="record-item"
            @click="goToDetail(record.id)"
          >
            <view class="record-icon" :style="{ background: record.iconBg }">
              <uni-icons :type="record.icon" size="24" :color="record.iconColor" />
            </view>
            <view class="record-info">
              <text class="record-name">{{ record.name }}</text>
              <text class="record-date">{{ record.date }}</text>
            </view>
            <view class="record-price">
              <text class="price-text">¥{{ record.price }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- Location Map Section -->
      <view class="map-section">
        <text class="section-title">店铺位置</text>
        <view class="map-container">
          <image v-if="store.mapImage" class="map-image" :src="store.mapImage" mode="aspectFill" />
          <view v-else class="map-placeholder">
            <uni-icons type="map" size="48" color="#bcc9c6" />
            <text class="placeholder-text">地图加载中...</text>
          </view>
          <view class="map-overlay">
            <view class="map-badge">
              <uni-icons type="location" size="18" color="#006860" />
              <text class="map-badge-text">在该位置附近</text>
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
      <view class="nav-item" @click="switchTab('stats')">
        <uni-icons type="bars" size="24" color="#3d4947" />
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
import { onLoad } from '@dcloudio/uni-app'

const isFavorite = ref(false)

const store = ref({
  id: 1,
  name: '星巴克咖啡',
  logo: '',
  address: '上海市浦东新区陆家嘴环路1000号',
  mapImage: '',
  stats: {
    records: 8,
    visits: 12,
    totalSpent: 320
  }
})

const records = ref([
  {
    id: 1,
    name: '冰摇桃桃乌龙茶',
    date: '2023-11-20 14:30',
    price: 36,
    icon: 'hand-up',
    iconBg: 'rgba(77, 254, 138, 0.2)',
    iconColor: '#007235'
  },
  {
    id: 2,
    name: '太妃榛果拿铁',
    date: '2023-11-18 09:15',
    price: 41,
    icon: 'hand-up',
    iconBg: 'rgba(0, 131, 121, 0.1)',
    iconColor: '#006860'
  },
  {
    id: 3,
    name: '冰震浓缩咖啡',
    date: '2023-11-15 16:45',
    price: 34,
    icon: 'star',
    iconBg: 'rgba(179, 238, 229, 0.3)',
    iconColor: '#2a655f'
  },
  {
    id: 4,
    name: '抹茶星冰乐',
    date: '2023-11-12 11:20',
    price: 38,
    icon: 'hand-up',
    iconBg: 'rgba(77, 254, 138, 0.2)',
    iconColor: '#007235'
  }
])

onLoad((options) => {
  if (options.id) {
    // Load store data
    console.log('Loading store:', options.id)
  }
})

const goBack = () => {
  uni.navigateBack()
}

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  uni.showToast({
    title: isFavorite.value ? '已收藏' : '已取消收藏',
    icon: 'success'
  })
}

const viewAllRecords = () => {
  console.log('View all records')
}

const goToDetail = (id) => {
  uni.navigateTo({ url: `/pages/detail/index?id=${id}` })
}

const switchTab = (tab) => {
  const routes = {
    home: '/pages/index/index',
    stats: '/pages/monthly/index',
    profile: '/pages/profile/index'
  }
  uni.switchTab({ url: routes[tab] })
}
</script>

<style lang="scss" scoped>
@use '@/styles/theme.scss' as *;

.store-page {
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

.header-btn {
  @include nav-button(40px);
}

.header-title {
  font-size: 18px;
  font-weight: $font-weight-bold;
  color: $primary;
}

// Main Content
.main-content {
  padding-top: 88px;
}

// Hero Section
.hero-section {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px 32px;
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 192px;
  background: $primary-gradient;
  opacity: 0.1;
  border-radius: 0 0 12px 12px;
  z-index: -1;
}

.logo-wrapper {
  position: relative;
  margin-bottom: 24px;
}

.logo-container {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 4px solid $surface-container-lowest;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(17, 153, 142, 0.08);
  background: $surface-container;
}

.logo-img {
  width: 100%;
  height: 100%;
}

.logo-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $surface-container;
}

.verified-badge {
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  background: $secondary;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid $surface-container-lowest;
}

.shop-info {
  text-align: center;
  margin-bottom: 32px;
}

.shop-name {
  font-size: 24px;
  font-weight: $font-weight-bold;
  color: $on-surface;
  display: block;
  margin-bottom: 8px;
}

.shop-location {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.location-text {
  font-size: 16px;
  color: $on-surface-variant;
}

// Quick Stats
.quick-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  width: 100%;
}

.stat-item {
  background: $surface-container-lowest;
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(17, 153, 142, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 4px;
}

.stat-label {
  font-size: 13px;
  font-weight: $font-weight-semibold;
  color: $on-surface-variant;
}

.stat-value {
  font-size: 24px;
  font-weight: $font-weight-bold;
  color: $primary;
}

// Records Section
.records-section {
  padding: 0 20px;
  margin-bottom: 32px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 24px;
  font-weight: $font-weight-semibold;
  color: $on-surface;
}

.view-all-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: transparent;
  border: none;
  padding: 0;

  &::after {
    border: none;
  }
}

.view-all-text {
  font-size: 13px;
  font-weight: $font-weight-semibold;
  color: $primary;
}

.records-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.record-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: $surface-container-lowest;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(17, 153, 142, 0.08);
  transition: transform $duration-fast $ease-out;

  &:active {
    transform: scale(1.02);
  }
}

.record-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.record-info {
  flex: 1;
}

.record-name {
  font-size: 18px;
  font-weight: $font-weight-semibold;
  color: $on-surface;
  display: block;
}

.record-date {
  font-size: 13px;
  font-weight: $font-weight-semibold;
  color: $on-surface-variant;
  display: block;
  margin-top: 4px;
}

.record-price {
  text-align: right;
}

.price-text {
  font-size: 16px;
  font-weight: $font-weight-bold;
  color: $primary;
}

// Map Section
.map-section {
  padding: 0 20px;
  margin-bottom: 24px;
}

.map-container {
  position: relative;
  width: 100%;
  height: 192px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(17, 153, 142, 0.08);
  background: $surface-container;
}

.map-image {
  width: 100%;
  height: 100%;
}

.map-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: $surface-container;
}

.placeholder-text {
  font-size: 14px;
  color: $outline;
}

.map-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  background: $surface-container-lowest;
  padding: 8px 16px;
  border-radius: 9999px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.map-badge-text {
  font-size: 13px;
  font-weight: $font-weight-bold;
  color: $on-surface;
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

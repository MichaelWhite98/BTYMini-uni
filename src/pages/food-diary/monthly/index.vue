<template>
  <view class="monthly-page">
    <!-- 顶部导航栏 -->
    <header class="app-header">
      <button class="nav-btn" @tap="handleBack">
        <uni-icons type="back" size="20"></uni-icons>
      </button>
      <text class="page-title">本月详情</text>
      <view class="avatar">
        <image class="avatar-img" :src="userAvatar" mode="aspectFill" />
      </view>
    </header>

    <!-- 主内容 -->
    <scroll-view scroll-y class="main-content">
      <!-- 时间周期标题 -->
      <view class="period-header">
        <text class="period-label">时间周期</text>
        <text class="period-title">{{ periodTitle }}</text>
      </view>

      <!-- 统计网格 -->
      <view class="stats-grid">
        <view class="stat-card">
          <text class="stat-label">本月记录</text>
          <view class="stat-value">
            <text class="stat-number">{{ monthStats.recordCount }}</text>
            <text class="stat-unit">杯</text>
          </view>
        </view>
        <view class="stat-card">
          <text class="stat-label">探访店铺</text>
          <view class="stat-value">
            <text class="stat-number">{{ monthStats.storeCount }}</text>
            <text class="stat-unit">家</text>
          </view>
        </view>
      </view>

      <!-- 饮品分布 -->
      <view class="drink-distribution-card">
        <text class="section-title">饮品分布</text>
        <view class="distribution-list">
          <view v-for="drink in drinkDistribution" :key="drink.name" class="distribution-item">
            <view class="distribution-header">
              <text class="drink-name">{{ drink.name }}</text>
              <text class="drink-count">{{ drink.count }} 杯</text>
            </view>
            <view class="progress-bar">
              <view class="progress-fill" :style="{ width: drink.percentage + '%' }" />
            </view>
          </view>
        </view>
      </view>

      <!-- 最常探访 -->
      <view class="top-stores-section">
        <text class="section-title">最常探访</text>
        <view class="store-list">
          <view v-for="store in topStores" :key="store.name" class="store-item">
            <view class="store-icon">
              <uni-icons :type="store.icon" size="24"></uni-icons>
            </view>
            <view class="store-info">
              <text class="store-name">{{ store.name }}</text>
              <text class="store-type">{{ store.type }}</text>
            </view>
            <view class="store-stats">
              <text class="store-visits">{{ store.visits }}</text>
              <text class="store-visits-label">次探访</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 本月影像 -->
      <view v-if="monthPhotos.length > 0" class="gallery-section">
        <view class="gallery-header">
          <text class="section-title">本月影像</text>
          <button v-if="monthPhotos.length > 3" class="view-all-btn" @tap="handleViewAll">
            查看全部
          </button>
        </view>
        <scroll-view scroll-x class="gallery-scroll">
          <view v-for="photo in monthPhotos" :key="photo.id" class="photo-card">
            <image class="photo-image" :src="photo.image" mode="aspectFill" />
            <view class="photo-overlay">
              <text class="photo-date">{{ photo.date }}</text>
            </view>
            <text class="photo-title">{{ photo.title }}</text>
          </view>
        </scroll-view>
      </view>
      
      <!-- 空状态 -->
      <view v-if="monthRecords.length === 0" class="empty-state">
        <view class="empty-icon">
          <uni-icons type="calendar" size="48"></uni-icons>
        </view>
        <text class="empty-title">本月还没有记录</text>
        <text class="empty-subtitle">点击下方加号开始记录第一杯饮品吧</text>
      </view>
    </scroll-view>

    <!-- 底部导航栏 -->
    <nav class="bottom-nav">
      <button class="nav-item active" @tap="handleCalendar">
        <uni-icons type="calendar" size="20"></uni-icons>
      </button>
      <button class="nav-item" @tap="handleAdd">
        <uni-icons type="plus" size="24"></uni-icons>
      </button>
      <button class="nav-item" @tap="handleProfile">
        <uni-icons type="person" size="20"></uni-icons>
      </button>
    </nav>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { getMonthStats, getRecordsByMonth } from '@/utils/food-diary/index.js'

// 用户头像
const userAvatar = ref('https://lh3.googleusercontent.com/aida-public/AB6AXuDxK0FtI70tBgi3Rcf5EKWVf2m2LKa_1Sa9DWSBerAC0KVCySKMDKNI6dCujffPKGQLSfkwgAq15c0mub16eLOBNOdXqavF1rOnAnoEE02VldtcyZY2oolU61wH0KUvU3elajJ3OHEkPGY_2polOtaQX2rsuu-P1Sv6ekuSHSM1j0ApOYMSGQ4sdHamWudiSviZ5qMeQBRyxWl9I7TcJNNLxe1GunQCWz9u-dTHn4CNRxoXuef70hDPks0jyUpqgtCCND2R-hUAEqs')

// 当前月份
const currentMonth = ref(new Date().toISOString().slice(0, 7))

// 月度统计
const monthStats = ref({
  recordDays: 0,
  recordCount: 0,
  imageCount: 0,
  storeCount: 0
})

// 月度记录
const monthRecords = ref([])

// 时间周期标题
const periodTitle = computed(() => {
  const [year, month] = currentMonth.value.split('-')
  return `${year}年${parseInt(month)}月`
})

// 饮品分布数据 - 根据实际记录计算
const drinkDistribution = computed(() => {
  const categoryMap = new Map()
  
  monthRecords.value.forEach(record => {
    const category = record.category || 'other'
    const count = categoryMap.get(category) || 0
    categoryMap.set(category, count + 1)
  })
  
  const total = monthRecords.value.length || 1
  const categoryNames = {
    coffee: '咖啡',
    americano: '美式',
    latte: '拿铁',
    tea: '茶饮',
    juice: '果汁',
    other: '其他'
  }
  
  return Array.from(categoryMap.entries())
    .map(([category, count]) => ({
      name: categoryNames[category] || category,
      count,
      percentage: Math.round((count / total) * 100)
    }))
    .sort((a, b) => b.count - a.count)
})

// 最常探访店铺 - 根据实际记录计算
const topStores = computed(() => {
  const storeMap = new Map()
  
  monthRecords.value.forEach(record => {
    const storeName = record.storeName || (record.location && record.location.name)
    if (storeName) {
      const count = storeMap.get(storeName) || 0
      storeMap.set(storeName, count + 1)
    }
  })
  
  return Array.from(storeMap.entries())
    .map(([name, visits]) => ({
      name,
      type: '咖啡店',
      icon: 'shop',
      visits
    }))
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 5)
})

// 本月照片 - 从实际记录中获取
const monthPhotos = computed(() => {
  return monthRecords.value
    .filter(record => record.images && record.images.length > 0)
    .slice(0, 10)
    .map(record => ({
      id: record.id,
      image: record.images[0],
      date: record.date ? `${parseInt(record.date.slice(5, 7))}月${parseInt(record.date.slice(8, 10))}日` : '',
      title: record.description || '饮品'
    }))
})

onLoad(() => {
  loadMonthData()
})

onShow(() => {
  loadMonthData()
})

// 加载月份数据
const loadMonthData = () => {
  monthStats.value = getMonthStats(currentMonth.value)
  monthRecords.value = getRecordsByMonth(currentMonth.value)
}

// 返回
const handleBack = () => {
  uni.navigateBack()
}

// 日历
const handleCalendar = () => {
  uni.navigateBack()
}

// 添加
const handleAdd = () => {
  const today = new Date().toISOString().slice(0, 10)
  uni.navigateTo({ url: `/pages/food-diary/add/index?date=${today}` })
}

// 个人中心
const handleProfile = () => {
  uni.navigateTo({ url: '/pages/food-diary/profile/index' })
}

// 查看全部照片
const handleViewAll = () => {
  uni.showToast({ title: '查看全部功能开发中', icon: 'none' })
}
</script>

<style lang="scss" scoped>
@use '@/styles/theme.scss' as *;

.monthly-page {
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
  @include transition-base;
}

.nav-btn {
  @include nav-button;
}

.page-title {
  font-size: $font-size-title-md;
  font-weight: $font-weight-semibold;
  color: var(--primary);
}

.avatar {
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
  padding: 16px $container-padding 32px;
  max-width: 896px;
  margin: 0 auto;
  height: calc(100vh - 164px);
}

// 时间周期标题
.period-header {
  margin-bottom: 32px;
  animation: slideUp 0.4s cubic-bezier(0.32, 0.72, 0, 1);
}

.period-label {
  font-size: $font-size-label-caps;
  font-weight: $font-weight-bold;
  color: var(--on-surface-variant);
  display: block;
  margin-bottom: 4px;
}

.period-title {
  display: block;
  font-size: 24px;
  font-weight: $font-weight-bold;
  line-height: 36px;
  color: var(--primary);
  letter-spacing: -0.02em;
}

// 统计网格
.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $spacing-md;
  margin-bottom: 32px;
}

.stat-card {
  background: var(--surface);
  border-radius: $radius-xl;
  padding: $spacing-lg;
  box-shadow: $shadow-card;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  aspect-ratio: 1;
  @include transition-base;
  animation: cardEnter 0.5s cubic-bezier(0.32, 0.72, 0, 1);

  &:active {
    transform: scale(0.98);
  }
}

.stat-label {
  font-size: $font-size-label-caps;
  font-weight: $font-weight-bold;
  color: var(--primary);
  margin-bottom: 8px;
}

.stat-value {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.stat-number {
  font-size: $font-size-display-lg;
  font-weight: $font-weight-bold;
  line-height: 1.2;
  letter-spacing: -0.02em;
  background: $primary-gradient;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-unit {
  font-size: $font-size-body-sm;
  color: var(--on-surface-variant);
}

// 饮品分布卡片
.drink-distribution-card {
  background: var(--surface);
  border-radius: $radius-xl;
  padding: $spacing-lg;
  box-shadow: $shadow-card;
  margin-bottom: 32px;
  animation: cardEnter 0.6s cubic-bezier(0.32, 0.72, 0, 1);
}

.section-title {
  font-size: $font-size-title-md;
  font-weight: $font-weight-semibold;
  color: var(--primary);
  margin-bottom: $spacing-lg;
}

.distribution-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.distribution-item {
  width: 100%;
}

.distribution-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 8px;
}

.drink-name {
  font-size: $font-size-body-lg;
  color: var(--on-surface);
}

.drink-count {
  font-size: $font-size-title-md;
  font-weight: $font-weight-semibold;
  color: var(--primary);
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: var(--surface-container);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: $primary-gradient;
  border-radius: 4px;
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
}

// 最常探访
.top-stores-section {
  margin-bottom: 32px;
}

.store-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.store-item {
  background: var(--surface);
  padding: $spacing-md;
  border-radius: $radius-xl;
  box-shadow: $shadow-card;
  display: flex;
  align-items: center;
  @include transition-base;
  overflow: hidden;
  animation: cardEnter 0.7s cubic-bezier(0.32, 0.72, 0, 1);

  &:active {
    transform: scale(0.98);
  }
}

.store-icon {
  width: $btn-size-lg;
  height: $btn-size-lg;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-container);
  border-radius: 50%;
  margin-right: $spacing-md;
  color: var(--primary);
  flex-shrink: 0;
}

.store-info {
  flex: 1;
  min-width: 0;
}

.store-name {
  display: block;
  font-size: $font-size-title-md;
  font-weight: $font-weight-semibold;
  color: var(--on-surface);
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.store-type {
  font-size: $font-size-body-sm;
  color: var(--on-surface-variant);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.store-stats {
  text-align: right;
  flex-shrink: 0;
  margin-left: $spacing-md;
}

.store-visits {
  display: block;
  font-size: 20px;
  font-weight: $font-weight-semibold;
  color: var(--primary);
  line-height: 1.2;
}

.store-visits-label {
  font-size: $font-size-label-caps;
  font-weight: $font-weight-bold;
  color: var(--on-surface-variant);
}

// 本月影像
.gallery-section {
  margin-bottom: 32px;
}

.gallery-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-md;
}

.view-all-btn {
  @include btn-reset;
  font-size: $font-size-label-caps;
  font-weight: $font-weight-bold;
  color: var(--primary);
  padding: 8px $spacing-md;
  border-radius: $radius-default;
  @include transition-base;

  &:active {
    transform: scale(0.95);
    background: var(--primary-container);
  }
}

.gallery-scroll {
  white-space: nowrap;
  padding-bottom: 8px;
}

.photo-card {
  display: inline-block;
  width: 256px;
  margin-right: $spacing-md;
  white-space: normal;
  animation: slideUp 0.8s cubic-bezier(0.32, 0.72, 0, 1);
}

.photo-image {
  width: 100%;
  aspect-ratio: 4/5;
  border-radius: $radius-xl;
  box-shadow: $shadow-card;
  margin-bottom: 8px;
}

.photo-overlay {
  position: relative;
  margin-top: -40px;
  padding: $spacing-md;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.4), transparent);
  border-radius: 0 0 $radius-xl $radius-xl;
}

.photo-date {
  font-size: $font-size-label-caps;
  font-weight: $font-weight-bold;
  color: white;
}

.photo-title {
  font-size: $font-size-body-sm;
  color: var(--on-surface);
}

// 空状态
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 32px;
  text-align: center;
}

.empty-icon {
  width: 96px;
  height: 96px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface-container);
  border-radius: 50%;
  margin-bottom: 24px;
  color: var(--on-surface-variant);
}

.empty-title {
  font-size: 20px;
  font-weight: $font-weight-semibold;
  color: var(--primary);
  margin-bottom: 8px;
}

.empty-subtitle {
  font-size: $font-size-body-sm;
  color: var(--on-surface-variant);
  line-height: 1.5;
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

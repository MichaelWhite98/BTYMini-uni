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
      <view class="gallery-section">
        <view class="gallery-header">
          <text class="section-title">本月影像</text>
          <button class="view-all-btn">查看全部</button>
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
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getMonthStats } from '@/utils/food-diary/index.js'

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

// 时间周期标题
const periodTitle = computed(() => {
  const [year, month] = currentMonth.value.split('-')
  return `${year}年${parseInt(month)}月`
})

// 饮品分布数据
const drinkDistribution = ref([
  { name: '拿铁', count: 3, percentage: 50 },
  { name: '美式', count: 2, percentage: 33 },
  { name: '抹茶', count: 1, percentage: 17 }
])

// 最常探访店铺
const topStores = ref([
  {
    name: '星巴克甄选',
    type: '精品咖啡馆',
    icon: 'shop',
    visits: 4
  },
  {
    name: '瑞幸咖啡',
    type: '社区咖啡店',
    icon: 'fire',
    visits: 2
  }
])

// 本月照片
const monthPhotos = ref([
  {
    id: 1,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAL8ZAQI5uRPdJnggjuGL-hBMQ6ms1nLzUbM1gsoClYG9RUj59PBck1jJG0x73AkKlDS5jDlsarSedNo-59yQBuPqCQYIN4n2-OB5ikPrXeVpnpYlJBxrOSZdg2jlkwRoJKXPaCaH94-SlsNDL0XLzql315eYv66l0Syg3IEMFGkkNWx1ZIPv-YUthTGnjsErySIpghWoEd1sqKf0elz0uKuxFQ2wWq9Kqq0UjgaRQQAE92sJH2tn5CyeaUweEG2MKWkgF-r7OQm2w',
    date: '6月12日',
    title: '燕麦拿铁'
  },
  {
    id: 2,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDA2ycMo_Pc5O2fMLI1CaBLQLdfGjtBt1_kNbsxeGA4QZ9u_cCIL4qLsk0qPp_Cw9whRC9s7z0usc7EebY-mruzZWwquSlzbHqgIYzXc-saJD99nQfaiOXWlKMi-rJiD8BIeSmnsb9EajEYJAl4saJYo4gnDF7CVdDdkaAJcMeI3Hu3t6d2h26uzoZsj7gnkRIqQxJdIyGom5vxjV3Tz0FTFJltYb4F_ijkuHOjh5I-h0hn3APo-8SobIODfyMGsToBWna9DQ6D8gs',
    date: '6月08日',
    title: '冰美式'
  },
  {
    id: 3,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGsmE87ys7s_xB8GSvMIBzbWzeEaTZaGYabBK5A_HXhZTTxiXnA7GBOYS4GdEsWIPWji6iWr3sV8TSmqn69nWO1u4G7Xp7t1JAN4ccDhAORFcB2nqRt7XlIRYWElrdK6qXmZabn4UWqBNFN5d3A-Exesd-gwdPIVzFIXND4Fse3_ZNET5AwVsfXwC_N1Fq6P01t9Af5fh6pgFieIcVmJoPk6hpDwmUm9cJ3BmXoK8uvMZ9BpjBuUR5D-7_3VgksvEY2R2GC7gZdrs',
    date: '6月03日',
    title: '抹茶拿铁'
  }
])

onLoad(() => {
  loadMonthData()
})

// 加载月份数据
const loadMonthData = () => {
  monthStats.value = getMonthStats(currentMonth.value)
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
  uni.navigateTo({ url: '/pages/food-diary/add/index' })
}

// 个人中心
const handleProfile = () => {
  uni.navigateTo({ url: '/pages/food-diary/profile/index' })
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
  // 适配灵动岛：padding-top = 状态栏高度
  padding-top: var(--status-bar-height);
  height: calc(var(--nav-bar-height));
  padding-left: $container-padding;
  padding-right: $container-padding;
  background: var(--background);
  transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
}

.nav-btn {
  width: 40px;
  height: 40px;
  min-width: 40px;
  min-height: 40px;
  max-width: 40px;
  max-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  overflow: hidden;
  box-sizing: border-box;
  border-radius: 50%;
  transition: all 0.3s cubic-bezier(0.32, 0.72, 0, 1);

  &:active {
    transform: scale(0.9);
    background: var(--primary-container);
  }

}


.page-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--primary);
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--primary-container);
  transition: all 0.3s cubic-bezier(0.32, 0.72, 0, 1);

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
  display: block;
  font-size: 12px;
  font-weight: 700;
  line-height: 16px;
  letter-spacing: 0.05em;
  color: var(--on-surface-variant);
  text-transform: uppercase;
  margin-bottom: 4px;
}

.period-title {
  display: block;
  font-size: 24px;
  font-weight: 700;
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
  border-radius: 24px;
  padding: $spacing-lg;
  box-shadow: $shadow-card;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  aspect-ratio: 1;
  transition: all 0.3s cubic-bezier(0.32, 0.72, 0, 1);
  animation: cardEnter 0.5s cubic-bezier(0.32, 0.72, 0, 1);

  &:active {
    transform: scale(0.98);
  }
}

.stat-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 8px;
}

.stat-value {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.stat-number {
  font-size: 36px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-unit {
  font-size: 14px;
  color: var(--on-surface-variant);
}

// 饮品分布卡片
.drink-distribution-card {
  background: var(--surface);
  border-radius: 24px;
  padding: $spacing-lg;
  box-shadow: $shadow-card;
  margin-bottom: 32px;
  animation: cardEnter 0.6s cubic-bezier(0.32, 0.72, 0, 1);
}

.section-title {
  font-size: 18px;
  font-weight: 600;
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
  font-size: 18px;
  font-weight: 600;
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
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
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
  border-radius: 20px;
  box-shadow: $shadow-card;
  display: flex;
  align-items: center;
  transition: all 0.3s cubic-bezier(0.32, 0.72, 0, 1);
  overflow: hidden;
  animation: cardEnter 0.7s cubic-bezier(0.32, 0.72, 0, 1);

  &:active {
    transform: scale(0.98);
  }
}

.store-icon {
  width: 48px;
  height: 48px;
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
  font-size: 18px;
  font-weight: 600;
  color: var(--on-surface);
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.store-type {
  font-size: 14px;
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
  font-weight: 600;
  color: var(--primary);
  line-height: 1.2;
}

.store-visits-label {
  font-size: 12px;
  font-weight: 700;
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
  font-size: 12px;
  font-weight: 700;
  color: var(--primary);
  background: transparent;
  border: none;
  padding: 8px $spacing-md;
  border-radius: $radius-default;
  transition: all 0.3s cubic-bezier(0.32, 0.72, 0, 1);

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
  border-radius: 24px;
  box-shadow: $shadow-card;
  margin-bottom: 8px;
}

.photo-overlay {
  position: relative;
  margin-top: -40px;
  padding: $spacing-md;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.4), transparent);
  border-radius: 0 0 24px 24px;
}

.photo-date {
  font-size: 12px;
  font-weight: 700;
  color: white;
}

.photo-title {
  font-size: 14px;
  color: var(--on-surface);
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
  // 适配底部安全区域
  padding: 16px 24px;
  padding-bottom: calc(32px + var(--safe-area-bottom));
  background: rgba(250, 250, 250, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 -2px 16px rgba(17, 153, 142, 0.04);
}

.nav-item {
  width: 48px;
  height: 48px;
  min-width: 48px;
  min-height: 48px;
  max-width: 48px;
  max-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: transparent;
  border: none;
  color: var(--on-surface-variant);
  padding: 0;
  margin: 0;
  transition: all 0.3s cubic-bezier(0.32, 0.72, 0, 1);
  overflow: hidden;
  box-sizing: border-box;

  &:active {
    transform: scale(0.9);
  }

  &.active {
    color: var(--primary);
    background: var(--primary-container);
  }

}
</style>

<template>
  <view class="home-page">
    <!-- Top AppBar -->
    <view class="app-header">
      <button class="header-btn" @click="handleMenu">
        <uni-icons type="bars" size="24" color="#3d4947" />
      </button>
      <text class="header-title">百淘云</text>
      <view class="header-avatar" @click="handleProfile">
        <image class="avatar-img" src="/static/images/avatar.png" mode="aspectFill" />
      </view>
    </view>

    <!-- Main Content -->
    <scroll-view class="main-content" scroll-y :show-scrollbar="false">
      <!-- Date Header - 新的时间日期呈现方式 -->
      <view class="date-section">
        <view class="date-main">
          <text class="date-day">{{ currentDay }}</text>
          <view class="date-info">
            <text class="date-weekday">{{ currentWeekday }}</text>
            <text class="date-month">{{ currentMonthYear }}</text>
          </view>
        </view>
        <view class="date-greeting">
          <text class="greeting-text">{{ greetingText }}</text>
        </view>
      </view>

      <!-- Calendar Card -->
      <view class="calendar-card">
        <view class="calendar-header">
          <text class="calendar-title">{{ calendarMonthTitle }}</text>
          <view class="calendar-nav">
            <button class="nav-btn" @click="prevMonth">
              <uni-icons type="left" size="20" color="#006860" />
            </button>
            <button class="nav-btn" @click="nextMonth">
              <uni-icons type="right" size="20" color="#006860" />
            </button>
          </view>
        </view>

        <!-- Weekday Headers -->
        <view class="calendar-weekdays">
          <text class="weekday" v-for="day in weekdays" :key="day">{{ day }}</text>
        </view>

        <!-- Calendar Grid -->
        <view class="calendar-grid">
          <view
            v-for="(day, index) in calendarDays"
            :key="index"
            class="calendar-day"
            :class="{
              'is-today': day.isToday,
              'has-record': day.hasRecord,
              'is-other-month': day.isOtherMonth
            }"
            @click="selectDay(day)"
          >
            <!-- 缩略图背景 -->
            <view v-if="day.thumbnail && !day.isToday" class="day-thumbnail">
              <image class="thumbnail-img" :src="day.thumbnail" mode="aspectFill" />
              <view class="thumbnail-overlay" />
            </view>
            <!-- 今天的特殊样式 -->
            <view v-if="day.isToday" class="today-wrapper">
              <view v-if="day.thumbnail" class="today-thumbnail">
                <image class="thumbnail-img" :src="day.thumbnail" mode="aspectFill" />
              </view>
              <view class="today-gradient" />
            </view>
            <text class="day-text" :class="{ 'has-thumb': day.thumbnail }">{{ day.day }}</text>
            <!-- 记录数量指示 -->
            <view v-if="day.hasRecord && day.count > 1" class="record-count">
              <text class="count-text">{{ day.count }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- Monthly Stats Card -->
      <view class="stats-card">
        <view class="stats-content">
          <view class="stats-header">
            <text class="stats-title">本月概览</text>
          </view>
          <view class="stats-grid">
            <view class="stat-item">
              <text class="stat-label">饮用杯数</text>
              <view class="stat-value-row">
                <text class="stat-value">{{ monthlyStats.totalCups }}</text>
                <text class="stat-unit">杯</text>
              </view>
            </view>
            <view class="stat-item secondary">
              <text class="stat-label">到访店铺</text>
              <view class="stat-value-row">
                <text class="stat-value">{{ monthlyStats.totalShops }}</text>
                <text class="stat-unit">间</text>
              </view>
            </view>
          </view>
          <view class="stats-footer">
            <view class="favorite-drink">
              <text class="favorite-label">最常饮用</text>
              <text class="favorite-name">{{ monthlyStats.favoriteDrink }}</text>
            </view>
            <view class="drink-icons">
              <view v-for="(icon, index) in drinkIcons" :key="index" class="drink-icon">
                <text>{{ icon }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- Recent Activity Section -->
      <view class="recent-section">
        <view class="section-header">
          <text class="section-title">最近追踪</text>
          <button class="view-all-btn" @click="viewAll">查看全部</button>
        </view>
        <scroll-view class="recent-list" scroll-x :show-scrollbar="false">
          <view
            v-for="record in recentRecords"
            :key="record.id"
            class="recent-card"
            @click="goToDetail(record.id)"
          >
            <view class="recent-icon" :class="record.type">
              <uni-icons :type="record.icon" size="24" color="#ffffff" />
            </view>
            <view class="recent-info">
              <text class="recent-shop">{{ record.shop }}</text>
              <text class="recent-detail">{{ record.name }} · {{ record.time }}</text>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- Bottom Spacing -->
      <view class="bottom-spacing" />
    </scroll-view>

    <!-- Bottom Navigation -->
    <view class="bottom-nav">
      <view class="nav-item active" @click="switchTab('home')">
        <uni-icons type="home" size="24" color="#006860" />
        <text class="nav-label">首页</text>
      </view>
      <view class="nav-item" @click="switchTab('stats')">
        <uni-icons type="bars" size="24" color="#3d4947" />
        <text class="nav-label">统计</text>
      </view>
      <view class="fab-wrapper">
        <button class="fab-btn" @click="addRecord">
          <uni-icons type="plus" size="28" color="#ffffff" />
        </button>
      </view>
      <view class="nav-item" @click="switchTab('profile')">
        <uni-icons type="person" size="24" color="#3d4947" />
        <text class="nav-label">我的</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getCalendarIndex, getMonthlyStats, getRecordList } from '@/utils/food-diary/api.js'

// 当前日期 - 新的呈现方式
const currentDay = ref('20')
const currentWeekday = ref('星期五')
const currentMonthYear = ref('6月 2026')
const greetingText = ref('美好的一天，从一杯好咖啡开始')

// 日历月份标题
const calendarMonthTitle = ref('')

const currentYear = ref(2026)
const currentMonthNum = ref(6)

// 星期标题
const weekdays = ['一', '二', '三', '四', '五', '六', '日']

// 日历数据
const calendarDays = ref([])

// 月度统计
const monthlyStats = ref({
  totalCups: 0,
  totalShops: 0,
  favoriteDrink: '暂无数据'
})

// 饮品图标
const drinkIcons = ref(['☕', '🍵'])

// 最近记录
const recentRecords = ref([])

// 加载状态
const loading = ref(false)

// 初始化日期 - 新的时间日期呈现方式
const initDate = () => {
  const now = new Date()

  // 日期数字
  currentDay.value = String(now.getDate()).padStart(2, '0')

  // 星期
  const weekdayNames = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  currentWeekday.value = weekdayNames[now.getDay()]

  // 月份年份
  const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  currentMonthYear.value = `${monthNames[now.getMonth()]} ${now.getFullYear()}`

  // 问候语 - 根据时间段变化
  const hour = now.getHours()
  if (hour < 6) {
    greetingText.value = '夜深了，注意休息'
  } else if (hour < 9) {
    greetingText.value = '早安，美好的一天从咖啡开始'
  } else if (hour < 12) {
    greetingText.value = '上午好，来杯咖啡提提神'
  } else if (hour < 14) {
    greetingText.value = '中午好，午后咖啡时光'
  } else if (hour < 18) {
    greetingText.value = '下午好，继续加油'
  } else if (hour < 22) {
    greetingText.value = '晚上好，放松一下'
  } else {
    greetingText.value = '夜深了，注意休息'
  }

  currentYear.value = now.getFullYear()
  currentMonthNum.value = now.getMonth() + 1
  updateCalendarMonthTitle()
}

// 更新日历月份标题
const updateCalendarMonthTitle = () => {
  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月',
                      '七月', '八月', '九月', '十月', '十一月', '十二月']
  calendarMonthTitle.value = `${monthNames[currentMonthNum.value - 1]} ${currentYear.value}`
}

// 加载日历数据
const loadCalendarData = async () => {
  try {
    const month = `${currentYear.value}-${String(currentMonthNum.value).padStart(2, '0')}`
    const result = await getCalendarIndex(month)

    // 构建日历数据
    buildCalendarDays(result.days || {})
  } catch (error) {
    console.error('加载日历数据失败:', error)
    // 使用默认数据
    buildCalendarDays({})
  }
}

// 构建日历天数
const buildCalendarDays = (daysData) => {
  const days = []
  const firstDay = new Date(currentYear.value, currentMonthNum.value - 1, 1)
  const lastDay = new Date(currentYear.value, currentMonthNum.value, 0)
  const startWeekday = firstDay.getDay() === 0 ? 7 : firstDay.getDay()
  const totalDays = lastDay.getDate()

  const today = new Date()
  const todayStr = today.toISOString().slice(0, 10)

  // 填充上月空白
  for (let i = 1; i < startWeekday; i++) {
    days.push({ day: '', isOtherMonth: true })
  }

  // 填充当月日期
  for (let d = 1; d <= totalDays; d++) {
    const dateStr = `${currentYear.value}-${String(currentMonthNum.value).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const dayKey = String(d).padStart(2, '0')
    const dayData = daysData[dayKey] || {}

    days.push({
      day: d,
      date: dateStr,
      isToday: dateStr === todayStr,
      hasRecord: dayData.count > 0,
      thumbnail: dayData.thumbnail || '',
      count: dayData.count || 0
    })
  }

  calendarDays.value = days
}

// 加载统计数据
const loadStatsData = async () => {
  try {
    const month = `${currentYear.value}-${String(currentMonthNum.value).padStart(2, '0')}`
    const result = await getMonthlyStats(month)

    monthlyStats.value = {
      totalCups: result.recordCount || 0,
      totalShops: result.storeCount || 0,
      favoriteDrink: result.topStores && result.topStores.length > 0
        ? `${result.topStores[0].name} (${result.topStores[0].count}次)`
        : '暂无数据'
    }
  } catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

// 加载最近记录
const loadRecentRecords = async () => {
  try {
    const result = await getRecordList({ pageNo: 1, pageSize: 5 })
    const records = result.lists || []

    recentRecords.value = records.map(record => ({
      id: record.id,
      shop: record.storeName || '未知店铺',
      name: record.description || '饮品',
      time: record.time || '',
      type: record.category || 'coffee',
      icon: getCategoryIcon(record.category)
    }))
  } catch (error) {
    console.error('加载最近记录失败:', error)
  }
}

// 获取分类图标
const getCategoryIcon = (category) => {
  const iconMap = {
    coffee: 'paperplane',
    americano: 'paperplane',
    latte: 'paperplane',
    tea: 'star',
    juice: 'heart',
    other: 'plus'
  }
  return iconMap[category] || 'paperplane'
}

// 方法
const handleMenu = () => {
  uni.showActionSheet({
    itemList: ['刷新数据', '设置', '帮助'],
    success: (res) => {
      if (res.tapIndex === 0) {
        loadAllData()
      }
    }
  })
}

const handleProfile = () => {
  uni.switchTab({ url: '/pages/profile/index' })
}

const prevMonth = () => {
  currentMonthNum.value--
  if (currentMonthNum.value < 1) {
    currentMonthNum.value = 12
    currentYear.value--
  }
  updateCalendarMonthTitle()
  loadCalendarData()
  loadStatsData()
}

const nextMonth = () => {
  currentMonthNum.value++
  if (currentMonthNum.value > 12) {
    currentMonthNum.value = 1
    currentYear.value++
  }
  updateCalendarMonthTitle()
  loadCalendarData()
  loadStatsData()
}

const selectDay = (day) => {
  if (day.day && !day.isOtherMonth) {
    console.log('Selected day:', day.date)
    // 可以跳转到该日期的记录列表
    uni.navigateTo({ url: `/pages/detail/index?date=${day.date}` })
  }
}

const viewAll = () => {
  uni.switchTab({ url: '/pages/monthly/index' })
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
  if (tab === 'home') return
  uni.switchTab({ url: routes[tab] })
}

const addRecord = () => {
  uni.navigateTo({ url: '/pages/add/index' })
}

// 加载所有数据
const loadAllData = async () => {
  loading.value = true
  try {
    await Promise.all([
      loadCalendarData(),
      loadStatsData(),
      loadRecentRecords()
    ])
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  initDate()
  loadAllData()
})
</script>

<style lang="scss" scoped>
@use '@/styles/theme.scss' as *;

.home-page {
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

.header-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid $primary-fixed;
  transition: transform $duration-normal $ease-out;

  &:active {
    transform: scale(0.95);
  }
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

// Date Section - 新的时间日期呈现方式
.date-section {
  margin-bottom: 24px;
}

.date-main {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 8px;
}

.date-day {
  font-size: 64px;
  font-weight: $font-weight-bold;
  color: $primary;
  line-height: 1;
  letter-spacing: -0.02em;
}

.date-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-top: 8px;
}

.date-weekday {
  font-size: 24px;
  font-weight: $font-weight-bold;
  color: $on-surface;
  line-height: 1.2;
}

.date-month {
  font-size: 16px;
  font-weight: $font-weight-medium;
  color: $on-surface-variant;
}

.date-greeting {
  margin-top: 8px;
}

.greeting-text {
  font-size: 14px;
  color: $outline;
  line-height: 1.5;
}

// Calendar Card
.calendar-card {
  background: $surface-container-lowest;
  border-radius: 28px;
  padding: 20px;
  box-shadow: 0 10px 30px -5px rgba(17, 153, 142, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.4);
  margin-bottom: 24px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.calendar-title {
  font-size: 20px;
  font-weight: $font-weight-semibold;
  color: $primary;
}

.calendar-nav {
  display: flex;
  gap: 12px;
}

.nav-btn {
  @include btn-reset;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:active {
    opacity: 0.7;
  }
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  margin-bottom: 12px;
}

.weekday {
  font-size: 14px;
  font-weight: $font-weight-semibold;
  color: $outline;
  letter-spacing: 0.02em;
  padding: 8px 0;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  transition: all $duration-normal $ease-out;
  position: relative;
  overflow: hidden;
  min-height: 44px;

  &:active {
    transform: scale(0.95);
  }

  &.is-today {
    .today-wrapper {
      position: absolute;
      inset: 0;
      border-radius: 14px;
      overflow: hidden;
    }

    .today-thumbnail {
      position: absolute;
      inset: 0;
    }

    .today-gradient {
      position: absolute;
      inset: 0;
      background: $primary-gradient;
      opacity: 0.85;
    }

    .day-text {
      color: $on-primary;
      font-weight: $font-weight-bold;
      font-size: 18px;
      position: relative;
      z-index: 1;
    }

    box-shadow: 0 4px 16px rgba(0, 104, 96, 0.35);
  }

  &.is-other-month {
    opacity: 0.3;
  }

  &.has-record:not(.is-today) {
    .day-text {
      font-weight: $font-weight-semibold;
    }
  }
}

// 缩略图样式
.day-thumbnail {
  position: absolute;
  inset: 0;
  border-radius: 14px;
  overflow: hidden;
}

.thumbnail-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.35);
}

.day-text {
  font-size: 16px;
  color: $on-surface;
  position: relative;
  z-index: 1;

  &.has-thumb {
    color: $on-surface;
    text-shadow: 0 1px 3px rgba(255, 255, 255, 0.9);
  }
}

// 记录数量指示
.record-count {
  position: absolute;
  top: 3px;
  right: 3px;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  background: $primary;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  padding: 0 4px;
}

.count-text {
  font-size: 11px;
  font-weight: $font-weight-bold;
  color: $on-primary;
}

// Stats Card
.stats-card {
  background: $surface-container-lowest;
  border-radius: 28px;
  padding: 24px;
  box-shadow: 0 10px 30px -5px rgba(17, 153, 142, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.4);
  margin-bottom: 24px;
  overflow: hidden;
  position: relative;
}

.stats-title {
  font-size: 24px;
  font-weight: $font-weight-semibold;
  color: $on-surface;
  margin-bottom: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.stat-item {
  background: rgba(0, 131, 121, 0.1);
  padding: 16px;
  border-radius: 16px;
  border: 1px solid rgba(0, 131, 121, 0.2);

  &.secondary {
    background: rgba(77, 254, 138, 0.1);
    border-color: rgba(77, 254, 138, 0.2);
  }
}

.stat-label {
  font-size: 13px;
  font-weight: $font-weight-semibold;
  color: $tertiary;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
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
}

.stat-unit {
  font-size: 16px;
  color: rgba(0, 104, 96, 0.7);
}

.stats-footer {
  padding-top: 24px;
  border-top: 1px solid $surface-variant;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.favorite-label {
  font-size: 13px;
  font-weight: $font-weight-semibold;
  color: $outline;
}

.favorite-name {
  font-size: 18px;
  font-weight: $font-weight-semibold;
  color: $on-surface;
  display: block;
  margin-top: 4px;
}

.drink-icons {
  display: flex;
  margin-right: -12px;
}

.drink-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: $primary-fixed;
  border: 2px solid $surface-container-lowest;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  margin-left: -8px;

  &:first-child {
    margin-left: 0;
  }
}

// Recent Section
.recent-section {
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 8px;
  margin-bottom: 16px;
}

.section-title {
  font-size: 20px;
  font-weight: $font-weight-semibold;
  color: $on-surface;
}

.view-all-btn {
  font-size: 13px;
  font-weight: $font-weight-semibold;
  color: $primary;
  background: transparent;
  border: none;
  padding: 0;

  &::after {
    border: none;
  }
}

.recent-list {
  display: flex;
  gap: 16px;
  white-space: nowrap;
  padding-bottom: 16px;
}

.recent-card {
  min-width: 200px;
  background: $surface-container-lowest;
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 10px 30px -5px rgba(17, 153, 142, 0.08);
  border: 1px solid $surface-container-lowest;
  transition: transform $duration-normal $ease-out;

  &:active {
    transform: scale(0.98);
  }
}

.recent-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;

  &.coffee {
    background: $primary-gradient;
  }

  &.tea {
    background: rgba(77, 254, 138, 0.3);
  }
}

.recent-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.recent-shop {
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $on-surface;
}

.recent-detail {
  font-size: 13px;
  color: $outline;
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

.fab-wrapper {
  position: relative;
  margin-top: -20px;
}

.fab-btn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: $primary-gradient;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(0, 104, 96, 0.4);
  transition: all $duration-normal $ease-out;

  &::after {
    border: none;
  }

  &:active {
    transform: scale(0.9);
  }
}
</style>

<template>
  <view class="food-diary-index">
    <view class="page-grain" />

    <view class="hero-nav">
      <view class="round-btn" @tap="goStore">⚙</view>
      <view class="round-btn brand" @tap="goStore">M</view>
    </view>

    <scroll-view scroll-y class="content-area">
      <view class="title-block">
        <text class="title">今天</text>
        <text class="subtitle">{{ todayLabel }}</text>
      </view>

      <view class="calendar-card">
        <view class="month-controller">
          <view class="month-arrow" @tap="changeMonth(-1)">‹</view>
          <text class="month-text">{{ monthLabel }}</text>
          <view class="month-arrow" @tap="changeMonth(1)">›</view>
        </view>

        <view class="week-row">
          <text v-for="label in WEEK_LABELS" :key="label" class="week-label">{{ label }}</text>
        </view>

        <view class="calendar-grid">
          <view
            v-for="item in calendarDays"
            :key="item.key"
            :class="['calendar-cell', { empty: item.empty, today: item.isToday, 'has-record': item.count > 0 }]"
            @tap="openDay(item)"
          >
            <view class="day-card">
              <image v-if="item.thumbnail" class="day-thumb" :src="item.thumbnail" mode="aspectFill" />
              <view v-else-if="item.count > 0" class="cup-mark">
                <text class="cup-lid" />
                <text class="cup-body" />
              </view>
              <text v-else class="day-number">{{ item.day }}</text>
              <text v-if="item.isToday" class="today-dot" />
            </view>
          </view>
        </view>
      </view>

      <view class="month-summary">
        <view class="summary-copy">
          <text class="summary-title">本月</text>
          <view class="summary-count">
            <text class="summary-number">{{ monthStats.recordCount }}</text>
            <text class="summary-unit">杯</text>
          </view>
          <text class="summary-store">{{ monthStats.storeCount }} 店铺</text>
        </view>

        <view class="cup-stack">
          <view class="stack-cup amber" />
          <view class="stack-cup latte" />
          <view class="stack-cup dark" />
          <view class="stack-cup black" />
          <view class="stack-cup cocoa" />
        </view>
      </view>
    </scroll-view>

    <view class="bottom-dock">
      <view class="dock-tabs">
        <view class="dock-tab active">▱</view>
        <view class="dock-tab">
          ♙
          <text class="dock-dot" />
        </view>
      </view>
      <view class="add-fab" @tap="addToday">+</view>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { WEEK_LABELS } from '@/constants/food-diary.js'
import {
  formatChineseDay,
  formatMonthLabel,
  getMonthIndex,
  getMonthStats,
  getToday,
  shiftMonthKey
} from '@/utils/food-diary/index.js'

const currentMonth = ref(getToday().slice(0, 7))
const monthData = ref({})
const monthStats = ref({
  recordDays: 0,
  recordCount: 0,
  imageCount: 0,
  storeCount: 0
})

const todayLabel = computed(() => formatChineseDay(new Date()))
const monthLabel = computed(() => formatMonthLabel(currentMonth.value))

const loadMonth = (month) => {
  const monthIndex = getMonthIndex(month)
  currentMonth.value = month
  monthData.value = monthIndex.days || {}
  monthStats.value = getMonthStats(month)
}

const calendarDays = computed(() => {
  const [year, month] = currentMonth.value.split('-').map(Number)
  const firstDay = new Date(year, month - 1, 1)
  const startWeek = firstDay.getDay()
  const daysInMonth = new Date(year, month, 0).getDate()
  const days = []

  for (let index = 0; index < startWeek; index += 1) {
    days.push({ key: `empty-${index}`, empty: true })
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const dayKey = String(day).padStart(2, '0')
    const date = `${currentMonth.value}-${dayKey}`
    const item = monthData.value[dayKey] || monthData.value[String(day)] || {}
    days.push({
      key: date,
      day,
      date,
      count: item.count || 0,
      thumbnail: item.thumbnail || '',
      isToday: date === getToday()
    })
  }

  return days
})

const changeMonth = (delta) => {
  loadMonth(shiftMonthKey(currentMonth.value, delta))
}

const openDay = (item) => {
  if (!item || item.empty) return
  uni.navigateTo({ url: `/pages/food-diary/detail/index?date=${item.date}` })
}

const addToday = () => {
  uni.navigateTo({ url: `/pages/food-diary/add/index?date=${getToday()}` })
}

const goStore = () => {
  uni.navigateTo({ url: '/pages/food-diary/store/index' })
}

onShow(() => {
  loadMonth(currentMonth.value)
})
</script>

<style lang="scss" scoped>
.food-diary-index {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: var(--paper);
  color: var(--ink);
}

.page-grain {
  position: fixed;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(circle at 18% 10%, rgba(255, 255, 255, 0.9), transparent 24%),
    radial-gradient(circle at 80% 28%, rgba(218, 204, 185, 0.16), transparent 22%),
    linear-gradient(135deg, rgba(116, 91, 62, 0.035) 0 25%, transparent 25% 50%, rgba(116, 91, 62, 0.025) 50% 75%, transparent 75%);
  background-size: auto, auto, 18rpx 18rpx;
}

.hero-nav {
  position: fixed;
  top: 72rpx;
  left: 0;
  right: 0;
  z-index: 20;
  display: flex;
  justify-content: space-between;
  padding: 0 28rpx;
}

.round-btn {
  width: 68rpx;
  height: 68rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8a7e79;
  background: rgba(255, 255, 255, 0.55);
  border: 4rpx solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 10rpx 24rpx rgba(92, 73, 52, 0.08);
  font-size: 34rpx;
}

.brand {
  font-size: 32rpx;
  font-weight: 800;
  font-family: Georgia, serif;
}

.content-area {
  position: relative;
  z-index: 1;
  height: 100vh;
  padding: 178rpx 28rpx 190rpx;
}

.title-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 50rpx;
}

.title {
  font-size: 58rpx;
  line-height: 1.1;
  font-weight: 800;
  letter-spacing: 2rpx;
}

.subtitle {
  margin-top: 12rpx;
  font-size: 28rpx;
  color: var(--muted);
}

.calendar-card,
.month-summary {
  background: var(--card);
  border-radius: 38rpx;
  box-shadow: 0 20rpx 60rpx rgba(62, 45, 28, 0.08);
}

.calendar-card {
  padding: 30rpx 28rpx 34rpx;
}

.month-controller {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 28rpx;
}

.month-arrow {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a69d98;
  background: #f4f1eb;
  font-size: 44rpx;
}

.month-text {
  min-width: 220rpx;
  text-align: center;
  font-size: 30rpx;
  font-weight: 700;
}

.week-row,
.calendar-grid {
  display: flex;
  flex-wrap: wrap;
}

.week-label {
  width: 14.285%;
  text-align: center;
  font-size: 26rpx;
  font-weight: 700;
  color: #aaa09b;
  margin-bottom: 22rpx;
}

.calendar-cell {
  width: 14.285%;
  height: 110rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12rpx;
}

.empty {
  opacity: 0;
}

.day-card {
  position: relative;
  width: 82rpx;
  height: 92rpx;
  border-radius: 18rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--tile);
}

.day-number {
  font-size: 30rpx;
}

.today .day-card {
  background: var(--accent);
  color: #fff;
  box-shadow: 0 8rpx 18rpx rgba(207, 145, 72, 0.28);
}

.day-thumb {
  width: 78rpx;
  height: 88rpx;
  border-radius: 16rpx;
  border: 4rpx solid #fff;
}

.cup-mark {
  position: relative;
  width: 44rpx;
  height: 62rpx;
}

.cup-lid {
  position: absolute;
  top: 0;
  left: 3rpx;
  width: 38rpx;
  height: 12rpx;
  border-radius: 10rpx;
  background: #fff;
  border: 4rpx solid #d4c8be;
}

.cup-body {
  position: absolute;
  top: 12rpx;
  left: 7rpx;
  width: 30rpx;
  height: 48rpx;
  border-radius: 6rpx 6rpx 13rpx 13rpx;
  background: linear-gradient(180deg, #9a4e27 0%, #49211d 100%);
  border: 4rpx solid #fff;
}

.today-dot {
  position: absolute;
  right: 8rpx;
  bottom: 8rpx;
  width: 10rpx;
  height: 10rpx;
  border-radius: 50%;
  background: #fff;
}

.month-summary {
  margin-top: 36rpx;
  min-height: 218rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 36rpx 44rpx;
  overflow: hidden;
}

.summary-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #8c827e;
}

.summary-count {
  display: flex;
  align-items: flex-end;
  margin: 24rpx 0 14rpx;
}

.summary-number {
  font-size: 64rpx;
  line-height: 0.8;
  font-weight: 800;
}

.summary-unit {
  margin-left: 14rpx;
  font-size: 30rpx;
  color: #887c78;
}

.summary-store {
  font-size: 28rpx;
  color: var(--muted);
}

.cup-stack {
  flex: 1;
  min-width: 360rpx;
  height: 130rpx;
  position: relative;
  margin-left: 24rpx;
}

.stack-cup {
  position: absolute;
  bottom: 0;
  width: 82rpx;
  height: 118rpx;
  border-radius: 18rpx 18rpx 26rpx 26rpx;
  border: 7rpx solid #fff;
  box-shadow: 0 12rpx 28rpx rgba(62, 36, 22, 0.14);

  &::before {
    content: "";
    position: absolute;
    top: -8rpx;
    left: -4rpx;
    right: -4rpx;
    height: 24rpx;
    border-radius: 50%;
    background: rgba(231, 245, 246, 0.88);
    border: 4rpx solid #d7e2df;
  }

  &.amber { left: 0; background: linear-gradient(180deg, #bd5b28, #5d2b1f); transform: rotate(-8deg); }
  &.latte { left: 70rpx; background: linear-gradient(180deg, #8c4a28, #4e2722); transform: rotate(6deg); }
  &.dark { left: 140rpx; background: linear-gradient(180deg, #202227, #0c0d11); transform: rotate(-2deg); }
  &.black { left: 210rpx; background: linear-gradient(180deg, #10131a, #040506); transform: rotate(7deg); }
  &.cocoa { left: 280rpx; background: linear-gradient(180deg, #3d2421, #120909); transform: rotate(-5deg); }
}

.bottom-dock {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 46rpx;
  z-index: 30;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 38rpx;
}

.dock-tabs {
  width: 330rpx;
  height: 100rpx;
  padding: 8rpx;
  display: flex;
  align-items: center;
  border-radius: 54rpx;
  background: rgba(255, 253, 248, 0.82);
  border: 4rpx solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 16rpx 45rpx rgba(65, 48, 34, 0.12);
}

.dock-tab {
  position: relative;
  flex: 1;
  height: 84rpx;
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8d827c;
  font-size: 42rpx;

  &.active {
    color: var(--accent);
    background: #e7e2dd;
  }
}

.dock-dot {
  position: absolute;
  right: 48rpx;
  top: 20rpx;
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: var(--accent);
}

.add-fab {
  width: 106rpx;
  height: 106rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent);
  background: rgba(255, 253, 248, 0.82);
  border: 4rpx solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 16rpx 45rpx rgba(65, 48, 34, 0.12);
  font-size: 54rpx;
}
</style>


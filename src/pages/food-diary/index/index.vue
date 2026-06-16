<template>
  <view class="food-diary-index">
    <!-- 顶部导航栏 -->
    <header class="app-header">
      <button class="nav-btn" @tap="handleMenu">
        <uni-icons type="bars" size="20"></uni-icons>
      </button>
      <text class="brand-title">百淘云</text>
      <view class="avatar" @tap="handleProfile">
        <image class="avatar-img" :src="userAvatar" mode="aspectFill" />
      </view>
    </header>

    <!-- 主内容区 -->
    <scroll-view scroll-y class="main-content">
      <!-- 日期标题 -->
      <view class="date-header">
        <text class="date-title">今天</text>
        <text class="date-subtitle">{{ todayLabel }}</text>
      </view>

      <!-- 日历卡片 -->
      <view class="calendar-card">
        <view class="calendar-grid">
          <!-- 星期标题 -->
          <view class="week-row">
            <text v-for="label in WEEK_LABELS" :key="label" class="week-label">{{ label }}</text>
          </view>

          <!-- 日期格子 -->
          <view class="days-grid">
            <view
              v-for="item in calendarDays"
              :key="item.key"
              :class="['day-cell', {
                empty: item.empty,
                today: item.isToday,
                selected: item.date === selectedDate
              }]"
              @tap="handleDayTap(item)"
            >
              <view v-if="!item.empty" class="day-content">
                <!-- 有记录显示饮品图标 -->
                <image
                  v-if="item.hasRecord"
                  class="drink-icon"
                  :src="item.drinkImage"
                  mode="aspectFit"
                />
                <!-- 否则显示日期数字 -->
                <text v-else class="day-number">{{ item.day }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 月度统计卡片 -->
      <view class="stats-card">
        <view class="stats-info">
          <text class="stats-label">本月记录</text>
          <view class="stats-count">
            <text class="stats-number">{{ monthStats.recordCount }}</text>
            <text class="stats-unit">杯</text>
          </view>
          <text class="stats-store">{{ monthStats.storeCount }} 间到访店铺</text>
        </view>

        <!-- 饮品贴纸堆叠 -->
        <view class="drink-stickers">
          <image
            v-for="(drink, index) in drinkStickers"
            :key="index"
            class="sticker"
            :class="`sticker-${index + 1}`"
            :src="drink.image"
            mode="aspectFit"
          />
        </view>
      </view>
    </scroll-view>

    <!-- 底部导航栏 -->
    <nav class="bottom-nav">
      <button class="nav-item active" @tap="handleCalendar">
        <uni-icons type="calendar" size="20"></uni-icons>
      </button>
      <button class="nav-item fab" @tap="handleAdd">
        <uni-icons type="plus" size="24"></uni-icons>
      </button>
      <button class="nav-item" @tap="handleProfile">
        <uni-icons type="person" size="20"></uni-icons>
      </button>
    </nav>
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

// 用户头像
const userAvatar = ref('https://lh3.googleusercontent.com/aida-public/AB6AXuD4MViBQlJwa2LxpuiStBQ2BQLgfs7W_-B0_PeTKZxvWSfNa07zZR4wZWcbCL24JXSvrwfbiOO-Z3kudy7SP53uqUx9DV_yb6oDSTFxtpGW8uhIAyx-qHrypRSRbBiwhwEp1lNcqsGRJ3HzO8DUB53q9nq16f_vTsEnIOvBkTjBGVUCXvQ5kflkodk3xFSZiZ0SDlYH7uioqKCEQRAT0B15NVa_KfIJ_MO6miHAos4gUm8-Z-AvRxNDeMoYP4V2FKg8NIcXTJaliMI')

// 当前选中日期
const selectedDate = ref(getToday())
const currentMonth = ref(getToday().slice(0, 7))
const monthData = ref({})
const monthStats = ref({
  recordDays: 0,
  recordCount: 0,
  imageCount: 0,
  storeCount: 0
})

// 饮品贴纸
const drinkStickers = ref([
  { image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBB-J8VvJZ_Rc6bcBmo0KzCZgZvneveEf4V2sbgP9hHJc-9zhj5PjAuO7QhIrjuTPSOIf97nm__fdT8MNiO_YqPucHOAulG82L3_LzHzsJqtbVLlVDN_4kJo1OgIbIsUvg391KsN1Hr5mpsXG3qyXQRrdpjdAMoJ8IBBNpyh6CCHBqg4hNEs6saohoqfG2em7_m4VenA7MpuVCNO6EXUQmVV49gIRsxFBnD6rod2pzE5xE4IiB01ttw4_PjNOV1Pr5HHSrnT5-Kdbs' },
  { image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdd_GQ1k0prJmI9_NRvV05a-ClmezfE9apkSCLMTruTYUQOLZ7E4sfTZ7vUY1ONaYGfIQ_RGosW2A5rEZBxgYHVIXgQN8SdPEw870WjoVOKSqsu0DD2HxzJXxZEszMGa3ozqZyOp6Bx-ouGiT0c8TRLtyO3_fRLfr0RkpOESZ-ahZsfy6XVCAl9igSuFXdF15AwYQ9dOv0M75wAvwXXPqCZS5NAo2kzOz7i5RQJs2OXdmFzpjX5xbWYJA_qJbD2NwDOmiWOBhu2o0' },
  { image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZ3KgHnv2uWHPW6-BI7iy7fAVSaFAkUmyM7uyEiskWQOZPaPO7eqA0QC--clRcIacuX-6b97CsMLy8Qc9SXsdofICxpymAmiqpuaIZf4pn-MeS1Zy1MzuLGTv0N9jsCEpf6Hva4ZM_BdPYxR_Gx6qQJfe4rc5VV3BwpnXN3EOkmhqfZuAtB4cbXvbMl4hHuFVNmZjx-mJoH3WyCQChu7UQxxEsHf37AJ6ly1QiKG9FtA5XJqzVjnN63sNAaLllqTARI67gPE9toDw' }
])

// 今天的日期标签
const todayLabel = computed(() => formatChineseDay(new Date()))

// 月标签
const monthLabel = computed(() => formatMonthLabel(currentMonth.value))

// 日历日期数组
const calendarDays = computed(() => {
  const [year, month] = currentMonth.value.split('-').map(Number)
  const firstDay = new Date(year, month - 1, 1)
  const startWeek = firstDay.getDay()
  const daysInMonth = new Date(year, month, 0).getDate()
  const days = []

  // 填充空白格子
  for (let index = 0; index < startWeek; index += 1) {
    days.push({ key: `empty-${index}`, empty: true })
  }

  // 填充日期
  for (let day = 1; day <= daysInMonth; day += 1) {
    const dayKey = String(day).padStart(2, '0')
    const date = `${currentMonth.value}-${dayKey}`
    const item = monthData.value[dayKey] || monthData.value[String(day)] || {}

    days.push({
      key: date,
      day,
      date,
      hasRecord: item.count > 0,
      drinkImage: item.thumbnail || '',
      isToday: date === getToday()
    })
  }

  return days
})

// 加载月份数据
const loadMonth = (month) => {
  const monthIndex = getMonthIndex(month)
  currentMonth.value = month
  monthData.value = monthIndex.days || {}
  monthStats.value = getMonthStats(month)
}

// 日期点击
const handleDayTap = (item) => {
  if (!item || item.empty) return
  selectedDate.value = item.date

  if (item.hasRecord) {
    uni.navigateTo({ url: `/pages/food-diary/detail/index?date=${item.date}` })
  }
}

// 添加记录
const handleAdd = () => {
  uni.navigateTo({ url: `/pages/food-diary/add/index?date=${getToday()}` })
}

// 菜单
const handleMenu = () => {
  // TODO: 打开菜单
}

// 个人中心
const handleProfile = () => {
  uni.navigateTo({ url: '/pages/food-diary/profile/index' })
}

// 日历视图
const handleCalendar = () => {
  uni.navigateTo({ url: '/pages/food-diary/monthly/index' })
}

onShow(() => {
  loadMonth(currentMonth.value)
})
</script>

<style lang="scss" scoped>
@use '@/styles/theme.scss' as *;

.food-diary-index {
  min-height: 100vh;
  background: var(--background);
  padding-bottom: 100px;
  animation: fadeIn 0.3s ease-out;
}

// 顶部导航栏
.app-header {
  position: sticky;
  top: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: space-between;
  // 适配灵动岛：padding-top = 状态栏高度
  padding-top: var(--status-bar-height);
  height: calc(var(--nav-bar-height));
  padding-left: $container-padding;
  padding-right: $container-padding;
  background: var(--background);
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
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  border-radius: 50%;
  transition: all 0.3s cubic-bezier(0.32, 0.72, 0, 1);

  &:active {
    transform: scale(0.9);
    background: var(--primary-container);
  }

}

.brand-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--primary);
  letter-spacing: 0.02em;
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

// 主内容区
.main-content {
  padding: 8px $container-padding 32px;
  height: calc(100vh - 164px);
}

// 日期标题
.date-header {
  text-align: center;
  margin-bottom: 32px;
  animation: slideUp 0.4s cubic-bezier(0.32, 0.72, 0, 1);
}

.date-title {
  display: block;
  font-size: 28px;
  font-weight: 700;
  line-height: 36px;
  color: var(--primary);
  margin-bottom: 4px;
  letter-spacing: -0.02em;
}

.date-subtitle {
  display: block;
  font-size: 14px;
  line-height: 20px;
  color: var(--on-surface-variant);
}

// 日历卡片
.calendar-card {
  background: var(--surface);
  border-radius: 24px;
  padding: 24px;
  box-shadow: $shadow-card;
  margin-bottom: 24px;
  overflow: hidden;
  animation: cardEnter 0.5s cubic-bezier(0.32, 0.72, 0, 1);
  transition: all 0.3s cubic-bezier(0.32, 0.72, 0, 1);

  &:active {
    transform: scale(0.99);
  }
}

.week-row {
  display: flex;
  margin-bottom: 16px;
}

.week-label {
  flex: 1;
  text-align: center;
  font-size: 12px;
  font-weight: 700;
  line-height: 16px;
  letter-spacing: 0.05em;
  color: var(--on-surface-variant);
  text-transform: uppercase;
}

.days-grid {
  display: flex;
  flex-wrap: wrap;
}

.day-cell {
  width: 14.285%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;

  &.empty {
    opacity: 0;
  }

  &.today {
    .day-content {
      background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
      color: var(--on-primary);
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(17, 153, 142, 0.3);
      transform: scale(1.1);
    }
  }

  &.selected {
    .day-content {
      background: var(--primary-container);
      color: var(--primary);
    }
  }
}

.day-content {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: var(--surface-container);
  transition: all 0.2s cubic-bezier(0.32, 0.72, 0, 1);

  &:active {
    background: var(--surface-container-high);
    transform: scale(0.95);
  }
}

.day-number {
  font-size: 16px;
  color: var(--on-surface);
}

.drink-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(17, 153, 142, 0.2));
}

// 统计卡片
.stats-card {
  background: var(--surface);
  border-radius: 24px;
  padding: 24px;
  box-shadow: $shadow-card;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  overflow: hidden;
  animation: cardEnter 0.6s cubic-bezier(0.32, 0.72, 0, 1);
  transition: all 0.3s cubic-bezier(0.32, 0.72, 0, 1);

  &:active {
    transform: scale(0.99);
  }

  // 装饰背景
  &::after {
    content: '';
    position: absolute;
    bottom: -24px;
    right: -24px;
    width: 128px;
    height: 128px;
    background: rgba(17, 153, 142, 0.05);
    border-radius: 50%;
    filter: blur(40px);
  }
}

.stats-info {
  flex: 1;
  position: relative;
  z-index: 1;
}

.stats-label {
  display: block;
  font-size: 12px;
  font-weight: 700;
  line-height: 16px;
  letter-spacing: 0.05em;
  color: var(--on-surface-variant);
  text-transform: uppercase;
  margin-bottom: 4px;
}

.stats-count {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin: 4px 0;
}

.stats-number {
  font-size: 36px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stats-unit {
  font-size: 18px;
  font-weight: 600;
  color: var(--on-surface-variant);
}

.stats-store {
  display: block;
  font-size: 14px;
  color: var(--secondary);
  margin-top: 4px;
}

// 饮品贴纸
.drink-stickers {
  display: flex;
  padding-right: 8px;
  position: relative;
  z-index: 1;
}

.sticker {
  width: 64px;
  height: 64px;
  object-fit: contain;
  filter: drop-shadow(0 4px 8px rgba(17, 153, 142, 0.2));

  &.sticker-1 {
    transform: rotate(-12deg);
    z-index: 3;
  }

  &.sticker-2 {
    transform: rotate(6deg) translateY(8px);
    margin-left: -16px;
    z-index: 2;
  }

  &.sticker-3 {
    transform: rotate(-6deg);
    margin-left: -16px;
    z-index: 1;
  }
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
  border-radius: 50%;
  background: transparent;
  border: none;
  color: var(--on-surface-variant);
  padding: 0;
  margin: 0;
  transition: all 0.3s cubic-bezier(0.32, 0.72, 0, 1);
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;

  &:active {
    transform: scale(0.9);
  }

  &.active {
    color: var(--primary);
    background: var(--primary-container);
  }


  &.fab {
    background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
    color: var(--on-primary);
    width: 56px;
    height: 56px;
    min-width: 56px;
    min-height: 56px;
    max-width: 56px;
    max-height: 56px;
    box-shadow: $shadow-fab;
  }
}
</style>

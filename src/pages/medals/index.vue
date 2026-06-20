<template>
  <view class="medals-page">
    <!-- Top AppBar -->
    <view class="app-header">
      <button class="header-btn" @click="goBack">
        <uni-icons type="back" size="24" color="#006860" />
      </button>
      <text class="header-title">勋章馆</text>
      <button class="header-btn" @click="showHelp">
        <uni-icons type="help" size="24" color="#006860" />
      </button>
    </view>

    <!-- Main Content -->
    <scroll-view class="main-content" scroll-y :show-scrollbar="false">
      <!-- Statistics Overview Card -->
      <view class="stats-card">
        <view class="stats-info">
          <view class="stats-row">
            <text class="stats-value">{{ totalMedals }}</text>
            <text class="stats-label">枚已获勋章</text>
          </view>
          <view class="checkin-badge">
            <uni-icons type="checkbox-filled" size="16" color="#006d32" />
            <text class="checkin-text">打卡总数: {{ totalCheckins }}</text>
          </view>
        </view>
        <view class="medal-icon">
          <uni-icons type="medal" size="32" color="#ffffff" />
        </view>
        <view class="decorative-circle" />
      </view>

      <!-- Geographic Footprint -->
      <view class="footprint-card" @click="viewFootprint">
        <view class="footprint-icon">
          <uni-icons type="map" size="24" color="#006860" />
        </view>
        <view class="footprint-info">
          <text class="footprint-title">探索足迹</text>
          <text class="footprint-desc">已点亮 {{ cities }} 个城市 · {{ districts }} 个商圈</text>
        </view>
        <view class="footprint-avatars">
          <view v-for="i in Math.min(cities, 3)" :key="i" class="avatar-small">
            <uni-icons type="location" size="16" color="#006860" />
          </view>
        </view>
        <uni-icons type="right" size="20" color="#6d7a77" />
      </view>

      <!-- Milestone Banner -->
      <view class="milestone-banner" @click="viewMilestone">
        <view class="milestone-content">
          <text class="milestone-label">即将达成</text>
          <text class="milestone-title">{{ nextMilestone.title }}</text>
        </view>
        <uni-icons type="right" size="32" color="rgba(255,255,255,0.5)" />
        <view class="milestone-bg" />
      </view>

      <!-- Medal Categories -->
      <view class="categories-section">
        <view
          v-for="category in categories"
          :key="category.id"
          class="category-section"
        >
          <view class="category-header">
            <view class="category-info">
              <text class="category-title">{{ category.title }}</text>
              <text class="category-desc">{{ category.description }}</text>
            </view>
            <text class="category-progress">已解锁 {{ category.unlocked }}/{{ category.total }}</text>
          </view>

          <view class="medals-grid">
            <view
              v-for="medal in category.medals"
              :key="medal.id"
              class="medal-item"
              :class="{ locked: !medal.unlocked }"
              @click="viewMedal(medal)"
            >
              <view
                class="medal-icon-wrapper"
                :class="{ unlocked: medal.unlocked }"
              >
                <uni-icons :type="medal.icon" size="28" :color="medal.unlocked ? '#ffffff' : '#6d7a77'" />
                <view v-if="!medal.unlocked && medal.progress" class="progress-overlay" :style="{ height: medal.progress + '%' }" />
              </view>
              <text class="medal-name">{{ medal.name }}</text>
              <view v-if="!medal.unlocked && medal.progress" class="progress-bar">
                <view class="progress-fill" :style="{ width: medal.progress + '%' }" />
              </view>
              <view v-if="!medal.unlocked && medal.current" class="current-badge">
                <text class="current-text">{{ medal.current }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- Bottom Spacing -->
      <view class="bottom-spacing" />
    </scroll-view>

    <!-- Medal Detail Modal -->
    <view v-if="showModal" class="modal-overlay" @click="closeModal">
      <view class="modal-content" @click.stop>
        <view class="modal-medal-icon" :class="{ unlocked: selectedMedal?.unlocked }">
          <uni-icons :type="selectedMedal?.icon" size="48" :color="selectedMedal?.unlocked ? '#ffffff' : '#6d7a77'" />
        </view>
        <text class="modal-medal-name">{{ selectedMedal?.name }}</text>

        <view class="modal-info-section">
          <view class="modal-info-item">
            <text class="modal-info-label">解锁条件</text>
            <text class="modal-info-value">{{ selectedMedal?.condition || '暂无' }}</text>
          </view>
          <view v-if="selectedMedal?.unlocked && selectedMedal?.unlockedAt" class="modal-info-item">
            <text class="modal-info-label">获得时间</text>
            <text class="modal-info-value">{{ selectedMedal?.unlockedAt }}</text>
          </view>
          <view v-if="!selectedMedal?.unlocked && selectedMedal?.current" class="modal-info-item">
            <text class="modal-info-label">当前进度</text>
            <text class="modal-info-value">{{ selectedMedal?.current }}</text>
          </view>
        </view>

        <button class="modal-close-btn" @click="closeModal">
          {{ selectedMedal?.unlocked ? '关闭' : '继续加油' }}
        </button>
      </view>
    </view>

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
import { ref, onMounted } from 'vue'
import { getMedalList } from '@/utils/food-diary/api.js'

const totalMedals = ref(0)
const totalCheckins = ref(0)
const cities = ref(0)
const districts = ref(0)

const nextMilestone = ref({
  title: '加载中...'
})

const categories = ref([])

const showModal = ref(false)
const selectedMedal = ref(null)

// 加载勋章数据
const loadMedalData = async () => {
  try {
    const result = await getMedalList()
    if (result) {
      totalMedals.value = result.totalMedals || 0
      totalCheckins.value = result.totalCheckins || 0
      cities.value = result.cities || 0
      districts.value = result.districts || 0
      nextMilestone.value = result.nextMilestone || { title: '暂无即将达成的勋章' }
      categories.value = result.categories || []
    }
  } catch (error) {
    console.error('加载勋章数据失败:', error)
    // 使用默认数据
    setDefaultData()
  }
}

// 默认数据
const setDefaultData = () => {
  totalMedals.value = 8
  totalCheckins.value = 125
  cities.value = 5
  districts.value = 3
  nextMilestone.value = {
    title: '再打卡 2 次即可获得 \'抹茶大师\''
  }
  categories.value = [
    {
      id: 'coffee',
      title: '咖啡达人',
      description: '探索深度咖啡文化',
      unlocked: 3,
      total: 6,
      medals: [
        { id: 1, name: '浓缩之魂', icon: 'hand-up', unlocked: true, condition: '打卡 10 杯浓缩咖啡', unlockedAt: '2024-06-15 14:30' },
        { id: 2, name: '拉花艺术', icon: 'fire', unlocked: true, condition: '打卡 5 杯拿铁', unlockedAt: '2024-06-10 09:15' },
        { id: 3, name: '手冲职人', icon: 'paperplane', unlocked: false, progress: 60, condition: '打卡 10 杯手冲咖啡', current: '6/10' },
        { id: 4, name: '美式狂热', icon: 'plus', unlocked: false, progress: 30, condition: '打卡 20 杯美式咖啡', current: '6/20' },
        { id: 5, name: '冰滴时光', icon: 'spinner-cycle', unlocked: false, progress: 0, condition: '打卡 5 杯冰滴咖啡', current: '0/5' },
        { id: 6, name: '摩卡爱好者', icon: 'heart', unlocked: true, condition: '打卡 8 杯摩卡', unlockedAt: '2024-06-18 16:45' }
      ]
    },
    {
      id: 'explore',
      title: '探店先锋',
      description: '城市角落的寻宝者',
      unlocked: 2,
      total: 6,
      medals: [
        { id: 7, name: '初试啼声', icon: 'compass', unlocked: true, condition: '打卡第 1 家店铺', unlockedAt: '2024-05-01 10:00' },
        { id: 8, name: '十店达人', icon: 'shop', unlocked: true, condition: '打卡 10 家不同店铺', unlockedAt: '2024-06-05 15:20' },
        { id: 9, name: '百店达人', icon: 'flag', unlocked: false, current: '12/100', condition: '打卡 100 家不同店铺' },
        { id: 10, name: '深夜食堂', icon: 'moon', unlocked: false, current: '8/10', condition: '在 22:00 后打卡 10 次' },
        { id: 11, name: '早鸟先锋', icon: 'sun', unlocked: false, current: '3/5', condition: '在 8:00 前打卡 5 次' },
        { id: 12, name: '周末战士', icon: 'calendar', unlocked: false, current: '4/20', condition: '周末打卡 20 次' }
      ]
    },
    {
      id: 'early',
      title: '早起鸟',
      description: '清晨的第一杯能量',
      unlocked: 1,
      total: 3,
      medals: [
        { id: 13, name: '晨光伴影', icon: 'sun', unlocked: true, condition: '连续 3 天在 8:00 前打卡', unlockedAt: '2024-06-12 07:45' },
        { id: 14, name: '早起冠军', icon: 'alarm', unlocked: false, current: '5/7', condition: '连续 7 天在 8:00 前打卡' },
        { id: 15, name: '元气觉醒', icon: 'pulse', unlocked: false, current: '0/30', condition: '累计 30 天在 8:00 前打卡' }
      ]
    }
  ]
}

const goBack = () => {
  uni.navigateBack()
}

const showHelp = () => {
  uni.showModal({
    title: '勋章说明',
    content: '通过打卡饮品记录获得勋章，解锁更多成就！不同的打卡行为会触发不同的勋章获取条件。',
    showCancel: false,
    confirmText: '知道了'
  })
}

const viewFootprint = () => {
  uni.showToast({
    title: '探索足迹功能开发中',
    icon: 'none'
  })
}

const viewMilestone = () => {
  if (nextMilestone.value.medalId) {
    // 找到对应勋章并显示详情
    for (const category of categories.value) {
      const medal = category.medals.find(m => m.id === nextMilestone.value.medalId)
      if (medal) {
        viewMedal(medal)
        return
      }
    }
  }
  uni.showToast({
    title: nextMilestone.value.title,
    icon: 'none'
  })
}

const viewMedal = (medal) => {
  selectedMedal.value = medal
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedMedal.value = null
}

const switchTab = (tab) => {
  const routes = {
    home: '/pages/index/index',
    stats: '/pages/monthly/index',
    profile: '/pages/profile/index'
  }
  uni.switchTab({ url: routes[tab] })
}

onMounted(() => {
  loadMedalData()
})
</script>

<style lang="scss" scoped>
@use '@/styles/theme.scss' as *;

.medals-page {
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

// Main Content
.main-content {
  padding-top: 104px;
  padding-left: 20px;
  padding-right: 20px;
  height: calc(100vh - 88px - 98px);
}

// Stats Card
.stats-card {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: $surface-container-lowest;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 10px 30px -5px rgba(0, 104, 96, 0.15);
  overflow: hidden;
  margin-bottom: 24px;
}

.stats-info {
  position: relative;
  z-index: 1;
}

.stats-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 8px;
}

.stats-value {
  font-size: 36px;
  font-weight: $font-weight-bold;
  color: $primary;
}

.stats-label {
  font-size: 13px;
  font-weight: $font-weight-semibold;
  color: $outline;
}

.checkin-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(77, 254, 138, 0.2);
  padding: 4px 12px;
  border-radius: 9999px;
  width: fit-content;
}

.checkin-text {
  font-size: 13px;
  font-weight: $font-weight-bold;
  color: $secondary;
}

.medal-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: $primary-gradient;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(0, 104, 96, 0.25);
  position: relative;
  z-index: 1;
}

.decorative-circle {
  position: absolute;
  right: -40px;
  bottom: -40px;
  width: 160px;
  height: 160px;
  background: rgba(0, 104, 96, 0.05);
  border-radius: 50%;
}

// Footprint Card
.footprint-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: $surface-container-lowest;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 10px 30px -5px rgba(0, 104, 96, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.4);
  margin-bottom: 24px;
  transition: transform $duration-fast $ease-out;

  &:active {
    transform: scale(0.98);
  }
}

.footprint-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(0, 104, 96, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.footprint-info {
  flex: 1;
}

.footprint-title {
  font-size: 16px;
  font-weight: $font-weight-bold;
  color: $on-surface;
  display: block;
}

.footprint-desc {
  font-size: 13px;
  font-weight: $font-weight-semibold;
  color: $outline;
}

.footprint-avatars {
  display: flex;
  margin-right: 8px;
}

.avatar-small {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid $surface-container-lowest;
  overflow: hidden;
  background: rgba(0, 104, 96, 0.1);
  margin-left: -8px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:first-child {
    margin-left: 0;
  }
}

// Milestone Banner
.milestone-banner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background: $primary-gradient;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 32px;
  box-shadow: 0 4px 16px rgba(0, 104, 96, 0.2);
  transition: transform $duration-fast $ease-out;

  &:active {
    transform: scale(0.98);
  }
}

.milestone-content {
  z-index: 1;
}

.milestone-label {
  font-size: 13px;
  font-weight: $font-weight-medium;
  color: rgba(255, 255, 255, 0.9);
  display: block;
}

.milestone-title {
  font-size: 18px;
  font-weight: $font-weight-bold;
  color: $on-primary;
}

.milestone-bg {
  position: absolute;
  top: 0;
  right: 0;
  width: 128px;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  transform: skewX(-12deg) translateX(32px);
}

// Categories Section
.categories-section {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.category-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 8px;
}

.category-title {
  font-size: 24px;
  font-weight: $font-weight-bold;
  color: $on-surface;
}

.category-desc {
  font-size: 13px;
  font-weight: $font-weight-semibold;
  color: $outline;
  display: block;
  margin-top: 4px;
}

.category-progress {
  font-size: 13px;
  font-weight: $font-weight-bold;
  color: $primary;
}

// Medals Grid
.medals-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.medal-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  transition: transform $duration-fast $ease-out;

  &:active {
    transform: scale(0.95);
  }

  &.locked {
    opacity: 0.7;
  }
}

.medal-icon-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  &.unlocked {
    background: $primary-gradient;
    box-shadow: 0 8px 20px rgba(0, 104, 96, 0.25);
  }

  &:not(.unlocked) {
    background: $surface-container;
    border: 2px dashed $outline-variant;
  }
}

.progress-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 104, 96, 0.2);
}

.medal-name {
  font-size: 13px;
  font-weight: $font-weight-bold;
  color: $on-surface;
  text-align: center;
}

.medal-item.locked .medal-name {
  font-weight: $font-weight-medium;
  color: $outline;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: $surface-container;
  border-radius: 2px;
  overflow: hidden;
  margin-top: 4px;
}

.progress-fill {
  height: 100%;
  background: $primary;
  border-radius: 2px;
}

.current-badge {
  padding: 2px 8px;
  background: $surface-container-high;
  border-radius: 9999px;
}

.current-text {
  font-size: 10px;
  font-weight: $font-weight-bold;
  color: $on-surface;
}

// Modal Overlay
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  animation: fadeIn 0.2s ease-out;
}

.modal-content {
  width: 80%;
  max-width: 320px;
  background: $surface-container-lowest;
  border-radius: 24px;
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: slideUp 0.3s ease-out;
}

.modal-medal-icon {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;

  &.unlocked {
    background: $primary-gradient;
    box-shadow: 0 8px 24px rgba(0, 104, 96, 0.3);
  }

  &:not(.unlocked) {
    background: $surface-container;
    border: 3px dashed $outline-variant;
  }
}

.modal-medal-name {
  font-size: 24px;
  font-weight: $font-weight-bold;
  color: $on-surface;
  margin-bottom: 24px;
}

.modal-info-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.modal-info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.modal-info-label {
  font-size: 12px;
  font-weight: $font-weight-medium;
  color: $outline;
}

.modal-info-value {
  font-size: 14px;
  font-weight: $font-weight-semibold;
  color: $on-surface;
}

.modal-close-btn {
  width: 100%;
  height: 48px;
  background: $primary-gradient;
  border-radius: 24px;
  border: none;
  font-size: 16px;
  font-weight: $font-weight-bold;
  color: $on-primary;

  &:active {
    opacity: 0.9;
  }
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
  box-shadow: 0 -4px 20px rgba(0, 104, 96, 0.08);
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

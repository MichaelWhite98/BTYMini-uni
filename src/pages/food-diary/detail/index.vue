<template>
  <view class="food-diary-detail">
    <view class="page-grain" />

    <view class="sheet-top">
      <view class="circle-btn close" @tap="goBack">×</view>
      <text class="page-title">{{ dateTitle }}</text>
      <view class="circle-btn save" @tap="addRecord">+</view>
    </view>

    <scroll-view scroll-y class="content-area">
      <view class="date-hero">
        <text class="hero-label">饮品记录</text>
        <text class="hero-title">{{ records.length }} 杯</text>
        <text class="hero-subtitle">{{ date }}</text>
      </view>

      <view v-if="records.length" class="record-list">
        <DrinkRecordCard
          v-for="record in records"
          :key="record.id"
          :record="record"
          @edit="editRecord"
          @delete="removeRecord"
        />
      </view>

      <view v-else class="empty-state">
        <view class="empty-cup">
          <text class="cup-lid" />
          <text class="cup-body" />
        </view>
        <text class="empty-title">今天还没有记录</text>
        <text class="empty-text">点右上角加号，记录第一杯饮品</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import DrinkRecordCard from '@/components/food-diary/DrinkRecordCard.vue'
import { deleteRecord, getRecordsByDate, getToday } from '@/utils/food-diary/index.js'
import { formatChineseDay } from '@/utils/food-diary/date.js'

const date = ref(getToday())
const records = ref([])

const loadRecords = (targetDate) => {
  date.value = targetDate
  records.value = getRecordsByDate(targetDate)
}

const dateTitle = computed(() => formatChineseDay(new Date(date.value)))

onLoad((query = {}) => {
  const queryDate = query.date ? String(query.date) : getToday()
  loadRecords(queryDate)
})

onShow(() => {
  loadRecords(date.value)
})

const goBack = () => uni.navigateBack()
const addRecord = () => uni.navigateTo({ url: `/pages/food-diary/add/index?date=${date.value}` })
const editRecord = (record) => {
  uni.navigateTo({ url: `/pages/food-diary/add/index?date=${date.value}&id=${record.id}` })
}

const removeRecord = (record) => {
  uni.showModal({
    title: '删除记录',
    content: '确定删除这杯饮品记录吗？',
    confirmColor: '#cf9148',
    success: ({ confirm }) => {
      if (!confirm) return
      deleteRecord(record.id)
      loadRecords(date.value)
      uni.showToast({ title: '已删除', icon: 'success' })
    }
  })
}
</script>

<style lang="scss" scoped>
.food-diary-detail {
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
    radial-gradient(circle at 50% 16%, rgba(255, 255, 255, 0.9), transparent 20%),
    radial-gradient(circle at 80% 36%, rgba(218, 204, 185, 0.12), transparent 25%),
    linear-gradient(135deg, rgba(116, 91, 62, 0.035) 0 25%, transparent 25% 50%, rgba(116, 91, 62, 0.025) 50% 75%, transparent 75%);
  background-size: auto, auto, 18rpx 18rpx;
}

.sheet-top {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 30;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 0 28rpx 14rpx;
  background: rgba(250, 247, 240, 0.86);
  backdrop-filter: blur(14rpx);
}

.page-title {
  font-size: 40rpx;
  font-weight: 800;
  margin-bottom: 6rpx;
}

.circle-btn {
  width: 68rpx;
  height: 68rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.55);
  border: 4rpx solid rgba(255, 255, 255, 0.82);
  color: #8f827d;
  box-shadow: 0 10rpx 24rpx rgba(92, 73, 52, 0.08);
  font-size: 40rpx;

  &.save {
    color: var(--accent);
  }
}

.content-area {
  position: relative;
  z-index: 1;
  height: 100vh;
  box-sizing: border-box;
  padding: 150rpx 28rpx 80rpx;
}

.date-hero {
  min-height: 210rpx;
  padding: 34rpx 40rpx;
  margin-bottom: 30rpx;
  border-radius: 38rpx;
  background: var(--card);
  box-shadow: 0 18rpx 52rpx rgba(66, 48, 32, 0.07);
  border: 2rpx solid rgba(216, 207, 196, 0.42);
}

.hero-label {
  display: block;
  font-size: 30rpx;
  font-weight: 800;
  color: #8c817d;
}

.hero-title {
  display: block;
  margin-top: 22rpx;
  font-size: 64rpx;
  line-height: 0.9;
  font-weight: 900;
}

.hero-subtitle {
  display: block;
  margin-top: 18rpx;
  font-size: 28rpx;
  color: var(--muted);
}

.record-list {
  padding-bottom: 40rpx;
}

.empty-state {
  min-height: 520rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.empty-cup {
  position: relative;
  width: 120rpx;
  height: 160rpx;
  margin-bottom: 30rpx;
}

.cup-lid {
  position: absolute;
  top: 0;
  left: 16rpx;
  width: 88rpx;
  height: 24rpx;
  border-radius: 50%;
  background: #dfe9ea;
  border: 7rpx solid #fff;
}

.cup-body {
  position: absolute;
  top: 26rpx;
  left: 28rpx;
  width: 64rpx;
  height: 116rpx;
  border-radius: 14rpx 14rpx 28rpx 28rpx;
  background: linear-gradient(180deg, #a94f28, #3e1d1a);
  border: 8rpx solid #fff;
  box-shadow: 0 18rpx 34rpx rgba(74, 42, 24, 0.12);
}

.empty-title {
  font-size: 34rpx;
  font-weight: 800;
}

.empty-text {
  margin-top: 12rpx;
  font-size: 26rpx;
  color: var(--muted);
}
</style>

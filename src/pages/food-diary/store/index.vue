<template>
  <view class="food-diary-store">
    <view class="page-grain" />

    <view class="sheet-top">
      <view class="circle-btn close" @tap="goBack">×</view>
      <text class="page-title">选择店铺</text>
      <view class="circle-btn save">✓</view>
    </view>

    <scroll-view scroll-y class="content-area">
      <view class="search-box">
        <text class="search-icon">⌕</text>
        <input v-model="keyword" class="search-input" placeholder="搜索或输入店铺名..." />
      </view>

      <text class="section-label">上次的店</text>
      <view class="last-store" @tap="chooseStore(LAST_STORE)">
        <view class="store-copy">
          <text class="store-name">{{ LAST_STORE.name }}</text>
          <text class="store-address">{{ LAST_STORE.address }}</text>
        </view>
        <text class="visit-pill">{{ LAST_STORE.visits }}</text>
      </view>

      <text class="section-label nearby">附近</text>
      <view class="store-panel">
        <view v-for="store in filteredStores" :key="store.name" class="store-item" @tap="chooseStore(store)">
          <view class="store-copy">
            <text class="store-name">{{ store.name }}</text>
            <text class="store-address">{{ store.address }}</text>
          </view>
          <text v-if="store.distance" class="store-distance">{{ store.distance }}</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { STORE_LIST, DEFAULT_STORE } from '@/constants/food-diary.js'

const LAST_STORE = {
  ...DEFAULT_STORE,
  visits: '5×'
}

const keyword = ref('')
const sourceDate = ref('')
const sourceId = ref('')

onLoad((query = {}) => {
  sourceDate.value = query.date ? String(query.date) : ''
  sourceId.value = query.id ? String(query.id) : ''
})

const filteredStores = computed(() => {
  const value = keyword.value.trim()
  if (!value) return STORE_LIST
  return STORE_LIST.filter((store) => store.name.includes(value) || store.address.includes(value))
})

const goBack = () => uni.navigateBack()

const chooseStore = (store) => {
  const params = [
    `storeName=${encodeURIComponent(store.name)}`,
    `storeAddress=${encodeURIComponent(store.address)}`,
    `city=${encodeURIComponent(store.city || '深圳市')}`
  ]
  if (sourceDate.value) params.push(`date=${sourceDate.value}`)
  if (sourceId.value) params.push(`id=${sourceId.value}`)
  const url = `/pages/food-diary/add/index?${params.join('&')}`
  uni.redirectTo({ url })
}
</script>

<style lang="scss" scoped>
.food-diary-store {
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
    radial-gradient(circle at 20% 14%, rgba(255, 255, 255, 0.92), transparent 18%),
    radial-gradient(circle at 78% 32%, rgba(218, 204, 185, 0.12), transparent 24%),
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

.search-box {
  height: 92rpx;
  display: flex;
  align-items: center;
  padding: 0 30rpx;
  margin-bottom: 44rpx;
  border-radius: 50rpx;
  background: rgba(255, 255, 255, 0.76);
  border: 3rpx solid rgba(232, 226, 217, 0.8);
  color: #8d827d;
}

.search-icon {
  font-size: 38rpx;
  margin-right: 18rpx;
}

.search-input {
  flex: 1;
  height: 82rpx;
  font-size: 28rpx;
}

.section-label {
  display: block;
  margin: 0 12rpx 20rpx;
  font-size: 28rpx;
  font-weight: 700;
  color: #8c817d;

  &.nearby {
    margin-top: 40rpx;
  }
}

.last-store,
.store-panel {
  background: var(--card);
  border-radius: 34rpx;
  box-shadow: 0 16rpx 46rpx rgba(66, 48, 32, 0.06);
  border: 2rpx solid rgba(216, 207, 196, 0.42);
}

.last-store {
  min-height: 138rpx;
  display: flex;
  align-items: center;
  padding: 26rpx 28rpx;
}

.store-copy {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.store-name {
  font-size: 32rpx;
  font-weight: 800;
}

.store-address {
  margin-top: 10rpx;
  font-size: 25rpx;
  color: var(--muted);
  line-height: 1.35;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.visit-pill {
  margin-left: 22rpx;
  padding: 14rpx 18rpx;
  border-radius: 26rpx;
  background: #f7efe6;
  color: var(--accent);
  font-size: 26rpx;
  font-weight: 800;
}

.store-panel {
  padding: 26rpx 28rpx;
}

.store-item {
  min-height: 108rpx;
  display: flex;
  align-items: center;
  padding: 12rpx 0;

  & + .store-item {
    margin-top: 12rpx;
  }
}

.store-distance {
  margin-left: 18rpx;
  font-size: 27rpx;
  color: #8f8580;
}
</style>

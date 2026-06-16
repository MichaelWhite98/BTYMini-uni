<template>
  <view class="store-page">
    <!-- 顶部导航栏 -->
    <header class="app-header">
      <button class="nav-btn" @tap="handleClose">
        <uni-icons type="close" size="20"></uni-icons>
      </button>
      <text class="page-title">选择店铺</text>
      <button class="nav-btn save" @tap="handleConfirm">
        <uni-icons type="checkmarkempty" size="20"></uni-icons>
      </button>
    </header>

    <!-- 主内容 -->
    <scroll-view scroll-y class="main-content">
      <!-- 搜索栏 -->
      <view class="search-bar">
        <view class="search-icon">
          <uni-icons type="search" size="20"></uni-icons>
        </view>
        <input
          v-model="keyword"
          class="search-input"
          placeholder="搜索或输入店名..."
          placeholder-class="search-placeholder"
        />
      </view>

      <!-- 上次到访 -->
      <view class="section">
        <text class="section-label">上次到访</text>
        <view class="last-store-card" @tap="selectStore(lastVisitedStore)">
          <view class="store-info">
            <text class="store-name">{{ lastVisitedStore.name }}</text>
            <text class="store-address">{{ lastVisitedStore.address }}</text>
          </view>
          <view class="visit-badge">
            <text class="visit-count">{{ lastVisitedStore.visits }}次</text>
          </view>
        </view>
      </view>

      <!-- 附近门店 -->
      <view class="section">
        <text class="section-label">附近门店</text>
        <view class="store-list-card">
          <view
            v-for="(store, index) in filteredStores"
            :key="store.name"
            class="store-item"
            :class="{ selected: selectedStore && selectedStore.name === store.name }"
            @tap="selectStore(store)"
          >
            <view class="store-item-info">
              <text class="store-item-name">{{ store.name }}</text>
              <text class="store-item-address">{{ store.address }}</text>
            </view>
            <text class="store-distance">{{ store.distance }}</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { STORE_LIST, DEFAULT_STORE } from '@/constants/food-diary.js'

// 状态
const keyword = ref('')
const selectedStore = ref(null)
const sourceDate = ref('')
const sourceId = ref('')

// 上次到访的店铺
const lastVisitedStore = ref({
  ...DEFAULT_STORE,
  visits: 5
})

// 过滤后的店铺列表
const filteredStores = computed(() => {
  const value = keyword.value.trim()
  if (!value) return STORE_LIST
  return STORE_LIST.filter((store) =>
    store.name.includes(value) || store.address.includes(value)
  )
})

onLoad((query = {}) => {
  sourceDate.value = query.date ? String(query.date) : ''
  sourceId.value = query.id ? String(query.id) : ''
})

// 选择店铺
const selectStore = (store) => {
  selectedStore.value = store
}

// 确认选择
const handleConfirm = () => {
  if (!selectedStore.value) {
    uni.showToast({ title: '请选择店铺', icon: 'none' })
    return
  }

  const store = selectedStore.value
  const params = [
    `storeName=${encodeURIComponent(store.name)}`,
    `storeAddress=${encodeURIComponent(store.address)}`,
    `city=${encodeURIComponent(store.city || '深圳市')}`
  ]
  if (sourceDate.value) params.push(`date=${sourceDate.value}`)
  if (sourceId.value) params.push(`id=${sourceId.value}`)

  const url = `/pages/food-diary/detail/index?${params.join('&')}`
  uni.redirectTo({ url })
}

// 关闭
const handleClose = () => {
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
@use '@/styles/theme.scss' as *;

.store-page {
  min-height: 100vh;
  background: var(--background);
  padding-bottom: 24px;
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
  background: rgba(250, 250, 250, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
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
  background: var(--surface-container-low);
  border-radius: 50%;
  color: var(--on-surface-variant);
  border: none;
  padding: 0;
  margin: 0;
  transition: all 0.3s cubic-bezier(0.32, 0.72, 0, 1);
  overflow: hidden;
  box-sizing: border-box;

  &:active {
    transform: scale(0.9);
  }

  &.save {
    background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
    color: white;
    box-shadow: $shadow-button;
  }

}


.page-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--primary);
}

// 主内容
.main-content {
  padding: 16px $container-padding 80px;
  max-width: 448px;
  margin: 0 auto;
  height: calc(100vh - 64px);
}

// 搜索栏
.search-bar {
  position: relative;
  margin-bottom: 32px;
  animation: slideUp 0.4s cubic-bezier(0.32, 0.72, 0, 1);
}

.search-icon {
  position: absolute;
  left: $spacing-md;
  top: 50%;
  transform: translateY(-50%);
  color: var(--on-surface-variant);
  display: flex;
  align-items: center;
  pointer-events: none;
}

.search-input {
  width: 100%;
  height: 48px;
  padding: 0 $spacing-md 0 48px;
  background: var(--surface-container-low);
  border: 2px solid transparent;
  border-radius: 24px;
  font-size: 14px;
  color: var(--on-surface);
  transition: all 0.3s cubic-bezier(0.32, 0.72, 0, 1);

  &:focus {
    border-color: var(--primary);
    background: var(--surface);
  }
}

.search-placeholder {
  color: var(--on-surface-variant);
}

// 区块
.section {
  margin-bottom: 32px;
  animation: cardEnter 0.5s cubic-bezier(0.32, 0.72, 0, 1);
}

.section-label {
  display: block;
  font-size: 12px;
  font-weight: 700;
  line-height: 16px;
  letter-spacing: 0.05em;
  color: var(--on-surface-variant);
  text-transform: uppercase;
  margin-bottom: $spacing-md;
  padding: 0 4px;
}

// 上次到访卡片
.last-store-card {
  background: var(--surface);
  padding: $spacing-lg;
  border-radius: 24px;
  box-shadow: $shadow-card;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.32, 0.72, 0, 1);
  overflow: hidden;

  &:active {
    transform: scale(0.98);
  }
}

.store-info {
  flex: 1;
  min-width: 0;
}

.store-name {
  display: block;
  font-size: 18px;
  font-weight: 600;
  color: var(--primary);
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.store-address {
  display: block;
  font-size: 14px;
  color: var(--on-surface-variant);
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.visit-badge {
  margin-left: $spacing-md;
  padding: 4px 8px;
  background: var(--primary-container);
  border-radius: 12px;
}

.visit-count {
  font-size: 10px;
  font-weight: 700;
  line-height: 16px;
  color: var(--primary);
}

// 门店列表卡片
.store-list-card {
  background: var(--surface);
  border-radius: 24px;
  box-shadow: $shadow-card;
  overflow: hidden;
}

.store-item {
  padding: $spacing-lg;
  border-bottom: 1px solid var(--surface-container-low);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.32, 0.72, 0, 1);

  &:last-child {
    border-bottom: none;
  }

  &:active {
    background: var(--surface-container-lowest);
    transform: scale(0.99);
  }

  &.selected {
    background: var(--primary-container);

    .store-item-name {
      color: var(--primary);
    }
  }
}

.store-item-info {
  flex: 1;
  min-width: 0;
}

.store-item-name {
  display: block;
  font-size: 18px;
  font-weight: 600;
  color: var(--on-surface);
  margin-bottom: 4px;
  transition: color 0.3s cubic-bezier(0.32, 0.72, 0, 1);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.store-item-address {
  display: block;
  font-size: 14px;
  color: var(--on-surface-variant);
  margin-top: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.store-distance {
  font-size: 12px;
  font-weight: 700;
  color: var(--on-surface-variant);
  margin-left: $spacing-md;
  white-space: nowrap;
}
</style>

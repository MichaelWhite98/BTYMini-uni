<template>
  <view class="detail-page">
    <!-- 顶部导航栏 -->
    <header class="app-header">
      <button class="nav-btn" @tap="handleClose">
        <uni-icons type="close" size="20"></uni-icons>
      </button>
      <text class="page-title">饮品详情</text>
      <button class="nav-btn save" :class="{ disabled: !canSave }" @tap="handleSave">
        <uni-icons type="checkbox" size="20"></uni-icons>
      </button>
    </header>

    <!-- 主内容 -->
    <scroll-view scroll-y class="main-content">
      <!-- 饮品图片 -->
      <view class="drink-hero">
        <view class="drink-image-wrapper">
          <image v-if="heroImage" class="drink-image" :src="heroImage" mode="aspectFit" />
          <view v-else class="drink-placeholder">
            <uni-icons type="fire" size="20"></uni-icons>
          </view>
        </view>
      </view>

      <view v-if="visionSummary" class="vision-summary-card">
        <view class="vision-summary-header">
          <view class="vision-badge">
            <uni-icons type="image" size="16"></uni-icons>
            <text class="vision-badge-text">主体抠图</text>
          </view>
          <text class="vision-score">{{ visionSummary.scoreText }}</text>
        </view>

        <view class="vision-primary">
          <image class="vision-thumb" :src="visionSummary.previewImage" mode="aspectFill" />
          <view class="vision-primary-text">
            <text class="vision-title">{{ visionSummary.title }}</text>
            <text class="vision-subtitle">{{ visionSummary.helperText }}</text>
          </view>
        </view>
      </view>

      <!-- 信息块 -->
      <view class="info-blocks">
        <!-- 日期时间 -->
        <view class="info-card" @tap="handleDatePicker">
          <view class="info-icon">
            <uni-icons type="calendar" size="20"></uni-icons>
          </view>
          <text class="info-text">{{ dateTimeLabel }}</text>
          <uni-icons type="bottom" size="20" class="arrow"></uni-icons>
        </view>

        <!-- 店铺 -->
        <view class="info-card" @tap="handleStoreSelect">
          <view class="info-icon">
            <uni-icons type="shop" size="20"></uni-icons>
          </view>
          <text class="info-text">{{ storeName }}</text>
          <uni-icons type="forward" size="20" class="arrow"></uni-icons>
        </view>

        <!-- 位置 -->
        <view class="info-card">
          <view class="info-icon">
            <uni-icons type="location" size="20"></uni-icons>
          </view>
          <text class="info-text">{{ city }}</text>
        </view>

        <!-- 饮品名称 -->
        <view class="info-card">
          <view class="info-icon">
            <uni-icons type="fire" size="20"></uni-icons>
          </view>
          <input
            v-model="drinkName"
            class="drink-input"
            placeholder="饮品名称..."
            maxlength="40"
          />
          <button class="favorite-btn" :class="{ active: isFavorite }" @tap="toggleFavorite">
            <uni-icons type="star" size="20"></uni-icons>
          </button>
        </view>

        <!-- 备注 -->
        <view class="info-card note-card">
          <view class="note-header">
            <uni-icons type="compose" size="20"></uni-icons>
            <text class="note-label">备注 (可选)</text>
          </view>
          <textarea
            v-model="note"
            class="note-input"
            placeholder="添加备注..."
            maxlength="200"
            auto-height
          />
        </view>
      </view>

      <!-- 删除按钮 -->
      <view v-if="isEdit" class="delete-action">
        <button class="delete-btn" @tap="handleDelete">删除记录</button>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { DEFAULT_STORE } from '@/constants/food-diary.js'
import {
  consumeCutoutDraft,
  formatTime,
  getToday,
  getRecords,
  saveRecord,
  updateRecord,
  deleteRecord
} from '@/utils/food-diary/index.js'

// 状态
const isEdit = ref(false)
const recordId = ref('')
const mode = ref('view') // view, add, edit
const date = ref(getToday())
const time = ref(formatTime(new Date()))
const sourceImage = ref('')
const drinkName = ref('')
const storeName = ref(DEFAULT_STORE.name)
const storeAddress = ref(DEFAULT_STORE.address)
const city = ref(DEFAULT_STORE.city)
const note = ref('')
const isFavorite = ref(false)
const submitting = ref(false)
const vision = ref(null)

// 计算属性
const canSave = computed(() => {
  return sourceImage.value && drinkName.value.trim()
})

const dateTimeLabel = computed(() => {
  const d = new Date(date.value)
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 ${time.value}`
})

const heroImage = computed(() => {
  const selectedItem = vision.value && vision.value.selectedItem
  return (selectedItem && (selectedItem.cutoutUrl || selectedItem.thumbnailUrl)) || sourceImage.value
})

const visionSummary = computed(() => {
  if (!vision.value || !vision.value.selectedItem) return null

  const score = Number(vision.value.selectedItem.score || 0)

  return {
    title: vision.value.selectedItem.displayName || '主体抠图',
    helperText: '已应用主体抠图。接入真实服务后，主体外的区域会保留透明背景。',
    previewImage: (vision.value.selectedItem.thumbnailUrl || vision.value.selectedItem.cutoutUrl || sourceImage.value),
    scoreText: score > 0 ? `主体稳定度 ${Math.round(score * 100)}%` : '已自动分析'
  }
})

const deriveCategory = () => {
  return 'coffee'
}

const applyVisionDraft = (draft) => {
  if (!draft) return
  vision.value = draft
  sourceImage.value = draft.sourceImageUrl || draft.imageUrl || sourceImage.value
}

// 加载记录
const loadRecord = (id) => {
  const records = getRecords()
  const record = records.find((item) => item.id === id)
  if (!record) return

  isEdit.value = true
  recordId.value = id
  date.value = record.date || getToday()
  time.value = record.time || formatTime(new Date())
  sourceImage.value = (record.images && record.images[0]) || ''
  drinkName.value = record.description || ''
  storeName.value = record.storeName || DEFAULT_STORE.name
  storeAddress.value = record.storeAddress || DEFAULT_STORE.address
  city.value = record.city || DEFAULT_STORE.city
  note.value = record.note || ''
  isFavorite.value = !!record.isFavorite
  vision.value = record.vision || null
}

onLoad((query = {}) => {
  if (query.id) {
    loadRecord(query.id)
    mode.value = 'edit'
    return
  }

  if (query.mode === 'add') {
    mode.value = 'add'
    if (query.date) date.value = String(query.date)
    if (query.images) sourceImage.value = decodeURIComponent(String(query.images))
    if (query.visionDraftId) {
      applyVisionDraft(consumeCutoutDraft(String(query.visionDraftId)))
    }
  }
})

// 日期选择
const handleDatePicker = () => {
  uni.showActionSheet({
    itemList: ['选择日期', '选择时间'],
    success: ({ tapIndex }) => {
      if (tapIndex === 0) {
        // 日期选择器
        // uni-app 的 picker 需要在模板中声明
      } else if (tapIndex === 1) {
        // 时间选择器
      }
    }
  })
}

// 店铺选择
const handleStoreSelect = () => {
  const params = [`date=${date.value}`]
  if (recordId.value) params.push(`id=${recordId.value}`)
  uni.navigateTo({ url: `/pages/food-diary/store/index?${params.join('&')}` })
}

// 收藏切换
const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
}

// 保存
const handleSave = () => {
  if (!canSave.value || submitting.value) return

  submitting.value = true

  const payload = {
    date: date.value,
    time: time.value,
    category: deriveCategory(),
    images: [sourceImage.value],
    description: drinkName.value,
    mood: 'good',
    storeName: storeName.value,
    storeAddress: storeAddress.value,
    city: city.value,
    note: note.value,
    isFavorite: isFavorite.value,
    location: {
      name: storeName.value,
      address: storeAddress.value
    },
    vision: vision.value
  }

  try {
    if (isEdit.value && recordId.value) {
      updateRecord(recordId.value, payload)
      uni.showToast({ title: '已保存', icon: 'success' })
    } else {
      saveRecord(payload)
      uni.showToast({ title: '已记录', icon: 'success' })
    }

    setTimeout(() => {
      uni.navigateBack()
    }, 800)
  } catch (error) {
    console.error(error)
    uni.showToast({ title: '保存失败', icon: 'none' })
    submitting.value = false
  }
}

// 关闭
const handleClose = () => {
  uni.navigateBack()
}

// 删除
const handleDelete = () => {
  if (!recordId.value) return

  uni.showModal({
    title: '删除记录',
    content: '您确定要从历史记录中删除这项仪式吗？',
    confirmColor: '#ba1a1a',
    success: ({ confirm }) => {
      if (!confirm) return
      deleteRecord(recordId.value)
      uni.showToast({ title: '记录已删除', icon: 'success' })
      setTimeout(() => uni.navigateBack(), 600)
    }
  })
}
</script>

<style lang="scss" scoped>
@use '@/styles/theme.scss' as *;

.detail-page {
  min-height: 100vh;
  background: var(--background);
  animation: fadeIn 0.3s ease-out;
}

// 顶部导航栏
.app-header {
  position: sticky;
  top: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: space-between;
  // 适配灵动岛：padding-top = 状态栏高度
  padding-top: var(--status-bar-height);
  height: calc(var(--nav-bar-height));
  padding-left: $container-padding;
  padding-right: $container-padding;
  background: rgba(250, 250, 250, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
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
  color: var(--on-surface-variant);
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  transition: all 0.3s cubic-bezier(0.32, 0.72, 0, 1);
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  border-radius: 50%;

  &:active {
    transform: scale(0.9);
    background: var(--surface-container);
  }

  &.save {
    color: var(--primary);

    &.disabled {
      opacity: 0.4;
    }
  }

}


.page-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--primary);
}

// 主内容
.main-content {
  padding: 32px $container-padding 80px;
  height: calc(100vh - 64px);
}

// 饮品图片
.drink-hero {
  display: flex;
  justify-content: center;
  padding: 32px 0 48px;
  animation: slideUp 0.4s cubic-bezier(0.32, 0.72, 0, 1);
}

.drink-image-wrapper {
  position: relative;
  width: 256px;
  height: 256px;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(17, 153, 142, 0.1);
    border-radius: 50%;
    filter: blur(40px);
    z-index: -1;
  }
}

.drink-image {
  width: 192px;
  height: auto;
  max-height: 256px;
  object-fit: contain;
  filter: drop-shadow(0 10px 15px rgba(17, 153, 142, 0.2));
  transform: rotate(-3deg);
}

.drink-placeholder {
  width: 192px;
  height: 192px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface-container);
  border-radius: 24px;

}

// 信息块
.info-blocks {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.info-card {
  background: var(--surface);
  border-radius: 20px;
  padding: $spacing-lg;
  box-shadow: $shadow-card;
  display: flex;
  align-items: center;
  transition: all 0.3s cubic-bezier(0.32, 0.72, 0, 1);
  overflow: hidden;
  animation: cardEnter 0.5s cubic-bezier(0.32, 0.72, 0, 1);

  &:active {
    transform: scale(0.98);
  }
}

.info-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: $spacing-md;
  color: var(--primary);
  flex-shrink: 0;

}

.info-text {
  flex: 1;
  font-size: $font-size-body-lg;
  color: var(--on-surface);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.arrow {
  color: var(--outline);
  font-size: 20px;
}

// 饮品名称输入
.drink-input {
  flex: 1;
  font-size: 18px;
  font-weight: 600;
  color: var(--primary);
  background: transparent;
  border: none;
  padding: 0;
}

.favorite-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--outline);
  padding: 0;
  margin-left: 8px;
  position: relative;
  overflow: hidden;
  border-radius: 50%;
  transition: all 0.3s cubic-bezier(0.32, 0.72, 0, 1);

  &:active {
    transform: scale(0.9);
  }

  &.active {
    color: var(--warning);
  }

}

.vision-summary-card {
  background: var(--surface);
  border-radius: 24px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: $shadow-card;
  animation: cardEnter 0.45s cubic-bezier(0.32, 0.72, 0, 1);
}

.vision-summary-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.vision-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--primary);
  font-size: 13px;
  font-weight: 700;
}

.vision-badge-text {
  color: var(--primary);
}

.vision-score {
  font-size: 12px;
  color: var(--on-surface-variant);
}

.vision-primary {
  display: flex;
  align-items: center;
  gap: 16px;
}

.vision-thumb {
  width: 72px;
  height: 72px;
  border-radius: 18px;
  background: var(--surface-container);
  flex-shrink: 0;
}

.vision-primary-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.vision-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--primary);
}

.vision-subtitle {
  font-size: 14px;
  color: var(--on-surface-variant);
}


// 备注卡片
.note-card {
  flex-direction: column;
  align-items: flex-start;
}

.note-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  color: var(--primary);

}

.note-label {
  font-size: 14px;
  color: var(--on-surface-variant);
}

.note-input {
  width: 100%;
  min-height: 60px;
  margin-top: 8px;
  padding-left: 40px;
  font-size: $font-size-body-lg;
  color: var(--on-surface);
  font-style: italic;
  background: transparent;
  border: none;
}

// 删除按钮
.delete-action {
  display: flex;
  justify-content: center;
  margin-top: 48px;
}

.delete-btn {
  font-size: 14px;
  color: var(--on-surface-variant);
  background: transparent;
  border: none;
  padding: $spacing-md;
  border-radius: $radius-default;
  transition: all 0.3s cubic-bezier(0.32, 0.72, 0, 1);

  &:active {
    color: var(--error);
    transform: scale(0.95);
    background: var(--error-container);
  }
}
</style>

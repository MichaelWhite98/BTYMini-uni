<template>
  <view class="food-diary-add">
    <view class="page-grain" />

    <view class="sheet-top">
      <view class="circle-btn close" @tap="goBack">×</view>
      <text class="page-title">饮品详情</text>
      <view class="circle-btn save" :class="{ disabled: submitting }" @tap="submit">✓</view>
    </view>

    <scroll-view scroll-y class="content-area">
      <view class="image-panel">
        <DrinkImagePicker v-model="images" :max="3" />
      </view>

      <view class="form-list">
        <view class="form-card date-card">
          <text class="form-icon">📅</text>
          <picker mode="date" :value="date" @change="handleDateChange">
            <text class="form-main">{{ dateLabel }} {{ time }}</text>
          </picker>
          <picker mode="time" :value="time" @change="handleTimeChange">
            <text class="form-arrow">⌄</text>
          </picker>
        </view>

        <view class="form-card" @tap="goStore">
          <text class="form-icon">🏠</text>
          <text class="form-main">{{ storeName }}</text>
          <text class="form-arrow">›</text>
        </view>

        <view class="form-card">
          <text class="form-icon">📍</text>
          <text class="form-main">{{ city }}</text>
        </view>

        <view class="form-card">
          <text class="form-icon">☕</text>
          <input
            v-model="description"
            class="drink-input"
            placeholder="饮品名称..."
            maxlength="40"
          />
          <text class="favorite" :class="{ active: isFavorite }" @tap="toggleFavorite">★</text>
        </view>

        <view class="form-card note-card">
          <text class="form-icon">✎</text>
          <input
            v-model="note"
            class="note-input"
            placeholder="备注（可选）..."
            maxlength="80"
          />
        </view>
      </view>

      <text class="category-hint" @tap="pickCategory">{{ categoryLabel }}</text>

      <view v-if="isEdit" class="delete-record" @tap="removeRecord">删除记录</view>
    </scroll-view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import DrinkImagePicker from '@/components/food-diary/DrinkImagePicker.vue'
import { CATEGORY_LIST, DEFAULT_STORE } from '@/constants/food-diary.js'
import {
  formatDate,
  formatTime,
  getToday,
  getRecords,
  saveRecord,
  updateRecord,
  deleteRecord
} from '@/utils/food-diary/index.js'

const isEdit = ref(false)
const recordId = ref('')
const date = ref(getToday())
const time = ref(formatTime(new Date()))
const images = ref([])
const category = ref('coffee')
const description = ref('自制便携美式咖啡 ☕')
const storeName = ref(DEFAULT_STORE.name)
const storeAddress = ref(DEFAULT_STORE.address)
const city = ref(DEFAULT_STORE.city)
const note = ref('')
const isFavorite = ref(false)
const submitting = ref(false)

const categoryLabel = computed(() => {
  const item = CATEGORY_LIST.find((entry) => entry.code === category.value)
  return item ? item.name : '咖啡'
})

const dateLabel = computed(() => {
  const value = new Date(date.value)
  return `${value.getFullYear()}年${value.getMonth() + 1}月${value.getDate()}日`
})

const loadRecord = (id) => {
  const records = getRecords()
  const record = records.find((item) => item.id === id)
  if (!record) return

  isEdit.value = true
  recordId.value = id
  date.value = record.date || getToday()
  time.value = record.time || formatTime(new Date())
  images.value = record.images || []
  category.value = record.category || 'coffee'
  description.value = record.description || ''
  storeName.value = record.storeName || (record.location && record.location.name) || DEFAULT_STORE.name
  storeAddress.value = record.storeAddress || (record.location && record.location.address) || DEFAULT_STORE.address
  city.value = record.city || DEFAULT_STORE.city
  note.value = record.note || ''
  isFavorite.value = !!record.isFavorite
}

onLoad((query = {}) => {
  if (query.id) {
    loadRecord(query.id)
    return
  }

  if (query.date) {
    date.value = String(query.date)
  }

  if (query.storeName) storeName.value = decodeURIComponent(String(query.storeName))
  if (query.storeAddress) storeAddress.value = decodeURIComponent(String(query.storeAddress))
  if (query.city) city.value = decodeURIComponent(String(query.city))
})

const goBack = () => uni.navigateBack()
const goStore = () => {
  const params = [`date=${date.value}`]
  if (recordId.value) params.push(`id=${recordId.value}`)
  uni.navigateTo({ url: `/pages/food-diary/store/index?${params.join('&')}` })
}
const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
}

const pickCategory = () => {
  uni.showActionSheet({
    itemList: CATEGORY_LIST.map((item) => item.name),
    itemColor: '#3d2725',
    success: ({ tapIndex }) => {
      const item = CATEGORY_LIST[tapIndex]
      if (item) category.value = item.code
    }
  })
}

const handleDateChange = (event) => {
  date.value = event.detail.value
}

const handleTimeChange = (event) => {
  time.value = event.detail.value
}

const submit = () => {
  if (submitting.value) return

  if (!images.value.length) {
    uni.showToast({ title: '请先添加饮品照片', icon: 'none' })
    return
  }

  if (!description.value.trim()) {
    uni.showToast({ title: '请输入饮品名称', icon: 'none' })
    return
  }

  submitting.value = true

  const payload = {
    date: date.value,
    time: time.value,
    category: category.value,
    images: images.value,
    description: description.value,
    mood: 'good',
    storeName: storeName.value,
    storeAddress: storeAddress.value,
    city: city.value,
    note: note.value,
    isFavorite: isFavorite.value,
    location: {
      name: storeName.value,
      address: storeAddress.value
    }
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

const removeRecord = () => {
  if (!recordId.value) return

  uni.showModal({
    title: '删除记录',
    content: '确定删除这杯饮品记录吗？',
    confirmColor: '#cf9148',
    success: ({ confirm }) => {
      if (!confirm) return
      deleteRecord(recordId.value)
      uni.showToast({ title: '已删除', icon: 'success' })
      setTimeout(() => uni.navigateBack(), 600)
    }
  })
}
</script>

<style lang="scss" scoped>
.food-diary-add {
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
    radial-gradient(circle at 52% 12%, rgba(255, 255, 255, 0.9), transparent 18%),
    radial-gradient(circle at 70% 38%, rgba(218, 204, 185, 0.12), transparent 25%),
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

  &.disabled {
    color: #c8c2be;
  }
}

.content-area {
  position: relative;
  z-index: 1;
  height: 100vh;
  box-sizing: border-box;
  padding: 150rpx 28rpx 80rpx;
}

.image-panel {
  min-height: 360rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 22rpx;
}

.form-list {
  display: flex;
  flex-direction: column;
  gap: 26rpx;
}

.form-card {
  min-height: 126rpx;
  display: flex;
  align-items: center;
  padding: 0 34rpx;
  border-radius: 34rpx;
  background: var(--card);
  box-shadow: 0 14rpx 40rpx rgba(66, 48, 32, 0.06);
  border: 2rpx solid rgba(216, 207, 196, 0.45);
}

.date-card {
  min-height: 136rpx;
}

.form-icon {
  width: 52rpx;
  margin-right: 24rpx;
  color: var(--accent);
  font-size: 40rpx;
  flex: 0 0 52rpx;
}

.form-main {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 32rpx;
  font-weight: 700;
}

.form-arrow {
  margin-left: 18rpx;
  color: #c5beb9;
  font-size: 38rpx;
}

.drink-input,
.note-input {
  flex: 1;
  height: 96rpx;
  font-size: 32rpx;
  font-weight: 700;
  color: var(--ink);
}

.note-input {
  color: #867b76;
  font-weight: 500;
}

.favorite {
  margin-left: 20rpx;
  color: #c6c0bc;
  font-size: 46rpx;

  &.active {
    color: var(--accent);
  }
}

.note-card {
  min-height: 126rpx;
}

.category-hint {
  display: block;
  text-align: center;
  margin-top: 24rpx;
  font-size: 24rpx;
  color: var(--muted);
}

.delete-record {
  display: flex;
  justify-content: center;
  padding: 58rpx 0 90rpx;
  font-size: 28rpx;
  color: #9d928e;
}
</style>

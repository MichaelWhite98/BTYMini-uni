<template>
  <view class="drink-record-card">
    <view class="drink-cover" @tap="handlePreview">
      <image v-if="cover" class="cover-image" :src="cover" mode="aspectFill" />
      <view v-else class="cover-cup">
        <text class="cup-lid" />
        <text class="cup-body" />
      </view>
    </view>

    <view class="record-main" @tap="$emit('edit', record)">
      <view class="record-title-row">
        <text class="category-icon">{{ categoryIcon }}</text>
        <text class="record-title">{{ record.description || '未命名饮品' }}</text>
        <text v-if="record.isFavorite" class="favorite">★</text>
      </view>
      <text class="record-meta">{{ record.time || '' }} · {{ categoryName }} · {{ moodIcon }}</text>
      <text class="record-store">{{ storeName }}</text>
      <text class="record-city">{{ record.city || '深圳市' }}</text>
    </view>

    <view class="record-actions">
      <view class="action-dot" @tap="$emit('edit', record)">›</view>
      <view class="delete-link" @tap.stop="$emit('delete', record)">删除</view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { CATEGORY_LIST, MOOD_LIST } from '@/constants/food-diary.js'
import { previewImage } from '@/utils/food-diary/index.js'

const props = defineProps({
  record: {
    type: Object,
    required: true
  }
})

defineEmits(['edit', 'delete'])

const cover = computed(() => {
  const images = props.record.images || []
  return images[0] || ''
})

const category = computed(() => {
  return CATEGORY_LIST.find((item) => item.code === props.record.category) || CATEGORY_LIST[0]
})

const mood = computed(() => {
  return MOOD_LIST.find((item) => item.code === props.record.mood) || MOOD_LIST[1]
})

const categoryIcon = computed(() => category.value.icon)
const categoryName = computed(() => category.value.name)
const moodIcon = computed(() => mood.value.icon)

const storeName = computed(() => {
  return props.record.storeName || (props.record.location && props.record.location.name) || '未选择店铺'
})

const handlePreview = () => {
  if (!props.record.images || !props.record.images.length) return
  previewImage(props.record.images, 0)
}
</script>

<style lang="scss" scoped>
.drink-record-card {
  display: flex;
  align-items: center;
  min-height: 188rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  border-radius: 34rpx;
  background: var(--card);
  border: 2rpx solid rgba(216, 207, 196, 0.42);
  box-shadow: 0 16rpx 46rpx rgba(66, 48, 32, 0.06);
}

.drink-cover {
  width: 132rpx;
  height: 142rpx;
  flex: 0 0 132rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
}

.cover-image {
  width: 122rpx;
  height: 136rpx;
  border-radius: 24rpx;
  border: 6rpx solid #fff;
  background: #eeeae4;
  box-shadow: 0 10rpx 24rpx rgba(68, 45, 28, 0.12);
}

.cover-cup {
  position: relative;
  width: 74rpx;
  height: 112rpx;
}

.cup-lid {
  position: absolute;
  top: 0;
  left: 8rpx;
  width: 58rpx;
  height: 18rpx;
  border-radius: 50%;
  background: #dfe9ea;
  border: 5rpx solid #fff;
}

.cup-body {
  position: absolute;
  top: 20rpx;
  left: 14rpx;
  width: 46rpx;
  height: 82rpx;
  border-radius: 10rpx 10rpx 20rpx 20rpx;
  background: linear-gradient(180deg, #a94f28, #3e1d1a);
  border: 6rpx solid #fff;
}

.record-main {
  flex: 1;
  min-width: 0;
}

.record-title-row {
  display: flex;
  align-items: center;
}

.category-icon {
  margin-right: 10rpx;
  font-size: 28rpx;
  color: var(--accent);
}

.record-title {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 32rpx;
  font-weight: 800;
  color: var(--ink);
}

.favorite {
  margin-left: 8rpx;
  font-size: 30rpx;
  color: var(--accent);
}

.record-meta,
.record-store,
.record-city {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.record-meta {
  margin-top: 10rpx;
  font-size: 24rpx;
  color: var(--accent);
}

.record-store {
  margin-top: 10rpx;
  font-size: 25rpx;
  color: var(--muted);
}

.record-city {
  margin-top: 6rpx;
  font-size: 24rpx;
  color: #b5aca7;
}

.record-actions {
  width: 76rpx;
  flex: 0 0 76rpx;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.action-dot {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c0b8b3;
  font-size: 44rpx;
}

.delete-link {
  margin-top: 28rpx;
  font-size: 22rpx;
  color: #c1b9b5;
}
</style>


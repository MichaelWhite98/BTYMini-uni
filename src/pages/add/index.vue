<template>
  <view class="add-page">
    <!-- Background Overlay -->
    <view class="overlay" :class="{ visible: isVisible }" @click="closeModal" />

    <!-- Bottom Panel -->
    <view class="panel" :class="{ visible: isVisible }">
      <view class="panel-content">
        <text class="panel-title">添加饮品记录</text>

        <!-- Main Options -->
        <view class="options-row">
          <button class="option-btn" @click="takePhoto">
            <view class="option-icon camera">
              <uni-icons type="camera" size="28" color="#f3fffc" />
            </view>
            <text class="option-text">拍照</text>
          </button>

          <button class="option-btn" @click="chooseFromGallery">
            <view class="option-icon gallery">
              <uni-icons type="image" size="28" color="#007235" />
            </view>
            <text class="option-text">从相册上传</text>
          </button>
        </view>

        <!-- Quick Actions -->
        <view class="quick-actions">
          <text class="quick-label">常用记录</text>
          <view class="quick-tags">
            <view
              v-for="(item, index) in quickActions"
              :key="index"
              class="quick-tag"
              @click="addQuickRecord(item)"
            >
              <text class="quick-tag-text">{{ item.name }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- Close Button -->
      <view class="close-btn-wrapper">
        <button class="close-btn" @click="closeModal">
          <uni-icons type="close" size="32" color="#f0f1f1" />
        </button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isVisible = ref(false)

const quickActions = ref([
  { name: '晨间咖啡 250ml', type: 'coffee' },
  { name: '午后绿茶 300ml', type: 'tea' }
])

onMounted(() => {
  // 自动显示面板
  setTimeout(() => {
    isVisible.value = true
  }, 100)
})

const closeModal = () => {
  isVisible.value = false
  setTimeout(() => {
    uni.navigateBack()
  }, 300)
}

const takePhoto = () => {
  uni.chooseImage({
    count: 1,
    sourceType: ['camera'],
    success: (res) => {
      const tempFilePath = res.tempFilePaths[0]
      uni.navigateTo({
        url: `/pages/analyze/index?image=${encodeURIComponent(tempFilePath)}`
      })
    }
  })
}

const chooseFromGallery = () => {
  uni.chooseImage({
    count: 1,
    sourceType: ['album'],
    success: (res) => {
      const tempFilePath = res.tempFilePaths[0]
      uni.navigateTo({
        url: `/pages/analyze/index?image=${encodeURIComponent(tempFilePath)}`
      })
    }
  })
}

const addQuickRecord = (item) => {
  console.log('Quick record:', item)
  // TODO: 直接添加记录
  uni.showToast({
    title: `已添加: ${item.name}`,
    icon: 'success'
  })
}
</script>

<style lang="scss" scoped>
@use '@/styles/theme.scss' as *;

.add-page {
  min-height: 100vh;
  position: relative;
}

// Overlay
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(26, 26, 26, 0.45);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
  z-index: 60;

  &.visible {
    opacity: 1;
    pointer-events: auto;
  }
}

// Panel
.panel {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 24px 24px 0 0;
  padding: 40px 20px 80px;
  transform: translateY(100%);
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 61;
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.15);

  &.visible {
    transform: translateY(0);
  }
}

.panel-content {
  max-width: 400px;
  margin: 0 auto;
}

.panel-title {
  font-size: 24px;
  font-weight: $font-weight-semibold;
  color: $on-surface;
  text-align: center;
  margin-bottom: 24px;
}

// Options Row
.options-row {
  display: flex;
  justify-content: space-around;
  gap: 24px;
  margin-bottom: 24px;
}

.option-btn {
  @include btn-reset;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  transition: transform $duration-fast $ease-out;

  &:active {
    transform: scale(0.95);
  }
}

.option-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 104, 96, 0.2);

  &.camera {
    background: $primary-container;
  }

  &.gallery {
    background: rgba(77, 254, 138, 0.3);
  }
}

.option-text {
  font-size: 16px;
  color: $on-surface;
}

// Quick Actions
.quick-actions {
  background: $surface-container-low;
  border-radius: 16px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.quick-label {
  font-size: 13px;
  font-weight: $font-weight-semibold;
  color: $on-surface-variant;
  margin-bottom: 12px;
  display: block;
}

.quick-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.quick-tag {
  padding: 8px 16px;
  background: $surface-container-lowest;
  border-radius: 9999px;
  border: 1px solid rgba(0, 104, 96, 0.1);
  box-shadow: 0 4px 12px rgba(17, 153, 142, 0.08);
  transition: transform $duration-fast $ease-out;

  &:active {
    transform: scale(0.95);
  }
}

.quick-tag-text {
  font-size: 13px;
  font-weight: $font-weight-semibold;
  color: $primary;
}

// Close Button
.close-btn-wrapper {
  position: absolute;
  bottom: -40px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
}

.close-btn {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: $inverse-surface;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  transition: all $duration-normal $ease-out;

  &::after {
    border: none;
  }

  &:active {
    transform: scale(0.9);
  }
}
</style>

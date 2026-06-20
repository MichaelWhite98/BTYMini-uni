<template>
  <view class="add-page">
    <!-- 背景模糊层 -->
    <view class="background-blur" />

    <!-- 底部弹窗 -->
    <view class="bottom-sheet" :class="{ show: isShow }">
      <!-- 操作卡片列表 -->
      <view class="action-cards">
        <!-- 拍照 -->
        <button class="action-card" @tap="handleCamera">
          <view class="action-icon">
            <uni-icons type="camera" size="20"></uni-icons>
          </view>
          <text class="action-label">拍照</text>
          <uni-icons type="forward" size="20" class="arrow"></uni-icons>
        </button>

        <!-- 从相册上传 -->
        <button class="action-card" @tap="handleAlbum">
          <view class="action-icon">
            <uni-icons type="image" size="20"></uni-icons>
          </view>
          <text class="action-label">从相册上传</text>
          <uni-icons type="forward" size="20" class="arrow"></uni-icons>
        </button>
      </view>

      <!-- 关闭按钮 -->
      <view class="close-action">
        <button class="close-btn" @tap="handleClose">
          <uni-icons type="close" size="20"></uni-icons>
        </button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const isShow = ref(false)
const selectedDate = ref('')

onLoad((query = {}) => {
  // 延迟显示动画
  setTimeout(() => {
    isShow.value = true
  }, 100)

  if (query.date) {
    selectedDate.value = String(query.date)
  }
})

const navigateToAnalyze = (imagePath) => {
  uni.redirectTo({
    url: `/pages/food-diary/analyze/index?date=${selectedDate.value}&image=${encodeURIComponent(imagePath)}`
  })
}

// 拍照
const handleCamera = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['camera'],
    success: (res) => {
      const tempFilePaths = res.tempFilePaths
      navigateToAnalyze(tempFilePaths[0])
    }
  })
}

// 从相册选择
const handleAlbum = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album'],
    success: (res) => {
      const tempFilePaths = res.tempFilePaths
      navigateToAnalyze(tempFilePaths[0])
    }
  })
}

// 关闭
const handleClose = () => {
  isShow.value = false
  setTimeout(() => {
    uni.navigateBack()
  }, 300)
}
</script>

<style lang="scss" scoped>
@use '@/styles/theme.scss' as *;

.add-page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}

// 背景模糊层
.background-blur {
  position: absolute;
  inset: 0;
  background: rgba(26, 26, 26, 0.2);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  animation: fadeIn 0.3s ease-out;
}

// 底部弹窗
.bottom-sheet {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0 $container-padding;
  padding-bottom: calc(48px + var(--safe-area-bottom));
  transform: translateY(100%);
  @include transition-base;

  &.show {
    transform: translateY(0);
  }
}

// 操作卡片
.action-cards {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  margin-bottom: 32px;
}

.action-card {
  @include btn-reset;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-lg;
  background: var(--surface);
  border-radius: $radius-xl;
  box-shadow: $shadow-card;
  @include transition-base;

  &:active {
    transform: scale(0.98);
  }
}

.action-icon {
  @include nav-button($btn-size-xl);
  background: var(--surface-container);
  margin-right: $spacing-lg;

  .action-card:active & {
    background: var(--primary-container);
    transform: scale(0.95);
  }
}

.action-label {
  flex: 1;
  font-size: $font-size-title-md;
  font-weight: $font-weight-semibold;
  color: var(--primary);
  text-align: left;
}

.arrow {
  color: var(--outline);
  transition: all $duration-normal $ease-out;

  .action-card:active & {
    color: var(--primary);
    transform: translateX(4px);
  }
}

// 关闭按钮
.close-action {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

.close-btn {
  @include nav-button(64px);
  background: var(--surface);
  box-shadow: $shadow-card;
  border: 2px solid white;
  color: var(--on-surface-variant);

  &:active {
    background: var(--surface-container);
  }
}
</style>

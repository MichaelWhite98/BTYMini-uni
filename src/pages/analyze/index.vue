<template>
  <view class="analyze-page">
    <!-- Top AppBar -->
    <view class="app-header">
      <button class="header-btn" @click="goBack">
        <uni-icons type="left" size="24" color="#1a1c1c" />
      </button>
      <text class="header-title">主体抠图</text>
      <button class="skip-btn" @click="skipCutout">跳过</button>
    </view>

    <!-- Main Content -->
    <view class="main-content">
      <!-- 状态标签 -->
      <view class="status-badge" :class="{ processing: isAnalyzing }">
        <uni-icons v-if="isAnalyzing" type="spinner-cycle" size="18" color="#006860" />
        <uni-icons v-else type="checkbox-filled" size="18" color="#006d32" />
        <text class="status-text">{{ statusText }}</text>
      </view>

      <!-- 图片预览卡片 -->
      <view class="preview-card">
        <image v-if="imageSrc" class="preview-image" :src="imageSrc" mode="aspectFill" />
        <view v-else class="preview-placeholder">
          <uni-icons type="image" size="64" color="#bcc9c6" />
          <text class="placeholder-text">暂无图片</text>
        </view>

        <!-- 主体遮罩 -->
        <view v-if="subjects.length > 0" class="subject-overlay">
          <view class="subject-label">主体_01</view>
        </view>

        <!-- 底部信息 -->
        <view class="preview-info">
          <view class="detected-info">
            <text class="detected-label">已检测：</text>
            <text class="detected-value">{{ subjects.length }} 个元素</text>
          </view>
          <button class="zoom-btn" @click="zoomImage">
            <uni-icons type="zoom-in" size="24" color="#ffffff" />
          </button>
        </view>
      </view>

      <!-- 候选列表 -->
      <view v-if="subjects.length > 0" class="candidates-section">
        <text class="candidates-label">候选主体</text>

        <view
          v-for="(subject, index) in subjects"
          :key="subject.id"
          class="candidate-item"
          :class="{ selected: selectedSubject === subject.id }"
          @click="selectSubject(subject.id)"
        >
          <view class="candidate-thumb">
            <image v-if="subject.thumbnailUrl" :src="subject.thumbnailUrl" mode="aspectFill" />
            <view v-else class="thumb-placeholder">
              <uni-icons type="image" size="20" color="#bcc9c6" />
            </view>
          </view>
          <view class="candidate-info">
            <view class="candidate-header">
              <text class="candidate-name">{{ subject.displayName }}</text>
              <view v-if="index === 0" class="recommended-tag">
                <text class="tag-text">推荐</text>
              </view>
            </view>
            <text class="candidate-desc">置信度 {{ (subject.score * 100).toFixed(0) }}%</text>
          </view>
          <view class="candidate-check" :class="{ checked: selectedSubject === subject.id }">
            <uni-icons v-if="selectedSubject === subject.id" type="checkmarkempty" size="16" color="#ffffff" />
          </view>
        </view>
      </view>

      <!-- 加载中提示 -->
      <view v-if="isAnalyzing" class="loading-section">
        <text class="loading-text">正在分析图片，请稍候...</text>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="action-bar">
      <button class="skip-action" @click="skipCutout">跳过抠图</button>
      <button class="use-action" :disabled="subjects.length === 0" @click="useCurrent">
        {{ subjects.length > 0 ? '使用当前' : '请等待...' }}
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { uploadImage, createCutoutTask, getCutoutTask } from '@/utils/food-diary/api.js'

const imageSrc = ref('')
const uploadedImageUrl = ref('')
const isAnalyzing = ref(false)
const selectedSubject = ref('')
const subjects = ref([])
const taskId = ref('')
const cutoutResult = ref(null)

const statusText = computed(() => {
  if (isAnalyzing.value) return '分析中...'
  if (subjects.value.length > 0) return '分析完成'
  return '准备中'
})

onLoad(async (options) => {
  if (options.image) {
    const localPath = decodeURIComponent(options.image)
    imageSrc.value = localPath

    // 开始上传图片并进行抠图
    await processImage(localPath)
  }
})

// 处理图片：上传 + 抠图
const processImage = async (localPath) => {
  try {
    isAnalyzing.value = true

    // 1. 上传图片到服务器
    uni.showLoading({ title: '上传图片...' })
    const uploadResult = await uploadImage(localPath, 'food-diary')
    uploadedImageUrl.value = uploadResult.url
    uni.hideLoading()

    // 2. 创建抠图任务
    uni.showLoading({ title: '分析图片...' })
    const cutoutTask = await createCutoutTask({
      scene: 'food-diary-cutout',
      imageId: uploadResult.imageId || '',
      imageUrl: uploadResult.url
    })

    taskId.value = cutoutTask.taskId

    // 3. 如果返回了结果，直接使用
    if (cutoutTask.status === 'succeeded' && cutoutTask.items) {
      subjects.value = cutoutTask.items
      if (cutoutTask.primaryItemId) {
        selectedSubject.value = cutoutTask.primaryItemId
      } else if (cutoutTask.items.length > 0) {
        selectedSubject.value = cutoutTask.items[0].id
      }
      cutoutResult.value = cutoutTask
    } else if (cutoutTask.status === 'failed') {
      uni.showToast({
        title: cutoutTask.failReason || '抠图失败',
        icon: 'none'
      })
    }

    uni.hideLoading()
  } catch (error) {
    console.error('处理图片失败:', error)
    uni.hideLoading()
    uni.showToast({
      title: '处理失败，请重试',
      icon: 'none'
    })
  } finally {
    isAnalyzing.value = false
  }
}

const goBack = () => {
  uni.navigateBack()
}

const skipCutout = () => {
  // 跳转到详情页，携带原图URL
  uni.navigateTo({
    url: `/pages/detail/index?imageUrl=${encodeURIComponent(uploadedImageUrl.value || imageSrc.value)}`
  })
}

const zoomImage = () => {
  if (imageSrc.value) {
    uni.previewImage({
      urls: [imageSrc.value]
    })
  }
}

const selectSubject = (id) => {
  selectedSubject.value = id
}

const useCurrent = () => {
  // 找到选中的主体
  const selected = subjects.value.find(s => s.id === selectedSubject.value)
  if (selected) {
    // 跳转到详情页，携带抠图结果
    uni.navigateTo({
      url: `/pages/detail/index?imageUrl=${encodeURIComponent(uploadedImageUrl.value)}&cutoutUrl=${encodeURIComponent(selected.cutoutUrl || selected.thumbnailUrl)}&subjectId=${selectedSubject.value}`
    })
  } else {
    skipCutout()
  }
}
</script>

<style lang="scss" scoped>
@use '@/styles/theme.scss' as *;

.analyze-page {
  min-height: 100vh;
  background: $background;
  padding-bottom: 120px;
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
  font-weight: $font-weight-semibold;
  color: $primary;
}

.skip-btn {
  font-size: 13px;
  font-weight: $font-weight-semibold;
  color: $on-surface-variant;
  background: transparent;
  border: none;
  padding: 8px 16px;

  &::after {
    border: none;
  }
}

// Main Content
.main-content {
  padding-top: 104px;
  padding-left: 20px;
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

// Status Badge
.status-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(77, 254, 138, 0.2);
  border-radius: 9999px;
  border: 1px solid rgba(77, 254, 138, 0.3);
  margin-bottom: 24px;

  &.processing {
    background: rgba(0, 104, 96, 0.1);
    border-color: rgba(0, 104, 96, 0.2);
  }
}

.status-text {
  font-size: 13px;
  font-weight: $font-weight-semibold;
  color: $on-secondary-container;
}

// Preview Card
.preview-card {
  position: relative;
  width: 100%;
  max-width: 480px;
  aspect-ratio: 4/5;
  border-radius: 28px;
  overflow: hidden;
  background: $surface-container-high;
  box-shadow: 0 10px 30px -5px rgba(17, 153, 142, 0.12);
  margin-bottom: 32px;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: $surface-container;
}

.placeholder-text {
  font-size: 14px;
  color: $outline;
}

.subject-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 75%;
  height: 75%;
  border: 2px solid $primary;
  border-radius: 12px;
  background: rgba(0, 104, 96, 0.05);
  backdrop-filter: blur(2px);
}

.subject-label {
  position: absolute;
  top: -12px;
  left: -12px;
  background: $primary;
  color: $on-primary;
  font-size: 10px;
  padding: 4px 8px;
  border-radius: 4px;
}

.preview-info {
  position: absolute;
  bottom: 24px;
  left: 24px;
  right: 24px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.detected-info {
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  padding: 8px 16px;
  border-radius: 16px;
}

.detected-label {
  font-weight: $font-weight-bold;
  font-size: 12px;
  color: $on-surface;
}

.detected-value {
  font-size: 12px;
  color: $on-surface;
}

.zoom-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(0, 104, 96, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: center;

  &::after {
    border: none;
  }
}

// Loading Section
.loading-section {
  padding: 24px;
  text-align: center;
}

.loading-text {
  font-size: 14px;
  color: $outline;
}

// Candidates Section
.candidates-section {
  width: 100%;
  max-width: 480px;
}

.candidates-label {
  font-size: 13px;
  font-weight: $font-weight-semibold;
  color: $on-surface-variant;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding-left: 4px;
  margin-bottom: 16px;
  display: block;
}

.candidate-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background: $surface-container-lowest;
  border-radius: 16px;
  margin-bottom: 16px;
  border: 2px solid transparent;
  transition: all $duration-fast $ease-out;

  &.selected {
    border-color: $primary;
    box-shadow: 0 10px 30px -5px rgba(17, 153, 142, 0.12);
  }

  &:active {
    transform: scale(0.98);
  }
}

.candidate-thumb {
  width: 64px;
  height: 64px;
  border-radius: 8px;
  overflow: hidden;
  background: $surface-container;
  flex-shrink: 0;

  image {
    width: 100%;
    height: 100%;
  }
}

.thumb-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.candidate-info {
  flex: 1;
  margin-left: 16px;
}

.candidate-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.candidate-name {
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $on-surface;
}

.recommended-tag {
  background: $secondary-container;
  padding: 2px 8px;
  border-radius: 9999px;
}

.tag-text {
  font-size: 10px;
  font-weight: $font-weight-bold;
  color: $on-secondary-container;
}

.candidate-desc {
  font-size: 13px;
  font-weight: $font-weight-semibold;
  color: $on-surface-variant;
}

.candidate-check {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid $outline-variant;
  display: flex;
  align-items: center;
  justify-content: center;

  &.checked {
    background: $primary;
    border-color: $primary;
  }
}

// Action Bar
.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px 20px calc(34px + 16px);
  background: rgba(249, 249, 249, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  gap: 16px;
}

.skip-action {
  flex: 1;
  height: 56px;
  border-radius: 16px;
  border: 2px solid $primary;
  background: transparent;
  color: $primary;
  font-size: 16px;
  font-weight: $font-weight-semibold;

  &::after {
    border: none;
  }

  &:active {
    transform: scale(0.95);
  }
}

.use-action {
  flex: 1.5;
  height: 56px;
  border-radius: 16px;
  background: $primary-gradient;
  color: $on-primary;
  font-size: 16px;
  font-weight: $font-weight-semibold;
  box-shadow: 0 4px 16px rgba(0, 104, 96, 0.2);

  &::after {
    border: none;
  }

  &:active {
    transform: scale(0.95);
  }

  &[disabled] {
    opacity: 0.5;
  }
}
</style>

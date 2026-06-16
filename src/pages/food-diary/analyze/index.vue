<template>
  <view class="analyze-page">
    <header class="app-header">
      <button class="nav-btn" @tap="handleBack">
        <uni-icons type="back" size="20"></uni-icons>
      </button>
      <text class="page-title">主体抠图</text>
      <button class="nav-btn ghost" @tap="handleSkip">
        <uni-icons type="forward" size="20"></uni-icons>
      </button>
    </header>

    <scroll-view scroll-y class="main-content">
      <view class="hero-panel">
        <image v-if="previewImageUrl" class="hero-image" :src="previewImageUrl" mode="aspectFill" />
        <view class="hero-overlay">
          <view class="hero-chip">
            <uni-icons :type="statusIcon" size="16"></uni-icons>
            <text class="hero-chip-text">{{ statusText }}</text>
          </view>
          <text class="hero-title">{{ statusTitle }}</text>
          <text class="hero-subtitle">{{ statusSubtitle }}</text>
        </view>
      </view>

      <view v-if="status === 'uploading' || status === 'analyzing'" class="state-card">
        <view class="spinner-wrap">
          <uni-icons type="spinner-cycle" size="28" class="spinner-icon"></uni-icons>
        </view>
        <text class="state-title">{{ loadingTitle }}</text>
        <text class="state-copy">{{ loadingCopy }}</text>
      </view>

      <view v-else-if="status === 'error'" class="state-card">
        <text class="state-title">主体抠图失败</text>
        <text class="state-copy">{{ errorMessage }}</text>
        <view class="state-actions">
          <button class="secondary-btn" @tap="handleRetry">重新处理</button>
          <button class="primary-btn" @tap="handleSkip">使用原图继续</button>
        </view>
      </view>

      <view v-else-if="status === 'success'" class="result-section">
        <view class="section-header">
          <text class="section-title">抠图候选</text>
          <text class="section-caption">选择一个要保留的主体继续录入</text>
        </view>

        <view class="result-list">
          <button
            v-for="item in items"
            :key="item.id"
            :class="['result-card', { selected: item.id === selectedItemId }]"
            @tap="handleSelect(item.id)"
          >
            <image class="result-image" :src="item.thumbnailUrl || previewImageUrl" mode="aspectFill" />
            <view class="result-body">
              <view class="result-row">
                <text class="result-label">{{ item.displayName || '主体' }}</text>
                <text class="result-score">{{ item.id === primaryItemId ? '推荐' : '候选' }}</text>
              </view>
              <text class="result-meta">
                {{ item.id === primaryItemId ? '将优先保留这个主体，其余区域透明' : '可切换为这个主体' }}
              </text>
            </view>
          </button>
        </view>

        <view class="tips-card">
          <text class="tips-title">将带入详情页的内容</text>
          <text class="tips-copy">详情页优先展示主体抠图。真实服务接入后，主体外的区域会是透明背景。</text>
        </view>
      </view>
    </scroll-view>

    <view class="bottom-bar">
      <button class="secondary-btn" @tap="handleSkip">
        {{ status === 'success' ? '跳过抠图结果' : '使用原图继续' }}
      </button>
      <button class="primary-btn" :disabled="!canContinue" @tap="handleContinue">
        {{ status === 'success' ? '使用当前主体' : '继续录入' }}
      </button>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onLoad, onUnload } from '@dcloudio/uni-app'
import {
  buildCutoutDraft,
  createCutoutTask,
  getCutoutTask,
  prepareCutoutSource,
  saveCutoutDraft
} from '@/utils/food-diary/index.js'

const date = ref('')
const localImagePath = ref('')
const sourceImageUrl = ref('')
const sourceImageId = ref('')
const taskId = ref('')
const status = ref('uploading')
const items = ref([])
const primaryItemId = ref('')
const selectedItemId = ref('')
const errorMessage = ref('请稍后重试，或直接使用原图继续录入。')

let pollTimer = null

const stopPolling = () => {
  if (pollTimer) {
    clearTimeout(pollTimer)
    pollTimer = null
  }
}

const previewImageUrl = computed(() => localImagePath.value || sourceImageUrl.value)

const canContinue = computed(() => {
  if (status.value !== 'success') return !!(sourceImageUrl.value || localImagePath.value)
  return !!selectedItemId.value
})

const statusText = computed(() => {
  if (status.value === 'uploading') return '上传中'
  if (status.value === 'success') return '抠图完成'
  if (status.value === 'error') return '处理失败'
  return '抠图中'
})

const statusIcon = computed(() => {
  if (status.value === 'success') return 'checkbox'
  if (status.value === 'error') return 'info'
  return 'spinner-cycle'
})

const statusTitle = computed(() => {
  if (status.value === 'uploading') return '正在上传原图'
  if (status.value === 'success') return '主体已经准备好继续录入'
  if (status.value === 'error') return '这张图没有顺利完成处理'
  return '正在为你提取杯子、盘子、碗等主体'
})

const statusSubtitle = computed(() => {
  if (status.value === 'uploading') return '图片会先上传到文件服务，再创建主体抠图任务。'
  if (status.value === 'success') return '可以直接使用推荐主体，也可以切换到其他候选主体。'
  if (status.value === 'error') return '抠图失败不会阻断主流程，仍然可以直接使用原图。'
  return '后端接入后，主体外的背景会直接被抠成透明。'
})

const loadingTitle = computed(() => (
  status.value === 'uploading' ? '正在上传原图' : '正在提取图片中的主体'
))

const loadingCopy = computed(() => (
  status.value === 'uploading'
    ? '上传完成后会自动创建主体抠图任务。'
    : '只保留杯子、盘子、碗这类主体，其他区域后续会变成透明背景。'
))

const getOriginalImageForDetail = () => sourceImageUrl.value || localImagePath.value

const goToDetailWithOriginal = () => {
  stopPolling()
  uni.redirectTo({
    url: `/pages/food-diary/detail/index?date=${date.value}&mode=add&images=${encodeURIComponent(getOriginalImageForDetail())}`
  })
}

const goToDetailWithCutout = () => {
  const draftId = saveCutoutDraft(buildCutoutDraft({
    task: {
      taskId: taskId.value,
      scene: 'food-diary-cutout',
      imageId: sourceImageId.value,
      imageUrl: sourceImageUrl.value,
      sourceImageUrl: sourceImageUrl.value,
      primaryItemId: primaryItemId.value,
      items: items.value
    },
    selectedItemId: selectedItemId.value
  }))

  stopPolling()
  uni.redirectTo({
    url: `/pages/food-diary/detail/index?date=${date.value}&mode=add&visionDraftId=${draftId}`
  })
}

const pollTask = async () => {
  try {
    const result = await getCutoutTask(taskId.value)

    if (result.status === 'queued' || result.status === 'running') {
      status.value = 'analyzing'
      pollTimer = setTimeout(pollTask, 1200)
      return
    }

    if (result.status === 'failed') {
      status.value = 'error'
      errorMessage.value = result.failReason || errorMessage.value
      return
    }

    items.value = result.items || []
    primaryItemId.value = result.primaryItemId || ((result.items && result.items[0] && result.items[0].id) || '')
    selectedItemId.value = primaryItemId.value
    status.value = items.value.length ? 'success' : 'error'

    if (!items.value.length) {
      errorMessage.value = '没有提取到明确主体，建议直接使用原图继续。'
    }
  } catch (error) {
    console.error(error)
    status.value = 'error'
  }
}

const startCutoutPipeline = async () => {
  stopPolling()
  status.value = 'uploading'
  errorMessage.value = '请稍后重试，或直接使用原图继续录入。'

  try {
    const source = await prepareCutoutSource({
      filePath: localImagePath.value
    })

    sourceImageId.value = source.imageId || ''
    sourceImageUrl.value = source.imageUrl || localImagePath.value
    status.value = 'analyzing'

    const task = await createCutoutTask({
      scene: 'food-diary-cutout',
      imageId: sourceImageId.value,
      imageUrl: sourceImageUrl.value,
      sourceImageUrl: sourceImageUrl.value
    })

    taskId.value = task.taskId
    pollTask()
  } catch (error) {
    console.error(error)
    status.value = 'error'
  }
}

const handleSelect = (itemId) => {
  selectedItemId.value = itemId
}

const handleContinue = () => {
  if (status.value === 'success' && selectedItemId.value) {
    goToDetailWithCutout()
    return
  }

  goToDetailWithOriginal()
}

const handleSkip = () => {
  goToDetailWithOriginal()
}

const handleRetry = () => {
  startCutoutPipeline()
}

const handleBack = () => {
  stopPolling()
  uni.navigateBack()
}

onLoad((query = {}) => {
  date.value = query.date ? String(query.date) : ''
  localImagePath.value = query.image ? decodeURIComponent(String(query.image)) : ''

  if (!localImagePath.value) {
    status.value = 'error'
    errorMessage.value = '没有拿到待处理图片。'
    return
  }

  startCutoutPipeline()
})

onUnload(() => {
  stopPolling()
})
</script>

<style lang="scss" scoped>
@use '@/styles/theme.scss' as *;

.analyze-page {
  min-height: 100vh;
  background: var(--background);
  padding-bottom: 132px;
}

.app-header {
  position: sticky;
  top: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: var(--status-bar-height);
  height: calc(var(--nav-bar-height));
  padding-left: $container-padding;
  padding-right: $container-padding;
  background: rgba(250, 250, 250, 0.9);
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
  color: var(--primary);
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  border-radius: 50%;

  &:active {
    background: var(--surface-container);
    transform: scale(0.95);
  }

  &.ghost {
    color: var(--on-surface-variant);
  }
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--primary);
}

.main-content {
  height: calc(100vh - 64px);
  padding: 16px $container-padding 32px;
}

.hero-panel {
  position: relative;
  height: 320px;
  border-radius: 28px;
  overflow: hidden;
  background: var(--surface-container);
  box-shadow: $shadow-card;
}

.hero-image {
  width: 100%;
  height: 100%;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 10px;
  padding: 24px;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.04) 0%, rgba(0, 0, 0, 0.52) 100%);
}

.hero-chip {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 32px;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.16);
  color: #fff;
  backdrop-filter: blur(8px);
}

.hero-chip-text {
  color: #fff;
  font-size: 13px;
  font-weight: 600;
}

.hero-title {
  font-size: 24px;
  font-weight: 700;
  line-height: 32px;
  color: #fff;
}

.hero-subtitle {
  font-size: 14px;
  line-height: 20px;
  color: rgba(255, 255, 255, 0.86);
}

.state-card,
.tips-card {
  margin-top: 20px;
  padding: 20px;
  border-radius: 24px;
  background: var(--surface);
  box-shadow: $shadow-card;
}

.spinner-wrap {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  background: var(--surface-container);
}

.spinner-icon {
  color: var(--primary);
  animation: spin 1.2s linear infinite;
}

.state-title,
.section-title,
.tips-title {
  display: block;
  font-size: 18px;
  font-weight: 600;
  color: var(--primary);
}

.state-copy,
.section-caption,
.tips-copy {
  display: block;
  margin-top: 8px;
  font-size: 14px;
  line-height: 20px;
  color: var(--on-surface-variant);
}

.state-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.result-section {
  margin-top: 20px;
}

.section-header {
  margin-bottom: 16px;
}

.result-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.result-card {
  width: 100%;
  padding: 14px;
  border: 2px solid transparent;
  border-radius: 24px;
  background: var(--surface);
  box-shadow: $shadow-card;
  display: flex;
  align-items: center;
  gap: 14px;
  text-align: left;

  &:active {
    transform: scale(0.99);
  }

  &.selected {
    border-color: var(--primary);
    background: var(--primary-container);
  }
}

.result-image {
  width: 88px;
  height: 88px;
  border-radius: 20px;
  background: var(--surface-container);
  flex-shrink: 0;
}

.result-body {
  min-width: 0;
  flex: 1;
}

.result-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.result-label {
  font-size: 18px;
  font-weight: 600;
  color: var(--primary);
}

.result-score {
  font-size: 13px;
  color: var(--on-surface-variant);
}

.result-meta {
  display: block;
  margin-top: 6px;
  font-size: 14px;
  color: var(--on-surface-variant);
}

.bottom-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 16px $container-padding calc(16px + var(--safe-area-bottom));
  background: rgba(254, 248, 245, 0.96);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.primary-btn,
.secondary-btn {
  min-height: 52px;
  border: none;
  border-radius: 18px;
  font-size: 15px;
  font-weight: 600;
}

.primary-btn {
  background: var(--primary);
  color: #fff;

  &[disabled] {
    opacity: 0.4;
  }
}

.secondary-btn {
  background: var(--surface);
  color: var(--primary);
  box-shadow: $shadow-card;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>

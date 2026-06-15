<template>
  <view class="drink-image-picker">
    <view v-if="modelValue.length" class="image-strip">
      <view
        v-for="(image, index) in modelValue"
        :key="image + index"
        class="image-item"
      >
        <image
          class="preview-image"
          :src="image"
          mode="aspectFill"
          @tap="handlePreview(index)"
        />
        <view class="remove-btn" @tap.stop="handleRemove(index)">×</view>
      </view>

      <view v-if="modelValue.length < max" class="small-add" @tap="handleChoose">+</view>
    </view>

    <view v-else class="hero-upload" @tap="handleChoose">
      <view class="cup-preview">
        <text class="cup-lid" />
        <text class="cup-straw" />
        <text class="cup-body" />
      </view>
      <text class="upload-title">添加饮品照片</text>
      <text class="upload-subtitle">拍照或从相册上传</text>
    </view>
  </view>
</template>

<script setup>
import { chooseImage, previewImage } from '@/utils/food-diary/index.js'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  max: {
    type: Number,
    default: 3
  }
})

const emit = defineEmits(['update:modelValue'])

const toast = (title) => {
  uni.showToast({ title, icon: 'none' })
}

const chooseFrom = async (sourceType) => {
  if (props.modelValue.length >= props.max) {
    toast(`最多选择${props.max}张图片`)
    return
  }

  try {
    const images = await chooseImage({
      count: props.max - props.modelValue.length,
      sourceType: [sourceType]
    })
    emit('update:modelValue', props.modelValue.concat(images))
  } catch (error) {
    if (error && error.errMsg && error.errMsg.includes('cancel')) return
    toast('选择图片失败')
  }
}

const handleChoose = () => {
  uni.showActionSheet({
    itemList: ['拍照', '从相册上传'],
    itemColor: '#3d2725',
    success: ({ tapIndex }) => {
      chooseFrom(tapIndex === 0 ? 'camera' : 'album')
    }
  })
}

const handlePreview = (index) => {
  previewImage(props.modelValue, index)
}

const handleRemove = (index) => {
  uni.showModal({
    title: '删除照片',
    content: '确定删除这张饮品照片吗？',
    confirmColor: '#cf9148',
    success: ({ confirm }) => {
      if (!confirm) return
      const next = props.modelValue.slice()
      next.splice(index, 1)
      emit('update:modelValue', next)
    }
  })
}
</script>

<style lang="scss" scoped>
.drink-image-picker {
  width: 100%;
}

.hero-upload {
  height: 320rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.cup-preview {
  position: relative;
  width: 170rpx;
  height: 210rpx;
  margin-bottom: 18rpx;
}

.cup-lid {
  position: absolute;
  top: 24rpx;
  left: 38rpx;
  width: 94rpx;
  height: 26rpx;
  border-radius: 50%;
  background: #dfe9ea;
  border: 8rpx solid #fff;
  box-shadow: 0 8rpx 16rpx rgba(77, 57, 42, 0.08);
}

.cup-straw {
  position: absolute;
  top: 0;
  right: 44rpx;
  width: 12rpx;
  height: 110rpx;
  border-radius: 10rpx;
  background: #f8f8f6;
  transform: rotate(10deg);
  box-shadow: inset -2rpx 0 0 #c8cac8;
  z-index: 2;
}

.cup-body {
  position: absolute;
  top: 42rpx;
  left: 46rpx;
  width: 78rpx;
  height: 142rpx;
  border-radius: 16rpx 16rpx 30rpx 30rpx;
  background: linear-gradient(180deg, #b95a29 0%, #813a24 48%, #45201d 100%);
  border: 10rpx solid #fff;
  box-shadow: 0 18rpx 32rpx rgba(77, 57, 42, 0.16);
}

.upload-title {
  font-size: 30rpx;
  font-weight: 700;
  color: var(--ink);
}

.upload-subtitle {
  margin-top: 8rpx;
  font-size: 24rpx;
  color: var(--muted);
}

.image-strip {
  display: flex;
  align-items: center;
  min-height: 230rpx;
  gap: 18rpx;
  padding: 12rpx 0;
}

.image-item {
  position: relative;
  width: 190rpx;
  height: 220rpx;
  flex: 0 0 190rpx;
}

.preview-image {
  width: 190rpx;
  height: 220rpx;
  border-radius: 28rpx;
  border: 8rpx solid #fff;
  background: #eeeae4;
  box-shadow: 0 14rpx 30rpx rgba(68, 45, 28, 0.12);
}

.remove-btn {
  position: absolute;
  top: -8rpx;
  right: -8rpx;
  width: 44rpx;
  height: 44rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(61, 39, 37, 0.76);
  border: 4rpx solid #fff;
  color: #fff;
  font-size: 30rpx;
}

.small-add {
  width: 118rpx;
  height: 118rpx;
  flex: 0 0 118rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent);
  font-size: 46rpx;
  background: rgba(255, 255, 255, 0.68);
  border: 4rpx solid rgba(255, 255, 255, 0.9);
}
</style>


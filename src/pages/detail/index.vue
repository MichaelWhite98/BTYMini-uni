<template>
  <view class="detail-page">
    <!-- Top AppBar -->
    <view class="app-header">
      <button class="header-btn" @click="goBack">
        <uni-icons type="close" size="24" color="#3d4947" />
      </button>
      <text class="header-title">饮品详情</text>
      <button class="save-btn" @click="saveRecord">保存</button>
    </view>

    <!-- Main Content -->
    <scroll-view class="main-content" scroll-y :show-scrollbar="false">
      <!-- Hero Image Section -->
      <view class="image-section">
        <view class="image-container">
          <view class="image-glow" />
          <view v-if="record.image" class="beverage-image">
            <image :src="record.image" mode="aspectFill" />
          </view>
          <view v-else class="beverage-placeholder">
            <uni-icons type="image" size="64" color="#bcc9c6" />
            <text class="placeholder-text">暂无图片</text>
          </view>
          <button class="camera-badge" @click="changeImage">
            <uni-icons type="camera" size="20" color="#007235" />
          </button>
        </view>
      </view>

      <!-- Subject Cutout Card -->
      <view class="cutout-card" @click="showCutoutOptions">
        <view class="cutout-left">
          <view class="cutout-thumb">
            <image v-if="record.cutoutImage" :src="record.cutoutImage" mode="aspectFill" />
            <view v-else class="cutout-placeholder">
              <uni-icons type="image" size="24" color="#bcc9c6" />
            </view>
          </view>
          <view class="cutout-info">
            <text class="cutout-label">主体识别</text>
            <text class="cutout-status">{{ record.cutoutImage ? '已完成识别' : '点击智能抠图' }}</text>
          </view>
        </view>
        <view class="cutout-valid">
          <uni-icons type="checkbox-filled" size="20" :color="record.cutoutImage ? '#006860' : '#bcc9c6'" />
          <text class="valid-text" :class="{ 'active': record.cutoutImage }">
            {{ record.cutoutImage ? '有效' : '待处理' }}
          </text>
        </view>
      </view>

      <!-- Info Cards -->
      <view class="info-cards">
        <!-- Date -->
        <view class="info-card" @click="selectDate">
          <uni-icons type="calendar" size="24" color="#6d7a77" />
          <view class="info-content">
            <text class="info-label">日期</text>
            <text class="info-value">{{ record.date }}</text>
          </view>
          <uni-icons type="right" size="20" color="#bcc9c6" />
        </view>

        <!-- Shop -->
        <view class="info-card" @click="selectShop">
          <uni-icons type="shop" size="24" color="#6d7a77" />
          <view class="info-content">
            <text class="info-label">店铺</text>
            <text class="info-value">{{ record.shop }}</text>
          </view>
          <uni-icons type="right" size="20" color="#bcc9c6" />
        </view>

        <!-- Location -->
        <view class="info-card" @click="selectLocation">
          <uni-icons type="location" size="24" color="#6d7a77" />
          <view class="info-content">
            <text class="info-label">地点</text>
            <text class="info-value" :class="{ 'placeholder': !record.location }">
              {{ record.location || '点击选择地点' }}
            </text>
          </view>
          <view class="location-actions">
            <uni-icons
              v-if="record.location"
              type="clear"
              size="20"
              color="#bcc9c6"
              @click.stop="clearLocation"
            />
            <uni-icons type="right" size="20" color="#bcc9c6" />
          </view>
        </view>
      </view>

      <!-- Location Preview Card -->
      <view v-if="record.location && record.latitude" class="location-preview-card">
        <map
          v-if="showMap"
          class="location-map"
          :latitude="record.latitude"
          :longitude="record.longitude"
          :markers="mapMarkers"
          :show-location="false"
          :scale="16"
          @click="selectLocation"
        />
        <view class="location-info">
          <text class="location-name">{{ record.location }}</text>
          <text class="location-address">{{ record.address || '暂无详细地址' }}</text>
        </view>
      </view>

      <!-- Frequent Locations -->
      <view v-if="frequentLocations.length > 0 && !record.location" class="frequent-locations-card">
        <view class="frequent-header">
          <text class="frequent-title">常用地点</text>
        </view>
        <view class="frequent-list">
          <view
            v-for="(loc, index) in frequentLocations"
            :key="index"
            class="frequent-item"
            @click="selectFrequentLocation(loc)"
          >
            <uni-icons type="location-filled" size="20" color="#006860" />
            <view class="frequent-info">
              <text class="frequent-name">{{ loc.name }}</text>
              <text class="frequent-address">{{ loc.address }}</text>
            </view>
            <text class="frequent-count">{{ loc.useCount }}次</text>
          </view>
        </view>
      </view>

      <!-- Input Fields -->
      <view class="input-section">
        <view class="input-group">
          <text class="input-label">饮品名称</text>
          <input
            class="input-field"
            v-model="record.name"
            placeholder="输入饮品名称"
          />
        </view>
        <view class="input-group">
          <text class="input-label">笔记备注</text>
          <textarea
            class="textarea-field"
            v-model="record.notes"
            placeholder="添加一点你的评价..."
            :maxlength="200"
          />
        </view>
      </view>

      <!-- Action Buttons -->
      <view class="action-section">
        <button class="save-action" @click="saveRecord">
          <uni-icons type="checkmarkempty" size="20" color="#ffffff" />
          <text class="action-text">完成编辑并更新</text>
        </button>
        <button class="delete-action" @click="deleteRecord">
          <uni-icons type="trash" size="20" color="#ba1a1a" />
          <text class="delete-text">删除此条记录</text>
        </button>
      </view>

      <!-- Bottom Spacing -->
      <view class="bottom-spacing" />
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { addRecord, uploadImage } from '@/utils/food-diary/api.js'
import { chooseLocation, getFrequentLocations } from '@/utils/location.js'
import { networkDiagnosis } from '@/utils/network-diagnosis.js'
import { smartCutout, detectSubjects, quickCutout } from '@/utils/ai-cutout.js'

const record = ref({
  id: null,
  image: '',
  cutoutImage: '',
  date: '',
  shop: '',
  location: '',        // 地点名称
  address: '',         // 详细地址
  latitude: null,      // 纬度
  longitude: null,     // 经度
  name: '',
  notes: ''
})

const isNewRecord = ref(true)
const isSaving = ref(false)
const showMap = ref(false) // 地图懒加载控制
const frequentLocations = ref([]) // 常用地点列表

// 地图标记数据
const mapMarkers = computed(() => {
  if (!record.value.latitude || !record.value.longitude) return []

  return [{
    id: 0,
    latitude: record.value.latitude,
    longitude: record.value.longitude,
    width: 32,
    height: 32,
    title: record.value.location
  }]
})

onLoad((options) => {
  if (options.id) {
    // 编辑现有记录
    isNewRecord.value = false
    // TODO: 从后端加载记录数据
    console.log('Loading record:', options.id)
  } else {
    // 新建记录：从URL参数获取图片
    isNewRecord.value = true
    if (options.imageUrl) {
      record.value.image = decodeURIComponent(options.imageUrl)
    }
    if (options.cutoutUrl) {
      record.value.cutoutImage = decodeURIComponent(options.cutoutUrl)
    }
    // 设置当前日期
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    record.value.date = `${year}-${month}-${day}`
  }

  // 加载常用地点
  loadFrequentLocations()
})

// 页面加载后延迟显示地图（性能优化）
onMounted(() => {
  setTimeout(() => {
    showMap.value = true
  }, 300)

  // 开发环境：执行网络诊断
  console.log('🔧 开发环境：执行网络诊断')
  console.log('💡 提示: 在控制台输入 networkDiagnosis() 查看详细诊断')
  networkDiagnosis()
})

// 加载常用地点
const loadFrequentLocations = async () => {
  try {
    frequentLocations.value = await getFrequentLocations()
  } catch (error) {
    console.error('加载常用地点失败:', error)
  }
}

const goBack = () => {
  uni.navigateBack()
}

const saveRecord = async () => {
  // 验证必填项
  if (!record.value.name || !record.value.name.trim()) {
    uni.showToast({
      title: '请输入饮品名称',
      icon: 'none'
    })
    return
  }

  if (!record.value.image) {
    uni.showToast({
      title: '请上传饮品图片',
      icon: 'none'
    })
    return
  }

  if (isSaving.value) return
  isSaving.value = true

  try {
    uni.showLoading({ title: '保存中...' })

    // 准备保存数据
    const saveData = {
      date: record.value.date,
      time: new Date().toTimeString().slice(0, 5), // 当前时间 HH:MM
      category: 'coffee',
      images: [record.value.image],
      description: record.value.name,
      storeName: record.value.shop,
      storeAddress: record.value.location,
      city: '',
      note: record.value.notes,
      mood: 'good'
    }

    // 如果有位置信息，添加到数据中
    if (record.value.latitude && record.value.longitude) {
      saveData.location = {
        name: record.value.location,
        address: record.value.address,
        latitude: record.value.latitude,
        longitude: record.value.longitude
      }
    }

    // 如果有抠图结果，添加到数据中
    if (record.value.cutoutImage) {
      saveData.vision = {
        selectedItem: {
          cutoutUrl: record.value.cutoutImage,
          thumbnailUrl: record.value.cutoutImage
        }
      }
    }

    // 调用后端 API
    const result = await addRecord(saveData)

    uni.hideLoading()
    uni.showToast({
      title: '保存成功',
      icon: 'success'
    })

    // 延迟返回上一页
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } catch (error) {
    uni.hideLoading()
    console.error('保存记录失败:', error)

    // 友好的错误提示
    let errorMsg = '保存失败，请重试'

    if (error.message && error.message.includes('登录已过期')) {
      errorMsg = '请先登录'

      // 提示用户设置 Token
      uni.showModal({
        title: '需要登录',
        content: '请先登录后再保存记录。在控制台运行 setDevToken() 或 setRealToken("真实Token")',
        confirmText: '知道了',
        success: () => {
          console.log('\n💡 登录方法：')
          console.log('1. 在控制台运行: setDevToken()')
          console.log('2. 或运行: setRealToken("你的真实Token")')
        }
      })
      return
    }

    uni.showToast({
      title: errorMsg,
      icon: 'none'
    })
  } finally {
    isSaving.value = false
  }
}

const changeImage = () => {
  uni.chooseImage({
    count: 1,
    sourceType: ['camera', 'album'],
    success: (res) => {
      record.value.image = res.tempFilePaths[0]
    }
  })
}

const selectDate = () => {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  uni.showActionSheet({
    itemList: ['今天', '昨天', '选择日期'],
    success: (res) => {
      if (res.tapIndex === 0) {
        const year = today.getFullYear()
        const month = String(today.getMonth() + 1).padStart(2, '0')
        const day = String(today.getDate()).padStart(2, '0')
        record.value.date = `${year}-${month}-${day}`
      } else if (res.tapIndex === 1) {
        const year = yesterday.getFullYear()
        const month = String(yesterday.getMonth() + 1).padStart(2, '0')
        const day = String(yesterday.getDate()).padStart(2, '0')
        record.value.date = `${year}-${month}-${day}`
      }
    }
  })
}

const selectShop = () => {
  uni.navigateTo({ url: '/pages/store/index' })
}

/**
 * 显示智能抠图选项
 */
const showCutoutOptions = () => {
  if (!record.value.image) {
    uni.showToast({
      title: '请先上传图片',
      icon: 'none'
    })
    return
  }

  uni.showActionSheet({
    itemList: [
      '智能识别主体',
      '抠出咖啡杯',
      '抠出食物',
      '抠出盘子',
      '抠出所有主体'
    ],
    success: async (res) => {
      switch (res.tapIndex) {
        case 0:
          await handleAutoDetect()
          break
        case 1:
          await handleSmartCutout('咖啡杯')
          break
        case 2:
          await handleSmartCutout('食物')
          break
        case 3:
          await handleSmartCutout('盘子')
          break
        case 4:
          await handleSmartCutout('所有主体')
          break
      }
    }
  })
}

/**
 * 自动识别主体
 */
const handleAutoDetect = async () => {
  try {
    uni.showLoading({ title: '识别中...' })

    // 上传图片
    const uploadResult = await uploadImage(record.value.image, 'food-diary')

    // 调用主体识别接口
    const result = await detectSubjects(uploadResult.url)

    uni.hideLoading()

    if (result.subjects && result.subjects.length > 0) {
      // 显示识别到的主体列表
      const subjects = result.subjects.map(s =>
        `${s.label} (${Math.round(s.confidence * 100)}%)`
      )

      uni.showActionSheet({
        itemList: subjects,
        success: async (res) => {
          const selected = result.subjects[res.tapIndex]
          await handleSmartCutout(selected.label)
        }
      })
    } else {
      uni.showToast({
        title: '未识别到主体',
        icon: 'none'
      })
    }
  } catch (error) {
    uni.hideLoading()
    console.error('主体识别失败:', error)
    uni.showToast({
      title: error.message || '识别失败',
      icon: 'none'
    })
  }
}

/**
 * 智能抠图
 */
const handleSmartCutout = async (description) => {
  try {
    uni.showLoading({ title: '抠图中...' })

    // 上传图片（如果还没有上传）
    let imageUrl = record.value.image
    if (!imageUrl.startsWith('http')) {
      const uploadResult = await uploadImage(record.value.image, 'food-diary')
      imageUrl = uploadResult.url
    }

    // 调用智能抠图接口
    const result = await smartCutout({
      imageUrl: imageUrl,
      description: description,
      returnMask: false
    })

    uni.hideLoading()

    // 保存抠图结果
    record.value.cutoutImage = result.cutoutUrl

    uni.showToast({
      title: '抠图成功',
      icon: 'success'
    })
  } catch (error) {
    uni.hideLoading()
    console.error('智能抠图失败:', error)
    uni.showToast({
      title: error.message || '抠图失败',
      icon: 'none'
    })
  }
}

const selectLocation = async () => {
  try {
    const result = await chooseLocation()

    if (result) {
      record.value.location = result.name || result.address
      record.value.address = result.address
      record.value.latitude = result.latitude
      record.value.longitude = result.longitude

      // 重新加载常用地点（更新使用次数）
      loadFrequentLocations()
    }
  } catch (error) {
    console.error('选择地点失败:', error)
  }
}

// 选择常用地点
const selectFrequentLocation = (location) => {
  record.value.location = location.name
  record.value.address = location.address
  record.value.latitude = location.latitude
  record.value.longitude = location.longitude
}

const clearLocation = () => {
  record.value.location = ''
  record.value.address = ''
  record.value.latitude = null
  record.value.longitude = null
}

const deleteRecord = () => {
  if (isNewRecord.value) {
    // 新记录直接返回
    uni.navigateBack()
    return
  }

  uni.showModal({
    title: '删除记录',
    content: '确定要删除这条记录吗？',
    confirmColor: '#ba1a1a',
    success: (res) => {
      if (res.confirm) {
        // TODO: 调用后端删除 API
        uni.showToast({
          title: '已删除',
          icon: 'success'
        })
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      }
    }
  })
}
</script>

<style lang="scss" scoped>
@use '@/styles/theme.scss' as *;

.detail-page {
  min-height: 100vh;
  background: $background;
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
  font-weight: $font-weight-bold;
  color: $primary;
}

.save-btn {
  font-size: 13px;
  font-weight: $font-weight-bold;
  color: $primary;
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
}

// Image Section
.image-section {
  display: flex;
  justify-content: center;
  padding: 24px 0;
}

.image-container {
  position: relative;
}

.image-glow {
  position: absolute;
  inset: -20px;
  background: rgba(0, 104, 96, 0.2);
  filter: blur(60px);
  border-radius: 50%;
  scale: 1.1;
}

.beverage-image {
  width: 256px;
  height: 256px;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(17, 153, 142, 0.15);
  border: 4px solid $surface-container-lowest;
  transform: rotate(-3deg);
  position: relative;
  z-index: 1;
  overflow: hidden;
  background: $surface-container-lowest;

  image {
    width: 100%;
    height: 100%;
  }
}

.beverage-placeholder {
  width: 256px;
  height: 256px;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(17, 153, 142, 0.15);
  border: 4px solid $surface-container-lowest;
  transform: rotate(-3deg);
  position: relative;
  z-index: 1;
  background: $surface-container;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.placeholder-text {
  font-size: 14px;
  color: $outline;
}

.camera-badge {
  position: absolute;
  bottom: -8px;
  right: -8px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: $secondary-container;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 2;

  &::after {
    border: none;
  }
}

// Cutout Card
.cutout-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: $surface-container-lowest;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(17, 153, 142, 0.08);
  margin-bottom: 16px;
}

.cutout-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.cutout-thumb {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  overflow: hidden;
  background: $surface-container;
  border: 1px solid rgba(109, 122, 119, 0.3);

  image {
    width: 100%;
    height: 100%;
  }
}

.cutout-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cutout-label {
  font-size: 13px;
  font-weight: $font-weight-semibold;
  color: $on-surface-variant;
  display: block;
}

.cutout-status {
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $on-surface;
  display: block;
  margin-top: 4px;
}

.cutout-valid {
  display: flex;
  align-items: center;
  gap: 8px;
}

.valid-text {
  font-size: 13px;
  font-weight: $font-weight-semibold;
  color: $primary;

  &.active {
    color: $primary;
  }

  &:not(.active) {
    color: $on-surface-variant;
  }
}

// Info Cards
.info-cards {
  background: $surface-container-lowest;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(17, 153, 142, 0.08);
  margin-bottom: 16px;
}

.info-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  transition: background $duration-fast $ease-out;

  &:active {
    background: rgba(0, 131, 121, 0.05);
  }

  &:not(:last-child) {
    border-bottom: 1px solid $surface-container;
  }
}

.info-content {
  flex: 1;
}

.info-label {
  font-size: 13px;
  font-weight: $font-weight-semibold;
  color: $on-surface-variant;
  display: block;
}

.info-value {
  font-size: 16px;
  color: $on-surface;
  display: block;
  margin-top: 4px;
}

// Location Preview Card
.location-preview-card {
  margin: 16px 0;
  background: $surface-container-lowest;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(17, 153, 142, 0.08);
}

.location-map {
  width: 100%;
  height: 160px;
}

.location-info {
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.location-name {
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $on-surface;
}

.location-address {
  font-size: 13px;
  color: $on-surface-variant;
}

// Location placeholder style
.info-value.placeholder {
  color: $on-surface-variant;
  opacity: 0.6;
}

// Location actions
.location-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

// Frequent Locations Card
.frequent-locations-card {
  margin: 16px 0;
  background: $surface-container-lowest;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(17, 153, 142, 0.08);
}

.frequent-header {
  padding: 16px 24px;
  border-bottom: 1px solid $surface-container;
}

.frequent-title {
  font-size: 13px;
  font-weight: $font-weight-semibold;
  color: $on-surface-variant;
}

.frequent-list {
  max-height: 200px;
  overflow-y: auto;
}

.frequent-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  transition: background $duration-fast $ease-out;

  &:active {
    background: rgba(0, 131, 121, 0.05);
  }

  &:not(:last-child) {
    border-bottom: 1px solid $surface-container;
  }
}

.frequent-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.frequent-name {
  font-size: 15px;
  font-weight: $font-weight-semibold;
  color: $on-surface;
}

.frequent-address {
  font-size: 12px;
  color: $on-surface-variant;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.frequent-count {
  font-size: 12px;
  color: $primary;
  font-weight: $font-weight-semibold;
}

// Input Section
.input-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-label {
  font-size: 13px;
  font-weight: $font-weight-semibold;
  color: $on-surface-variant;
  margin-left: 16px;
}

.input-field {
  width: 100%;
  height: 56px;
  padding: 0 24px;
  background: $surface-container-lowest;
  border-radius: 16px;
  font-size: 18px;
  color: $on-surface;
  box-shadow: 0 4px 20px rgba(17, 153, 142, 0.08);

  &::placeholder {
    color: $on-surface-variant;
  }
}

.textarea-field {
  width: 100%;
  height: 120px;
  padding: 24px;
  background: $surface-container-lowest;
  border-radius: 16px;
  font-size: 16px;
  color: $on-surface;
  box-shadow: 0 4px 20px rgba(17, 153, 142, 0.08);

  &::placeholder {
    color: $on-surface-variant;
  }
}

// Action Section
.action-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 32px;
  padding-bottom: 48px;
}

.save-action {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 56px;
  background: $primary-gradient;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 104, 96, 0.2);

  &::after {
    border: none;
  }

  &:active {
    transform: scale(0.98);
  }
}

.action-text {
  font-size: 16px;
  font-weight: $font-weight-bold;
  color: $on-primary;
}

.delete-action {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 56px;
  background: rgba(255, 218, 214, 0.2);
  border-radius: 16px;
  transition: background $duration-fast $ease-out;

  &::after {
    border: none;
  }

  &:active {
    background: rgba(255, 218, 214, 0.4);
  }
}

.delete-text {
  font-size: 16px;
  font-weight: $font-weight-bold;
  color: $error;
}

// Bottom Spacing
.bottom-spacing {
  height: 32px;
}
</style>

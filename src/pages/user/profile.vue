<template>
  <view class="profile-edit-page">
    <!-- Top AppBar -->
    <view class="app-header">
      <button class="header-btn" @click="goBack">
        <uni-icons type="left" size="24" color="#3d4947" />
      </button>
      <text class="header-title">编辑资料</text>
      <button class="save-btn" @click="saveProfile">保存</button>
    </view>

    <!-- Main Content -->
    <scroll-view class="main-content" scroll-y :show-scrollbar="false">
      <!-- Avatar Section -->
      <view class="avatar-section">
        <view class="avatar-container" @click="changeAvatar">
          <image class="avatar-large" :src="userInfo.avatar || '/static/images/avatar.png'" mode="aspectFill" />
          <view class="avatar-overlay">
            <uni-icons type="camera" size="32" color="#ffffff" />
            <text class="avatar-tip">点击更换头像</text>
          </view>
        </view>
      </view>

      <!-- Form Section -->
      <view class="form-section">
        <!-- Nickname -->
        <view class="form-item">
          <text class="form-label">昵称</text>
          <input
            class="form-input"
            v-model="userInfo.nickname"
            placeholder="请输入昵称"
            maxlength="20"
          />
          <text class="form-counter">{{ userInfo.nickname?.length || 0 }}/20</text>
        </view>

        <!-- Gender -->
        <view class="form-item">
          <text class="form-label">性别</text>
          <view class="gender-options">
            <view
              class="gender-option"
              :class="{ active: userInfo.gender === 1 }"
              @click="userInfo.gender = 1"
            >
              <text>男</text>
            </view>
            <view
              class="gender-option"
              :class="{ active: userInfo.gender === 2 }"
              @click="userInfo.gender = 2"
            >
              <text>女</text>
            </view>
            <view
              class="gender-option"
              :class="{ active: userInfo.gender === 0 }"
              @click="userInfo.gender = 0"
            >
              <text>保密</text>
            </view>
          </view>
        </view>

        <!-- Birthday -->
        <view class="form-item" @click="showDatePicker = true">
          <text class="form-label">生日</text>
          <text class="form-value">
            {{ userInfo.birthday || '请选择生日' }}
          </text>
          <uni-icons type="right" size="20" color="#bcc9c6" />
        </view>

        <!-- City -->
        <view class="form-item">
          <text class="form-label">城市</text>
          <input
            class="form-input"
            v-model="userInfo.city"
            placeholder="请输入城市"
            maxlength="20"
          />
        </view>

        <!-- Bio -->
        <view class="form-item bio-item">
          <text class="form-label">个性签名</text>
          <textarea
            class="form-textarea"
            v-model="userInfo.bio"
            placeholder="介绍一下自己吧..."
            maxlength="100"
          />
          <text class="form-counter">{{ userInfo.bio?.length || 0 }}/100</text>
        </view>
      </view>

      <!-- Action Section -->
      <view class="action-section">
        <button class="action-btn save" @click="saveProfile">
          <text>保存修改</text>
        </button>
      </view>

      <!-- Bottom Spacing -->
      <view class="bottom-spacing" />
    </scroll-view>

    <!-- Date Picker -->
    <uni-datetime-picker
      v-if="showDatePicker"
      type="date"
      :value="userInfo.birthday"
      @change="onDateChange"
      @maskClick="showDatePicker = false"
    />
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getUserInfo, updateUserInfo, uploadImage } from '@/utils/food-diary/api.js'
import { setUserInfo, getUserInfo as getCachedUserInfo } from '@/utils/auth.js'

const userInfo = ref({
  nickname: '',
  avatar: '',
  gender: 0,
  birthday: '',
  city: '',
  bio: ''
})

const showDatePicker = ref(false)
const isSaving = ref(false)

// 加载用户信息
const loadUserInfo = async () => {
  // 先从缓存加载
  const cachedUser = getCachedUserInfo()
  if (cachedUser) {
    userInfo.value = {
      nickname: cachedUser.nickname || '',
      avatar: cachedUser.avatar || '',
      gender: cachedUser.gender || 0,
      birthday: cachedUser.birthday || '',
      city: cachedUser.city || '',
      bio: cachedUser.bio || ''
    }
  }

  // 从服务器获取最新数据
  try {
    const userData = await getUserInfo()
    userInfo.value = {
      nickname: userData.nickname || '',
      avatar: userData.avatar || '',
      gender: userData.gender || 0,
      birthday: userData.birthday || '',
      city: userData.city || '',
      bio: userData.bio || ''
    }

    // 更新缓存
    setUserInfo(userData)
  } catch (error) {
    console.error('获取用户信息失败:', error)
    uni.showToast({
      title: '获取信息失败',
      icon: 'none'
    })
  }
}

// 更换头像
const changeAvatar = async () => {
  try {
    // 选择图片
    const res = await new Promise((resolve, reject) => {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: resolve,
        fail: reject
      })
    })

    const tempFilePath = res.tempFilePaths[0]

    uni.showLoading({ title: '上传中...' })

    // 上传图片
    const uploadRes = await uploadImage(tempFilePath, 'avatar')

    // 更新显示
    userInfo.value.avatar = uploadRes.url

    uni.hideLoading()
    uni.showToast({
      title: '上传成功',
      icon: 'success'
    })
  } catch (error) {
    uni.hideLoading()
    console.error('上传头像失败:', error)

    if (error.errMsg && !error.errMsg.includes('cancel')) {
      uni.showToast({
        title: error.message || '上传失败',
        icon: 'none'
      })
    }
  }
}

// 日期选择
const onDateChange = (e) => {
  userInfo.value.birthday = e
  showDatePicker.value = false
}

// 保存用户信息
const saveProfile = async () => {
  // 验证昵称
  if (!userInfo.value.nickname || userInfo.value.nickname.trim().length === 0) {
    uni.showToast({
      title: '请输入昵称',
      icon: 'none'
    })
    return
  }

  if (userInfo.value.nickname.length > 20) {
    uni.showToast({
      title: '昵称最多20个字符',
      icon: 'none'
    })
    return
  }

  if (isSaving.value) return
  isSaving.value = true

  try {
    uni.showLoading({ title: '保存中...' })

    // 调用 API 更新用户信息
    await updateUserInfo({
      nickname: userInfo.value.nickname,
      avatar: userInfo.value.avatar,
      gender: userInfo.value.gender,
      birthday: userInfo.value.birthday,
      city: userInfo.value.city,
      bio: userInfo.value.bio
    })

    // 更新缓存
    setUserInfo(userInfo.value)

    uni.hideLoading()
    uni.showToast({
      title: '保存成功',
      icon: 'success'
    })

    // 延迟返回
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } catch (error) {
    uni.hideLoading()
    console.error('保存用户信息失败:', error)
    uni.showToast({
      title: error.message || '保存失败',
      icon: 'none'
    })
  } finally {
    isSaving.value = false
  }
}

const goBack = () => {
  uni.navigateBack()
}

onMounted(() => {
  loadUserInfo()
})
</script>

<style lang="scss" scoped>
@use '@/styles/theme.scss' as *;

.profile-edit-page {
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
  font-size: 14px;
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
  height: calc(100vh - 88px);
}

// Avatar Section
.avatar-section {
  display: flex;
  justify-content: center;
  padding: 32px 0;
}

.avatar-container {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  background: $surface-container;
  box-shadow: 0 8px 24px rgba(17, 153, 142, 0.12);
}

.avatar-large {
  width: 100%;
  height: 100%;
}

.avatar-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity $duration-fast $ease-out;

  &:active {
    opacity: 1;
  }
}

.avatar-container:active .avatar-overlay {
  opacity: 1;
}

.avatar-tip {
  font-size: 12px;
  color: #ffffff;
}

// Form Section
.form-section {
  background: $surface-container-lowest;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(17, 153, 142, 0.08);
}

.form-item {
  padding: 20px 24px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid $surface-container;

  &:last-child {
    border-bottom: none;
  }

  &.bio-item {
    flex-direction: column;
    align-items: stretch;
  }
}

.form-label {
  font-size: 14px;
  font-weight: $font-weight-semibold;
  color: $on-surface-variant;
  width: 80px;
  flex-shrink: 0;

  .bio-item & {
    width: auto;
    margin-bottom: 12px;
  }
}

.form-input {
  flex: 1;
  font-size: 16px;
  color: $on-surface;
  text-align: right;
}

.form-value {
  flex: 1;
  font-size: 16px;
  color: $on-surface;
  text-align: right;
}

.form-counter {
  font-size: 12px;
  color: $outline-variant;
  margin-left: 8px;
  flex-shrink: 0;

  .bio-item & {
    text-align: right;
    margin-top: 8px;
  }
}

.form-textarea {
  width: 100%;
  height: 100px;
  font-size: 16px;
  color: $on-surface;
  line-height: 1.5;
}

// Gender Options
.gender-options {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.gender-option {
  padding: 8px 20px;
  border-radius: 20px;
  background: $surface-container;
  font-size: 14px;
  color: $on-surface-variant;
  transition: all $duration-fast $ease-out;

  &.active {
    background: $primary-container;
    color: $on-primary-container;
    font-weight: $font-weight-semibold;
  }

  &:active {
    transform: scale(0.95);
  }
}

// Action Section
.action-section {
  padding: 32px 0;
}

.action-btn {
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: $font-weight-bold;
  transition: all $duration-fast $ease-out;

  &::after {
    border: none;
  }

  &:active {
    transform: scale(0.98);
  }

  &.save {
    background: $primary-gradient;
    color: $on-primary;
    box-shadow: 0 4px 12px rgba(0, 104, 96, 0.2);
  }
}

// Bottom Spacing
.bottom-spacing {
  height: 32px;
}
</style>

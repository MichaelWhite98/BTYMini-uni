<template>
  <view class="test-page">
    <view class="test-section">
      <text class="test-title">uni-icons 测试</text>

      <view class="test-row">
        <uni-icons type="bars" size="30" color="#333"></uni-icons>
        <text>菜单图标 (bars)</text>
      </view>

      <view class="test-row">
        <uni-icons type="person" size="30" color="#11998e"></uni-icons>
        <text>用户图标 (person)</text>
      </view>

      <view class="test-row">
        <uni-icons type="calendar" size="30" color="#f57c00"></uni-icons>
        <text>日历图标 (calendar)</text>
      </view>

      <view class="test-row">
        <uni-icons type="plus" size="30" color="#38ef7d"></uni-icons>
        <text>加号图标 (plus)</text>
      </view>

      <view class="test-row">
        <uni-icons type="search" size="30" color="#2196f3"></uni-icons>
        <text>搜索图标 (search)</text>
      </view>

      <view class="test-row">
        <uni-icons type="camera" size="30" color="#e91e63"></uni-icons>
        <text>相机图标 (camera)</text>
      </view>

      <view class="test-row">
        <uni-icons type="heart" size="30" color="#f44336"></uni-icons>
        <text>心形图标 (heart)</text>
      </view>

      <view class="test-row">
        <uni-icons type="star" size="30" color="#ff9800"></uni-icons>
        <text>星星图标 (star)</text>
      </view>
    </view>
  </view>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.test-page {
  padding: 20px;
  background: #fafafa;
  min-height: 100vh;
}

.test-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
}

.test-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
  display: block;
}

.test-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;

  text {
    font-size: 14px;
    color: #666;
  }
}
</style>

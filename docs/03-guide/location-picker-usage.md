# 地点选择功能使用指南

## 概述

本功能提供了完整的地点选择、管理和展示解决方案，包括：
- 地图位置选择
- 常用地点管理
- 权限处理
- 距离计算
- 友好的错误提示

## 功能特性

### 1. 基础位置选择

使用 `chooseLocation()` 打开地图选择位置：

```javascript
import { chooseLocation } from '@/utils/location.js'

const selectLocation = async () => {
  const result = await chooseLocation()

  if (result) {
    console.log('地点名称:', result.name)
    console.log('详细地址:', result.address)
    console.log('经度:', result.longitude)
    console.log('纬度:', result.latitude)
  }
}
```

**参数选项：**

```javascript
const result = await chooseLocation({
  saveToFrecent: true  // 是否保存到常用地点，默认 true
})
```

### 2. 常用地点管理

#### 保存常用地点

```javascript
import { saveFrequentLocation } from '@/utils/location.js'

const location = {
  name: '星巴克（中关村店）',
  address: '北京市海淀区中关村大街1号',
  latitude: 39.984120,
  longitude: 116.307430
}

await saveFrequentLocation(location)
```

#### 获取常用地点列表

```javascript
import { getFrequentLocations } from '@/utils/location.js'

const locations = await getFrequentLocations()
// 返回按使用次数排序的地点数组
```

#### 删除常用地点

```javascript
import { deleteFrequentLocation } from '@/utils/location.js'

// 删除索引为 0 的地点
await deleteFrequentLocation(0)
```

#### 清空所有常用地点

```javascript
import { clearFrequentLocations } from '@/utils/location.js'

await clearFrequentLocations()
```

### 3. 获取当前位置

```javascript
import { getCurrentLocation } from '@/utils/location.js'

const location = await getCurrentLocation({
  type: 'gcj02',    // 坐标系类型，默认 'gcj02'
  showTip: true     // 是否显示错误提示，默认 true
})

if (location) {
  console.log('当前纬度:', location.latitude)
  console.log('当前经度:', location.longitude)
}
```

### 4. 距离计算

```javascript
import { calculateDistance, formatDistance } from '@/utils/location.js'

// 计算两点距离（米）
const distance = calculateDistance(
  39.904202, 116.407394, // 点1：北京
  31.230416, 121.473701  // 点2：上海
)

// 格式化距离显示
const distanceText = formatDistance(distance)
// 输出: "1067.9km"
```

### 5. 权限检查

```javascript
import { checkLocationPermission } from '@/utils/location.js'

const hasPermission = await checkLocationPermission()
if (!hasPermission) {
  // 用户拒绝了权限，已自动弹出引导提示
  return
}
```

### 6. 位置文本格式化

```javascript
import { formatLocationText } from '@/utils/location.js'

const location = {
  name: '星巴克',
  address: '北京市海淀区中关村大街1号'
}

const text = formatLocationText(location)
// 输出: "星巴克"
```

## 在详情页中使用

### 完整示例

```vue
<template>
  <view>
    <!-- 地点选择卡片 -->
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

    <!-- 地图预览 -->
    <view v-if="record.location && record.latitude" class="location-preview-card">
      <map
        class="location-map"
        :latitude="record.latitude"
        :longitude="record.longitude"
        :markers="mapMarkers"
        :scale="16"
        @click="selectLocation"
      />
      <view class="location-info">
        <text class="location-name">{{ record.location }}</text>
        <text class="location-address">{{ record.address }}</text>
      </view>
    </view>

    <!-- 常用地点快速选择 -->
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
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { chooseLocation, getFrequentLocations } from '@/utils/location.js'

const record = ref({
  location: '',
  address: '',
  latitude: null,
  longitude: null
})

const frequentLocations = ref([])

// 地图标记
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

onLoad(() => {
  loadFrequentLocations()
})

// 加载常用地点
const loadFrequentLocations = async () => {
  frequentLocations.value = await getFrequentLocations()
}

// 选择地点
const selectLocation = async () => {
  const result = await chooseLocation()

  if (result) {
    record.value.location = result.name || result.address
    record.value.address = result.address
    record.value.latitude = result.latitude
    record.value.longitude = result.longitude

    // 重新加载常用地点（更新使用次数）
    loadFrequentLocations()
  }
}

// 快速选择常用地点
const selectFrequentLocation = (location) => {
  record.value.location = location.name
  record.value.address = location.address
  record.value.latitude = location.latitude
  record.value.longitude = location.longitude
}

// 清除地点
const clearLocation = () => {
  record.value.location = ''
  record.value.address = ''
  record.value.latitude = null
  record.value.longitude = null
}
</script>
```

## 权限配置

### manifest.json

在 `manifest.json` 中添加以下配置：

```json
{
  "mp-weixin": {
    "permission": {
      "scope.userLocation": {
        "desc": "您的位置信息将用于标记饮品饮用地点，为您提供更好的记录体验"
      }
    },
    "requiredPrivateInfos": [
      "getLocation",
      "chooseLocation"
    ]
  }
}
```

## 性能优化建议

### 1. 地图懒加载

```vue
<map
  v-if="showMap"
  class="location-map"
  :latitude="record.latitude"
  :longitude="record.longitude"
/>
```

```javascript
const showMap = ref(false)

onMounted(() => {
  setTimeout(() => {
    showMap.value = true
  }, 300)
})
```

### 2. 常用地点缓存

常用地点数据会自动缓存到本地存储，无需额外处理。

### 3. 按需加载

只在需要时加载常用地点列表：

```javascript
// 只在显示时加载
const loadFrequentLocations = async () => {
  if (frequentLocations.value.length === 0) {
    frequentLocations.value = await getFrequentLocations()
  }
}
```

## 错误处理

所有 API 都已经内置了完善的错误处理：

- 权限被拒绝：自动弹出引导提示
- 网络异常：显示友好的错误信息
- 用户取消：静默返回 null
- 其他错误：显示通用错误提示

## 测试

运行测试文件：

```bash
node src/utils/location.test.js
```

测试覆盖：
- ✅ 常用地点保存、获取、删除、清空
- ✅ 距离计算和格式化
- ✅ 位置文本格式化
- ✅ 权限检查

## 注意事项

1. **坐标系**：使用国测局坐标系（gcj02），适用于国内地图
2. **权限说明**：权限申请时的描述文案要清晰友好
3. **数据兼容**：旧数据没有位置信息时，相关功能会自动隐藏
4. **存储限制**：常用地点最多保存 10 个，按使用频率自动排序

## 更新日志

### v2.0.0 (2026-06-21)
- ✅ 新增常用地点管理功能
- ✅ 新增距离计算功能
- ✅ 优化权限引导流程
- ✅ 完善错误处理
- ✅ 添加地图懒加载
- ✅ 改进用户提示信息

### v1.0.0 (2026-06-20)
- ✅ 基础地图选择功能
- ✅ 地点预览组件
- ✅ 权限检查

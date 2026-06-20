# Detail 页面地图位置选择功能设计

## 📋 概述

本文档描述了 `pages/detail/index` 页面集成地图和位置选择功能的设计方案，允许用户在饮品详情页面选择和标记饮用地点。

**创建日期**: 2026-06-20
**功能模块**: 地图位置选择
**目标页面**: pages/detail/index.vue

---

## 🎯 功能目标

### 核心需求
1. **地点展示**: 在详情页展示已选择的地点信息
2. **地图选择**: 用户可以在地图上选择/标记饮用地点
3. **位置搜索**: 支持通过关键词搜索地点
4. **当前位置**: 支持获取用户当前位置
5. **数据关联**: 将位置信息与饮品记录关联保存

### 用户场景
- 用户记录饮品时，想要标记在哪家店喝的
- 用户想要记录具体的饮用位置（咖啡馆、办公室、家里等）
- 用户回顾记录时，可以看到饮品地点的地图位置

---

## 🏗️ 技术架构

### 平台兼容性
本项目为 uni-app 开发的微信小程序，需要考虑以下技术选型：

#### 方案对比

| 方案 | 优点 | 缺点 | 推荐度 |
|------|------|------|--------|
| **腾讯地图 SDK** | 微信小程序原生支持、性能好、免费额度充足 | 需要申请密钥、仅限微信平台 | ⭐⭐⭐⭐⭐ |
| **uni-app 地图组件** | 跨平台兼容、API 统一 | 功能相对简化、某些平台限制 | ⭐⭐⭐⭐ |
| **第三方地图插件** | 功能丰富 | 增加包体积、可能有费用 | ⭐⭐⭐ |

**推荐方案**: 使用 **uni-app 地图组件** + **腾讯位置服务 SDK** 混合方案

---

## 📱 UI 设计方案

### 1. 详情页地点卡片优化

#### 当前设计（第74-81行）
```vue
<view class="info-card">
  <uni-icons type="location" size="24" color="#6d7a77" />
  <view class="info-content">
    <text class="info-label">地点</text>
    <text class="info-value">{{ record.location }}</text>
  </view>
  <uni-icons type="map" size="20" color="#bcc9c6" />
</view>
```

#### 优化后设计
```vue
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

<!-- 地点预览卡片 -->
<view v-if="record.location && record.latitude" class="location-preview-card">
  <map
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
```

### 2. 地图选择页面设计

#### 页面结构
创建新页面 `pages/location-picker/index.vue`

```
┌─────────────────────────────────┐
│  ← 选择地点          搜索地点    │ 顶部导航栏
├─────────────────────────────────┤
│  🔍 搜索框                       │ 搜索区域
├─────────────────────────────────┤
│                                 │
│      地图显示区域                │ 地图区域
│      - 当前位置标记              │
│      - 可选择地点                │
│      - 中心点标记                │
│                                 │
├─────────────────────────────────┤
│  📍 当前位置                     │ 快捷操作
│  🏠 家                          │
│  🏢 公司                        │
├─────────────────────────────────┤
│  📍 选中地点名称                 │ 底部确认栏
│  详细地址信息                    │
│  ┌───────────────────────────┐  │
│  │   确认选择                │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

---

## 🔧 技术实现方案

### 1. 数据模型设计

#### 数据结构扩展
在 `record` 对象中添加位置相关字段：

```javascript
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
```

#### 地图标记数据
```javascript
const mapMarkers = computed(() => {
  if (!record.value.latitude || !record.value.longitude) return []

  return [{
    id: 0,
    latitude: record.value.latitude,
    longitude: record.value.longitude,
    iconPath: '/static/icons/location-marker.png',
    width: 32,
    height: 32,
    title: record.value.location
  }]
})
```

### 2. API 集成

#### 腾讯位置服务 SDK 配置

**步骤 1: 申请密钥**
1. 访问 [腾讯位置服务](https://lbs.qq.com/)
2. 创建应用，获取 Key
3. 开启 WebService API 和小程序 SDK 权限

**步骤 2: 配置小程序**
```json
// manifest.json
{
  "mp-weixin": {
    "permission": {
      "scope.userLocation": {
        "desc": "您的位置信息将用于标记饮品饮用地点"
      }
    },
    "requiredPrivateInfos": [
      "getLocation",
      "chooseLocation"
    ]
  }
}
```

**步骤 3: 安装 SDK**
```bash
npm install qqmap-wx-jssdk --save
```

#### 地图工具类封装

创建 `utils/location.js`:

```javascript
import QQMapWX from 'qqmap-wx-jssdk'

// 初始化腾讯地图 SDK
const qqmap = new QQMapWX({
  key: 'YOUR_TENCENT_MAP_KEY' // 替换为实际密钥
})

/**
 * 获取当前位置
 */
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    uni.getLocation({
      type: 'gcj02',
      success: (res) => {
        // 逆地理编码获取地址信息
        qqmap.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: (addressRes) => {
            resolve({
              latitude: res.latitude,
              longitude: res.longitude,
              name: addressRes.result.formatted_addresses.recommend,
              address: addressRes.result.address
            })
          },
          fail: reject
        })
      },
      fail: reject
    })
  })
}

/**
 * 搜索地点
 */
export const searchLocation = (keyword, location) => {
  return new Promise((resolve, reject) => {
    qqmap.search({
      keyword: keyword,
      location: location ? `${location.latitude},${location.longitude}` : undefined,
      page_size: 20,
      success: (res) => {
        resolve(res.data.map(item => ({
          id: item.id,
          name: item.title,
          address: item.address,
          latitude: item.location.lat,
          longitude: item.location.lng,
          distance: item._distance
        })))
      },
      fail: reject
    })
  })
}

/**
 * 打开地图选择位置
 */
export const chooseLocation = () => {
  return new Promise((resolve, reject) => {
    uni.chooseLocation({
      success: (res) => {
        resolve({
          name: res.name,
          address: res.address,
          latitude: res.latitude,
          longitude: res.longitude
        })
      },
      fail: reject
    })
  })
}
```

### 3. 详情页功能实现

#### 选择地点方法
```javascript
import { chooseLocation } from '@/utils/location.js'

const selectLocation = async () => {
  try {
    const result = await chooseLocation()

    record.value.location = result.name || result.address
    record.value.address = result.address
    record.value.latitude = result.latitude
    record.value.longitude = result.longitude

  } catch (error) {
    if (error.errMsg !== 'chooseLocation:fail cancel') {
      uni.showToast({
        title: '选择地点失败',
        icon: 'none'
      })
    }
  }
}

const clearLocation = () => {
  record.value.location = ''
  record.value.address = ''
  record.value.latitude = null
  record.value.longitude = null
}
```

#### 保存数据更新
```javascript
const saveRecord = async () => {
  // ... 现有验证逻辑

  const saveData = {
    // ... 现有字段
    storeName: record.value.shop,
    storeAddress: record.value.location,
    // 新增位置字段
    location: {
      name: record.value.location,
      address: record.value.address,
      latitude: record.value.latitude,
      longitude: record.value.longitude
    },
    // ... 其他字段
  }

  // ... 保存逻辑
}
```

---

## 🎨 样式设计

### 地点预览卡片样式

```scss
// 地点预览卡片
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

// 地点占位符样式
.info-value.placeholder {
  color: $on-surface-variant;
  opacity: 0.6;
}

// 地点操作区
.location-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
```

---

## 📐 交互设计

### 用户操作流程

```
┌─────────────┐
│  点击地点卡片 │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  调用地图选择器  │
│  (uni.chooseLocation) │
└──────┬──────┘
       │
       ├─ 用户选择地点
       │       │
       │       ▼
       │  ┌─────────────┐
       │  │  返回位置信息 │
       │  │  - 名称      │
       │  │  - 地址      │
       │  │  - 经纬度    │
       │  └──────┬──────┘
       │         │
       │         ▼
       │  ┌─────────────┐
       │  │  更新表单数据 │
       │  │  显示地图预览 │
       │  └─────────────┘
       │
       ├─ 用户取消选择
       │       │
       │       ▼
       │  ┌─────────────┐
       │  │  保持原有数据 │
       │  └─────────────┘
       │
       └─ 选择失败
               │
               ▼
          ┌─────────────┐
          │  显示错误提示 │
          └─────────────┘
```

### 快捷操作

1. **清除地点**: 点击清除图标清除已选地点
2. **重新选择**: 点击地点卡片或地图预览重新选择
3. **查看地图**: 已选地点时显示缩略地图预览

---

## 🔐 权限处理

### 微信小程序权限配置

#### manifest.json 配置
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

#### app.json 配置（小程序原生）
```json
{
  "permission": {
    "scope.userLocation": {
      "desc": "您的位置信息将用于标记饮品饮用地点"
    }
  },
  "requiredPrivateInfos": [
    "getLocation",
    "chooseLocation"
  ]
}
```

### 权限引导处理

```javascript
/**
 * 检查并请求位置权限
 */
const checkLocationPermission = async () => {
  try {
    const res = await uni.getSetting()

    if (res.authSetting['scope.userLocation'] === false) {
      // 用户之前拒绝过，引导去设置页开启
      uni.showModal({
        title: '需要位置权限',
        content: '为了标记饮品饮用地点，需要获取您的位置信息',
        confirmText: '去设置',
        success: (modalRes) => {
          if (modalRes.confirm) {
            uni.openSetting()
          }
        }
      })
      return false
    }

    return true
  } catch (error) {
    console.error('检查权限失败:', error)
    return false
  }
}
```

---

## 🧪 测试方案

### 功能测试清单

#### 基础功能测试
- [ ] 点击地点卡片能正确打开地图选择器
- [ ] 能成功选择并显示地点名称
- [ ] 地图预览能正确显示选中位置
- [ ] 清除功能能正确清除位置信息
- [ ] 保存时位置信息正确提交到后端

#### 权限测试
- [ ] 首次使用时正确请求权限
- [ ] 拒绝权限后显示引导提示
- [ ] 从设置页返回后权限状态正确
- [ ] 无权限时功能降级处理

#### 异常测试
- [ ] 取消选择时不影响原有数据
- [ ] 网络异常时的错误提示
- [ ] 定位失败时的友好提示
- [ ] 地图加载失败的降级处理

#### 边界测试
- [ ] 地点名称过长时的显示处理
- [ ] 地址信息为空时的显示
- [ ] 同时选择店铺和地点的数据处理
- [ ] 编辑记录时正确加载已有位置

---

## 📊 性能优化

### 1. 地图组件懒加载
```vue
<map
  v-if="showMap"
  class="location-map"
  :latitude="record.latitude"
  :longitude="record.longitude"
/>
```

### 2. 缓存策略
- 缓存用户常用的地点列表
- 缓存最近选择的位置信息
- 使用本地存储减少网络请求

### 3. 按需加载 SDK
```javascript
// 只在需要时加载腾讯地图 SDK
let qqmap = null

export const getQQMap = () => {
  if (!qqmap) {
    qqmap = new QQMapWX({
      key: 'YOUR_KEY'
    })
  }
  return qqmap
}
```

---

## 🚀 开发计划

### 阶段一：基础功能（预计 2 天）
1. ✅ 配置腾讯位置服务 SDK
2. ✅ 实现基础地图选择功能
3. ✅ 详情页 UI 集成
4. ✅ 数据模型调整

### 阶段二：增强功能（预计 1 天）
1. ⬜ 地图预览组件
2. ⬜ 搜索地点功能
3. ⬜ 常用地点管理
4. ⬜ 权限引导优化

### 阶段三：优化完善（预计 1 天）
1. ⬜ 性能优化
2. ⬜ 异常处理完善
3. ⬜ UI/UX 细节优化
4. ⬜ 测试与修复

---

## 📝 注意事项

### 开发注意
1. **密钥安全**: 腾讯地图 Key 不应硬编码，建议使用环境变量
2. **权限说明**: 权限申请时的描述文案要清晰友好
3. **降级处理**: 定位失败时要有合理的降级方案
4. **数据兼容**: 要考虑旧数据没有位置信息的情况

### 兼容性注意
1. **小程序平台**: 主要支持微信小程序，其他平台需测试
2. **地图组件**: uni-app 的 map 组件在各平台表现有差异
3. **定位精度**: 不同设备的定位精度可能不同

### 后端注意
1. **数据库字段**: 需要添加位置相关字段
2. **API 更新**: 保存接口需要支持位置数据
3. **数据迁移**: 考虑现有数据的迁移方案

---

## 🔗 相关资源

### 文档参考
- [腾讯位置服务开发文档](https://lbs.qq.com/webDemoCenter/glAPI/glAPI/map)
- [uni-app 地图组件文档](https://uniapp.dcloud.io/component/map)
- [微信小程序定位接口](https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.chooseLocation.html)

### 相关文件
- 详情页：`src/pages/detail/index.vue`
- 配置文件：`manifest.json`
- 工具类：`src/utils/location.js`（待创建）

---

## 📅 更新记录

| 日期 | 版本 | 说明 |
|------|------|------|
| 2026-06-20 | 1.0 | 初版设计方案 |

---

## 📮 反馈

如有问题或建议，请联系开发团队。

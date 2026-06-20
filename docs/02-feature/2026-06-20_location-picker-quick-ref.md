# 地图位置选择功能 - 快速参考

## 🚀 快速开始

### 用户操作
1. 点击"地点"卡片
2. 在地图中搜索/选择位置
3. 点击"确定"返回
4. 查看地图预览
5. 保存记录

---

## 📂 文件清单

### 新建文件
```
src/utils/location.js                           # 位置工具类
```

### 修改文件
```
src/manifest.json                               # 权限配置
src/pages/detail/index.vue                      # 详情页实现
```

### 文档文件
```
docs/02-feature/2026-06-20_location-picker-design.md        # 设计方案
docs/02-feature/2026-06-20_location-picker-test-guide.md    # 测试指南
docs/02-feature/2026-06-20_location-picker-summary.md       # 开发总结
```

---

## 🔑 核心代码

### 1. 选择地点
```javascript
import { chooseLocation } from '@/utils/location.js'

const selectLocation = async () => {
  const result = await chooseLocation()
  if (result) {
    record.value.location = result.name || result.address
    record.value.address = result.address
    record.value.latitude = result.latitude
    record.value.longitude = result.longitude
  }
}
```

### 2. 清除地点
```javascript
const clearLocation = () => {
  record.value.location = ''
  record.value.address = ''
  record.value.latitude = null
  record.value.longitude = null
}
```

### 3. 保存位置数据
```javascript
const saveData = {
  // ... 其他字段
  storeAddress: record.value.location,
  location: {
    name: record.value.location,
    address: record.value.address,
    latitude: record.value.latitude,
    longitude: record.value.longitude
  }
}
```

---

## 🎨 UI 组件

### 地点卡片
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
    <uni-icons v-if="record.location" type="clear" @click.stop="clearLocation" />
    <uni-icons type="right" />
  </view>
</view>
```

### 地图预览
```vue
<view v-if="record.location && record.latitude" class="location-preview-card">
  <map
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
```

---

## 🔐 权限配置

### manifest.json
```json
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

---

## 📊 数据结构

### record 对象
```javascript
{
  location: '',        // 地点名称
  address: '',         // 详细地址
  latitude: null,      // 纬度
  longitude: null,     // 经度
}
```

### location 对象（保存时）
```javascript
{
  name: '星巴克咖啡',
  address: '北京市朝阳区...',
  latitude: 39.908823,
  longitude: 116.397470
}
```

---

## 🧪 测试要点

### 必测项
- ✅ 点击打开地图选择器
- ✅ 选择地点显示正常
- ✅ 地图预览显示
- ✅ 清除功能正常
- ✅ 保存数据正确
- ✅ 权限处理正确

---

## 🔗 API 参考

### uni.chooseLocation()
```javascript
uni.chooseLocation({
  success: (res) => {
    // res.name - 地点名称
    // res.address - 详细地址
    // res.latitude - 纬度
    // res.longitude - 经度
  },
  fail: (err) => {
    // err.errMsg - 错误信息
  }
})
```

### uni.getSetting()
```javascript
uni.getSetting({
  success: (res) => {
    // res.authSetting['scope.userLocation']
    // true: 已授权
    // false: 已拒绝
    // undefined: 未询问
  }
})
```

### uni.openSetting()
```javascript
uni.openSetting({
  success: (res) => {
    // 用户在设置页的操作结果
  }
})
```

---

## ⚠️ 注意事项

1. **真机测试**: 地图功能需在真机测试
2. **权限引导**: 用户拒绝后需引导去设置
3. **错误处理**: 取消操作不应显示错误
4. **数据验证**: 保存前验证位置数据完整性
5. **向后兼容**: 处理旧数据没有位置信息的情况

---

## 📞 问题排查

### 问题: 地图选择器打不开
- 检查权限配置
- 检查 API 调用
- 查看控制台错误

### 问题: 选择后数据未更新
- 检查数据绑定
- 检查方法调用
- 查看返回数据

### 问题: 地图预览不显示
- 检查条件渲染
- 检查经纬度数据
- 检查地图组件配置

---

## 📚 相关文档

- [设计方案](./2026-06-20_location-picker-design.md)
- [测试指南](./2026-06-20_location-picker-test-guide.md)
- [开发总结](./2026-06-20_location-picker-summary.md)

---

**更新日期**: 2026-06-20

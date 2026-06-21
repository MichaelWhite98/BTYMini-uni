# 位置功能开发环境兼容性修复

## 问题描述

在 macOS 开发环境下使用微信开发者工具时，`uni.getSetting()` API 可能会失败并报错：

```
检查位置权限失败: {errMsg: "getSetting:fail "}
```

这是因为某些 API 在开发环境中不可用或行为不一致。

## 解决方案

### 1. 优化权限检查逻辑

修改 `checkLocationPermission()` 函数：

```javascript
export const checkLocationPermission = async () => {
  try {
    const res = await new Promise((resolve, reject) => {
      uni.getSetting({
        success: resolve,
        fail: reject
      })
    })

    // 用户之前拒绝过
    if (res.authSetting && res.authSetting['scope.userLocation'] === false) {
      // ... 显示引导提示
      return false
    }

    return true
  } catch (error) {
    // 在开发环境或某些平台上，getSetting 可能不可用
    // 此时直接返回 true，让后续的 API 调用来处理权限问题
    console.warn('getSetting 不可用，跳过权限检查:', error.errMsg || error)
    return true
  }
}
```

**关键改进：**
- 添加 `res.authSetting` 存在性检查
- 将 `console.error` 改为 `console.warn`
- 在 `getSetting` 失败时返回 `true` 而不是 `false`
- 让后续的 `chooseLocation` 或 `getLocation` 来处理实际的权限问题

### 2. 增强错误处理

在 `chooseLocation()` 和 `getCurrentLocation()` 中添加更全面的权限错误检测：

```javascript
// 检测权限相关错误
if (error.errMsg && (error.errMsg.includes('auth deny') || error.errMsg.includes('authorize'))) {
  // 处理权限被拒绝的情况
}
```

## 工作原理

1. **开发环境**：
   - `getSetting()` 失败 → 返回 `true`
   - `chooseLocation()` 被调用 → 如果需要权限，会弹出授权窗口
   - 用户授权/拒绝 → `chooseLocation()` 的回调处理结果

2. **生产环境**：
   - `getSetting()` 成功 → 检查权限状态
   - 如果已拒绝 → 引导用户去设置
   - 如果未授权 → 调用 API 时会弹出授权窗口

## 兼容性

这个修复方案兼容：
- ✅ 微信开发者工具（macOS/Windows）
- ✅ 微信小程序真机
- ✅ 各种 Android/iOS 设备

## 测试建议

### 开发环境测试

1. 清除应用数据
2. 点击"选择地点"
3. 应该能正常打开地图选择器
4. 选择地点后应该能正常返回结果

### 权限测试

1. 首次授权：应该弹出授权窗口
2. 用户同意：应该能正常选择地点
3. 用户拒绝：应该显示引导提示
4. 重新授权：应该能引导用户去设置页开启权限

## 相关文件

- `src/utils/location.js` - 位置服务工具类
- `src/pages/detail/index.vue` - 详情页（使用位置功能）

## 更新日期

2026-06-21

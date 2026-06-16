# 机型适配方案

## 概述

本项目已实现全面的机型适配，支持 iPhone X 系列机型（包括灵动岛、刘海屏）以及其他特殊机型。

## 适配方案

### 1. 安全区域变量

在全局样式 `theme.scss` 中定义了以下 CSS 变量：

```scss
page {
  // 状态栏高度
  --status-bar-height: 20px;

  // 安全区域插入
  --safe-area-top: 0px;
  --safe-area-bottom: 0px;
  --safe-area-left: 0px;
  --safe-area-right: 0px;

  // 导航栏高度 = 状态栏高度 + 导航栏内容高度(44px)
  --nav-bar-height: 64px;

  // 底部安全区域高度
  --tab-bar-height: 50px;
  --bottom-safe-height: calc(var(--tab-bar-height) + var(--safe-area-bottom));
}
```

### 2. 系统信息获取

使用 `src/utils/safe-area.js` 工具获取系统信息：

```javascript
import { getSystemInfo } from '@/utils/safe-area.js'

const systemInfo = getSystemInfo()
console.log('状态栏高度:', systemInfo.statusBarHeight)
console.log('安全区域:', systemInfo.safeArea)
console.log('是否为 iPhone X:', systemInfo.isIPhoneX)
```

### 3. 导航栏适配

所有页面的顶部导航栏使用以下样式：

```scss
.app-header {
  // 适配灵动岛：padding-top = 状态栏高度
  padding-top: var(--status-bar-height);
  height: calc(var(--nav-bar-height));
  padding-left: $container-padding;
  padding-right: $container-padding;
}
```

### 4. 底部安全区域适配

所有页面的底部导航栏使用以下样式：

```scss
.bottom-nav {
  // 适配底部安全区域
  padding: 16px 24px;
  padding-bottom: calc(32px + var(--safe-area-bottom));
}
```

## 支持的机型

- iPhone X / XS / XS Max / XR
- iPhone 11 / 11 Pro / 11 Pro Max
- iPhone 12 / 12 mini / 12 Pro / 12 Pro Max
- iPhone 13 / 13 mini / 13 Pro / 13 Pro Max
- iPhone 14 / 14 Plus / 14 Pro / 14 Pro Max（灵动岛）
- iPhone 15 / 15 Plus / 15 Pro / 15 Pro Max（灵动岛）
- iPhone 16 / 16 Plus / 16 Pro / 16 Pro Max（灵动岛）
- 以及其他有刘海或特殊屏幕的机型

## 测试方法

1. 在微信开发者工具中，使用不同的设备模拟器测试
2. 切换到 iPhone 15 Pro Max 等灵动岛机型
3. 检查顶部导航栏是否正确避开灵动岛
4. 检查底部导航栏是否正确适配安全区域

## 已适配的页面

- ✅ `pages/food-diary/index/index.vue` - 首页
- ✅ `pages/food-diary/profile/index.vue` - 个人中心
- ✅ `pages/food-diary/monthly/index.vue` - 月度视图
- ✅ `pages/food-diary/store/index.vue` - 店铺选择
- ✅ `pages/food-diary/detail/index.vue` - 详情页
- ✅ `pages/food-diary/add/index.vue` - 添加记录

## 注意事项

1. **不要硬编码高度**：避免使用固定的 `height: 64px`，应使用 `calc(var(--nav-bar-height))`

2. **底部安全区域**：所有固定在底部的元素都需要添加 `padding-bottom: calc(Xpx + var(--safe-area-bottom))`

3. **状态栏高度**：顶部固定元素需要添加 `padding-top: var(--status-bar-height)`

4. **测试覆盖**：务必在多种机型上测试，特别是有灵动岛和刘海的机型

## 更新日志

- **2026-06-16**: 初始实现机型适配方案
  - 添加安全区域工具函数
  - 更新全局样式变量
  - 适配所有页面的导航栏和底部安全区域

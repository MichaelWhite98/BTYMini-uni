# 饮品记录模块 - 快速开发指南

## 🚀 快速开始

### 项目结构
```
src/
├── pages/
│   └── food-diary/
│       ├── index/index.vue          # 首页 - 日历视图
│       ├── add/index.vue            # 添加记录 - 底部弹窗
│       ├── detail/index.vue         # 饮品详情
│       ├── store/index.vue          # 选择店铺
│       ├── monthly/index.vue        # 月度详情
│       └── profile/index.vue        # 个人中心
├── styles/
│   └── theme.scss                   # 设计系统变量
├── constants/
│   └── food-diary.js                # 常量定义
└── utils/
    └── food-diary/
        └── index.js                 # 工具函数
```

## 🎨 设计系统速查

### 颜色变量
```scss
// 主要颜色
--primary: #271310;              // 深咖啡色
--secondary: #7d562d;            // 琥珀色
--background: #fef8f5;           // 背景色

// 表面颜色
--surface-container-lowest: #ffffff;
--surface-container-low: #f8f2f0;
--surface-container: #f2edea;

// 文本颜色
--on-surface: #1d1b1a;           // 主文本
--on-surface-variant: #504442;   // 次要文本
--outline: #827472;              // 辅助文本

// 状态颜色
--error: #ba1a1a;                // 错误
```

### 间距系统
```scss
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 16px;
$spacing-lg: 24px;       // 容器内边距
$spacing-xl: 32px;
$spacing-xxl: 48px;      // 区块间距
$container-padding: 20px;
```

### 圆角系统
```scss
$radius-sm: 4px;
$radius-default: 8px;
$radius-md: 12px;
$radius-lg: 16px;
$radius-xl: 24px;        // 卡片圆角
$radius-full: 9999px;    // 按钮圆角
```

### 阴影系统
```scss
$shadow-card: 0 4px 20px rgba(62, 39, 35, 0.04);
$shadow-button: 0 4px 12px rgba(62, 39, 35, 0.08);
```

## 📝 常用代码片段

### 页面基础结构
```vue
<template>
  <view class="page-name">
    <!-- 顶部导航栏 -->
    <header class="app-header">
      <button class="nav-btn" @tap="handleBack">
        <text class="material-icons">arrow_back</text>
      </button>
      <text class="page-title">页面标题</text>
      <button class="nav-btn save" @tap="handleSave">
        <text class="material-icons">check</text>
      </button>
    </header>

    <!-- 主内容 -->
    <scroll-view scroll-y class="main-content">
      <!-- 内容区域 -->
    </scroll-view>

    <!-- 底部导航栏 -->
    <nav class="bottom-nav">
      <!-- 导航项 -->
    </nav>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

// 状态定义
const data = ref('')

// 生命周期
onLoad(() => {
  // 初始化逻辑
})

// 事件处理
const handleBack = () => {
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

.page-name {
  min-height: 100vh;
  background: var(--background);
}
</style>
```

### 卡片样式
```vue
<view class="card">
  <text class="card-title">标题</text>
  <text class="card-content">内容</text>
</view>
```

```scss
.card {
  background: var(--surface-container-lowest);
  border-radius: 24px;
  padding: 24px;
  box-shadow: $shadow-card;
}
```

### 按钮样式
```vue
<!-- 主要按钮 -->
<button class="btn-primary">主要按钮</button>

<!-- 次要按钮 -->
<button class="btn-secondary">次要按钮</button>

<!-- 图标按钮 -->
<button class="nav-btn">
  <text class="material-icons">add</text>
</button>
```

```scss
.btn-primary {
  background: var(--primary-container);
  color: var(--on-primary);
  border-radius: $radius-full;
  padding: 12px 24px;
  font-weight: 600;
  border: none;

  &:active {
    transform: scale(0.96);
  }
}

.nav-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface-container-low);
  border-radius: 50%;
  border: none;
  padding: 0;

  &:active {
    transform: scale(0.96);
  }
}
```

### 输入框样式
```vue
<input
  v-model="value"
  class="input-field"
  placeholder="请输入..."
  placeholder-class="input-placeholder"
/>
```

```scss
.input-field {
  width: 100%;
  height: 48px;
  padding: 0 16px;
  background: var(--surface-container-low);
  border: none;
  border-radius: $radius-full;
  font-size: 14px;
  color: var(--on-surface);

  &:focus {
    border: 1px solid var(--primary);
  }
}

.input-placeholder {
  color: var(--outline-variant);
}
```

### 列表项样式
```vue
<view class="list-item" @tap="handleTap">
  <view class="item-icon">
    <text class="material-icons">storefront</text>
  </view>
  <view class="item-content">
    <text class="item-title">标题</text>
    <text class="item-subtitle">副标题</text>
  </view>
  <text class="material-icons item-arrow">chevron_right</text>
</view>
```

```scss
.list-item {
  display: flex;
  align-items: center;
  padding: 16px 24px;
  background: var(--surface-container-lowest);
  border-radius: 16px;
  transition: all 0.2s ease;

  &:active {
    transform: scale(0.98);
  }
}

.item-icon {
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  color: var(--secondary);
}

.item-content {
  flex: 1;
  min-width: 0;
}

.item-title {
  display: block;
  font-size: 16px;
  color: var(--on-surface);
}

.item-subtitle {
  display: block;
  font-size: 14px;
  color: var(--on-surface-variant);
  margin-top: 4px;
}

.item-arrow {
  color: var(--outline-variant);
}
```

## 🔗 页面跳转

### 导航到新页面
```javascript
uni.navigateTo({
  url: '/pages/food-diary/detail/index?id=123'
})
```

### 返回上一页
```javascript
uni.navigateBack()
```

### 重定向（替换当前页面）
```javascript
uni.redirectTo({
  url: '/pages/food-diary/store/index'
})
```

### 切换底部导航
```javascript
uni.switchTab({
  url: '/pages/food-diary/index/index'
})
```

## 💡 常见功能实现

### 图片选择
```javascript
// 拍照
const handleCamera = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['camera'],
    success: (res) => {
      const tempFilePaths = res.tempFilePaths
      // 处理图片
    }
  })
}

// 从相册选择
const handleAlbum = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album'],
    success: (res) => {
      const tempFilePaths = res.tempFilePaths
      // 处理图片
    }
  })
}
```

### Toast 提示
```javascript
// 成功提示
uni.showToast({
  title: '保存成功',
  icon: 'success'
})

// 错误提示
uni.showToast({
  title: '保存失败',
  icon: 'error'
})

// 普通提示
uni.showToast({
  title: '提示信息',
  icon: 'none'
})
```

### 确认对话框
```javascript
uni.showModal({
  title: '删除确认',
  content: '确定要删除吗？',
  confirmColor: '#ba1a1a',
  success: ({ confirm }) => {
    if (confirm) {
      // 用户点击确定
    } else {
      // 用户点击取消
    }
  }
})
```

### 操作菜单
```javascript
uni.showActionSheet({
  itemList: ['选项1', '选项2', '选项3'],
  success: ({ tapIndex }) => {
    switch (tapIndex) {
      case 0:
        // 处理选项1
        break
      case 1:
        // 处理选项2
        break
      case 2:
        // 处理选项3
        break
    }
  }
})
```

### 本地存储
```javascript
// 保存数据
uni.setStorageSync('key', 'value')

// 读取数据
const value = uni.getStorageSync('key')

// 删除数据
uni.removeStorageSync('key')

// 清空所有数据
uni.clearStorageSync()
```

## 🐛 调试技巧

### 控制台输出
```javascript
console.log('调试信息:', data)
console.error('错误信息:', error)
```

### 查看元素
使用微信开发者工具的调试面板查看元素样式

### 网络请求
在调试面板的 Network 标签查看网络请求

## 📱 测试清单

### 功能测试
- [ ] 页面跳转是否正常
- [ ] 数据加载是否正确
- [ ] 表单提交是否成功
- [ ] 图片上传是否正常
- [ ] 本地存储是否可用

### UI 测试
- [ ] 布局是否正确
- [ ] 颜色是否符合设计
- [ ] 字体大小是否合适
- [ ] 间距是否一致
- [ ] 圆角是否正确

### 交互测试
- [ ] 点击响应是否正常
- [ ] 滑动是否流畅
- [ ] 动画是否自然
- [ ] 提示是否清晰
- [ ] 错误处理是否友好

### 性能测试
- [ ] 页面加载速度
- [ ] 图片加载速度
- [ ] 滚动流畅度
- [ ] 内存占用
- [ ] CPU 使用率

## 🔧 开发工具

### 微信开发者工具
- 调试面板
- 性能监控
- 代码压缩
- 真机调试

### VS Code 插件
- uni-app-snippets
- Vetur
- ESLint
- Prettier

## 📚 相关文档

- [详细开发文档](./food-diary-pages-development.md)
- [设计系统文档](../../resources/stitch_minimalist_design_drafts/brew_steep/DESIGN.md)
- [uni-app 官方文档](https://uniapp.dcloud.io/)
- [Vue 3 官方文档](https://v3.vuejs.org/)

---

**提示**: 遇到问题时，先查看详细开发文档，再查阅官方文档。

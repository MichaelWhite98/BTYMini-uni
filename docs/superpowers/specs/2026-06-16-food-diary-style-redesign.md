# 饮食日记小程序样式优化设计方案

**文档版本：** 1.0
**创建日期：** 2026-06-16
**项目：** BTYMini-uni（uni-app 小程序）
**设计风格：** 清新自然风格

---

## 1. 项目概述

### 1.1 项目背景

BTYMini-uni 是一个基于 uni-app 开发的饮食日记小程序，使用 Vue 3 框架。当前项目已有基础设计系统，采用基于自然烘焙豆和茶叶的配色方案。本次优化旨在采用全新的清新自然风格，打造更现代、更吸引人的用户界面。

### 1.2 优化目标

- **视觉升级**：采用清新自然的青绿色配色方案，传达健康与活力
- **体验提升**：大圆角柔和设计，营造温暖友好的视觉感受
- **交互优化**：添加适度流畅动画，提升用户体验
- **一致性保证**：建立完整的设计系统，确保所有页面视觉统一

### 1.3 项目范围

**涉及页面：**
- 首页（日历视图）
- 添加记录页
- 详情页
- 月度视图
- 个人中心
- 店铺页面

**涉及组件：**
- 日历卡片
- 统计卡片
- 记录卡片
- 底部导航
- 底部弹窗
- 图片选择器

---

## 2. 设计系统

### 2.1 设计理念

打造一个**清新自然、温暖友好**的饮食日记体验。采用青绿渐变配色传达健康与活力，大圆角柔和设计营造亲和力，适度动画提升交互流畅度，让用户在记录饮食的同时享受愉悦的视觉体验。

### 2.2 配色方案

#### 主色调（Primary）

```scss
// 清新青绿渐变
--primary: #11998e;           // 主色
--primary-light: #38ef7d;     // 主色浅色
--primary-gradient: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
--primary-container: #e8f5f3; // 主色容器背景
--on-primary: #ffffff;        // 主色上的文本
--on-primary-container: #0a3d2e; // 主色容器上的文本
```

#### 次要色调（Secondary）

```scss
// 辅助色彩
--secondary: #f57c00;         // 次要色（橙色，用于强调）
--secondary-container: #fff3e0;
--on-secondary: #ffffff;
--on-secondary-container: #e65100;
```

#### 背景和表面（Background & Surface）

```scss
// 背景色
--background: #fafafa;        // 主背景
--surface: #ffffff;           // 卡片背景
--surface-dim: #f5f5f5;       // 暗淡表面
--surface-bright: #ffffff;    // 明亮表面
--surface-variant: #e8f5f3;   // 变体表面

// 表面容器层级
--surface-container-lowest: #ffffff;
--surface-container-low: #fafafa;
--surface-container: #f5f5f5;
--surface-container-high: #f0f0f0;
--surface-container-highest: #e8e8e8;
```

#### 文本颜色（Text Colors）

```scss
--on-background: #1a1a1a;     // 背景上的文本
--on-surface: #1a1a1a;        // 表面上的文本
--on-surface-variant: #666666; // 表面变体上的文本
--outline: #e0e0e0;           // 轮廓线
--outline-variant: #f0f0f0;   // 轮廓线变体
```

#### 状态颜色（State Colors）

```scss
// 成功
--success: #38ef7d;
--success-container: #e8f5f3;
--on-success: #ffffff;
--on-success-container: #0a3d2e;

// 警告
--warning: #f57c00;
--warning-container: #fff3e0;
--on-warning: #ffffff;
--on-warning-container: #e65100;

// 错误
--error: #e53935;
--error-container: #ffebee;
--on-error: #ffffff;
--on-error-container: #c62828;
```

### 2.3 间距系统

基于 4px 基线的间距系统：

```scss
$spacing-unit: 4px;
$spacing-xs: 4px;    // 极小间距
$spacing-sm: 8px;    // 小间距
$spacing-md: 16px;   // 中等间距
$spacing-lg: 24px;   // 大间距
$spacing-xl: 32px;   // 超大间距
$spacing-xxl: 48px;  // 极大间距

$container-padding: 20px; // 容器内边距
$gutter: 16px;            // 栅格间距
```

### 2.4 圆角系统

大圆角柔和设计的圆角系统：

```scss
$radius-sm: 8px;      // 小圆角（标签、徽章）
$radius-default: 12px; // 默认圆角（按钮、输入框）
$radius-md: 16px;     // 中等圆角（小卡片）
$radius-lg: 20px;     // 大圆角（卡片、弹窗）
$radius-xl: 24px;     // 超大圆角（大卡片）
$radius-2xl: 28px;    // 极大圆角（特殊元素）
$radius-full: 9999px; // 完全圆形（头像、圆形按钮）
```

### 2.5 阴影系统

柔和渐变阴影系统：

```scss
// 柔和阴影
$shadow-xs: 0 2px 8px rgba(17, 153, 142, 0.04);
$shadow-sm: 0 4px 12px rgba(17, 153, 142, 0.06);
$shadow-md: 0 4px 20px rgba(17, 153, 142, 0.08);
$shadow-lg: 0 8px 24px rgba(17, 153, 142, 0.12);
$shadow-xl: 0 12px 32px rgba(17, 153, 142, 0.16);

// 特殊阴影
$shadow-card: 0 4px 20px rgba(17, 153, 142, 0.08);
$shadow-button: 0 4px 12px rgba(17, 153, 142, 0.2);
$shadow-fab: 0 8px 24px rgba(17, 153, 142, 0.3);
```

### 2.6 字体系统

```scss
// 字体家族
$font-family-base: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC",
                   "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif;

// 字体大小
$font-size-display-lg: 36px;
$font-size-headline-lg: 28px;
$font-size-title-md: 18px;
$font-size-body-lg: 16px;
$font-size-body-sm: 14px;
$font-size-label-caps: 12px;

// 行高
$line-height-display-lg: 44px;
$line-height-headline-lg: 36px;
$line-height-title-md: 24px;
$line-height-body-lg: 24px;
$line-height-body-sm: 20px;
$line-height-label-caps: 16px;

// 字重
$font-weight-regular: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;
```

### 2.7 动画系统

适度的动画效果，使用 CSS transform 和 opacity 确保性能：

```scss
// 动画时长
$duration-fast: 0.15s;
$duration-normal: 0.3s;
$duration-slow: 0.45s;

// 缓动函数
$ease-out: cubic-bezier(0.32, 0.72, 0, 1);
$ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
$ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);

// 动画效果
@mixin transition-base {
  transition: all $duration-normal $ease-out;
}

@mixin transition-transform {
  transition: transform $duration-normal $ease-out;
}

@mixin hover-lift {
  transform: translateY(-2px);
  box-shadow: $shadow-md;
}

@mixin active-scale {
  transform: scale(0.96);
}
```

---

## 3. 组件设计规范

### 3.1 卡片组件

**设计特征：**
- 圆角：20-24px
- 背景：`var(--surface)` 或 `var(--surface-container-lowest)`
- 阴影：`$shadow-card`
- 内边距：20-24px

**样式示例：**

```scss
.card {
  background: var(--surface);
  border-radius: 20px;
  padding: 24px;
  box-shadow: $shadow-card;
  transition: all $duration-normal $ease-out;

  &:active {
    transform: scale(0.98);
  }
}

.card-elevated {
  background: var(--surface-container-lowest);
  border-radius: 24px;
  padding: 24px;
  box-shadow: $shadow-md;
}
```

### 3.2 按钮组件

**主要按钮：**

```scss
.btn-primary {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  color: var(--on-primary);
  border-radius: 20px;
  padding: 12px 24px;
  font-weight: 600;
  font-size: 14px;
  box-shadow: $shadow-button;
  transition: all $duration-normal $ease-out;

  &:active {
    transform: scale(0.96);
  }
}
```

**次要按钮：**

```scss
.btn-secondary {
  background: transparent;
  color: var(--primary);
  border: 2px solid var(--primary);
  border-radius: 20px;
  padding: 10px 22px;
  font-weight: 600;
  font-size: 14px;
  transition: all $duration-normal $ease-out;

  &:active {
    transform: scale(0.96);
  }
}
```

**圆形按钮（FAB）：**

```scss
.btn-fab {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  color: var(--on-primary);
  box-shadow: $shadow-fab;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all $duration-normal $ease-out;

  &:active {
    transform: scale(0.9);
  }
}
```

### 3.3 输入框组件

```scss
.input-field {
  width: 100%;
  height: 48px;
  padding: 0 16px;
  background: var(--surface-container-low);
  border: 2px solid transparent;
  border-radius: 20px;
  font-size: 14px;
  color: var(--on-surface);
  transition: all $duration-normal $ease-out;

  &::placeholder {
    color: var(--on-surface-variant);
  }

  &:focus {
    border-color: var(--primary);
    background: var(--surface);
  }
}
```

### 3.4 标签组件

```scss
.tag {
  display: inline-block;
  background: var(--primary-container);
  color: var(--primary);
  padding: 6px 16px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 500;
  transition: all $duration-normal $ease-out;

  &:active {
    transform: scale(0.95);
  }
}

.tag-success {
  background: var(--success-container);
  color: var(--success);
}

.tag-warning {
  background: var(--warning-container);
  color: var(--warning);
}
```

### 3.5 导航栏组件

**顶部导航：**

```scss
.app-header {
  position: sticky;
  top: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 20px;
  background: var(--background);
}
```

**底部导航：**

```scss
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 50;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 16px 24px 32px;
  background: rgba(250, 250, 250, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 -2px 16px rgba(17, 153, 142, 0.04);
}
```

### 3.6 底部弹窗组件

```scss
.bottom-sheet {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0 20px 48px;
  transform: translateY(100%);
  transition: transform 0.4s cubic-bezier(0.32, 0.72, 0, 1);

  &.show {
    transform: translateY(0);
  }
}

.bottom-sheet-card {
  background: var(--surface);
  border-radius: 24px;
  padding: 24px;
  box-shadow: $shadow-card;
}
```

---

## 4. 页面设计规范

### 4.1 首页（日历视图）

**布局结构：**
- 顶部导航栏（64px）
- 主内容区（scroll-view）
  - 日期标题
  - 日历卡片
  - 统计卡片
- 底部导航栏（80px + 安全区域）

**关键元素样式：**

```scss
// 日历卡片
.calendar-card {
  background: var(--surface);
  border-radius: 24px;
  padding: 24px;
  box-shadow: $shadow-card;
  margin-bottom: 24px;
}

// 日期格子
.day-cell {
  width: 14.285%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;

  &.today .day-content {
    background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
    color: var(--on-primary);
    transform: scale(1.1);
    box-shadow: 0 2px 8px rgba(17, 153, 142, 0.3);
  }
}

// 统计卡片
.stats-card {
  background: var(--surface);
  border-radius: 24px;
  padding: 24px;
  box-shadow: $shadow-card;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    bottom: -24px;
    right: -24px;
    width: 128px;
    height: 128px;
    background: rgba(17, 153, 142, 0.05);
    border-radius: 50%;
    filter: blur(40px);
  }
}
```

### 4.2 添加记录页

**布局结构：**
- 背景模糊层
- 底部弹窗（从底部滑入）
  - 操作卡片列表
  - 关闭按钮

**关键元素样式：**

```scss
// 背景模糊层
.background-blur {
  position: absolute;
  inset: 0;
  background: rgba(26, 26, 26, 0.2);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

// 操作卡片
.action-card {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  background: var(--surface);
  border-radius: 24px;
  box-shadow: $shadow-card;
  transition: all $duration-normal $ease-out;

  &:active {
    transform: scale(0.98);
  }
}
```

### 4.3 详情页

**布局结构：**
- 顶部导航栏
- 图片展示区
- 记录信息卡片
- 操作按钮区

**关键元素样式：**

```scss
// 记录卡片
.record-card {
  background: var(--surface);
  border-radius: 24px;
  padding: 24px;
  box-shadow: $shadow-card;
  margin-bottom: 16px;
}

// 图片展示
.record-image {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 20px;
}
```

---

## 5. 动画效果规范

### 5.1 页面切换动画

```scss
// 页面进入
.page-enter {
  animation: slideUp 0.3s cubic-bezier(0.32, 0.72, 0, 1);
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

// 页面退出
.page-leave {
  animation: slideDown 0.3s cubic-bezier(0.32, 0.72, 0, 1);
}

@keyframes slideDown {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(20px);
    opacity: 0;
  }
}
```

### 5.2 卡片动画

```scss
// 卡片悬停
.card {
  transition: all 0.3s cubic-bezier(0.32, 0.72, 0, 1);

  &:active {
    transform: scale(0.98);
  }
}

// 卡片进入
.card-enter {
  animation: cardEnter 0.4s cubic-bezier(0.32, 0.72, 0, 1);
}

@keyframes cardEnter {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
```

### 5.3 按钮动画

```scss
// 按钮点击
.btn {
  transition: all 0.15s cubic-bezier(0.32, 0.72, 0, 1);

  &:active {
    transform: scale(0.96);
  }
}

// 按钮涟漪效果
.btn-ripple {
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }

  &:active::after {
    width: 200px;
    height: 200px;
  }
}
```

### 5.4 弹窗动画

```scss
// 底部弹窗
.bottom-sheet {
  transform: translateY(100%);
  transition: transform 0.4s cubic-bezier(0.32, 0.72, 0, 1);

  &.show {
    transform: translateY(0);
  }
}

// 遮罩层
.mask {
  opacity: 0;
  transition: opacity 0.3s ease;

  &.show {
    opacity: 1;
  }
}
```

---

## 6. 实施计划

### 6.1 阶段一：重构设计系统基础（1-2天）

**目标：** 更新 `theme.scss`，建立新的设计系统基础

**任务清单：**
- [ ] 更新配色变量（青绿色系统）
- [ ] 更新间距系统
- [ ] 更新圆角系统（16-24px）
- [ ] 更新阴影系统（柔和渐变）
- [ ] 更新字体系统
- [ ] 添加动画 mixin
- [ ] 添加全局工具类

**输出文件：**
- `src/styles/theme.scss`（已更新）

### 6.2 阶段二：优化核心页面（2-3天）

**目标：** 优化首页，建立视觉标准

**任务清单：**
- [ ] 优化顶部导航栏样式
- [ ] 优化日历卡片样式
- [ ] 优化统计卡片样式
- [ ] 优化底部导航栏样式
- [ ] 添加页面动画效果
- [ ] 测试小程序兼容性

**输出文件：**
- `src/pages/food-diary/index/index.vue`（已优化）

### 6.3 阶段三：优化功能页面（2-3天）

**目标：** 优化添加记录页和详情页

**任务清单：**
- [ ] 优化添加记录页样式
- [ ] 优化底部弹窗动画
- [ ] 优化详情页样式
- [ ] 优化记录卡片组件
- [ ] 添加交互动画
- [ ] 测试功能完整性

**输出文件：**
- `src/pages/food-diary/add/index.vue`（已优化）
- `src/pages/food-diary/detail/index.vue`（已优化）
- `src/components/food-diary/DrinkRecordCard.vue`（已优化）

### 6.4 阶段四：扩展到所有页面（1-2天）

**目标：** 完善所有页面，添加完整动画

**任务清单：**
- [ ] 优化月度视图页面
- [ ] 优化个人中心页面
- [ ] 优化店铺页面
- [ ] 完善所有动画效果
- [ ] 全面测试和优化

**输出文件：**
- `src/pages/food-diary/monthly/index.vue`（已优化）
- `src/pages/food-diary/profile/index.vue`（已优化）
- `src/pages/food-diary/store/index.vue`（已优化）

---

## 7. 技术实现要点

### 7.1 uni-app 兼容性

**注意事项：**
- 使用 `var(--variable)` 定义 CSS 变量
- 使用 SCSS 变量编译时注入
- 避免使用小程序不支持的 CSS 特性
- 使用 `-webkit-` 前缀确保兼容性

**示例：**

```scss
// ✅ 推荐：使用 CSS 变量
page {
  --primary: #11998e;
  background: var(--primary);
}

// ✅ 推荐：使用 SCSS 变量
$primary: #11998e;
.button {
  background: $primary;
}

// ❌ 避免：小程序不支持的特性
.element {
  backdrop-filter: blur(10px); // 部分小程序不支持
}
```

### 7.2 性能优化

**动画性能：**
- 优先使用 `transform` 和 `opacity`
- 避免使用 `width`、`height`、`left`、`top` 等属性动画
- 使用 `will-change` 提示浏览器优化

**示例：**

```scss
// ✅ 推荐：高性能动画
.animated-element {
  transform: translateY(0);
  opacity: 1;
  transition: transform 0.3s, opacity 0.3s;
  will-change: transform, opacity;
}

// ❌ 避免：低性能动画
.animated-element {
  top: 0;
  height: 100px;
  transition: top 0.3s, height 0.3s; // 会触发重排
}
```

### 7.3 响应式适配

**使用 rpx 单位：**
- 小程序使用 `rpx` 作为响应式单位
- 设计稿基于 750px 宽度
- 使用 SCSS 函数自动转换

**示例：**

```scss
// 使用 rpx 单位
.card {
  padding: 48rpx; // 24px in 750px design
  border-radius: 48rpx; // 24px in 750px design
}
```

---

## 8. 测试计划

### 8.1 视觉测试

**测试项目：**
- [ ] 配色方案是否符合设计规范
- [ ] 圆角大小是否统一
- [ ] 阴影效果是否一致
- [ ] 间距是否符合规范
- [ ] 字体大小是否合适

### 8.2 功能测试

**测试项目：**
- [ ] 所有页面功能是否正常
- [ ] 导航跳转是否正确
- [ ] 表单提交是否正常
- [ ] 图片上传是否正常

### 8.3 性能测试

**测试项目：**
- [ ] 动画是否流畅
- [ ] 页面加载速度
- [ ] 内存占用情况
- [ ] CPU 使用率

### 8.4 兼容性测试

**测试平台：**
- [ ] 微信小程序
- [ ] 支付宝小程序（可选）
- [ ] 不同机型适配
- [ ] 不同屏幕尺寸适配

---

## 9. 风险评估

### 9.1 技术风险

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| 小程序兼容性问题 | 高 | 提前测试关键特性，准备降级方案 |
| 性能下降 | 中 | 使用高性能动画，优化渲染 |
| 样式覆盖冲突 | 中 | 使用作用域样式，避免全局污染 |

### 9.2 进度风险

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| 设计调整 | 中 | 预留调整时间，采用渐进式开发 |
| 需求变更 | 高 | 明确需求范围，控制变更 |
| 技术难点 | 中 | 提前调研，准备备选方案 |

---

## 10. 验收标准

### 10.1 视觉验收

- [ ] 配色方案完全符合清新自然风格
- [ ] 所有卡片、按钮使用统一的大圆角设计
- [ ] 阴影效果柔和统一
- [ ] 间距符合设计规范
- [ ] 字体层次清晰

### 10.2 功能验收

- [ ] 所有页面功能正常
- [ ] 导航跳转正确
- [ ] 表单交互正常
- [ ] 图片功能正常

### 10.3 性能验收

- [ ] 动画流畅（60fps）
- [ ] 页面加载快速（<1s）
- [ ] 无明显卡顿
- [ ] 内存占用合理

### 10.4 代码质量

- [ ] 代码结构清晰
- [ ] 命名规范统一
- [ ] 注释完整
- [ ] 无冗余代码

---

## 11. 附录

### 11.1 设计资源

**设计工具：**
- Figma（设计稿）
- Zeplin（标注）
- Iconfont（图标库）

**参考设计：**
- Material Design 3
- Apple Human Interface Guidelines
- Ant Design Mobile

### 11.2 技术文档

**框架文档：**
- [uni-app 官方文档](https://uniapp.dcloud.io/)
- [Vue 3 官方文档](https://vuejs.org/)
- [微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)

### 11.3 更新日志

| 版本 | 日期 | 更新内容 |
|------|------|----------|
| 1.0 | 2026-06-16 | 初始版本，完成设计方案 |

---

**文档编写：** Claude Code
**审核状态：** 待审核
**下一步：** 用户审查文档 → 创建实施计划 → 开始编码

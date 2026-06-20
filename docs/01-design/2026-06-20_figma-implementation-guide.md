# Figma 设计实施指南

## 第一步：创建新文件

1. 打开 Figma，点击 "New design file"
2. 命名为 "百淘云小程序设计系统"
3. 创建以下页面结构：
   - 🏠 封面
   - 🎨 设计系统
   - 🧩 组件库
   - 📱 页面

---

## 第二步：创建设计令牌 (变量)

### 颜色变量

在 Figma 中创建变量集合：

**集合名称**: `Colors/百淘云`

| 变量名 | 色值 | 用途 |
|--------|------|------|
| primary | #11998e | 主色 |
| primary-light | #38ef7d | 主色浅 |
| primary-container | #e8f5f3 | 主色容器 |
| secondary | #f57c00 | 次色 |
| secondary-container | #fff3e0 | 次色容器 |
| background | #fafafa | 背景 |
| surface | #ffffff | 表面 |
| surface-container | #f5f5f5 | 表面容器 |
| on-surface | #1a1a1a | 主要文字 |
| on-surface-variant | #666666 | 次要文字 |
| outline | #e0e0e0 | 边框 |
| error | #e53935 | 错误 |
| error-container | #ffebee | 错误容器 |
| success | #38ef7d | 成功 |
| warning | #f57c00 | 警告 |

### 间距变量

**集合名称**: `Spacing/百淘云`

| 变量名 | 值 |
|--------|-----|
| xs | 4 |
| sm | 8 |
| md | 16 |
| lg | 24 |
| xl | 32 |
| xxl | 48 |
| container-padding | 20 |

### 圆角变量

**集合名称**: `Radius/百淘云`

| 变量名 | 值 |
|--------|-----|
| sm | 8 |
| default | 12 |
| md | 16 |
| lg | 20 |
| xl | 24 |
| 2xl | 28 |
| full | 9999 |

---

## 第三步：创建文字样式

在 Figma 右侧面板 → Typography 创建：

| 样式名 | 字体 | 大小 | 行高 | 字重 |
|--------|------|------|------|------|
| Display/LG | PingFang SC | 36 | 44 | Bold |
| Headline/LG | PingFang SC | 28 | 36 | Bold |
| Title/MD | PingFang SC | 18 | 24 | Semibold |
| Body/LG | PingFang SC | 16 | 24 | Regular |
| Body/SM | PingFang SC | 14 | 20 | Regular |
| Label/Caps | PingFang SC | 12 | 16 | Bold |

---

## 第四步：创建效果样式

在 Figma 右侧面板 → Effects 创建：

| 样式名 | 效果 |
|--------|------|
| Shadow/XS | Drop shadow: 0 2px 8px rgba(17,153,142,0.04) |
| Shadow/SM | Drop shadow: 0 4px 12px rgba(17,153,142,0.06) |
| Shadow/Card | Drop shadow: 0 4px 20px rgba(17,153,142,0.08) |
| Shadow/LG | Drop shadow: 0 8px 24px rgba(17,153,142,0.12) |
| Shadow/FAB | Drop shadow: 0 8px 24px rgba(17,153,142,0.3) |

---

## 第五步：创建基础组件

### 1. 按钮 (Button)

创建 Component Set，包含变体：

```
Button
├── variant=Primary
├── variant=Secondary
├── variant=Ghost
├── size=Small (32px 高)
├── size=Medium (40px 高) ← 默认
├── size=Large (48px 高)
├── state=Default
├── state=Pressed
└── state=Disabled
```

**Primary 按钮属性：**
- 填充: 渐变 #11998e → #38ef7d (135deg)
- 圆角: 12px (使用变量)
- 内边距: 12px 24px
- 文字: 白色, Title/MD 样式
- 效果: Shadow/Button

### 2. 导航按钮 (Nav Button)

```
NavButton
├── size=Small (32px)
├── size=Medium (40px) ← 默认
├── size=Large (48px)
├── state=Default
└── state=Pressed
```

**属性：**
- 尺寸: 正方形 (40x40)
- 圆角: 50% (圆形)
- 填充: 透明
- 图标: 20px, 主色
- Pressed 状态: 缩放 0.9, 背景 primary-container

### 3. FAB 浮动按钮

```
FAB
├── size=Default (56px)
├── size=Small (40px)
├── size=Large (64px)
└── state=Default/Pressed
```

**属性：**
- 尺寸: 56x56
- 圆角: 50%
- 填充: 渐变 #11998e → #38ef7d
- 图标: 24px, 白色
- 效果: Shadow/FAB

### 4. 卡片 (Card)

```
Card
├── variant=Default
├── variant=Elevated
└── state=Default/Pressed
```

**属性：**
- 圆角: 24px (使用变量 radius-xl)
- 填充: surface 颜色
- 效果: Shadow/Card
- 内边距: 24px

### 5. 信息卡片 (Info Card)

```
InfoCard
├── variant=Default
└── withArrow=true/false
```

**结构：**
```
┌───────────────────────────────────┐
│ [图标 40x40]  文字内容      [箭头] │
└───────────────────────────────────┘
```

### 6. 底部导航栏 (Bottom Nav)

```
BottomNav
├── item=1 (单按钮)
├── item=3 (三按钮) ← 默认
└── item=5 (五按钮)
```

**属性：**
- 高度: 64px + 安全区域
- 填充: rgba(250,250,250,0.8)
- 背景: 模糊效果
- 阴影: 0 -2px 16px rgba(17,153,142,0.04)

### 7. 头像 (Avatar)

```
Avatar
├── size=Small (32px)
├── size=Medium (40px)
├── size=Large (64px)
└── size=XL (96px)
```

### 8. 标签 (Tag)

```
Tag
├── variant=Default (primary)
├── variant=Success
├── variant=Warning
└── variant=Error
```

---

## 第六步：创建页面

### 首页 (Home)

**画布尺寸**: 375 x 812 (iPhone X)

**层次结构：**
```
Frame: 首页
├── Header (固定顶部)
│   ├── NavButton (菜单)
│   ├── Text: "百淘云"
│   └── Avatar
├── ScrollView (主内容)
│   ├── DateHeader
│   │   ├── Text: "今天" (Headline/LG)
│   │   └── Text: 日期副标题 (Body/SM)
│   ├── CalendarCard (Card)
│   │   ├── WeekRow (日-六)
│   │   └── DaysGrid (7列)
│   └── StatsCard (Card)
│       ├── StatsInfo
│       │   ├── Text: "本月记录" (Label/Caps)
│       │   ├── Text: "36 杯" (Display/LG)
│       │   └── Text: "5 间到访店铺"
│       └── DrinkStickers (贴纸堆叠)
└── BottomNav (固定底部)
    ├── NavItem (日历)
    ├── FAB (添加)
    └── NavItem (个人中心)
```

### 月度页 (Monthly)

```
Frame: 月度页
├── Header
├── ScrollView
│   ├── PeriodHeader
│   ├── StatsGrid (2列 Grid)
│   │   ├── StatCard
│   │   └── StatCard
│   ├── DrinkDistributionCard
│   │   ├── SectionTitle
│   │   └── DistributionList
│   └── TopStoresSection
│       └── StoreList
└── BottomNav
```

### 个人中心 (Profile)

```
Frame: 个人中心
├── Header
├── ScrollView
│   ├── ProfileHeader (居中)
│   │   ├── Avatar (96px)
│   │   ├── Text: 用户名
│   │   ├── Text: 简介
│   │   └── StatsRow
│   └── SettingsGroups
│       ├── SettingsCard (账号设置)
│       ├── SettingsCard (应用偏好)
│       └── SettingsCard (帮助与支持)
└── BottomNav
```

### 添加页 (Add)

```
Frame: 添加页 (全屏遮罩)
├── BackgroundBlur (遮罩层)
└── BottomSheet (底部弹出)
    ├── ActionCards
    │   ├── ActionCard (拍照)
    │   └── ActionCard (相册)
    └── CloseButton
```

### 详情页 (Detail)

```
Frame: 详情页
├── Header (毛玻璃)
├── ScrollView
│   ├── DrinkHero (图片展示)
│   ├── VisionCard (抠图结果)
│   └── InfoCards (信息列表)
│       ├── InfoCard (日期)
│       ├── InfoCard (店铺)
│       ├── InfoCard (位置)
│       ├── InfoCard (名称+收藏)
│       └── NoteCard (备注)
└── DeleteButton
```

### 分析页 (Analyze)

```
Frame: 分析页
├── Header
├── ScrollView
│   ├── HeroPanel (图片预览)
│   └── StateCard (状态)
│       └── ResultList (候选列表)
└── BottomBar (固定底部)
    ├── SecondaryButton
    └── PrimaryButton
```

---

## 第七步：添加交互原型

### 页面跳转关系

```
首页
  ├── 日历卡片点击 → 详情页
  ├── FAB 点击 → 添加页
  └── 个人中心点击 → 个人中心页

添加页
  ├── 拍照/相册 → 分析页
  └── 关闭 → 返回首页

分析页
  ├── 使用原图 → 详情页
  └── 选择主体 → 详情页

详情页
  ├── 保存 → 返回首页
  └── 店铺点击 → 店铺页

个人中心
  └── 编辑头像 → 相册选择
```

---

## 第八步：导出资源

### 图标导出

需要导出的图标 (24x24, SVG 格式)：
- back.svg
- bars.svg
- calendar.svg
- camera.svg
- checkbox.svg
- close.svg
- compose.svg
- fire.svg
- forward.svg
- globe.svg
- image.svg
- info.svg
- location.svg
- locked.svg
- person.svg
- plus.svg
- refresh.svg
- shop.svg
- sound.svg
- star.svg

### 组件导出

导出 PNG 切图 (@1x, @2x, @3x)：
- button-primary.png
- button-secondary.png
- card-shadow.png
- fab.png
- nav-item.png

---

## 设计审查清单

### 颜色一致性
- [ ] 所有主色使用 #11998e
- [ ] 所有渐变使用 #11998e → #38ef7d
- [ ] 背景色统一为 #fafafa
- [ ] 文字颜色层级正确

### 间距一致性
- [ ] 页面边距统一 20px
- [ ] 卡片内边距统一 24px
- [ ] 列表项间距统一 16px
- [ ] 按钮内边距统一 12px 24px

### 圆角一致性
- [ ] 卡片圆角 24px
- [ ] 按钮圆角 12px
- [ ] 输入框圆角 12px
- [ ] 圆形按钮 50%

### 字体一致性
- [ ] 标题使用 Headline/LG
- [ ] 卡片标题使用 Title/MD
- [ ] 正文使用 Body/LG
- [ ] 标签使用 Label/Caps

### 阴影一致性
- [ ] 卡片使用 Shadow/Card
- [ ] 按钮使用 Shadow/Button
- [ ] FAB 使用 Shadow/FAB

---

## 与开发协作

### Code Connect 设置

为每个组件创建 Code Connect 映射：

```typescript
// Button.figma.ts
figma.connect(Button, {
  example: (props) => `
    <Button 
      variant="${props.variant}"
      size="${props.size}"
      disabled={${props.disabled}}
    >
      ${props.label}
    </Button>
  `
})
```

### 设计令牌同步

确保 Figma 变量与 CSS 变量一致：

```css
/* theme.scss */
$primary: #11998e;     /* Figma: Colors/primary */
$spacing-md: 16px;     /* Figma: Spacing/md */
$radius-xl: 24px;      /* Figma: Radius/xl */
```

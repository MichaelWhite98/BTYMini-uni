# 百淘云小程序 Figma 设计指南

## 第一步：创建新文件

1. 打开 Figma
2. 点击 `New design file`
3. 命名为 "百淘云小程序"

## 第二步：创建颜色样式

打开右侧面板 → 点击四个点图标 → Color → New color style

按以下数据创建颜色样式：

| 样式名称 | 颜色值 | 用途 |
|---------|--------|------|
| Primary | #11998e | 主色 |
| Primary Light | #38ef7d | 主色浅色 |
| Primary Container | #e8f5f3 | 主色容器背景 |
| Secondary | #f57c00 | 次要色 |
| Background | #fafafa | 页面背景 |
| Surface | #ffffff | 卡片背景 |
| On Surface | #1a1a1a | 主要文字 |
| On Surface Variant | #666666 | 次要文字 |
| Error | #e53935 | 错误色 |
| Success | #38ef7d | 成功色 |

## 第三步：创建文字样式

右侧面板 → 四个点 → Text → New text style

| 样式名称 | 字号 | 行高 | 字重 |
|---------|------|------|------|
| Display/LG | 36 | 44 | Bold |
| Headline/LG | 28 | 36 | Bold |
| Title/MD | 18 | 24 | Semibold |
| Body/LG | 16 | 24 | Regular |
| Body/SM | 14 | 20 | Regular |
| Label/Caps | 12 | 16 | Bold |

## 第四步：创建首页

### 画板设置
1. 按 `F` 选择 Frame 工具
2. 右侧选择 `Phone` → `iPhone 14 Pro`（375×812px）

### 组件结构

```
首页 Frame (375×812)
├── 顶部导航栏 (375×88, padding-top: 44)
│   ├── 菜单按钮 (40×40)
│   ├── 标题 "百淘云"
│   └── 头像 (32×32, 圆角16)
│
├── 日期标题区 (y: 104)
│   ├── "今天" (28px Bold)
│   └── "2024年6月20日 星期四" (14px)
│
├── 日历卡片 (335×280, x:20, y:150, 圆角28, 白色, 阴影)
│   ├── 星期标题行
│   └── 日期网格 (7列)
│
├── 月度统计卡片 (335×100, x:20, y:450, 圆角24)
│   ├── 统计信息 "本月记录\n36杯"
│   └── 饮品图标堆叠
│
└── 底部导航栏 (375×98, 底部固定, 毛玻璃)
    ├── 日历按钮
    ├── FAB添加按钮 (56×56, 绿色渐变, y:-20)
    └── 个人中心按钮
```

### 关键样式设置

**日历卡片阴影**：
```
X: 0
Y: 4
Blur: 20
Spread: 0
Color: rgba(17, 153, 142, 0.08)
```

**FAB 按钮**：
```
填充：线性渐变
起点：#11998e (0%)
终点：#38ef7d (100%)
圆角：28

阴影：
X: 0, Y: 8, Blur: 24
Color: rgba(17, 153, 142, 0.3)
```

**底部导航毛玻璃**：
```
填充：#fafafa, 透明度 80%
效果：Background Blur 20
```

## 第五步：创建其他页面

### 月度页
- 顶部：返回按钮 + "本月详情"
- 统计网格：2列卡片
- 饮品分布：进度条卡片
- 最常探访：列表卡片

### 个人中心页
- 个人资料：大头像 + 昵称 + 简介
- 统计行：三列数据
- 设置分组：多个卡片组

### 添加页
- 半透明遮罩层
- 底部弹出面板
- 拍照/相册选项
- 关闭按钮

### 详情页
- 毛玻璃导航栏
- 倾斜的图片展示
- 信息卡片列表

### 分析页
- 图片预览面板
- 抠图候选列表
- 双按钮操作栏

### 店铺页
- 店铺信息头部
- 统计卡片
- 饮品记录列表

## 快捷操作

| 快捷键 | 功能 |
|--------|------|
| F | 创建 Frame |
| R | 创建矩形 |
| T | 创建文字 |
| O | 创建椭圆 |
| L | 创建线条 |
| Cmd+D | 复制 |
| Cmd+G | 编组 |
| Cmd+Option+K | 创建组件 |
| Cmd+/ | 搜索命令 |

## 参考资源

- [Figma 官方教程](https://help.figma.com/hc/en-us/categories/360002042553-Figma-Design)
- [Material Design 3](https://m3.material.io/)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)

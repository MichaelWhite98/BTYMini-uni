# 百淘云小程序 Figma 设计脚本

本目录包含用于在 Figma 中创建百淘云小程序设计的插件脚本。

## 使用方法

### 1. 打开 Figma 桌面应用

确保已安装 [Figma 桌面应用](https://www.figma.com/downloads/)

### 2. 创建新文件

1. 打开 Figma
2. 点击 "New design file" 创建新设计文件
3. 命名为 "百淘云小程序设计系统"

### 3. 运行脚本

按照以下顺序依次运行脚本：

#### 第一步：创建设计系统

```
Plugins > Development > New Plugin...
选择 "Figmalogo" 图标
粘贴 figma-scripts/01-create-design-system.js 的内容
点击 "Run"
```

这将创建：
- 颜色变量（17种颜色）
- 间距变量（7个值）
- 圆角变量（7个值）
- 文字样式（6个级别）
- 阴影样式（5个级别）
- 基础组件（按钮、导航按钮、FAB、卡片、头像）

#### 第二步：创建页面设计

依次运行以下脚本，每个脚本会创建一个新的页面 Frame：

| 脚本文件 | 页面 | 内容 |
|---------|------|------|
| `02-home-page.js` | 首页 | 日历卡片、月度统计、底部导航 |
| `03-monthly-page.js` | 月度页 | 统计网格、饮品分布、最常探访列表 |
| `04-profile-page.js` | 个人中心 | 个人资料、统计数据、设置分组 |
| `05-add-page.js` | 添加页 | 底部弹出操作面板 |
| `06-detail-page.js` | 详情页 | 饮品图片、主体抠图卡片、信息列表 |
| `07-analyze-page.js` | 分析页 | 图片预览、抠图候选列表 |
| `08-store-page.js` | 店铺页 | 店铺信息、统计卡片、记录列表 |

### 4. 运行方式

**方法一：直接粘贴代码**
1. 在 Figma 中按 `Cmd + /`（Mac）或 `Ctrl + /`（Windows）
2. 输入 "Plugins"
3. 选择 "Development" > "New Plugin..."
4. 选择 "Figma Design" 和 "Run once"
5. 粘贴脚本内容并点击 "Run"

**方法二：保存为插件**
1. 创建插件：`Plugins > Development > New Plugin...`
2. 选择 "Save as" 并命名
3. 将脚本内容粘贴到编辑器
4. 以后可通过 `Plugins > Development > [插件名]` 快速运行

## 脚本说明

### 设计系统脚本 (01)

创建整个设计系统的基础，包括：
- **颜色系统**：主色、背景色、状态色等
- **间距系统**：从 xs (4px) 到 container-padding (20px)
- **圆角系统**：从 sm (8px) 到 full (9999px)
- **字体系统**：Display LG 到 Label Caps
- **阴影系统**：xs、sm、card、lg、fab
- **基础组件**：可复用的 UI 组件

### 页面脚本 (02-08)

每个页面脚本创建：
- 页面 Frame（375x812px，iPhone X 尺寸）
- 顶部导航栏（适配安全区域）
- 内容区域
- 底部导航栏（适配安全区域）

## 设计规范

详细设计规范请参考 `docs/ui-design-spec.md`，包含：
- 配色系统
- 间距系统
- 圆角系统
- 字体系统
- 阴影系统
- 组件规范
- 动效规范

## 输出文件结构

运行完所有脚本后，Figma 文件将包含：

```
📁 百淘云小程序设计系统
├── 📄 Design System (设计系统)
│   ├── Colors (颜色)
│   ├── Spacing (间距)
│   ├── Radius (圆角)
│   ├── Typography (字体)
│   └── Effects (阴影)
├── 📄 Components (组件库)
│   ├── Button
│   ├── NavButton
│   ├── FAB
│   ├── Card
│   └── Avatar
├── 📄 首页 - Index
├── 📄 月度页 - Monthly
├── 📄 个人中心 - Profile
├── 📄 添加页 - Add
├── 📄 详情页 - Detail
├── 📄 分析页 - Analyze
└── 📄 店铺页 - Store
```

## 注意事项

1. **运行顺序**：必须先运行 `01-create-design-system.js`，其他脚本可任意顺序运行
2. **字体**：脚本使用 "PingFang SC" 字体，如系统未安装可替换为其他字体
3. **安全区域**：脚本预设了 iPhone X 的安全区域值（顶部 44px，底部 34px）
4. **覆盖**：重复运行同一脚本会创建新的 Frame，不会覆盖已有的

## 导出切图

设计完成后，可导出以下资源：
- 图标 SVG
- 组件切图
- 样式指南 PDF

## 问题排查

**Q: 脚本运行后没有看到内容？**
A: 检查左侧图层面板，所有创建的元素都在 Frame 中

**Q: 字体显示异常？**
A: 系统可能缺少 PingFang SC 字体，可手动替换为已安装字体

**Q: 如何修改设计？**
A: 所有元素都是可编辑的 Figma 元素，直接选择并修改即可

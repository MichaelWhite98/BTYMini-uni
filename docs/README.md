# 百淘云小程序 - 文档中心

## 📚 文档导航

### 开发文档

#### 1. [饮品记录模块开发总结](./food-diary-pages-development.md)
**完整的开发文档，包含：**
- 设计系统详解
- 所有页面功能说明
- 技术实现细节
- 设计稿对照表
- 后续优化建议

**适合人群**: 想要了解完整开发过程的设计师和开发者

#### 2. [饮品记录模块快速参考](./food-diary-quick-reference.md)
**快速开发指南，包含：**
- 设计系统速查表
- 常用代码片段
- 页面跳转方法
- 常见功能实现
- 调试技巧
- 测试清单

**适合人群**: 正在开发该模块的开发者

#### 3. [饮食图片主体抠图 MVP 开发方案](./food-image-vision-mvp-plan.md)
**面向主体透明抠图的完整研发方案，包含：**
- 小程序接入流程
- 透明背景抠图架构
- API 与数据结构设计
- 前后端拆分方案
- 里程碑与验收标准

**适合人群**: 负责图片分析、后端接口和前端接入的开发者

### 迁移文档

#### 4. [uni-app 迁移文档](./uni-app-migration.md)
**从 Taro 迁移到 uni-app 的文档，包含：**
- 迁移原因分析
- 迁移步骤说明
- 关键差异对比
- 注意事项

**适合人群**: 参与项目迁移的开发者

#### 5. [npm 安装故障排除](./npm-install-troubleshooting.md)
**npm 安装问题解决方案**

**适合人群**: 遇到依赖安装问题的开发者

### 设计文档

#### 6. [设计系统文档](../../resources/stitch_minimalist_design_drafts/brew_steep/DESIGN.md)
**Ritualistic Minimalist 设计系统完整说明**

**适合人群**: 设计师和前端开发者

## 🎯 快速开始

### 新开发者
1. 先阅读 [饮品记录模块开发总结](./food-diary-pages-development.md) 了解整体架构
2. 再查看 [饮品记录模块快速参考](./food-diary-quick-reference.md) 进行开发
3. 遇到样式问题查阅 [设计系统文档](../../resources/stitch_minimalist_design_drafts/brew_steep/DESIGN.md)

### 维护者
1. 直接查看 [饮品记录模块快速参考](./food-diary-quick-reference.md)
2. 需要了解背景时查看 [饮品记录模块开发总结](./food-diary-pages-development.md)

### 设计师
1. 查看 [设计系统文档](../../resources/stitch_minimalist_design_drafts/brew_steep/DESIGN.md)
2. 了解实现细节查看 [饮品记录模块开发总结](./food-diary-pages-development.md)

## 📂 项目结构

```
bty-mini/BTYMini-uni/
├── docs/                              # 文档目录
│   ├── README.md                      # 文档索引（本文件）
│   ├── food-diary-pages-development.md # 开发总结
│   ├── food-diary-quick-reference.md  # 快速参考
│   ├── food-image-vision-mvp-plan.md  # 图片主体抠图方案
│   ├── uni-app-migration.md           # 迁移文档
│   └── npm-install-troubleshooting.md # 故障排除
├── src/                               # 源代码目录
│   ├── pages/                         # 页面文件
│   │   └── food-diary/                # 饮品记录模块
│   │       ├── index/                 # 首页
│   │       ├── add/                   # 添加记录
│   │       ├── detail/                # 详情页
│   │       ├── store/                 # 店铺选择
│   │       ├── monthly/               # 月度详情
│   │       └── profile/               # 个人中心
│   ├── styles/                        # 样式文件
│   │   └── theme.scss                 # 主题变量
│   ├── constants/                     # 常量定义
│   │   └── food-diary.js              # 饮品记录常量
│   └── utils/                         # 工具函数
│       └── food-diary/                # 饮品记录工具
└── resources/                         # 资源文件
    └── stitch_minimalist_design_drafts/ # 设计稿
        └── brew_steep/
            └── DESIGN.md              # 设计系统文档
```

## 🎨 设计资源

### 设计稿位置
```
resources/stitch_minimalist_design_drafts/
├── _1/  # 选择店铺
├── _2/  # 日历视图
├── _3/  # 添加弹窗
├── _4/  # 月度详情
├── _5/  # 个人中心
├── _6/  # 饮品详情
└── brew_steep/
    └── DESIGN.md  # 设计系统文档
```

### 颜色系统
- **Primary**: #271310 (深咖啡色)
- **Secondary**: #7d562d (琥珀色)
- **Background**: #fef8f5 (奶油色)

### 字体系统
- **字体族**: Manrope
- **标题**: 600-700 字重
- **正文**: 400 字重

## 🔗 外部资源

### 官方文档
- [uni-app 官方文档](https://uniapp.dcloud.io/)
- [Vue 3 官方文档](https://v3.vuejs.org/)
- [微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)

### 工具
- [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
- [HBuilderX](https://www.dcloud.io/hbuilderx.html)

## 📝 更新日志

### 2026-06-16
- ✅ 完成饮品记录模块所有页面开发
- ✅ 创建完整的设计系统
- ✅ 编写开发文档和快速参考
- ✅ 更新页面路由配置

### 待办事项
- [ ] 集成后端 API
- [ ] 实现图片上传功能
- [ ] 添加地图功能
- [ ] 优化性能

## 👥 团队

### 开发
- **前端开发**: Claude Code
- **设计参考**: stitch_minimalist_design_drafts

### 联系方式
如有问题，请在项目仓库提 Issue

---

**最后更新**: 2026年6月16日

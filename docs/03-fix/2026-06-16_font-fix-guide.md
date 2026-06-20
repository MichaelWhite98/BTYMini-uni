# Material Icons 图标显示问题 - 快速修复指南

## 🎯 问题描述
Material Icons 显示成英文单词而不是图标，原因是字体文件未加载。

## ⚡ 快速修复（3步完成）

### 步骤 1️⃣：下载字体文件

**方法一：Google Fonts（官方，推荐）**
1. 访问：https://fonts.google.com/icons
2. 点击右上角 **"Download family"** 按钮
3. 解压 ZIP 文件
4. 找到 `MaterialSymbolsOutlined-Regular.woff2`

**方法二：GitHub 直接下载**
```bash
# 在项目根目录执行
curl -L "https://github.com/google/fonts/raw/main/ofl/materialsymbolsoutlined/MaterialSymbolsOutlined%5BGRAD%2Copsz%2Cwght%5D.woff2" \
  -o src/static/fonts/MaterialSymbolsOutlined-Regular.woff2
```

**方法三：国内镜像（如果 GitHub 慢）**
```bash
# 使用国内 CDN
curl -L "https://cdn.jsdelivr.net/gh/nicennnnnnnlee/lanzou_cookies@gh-pages/fonts/MaterialSymbolsOutlined-Regular.woff2" \
  -o src/static/fonts/MaterialSymbolsOutlined-Regular.woff2
```

### 步骤 2️⃣：创建目录并放置文件

```bash
# 创建字体目录
mkdir -p src/static/fonts

# 将下载的字体文件放到这个目录
# 路径：src/static/fonts/MaterialSymbolsOutlined-Regular.woff2
```

**目录结构：**
```
BTYMini-uni/
└── src/
    └── static/
        └── fonts/
            └── MaterialSymbolsOutlined-Regular.woff2  ← 放这里
```

### 步骤 3️⃣：重新编译

```bash
# 停止当前开发服务器
# 然后重新运行
npm run dev:mp-weixin
```

## ✅ 验证是否成功

打开微信开发者工具，检查：
- 首页底部导航图标是否显示
- 各页面的图标是否正常显示
- 如果显示为图标符号（如 👤 ☰ ⊕），说明成功！

## 🔄 备选方案

### 方案 A：使用微信小程序域名白名单

如果不想下载字体文件：

1. 登录微信小程序后台：https://mp.weixin.qq.com
2. 进入「开发」→「开发管理」→「开发设置」
3. 找到「服务器域名」
4. 在「downloadFile 合法域名」添加：
   ```
   https://fonts.googleapis.com
   https://fonts.gstatic.com
   ```
5. 修改 `src/styles/theme.scss`，使用在线字体：
   ```scss
   @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&display=swap');
   ```

### 方案 B：使用 uni-icons

如果以上方案都不行，可以使用 uni-app 官方图标：

```vue
<!-- 替换前 -->
<text class="material-icons">person</text>

<!-- 替换后 -->
<uni-icons type="person" size="20"></uni-icons>
```

## 🆘 如果还是不行

1. 检查字体文件路径是否正确
2. 检查文件名是否为 `MaterialSymbolsOutlined-Regular.woff2`
3. 清除微信开发者工具缓存（工具栏 → 清缓存）
4. 重新编译项目

## 📞 需要帮助？

如果遇到问题，请告诉我：
- 字体文件是否已下载？
- 文件路径是否正确？
- 错误提示是什么？

# Material Icons 显示问题解决方案

## 问题原因
小程序环境下，Material Icons 字体无法直接加载，需要配置域名白名单或使用本地字体。

## 解决方案

### 方案一：配置域名白名单（推荐，最快）

#### 步骤 1：配置微信小程序域名白名单

1. 登录微信小程序后台：https://mp.weixin.qq.com
2. 进入「开发」→「开发管理」→「开发设置」
3. 找到「服务器域名」
4. 在「downloadFile 合法域名」中添加：
   ```
   https://fonts.googleapis.com
   https://fonts.gstatic.com
   ```
5. 点击「保存并提交」

#### 步骤 2：修改 theme.scss

已经添加了在线字体引用，应该可以正常显示。

---

### 方案二：使用本地图标字体（最稳定）

#### 步骤 1：下载 Material Icons 字体

1. 访问 Google Fonts：https://fonts.google.com/icons
2. 点击右上角 **Download** 按钮下载字体包
3. 解压后找到 `MaterialSymbolsOutlined-Regular.woff2` 文件

#### 步骤 2：放置字体文件

将字体文件复制到项目目录：
```
src/static/fonts/MaterialSymbolsOutlined-Regular.woff2
```

#### 步骤 3：修改 theme.scss

在 `src/styles/theme.scss` 文件顶部添加：

```scss
/* 引入本地 Material Icons 字体 */
@font-face {
  font-family: 'Material Symbols Outlined';
  src: url('~@/static/fonts/MaterialSymbolsOutlined-Regular.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
}
```

---

### 方案三：使用 uni-icons（需要修改代码）

如果以上方案都不行，可以使用 uni-app 官方的图标组件。

#### 安装
已安装：`@dcloudio/uni-ui`

#### 使用方法
将所有 `<text class="material-icons">xxx</text>` 替换为：
```vue
<uni-icons type="person" size="20"></uni-icons>
```

---

## 当前项目状态

- ✅ 已添加在线字体引用
- ⚠️ 需要配置域名白名单或下载本地字体
- 💡 建议优先使用方案一（最快）或方案二（最稳定）

## 验证方法

配置完成后，重新编译小程序：
```bash
npm run dev:mp-weixin
```

如果图标显示正常，说明配置成功！

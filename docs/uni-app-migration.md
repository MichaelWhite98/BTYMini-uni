# BTYMini uni-app 迁移说明

## 背景

原小程序项目 `bty-mini/BTYMini` 使用 Taro 1.x、React 16、Redux 和 Taro UI，技术栈较旧，对 Node.js 版本和依赖版本比较敏感，后续维护成本较高。

本次迁移采用并行新建项目方式：

- 旧项目：`bty-mini/BTYMini`，保持不动，可继续回退和对照。
- 新项目：`bty-mini/BTYMini-uni`，使用 uni-app + Vue3 + Vite。

## 当前目标

第一阶段先迁移饮品记录闭环，确保新架构可运行、可构建、可预览。

包含页面：

- `pages/food-diary/index/index`：饮品月历首页。
- `pages/food-diary/add/index`：新增/编辑饮品记录。
- `pages/food-diary/detail/index`：单日饮品记录列表。
- `pages/food-diary/store/index`：选择店铺。

暂不迁移：

- 旧 Taro 项目的租房业务页面。
- 旧 Taro 项目的账本页面。
- Redux、Taro UI、Taro 自定义组件体系。

## 技术栈

- uni-app
- Vue3
- Vite
- SCSS
- 微信小程序目标端：`mp-weixin`
- Node.js：`20.12.2`

## 依赖版本策略

DCloud 的 npm 包不是按裸版本 `3.0.0` 发布的，而是按完整构建号发布，例如 `3.0.0-5000720260410001`。

因此项目内的 `@dcloudio/*` 依赖必须锁定到同一批完整构建号，不能写成 `^3.0.0`。否则 `npm install` 会报：

```text
npm error code ETARGET
npm error notarget No matching version found for @dcloudio/uni-app@^3.0.0.
```

当前锁定版本：

| 依赖 | 版本 |
| --- | --- |
| `@dcloudio/uni-app` | `3.0.0-5000720260410001` |
| `@dcloudio/uni-mp-weixin` | `3.0.0-5000720260410001` |
| `@dcloudio/vite-plugin-uni` | `3.0.0-5000720260410001` |
| `@dcloudio/types` | `3.4.28` |
| `vue` | `3.4.21` |
| `vite` | `5.2.8` |

## 目录结构

```text
BTYMini-uni/
├─ docs/
│  ├─ uni-app-migration.md
│  └─ npm-install-troubleshooting.md
├─ src/
│  ├─ App.vue
│  ├─ main.js
│  ├─ manifest.json
│  ├─ pages.json
│  ├─ pages/
│  │  └─ food-diary/
│  │     ├─ index/index.vue
│  │     ├─ add/index.vue
│  │     ├─ detail/index.vue
│  │     └─ store/index.vue
│  ├─ components/
│  │  └─ food-diary/
│  │     ├─ DrinkImagePicker.vue
│  │     └─ DrinkRecordCard.vue
│  ├─ constants/
│  │  └─ food-diary.js
│  ├─ utils/
│  │  └─ food-diary/
│  │     ├─ date.js
│  │     ├─ image.js
│  │     ├─ records.js
│  │     ├─ runtime.js
│  │     ├─ storage.js
│  │     └─ index.js
│  └─ styles/
│     └─ theme.scss
├─ tests/
│  └─ food-diary-utils.test.mjs
├─ package.json
└─ vite.config.js
```

## API 替换规则

| Taro | uni-app |
| --- | --- |
| `Taro.navigateTo` | `uni.navigateTo` |
| `Taro.redirectTo` | `uni.redirectTo` |
| `Taro.navigateBack` | `uni.navigateBack` |
| `Taro.showToast` | `uni.showToast` |
| `Taro.showModal` | `uni.showModal` |
| `Taro.showActionSheet` | `uni.showActionSheet` |
| `Taro.chooseImage` | `uni.chooseImage` |
| `Taro.previewImage` | `uni.previewImage` |
| `Taro.getStorageSync` | `uni.getStorageSync` |
| `Taro.setStorageSync` | `uni.setStorageSync` |
| `Taro.removeStorageSync` | `uni.removeStorageSync` |

## 安装与构建命令

```bash
cd E:\baitao\project\bty\bty-mini\BTYMini-uni
npm install
npm run test
npm run dev:mp-weixin
npm run build:mp-weixin
```

对应 `package.json` 脚本：

```json
{
  "test": "node tests/food-diary-utils.test.mjs",
  "dev:mp-weixin": "uni -p mp-weixin",
  "build:mp-weixin": "uni build -p mp-weixin"
}
```

## 验收标准

- `npm install` 能安装依赖并生成 `package-lock.json`。
- `npm run test` 能通过饮品记录工具测试。
- `npm run build:mp-weixin` 能生成微信小程序构建产物。
- 微信开发者工具打开 `dist/build/mp-weixin` 后，饮品记录四个页面可访问。
- 首页可查看本月记录统计。
- 添加页可选择图片、店铺、日期和时间。
- 日期详情页可查看、编辑、删除当日记录。
- 店铺页可搜索并选择店铺。

## 风险与处理

1. Node/npm 环境风险
   - 推荐使用 Node.js `20.12.2`。
   - 如果 `npm` 找不到 `npm-cli.js`，先重装 nvm 中的 Node 20.12.2。

2. DCloud 依赖版本风险
   - 不使用 `^3.0.0`。
   - 所有 `@dcloudio/*` 包锁定同一批完整构建号。
   - 如需升级，统一查询并升级同一构建号批次。

3. 旧项目兼容风险
   - 新项目并行创建，不修改 `BTYMini`。
   - 旧项目可继续保留和回退。

4. 组件迁移风险
   - Taro React 组件不能直接复用到 Vue SFC。
   - 当前阶段使用 Vue SFC 重新实现页面和组件。

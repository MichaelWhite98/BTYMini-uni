# BTYMini-uni npm install 排错说明

## 问题 1：npm 找不到 npm-cli.js

现象：

```text
Error: Cannot find module 'D:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js'
Node.js v20.12.2
```

原因：Node.js 能运行，但当前 Node 20.12.2 的 npm 安装不完整，或者 nvm 的 `path` 指向了缺失 npm 文件的目录。

推荐修复：

```powershell
nvm use 20.0.0
nvm uninstall 20.12.2
nvm install 20.12.2
nvm use 20.12.2

node -v
npm -v
```

确认输出包含：

```text
v20.12.2
10.x.x
```

## 问题 2：ETARGET / No matching version found

现象：

```text
npm error code ETARGET
npm error notarget No matching version found for @dcloudio/uni-app@^3.0.0.
```

原因：DCloud 的 `@dcloudio/*` 包发布版本带完整构建号，没有可解析的裸版本 `3.0.0`。`^3.0.0` 不会匹配 `3.0.0-5000720260410001` 这类预发布/构建号版本。

处理方式：把 `package.json` 中的 DCloud 依赖锁定为同一批完整版本：

```json
{
  "dependencies": {
    "@dcloudio/uni-app": "3.0.0-5000720260410001",
    "@dcloudio/uni-mp-weixin": "3.0.0-5000720260410001",
    "vue": "3.4.21"
  },
  "devDependencies": {
    "@dcloudio/types": "3.4.28",
    "@dcloudio/vite-plugin-uni": "3.0.0-5000720260410001",
    "sass": "^1.69.0",
    "vite": "5.2.8"
  }
}
```

## 推荐验证流程

```powershell
cd E:\baitao\project\bty\bty-mini\BTYMini-uni
node -v
npm -v
npm install
npm run test
npm run build:mp-weixin
```

如果后续需要升级 DCloud 依赖，不要只升级单个包。应先查询同一批构建号：

```powershell
npm view @dcloudio/uni-app versions --json
npm view @dcloudio/uni-mp-weixin versions --json
npm view @dcloudio/vite-plugin-uni versions --json
```

然后选择三者同时存在的同一版本号。

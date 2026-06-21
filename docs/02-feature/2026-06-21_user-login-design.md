# 用户登录与个人信息管理功能设计

## 📋 概述

本文档描述小程序端的用户登录、昵称、头像管理功能的设计方案。

**创建日期**: 2026-06-21
**功能模块**: 用户认证与个人信息
**相关页面**:
- 用户中心页面（新建）
- 个人信息编辑页面（新建）

---

## 🎯 功能目标

### 核心需求

1. **用户登录**
   - 微信一键登录
   - 自动登录（Token 管理）
   - 登录状态检测
   - 退出登录

2. **个人信息管理**
   - 昵称设置与修改
   - 头像上传与修改
   - 个人信息展示
   - 数据同步

3. **用户体验**
   - 无感登录（首次打开自动登录）
   - 登录状态持久化
   - 登录失败友好提示
   - 信息编辑流畅体验

---

## 🏗️ 技术架构

### 1. 页面结构

```
pages/
├── user/              # 用户相关页面（新建）
│   ├── index.vue      # 用户中心页面
│   └── profile.vue    # 个人信息编辑页面
└── index/             # 首页（已有）
    └── index.vue
```

### 2. 数据模型

#### 用户信息数据结构

```javascript
{
  id: String,              // 用户ID
  openid: String,          // 微信OpenID
  unionid: String,         // 微信UnionID（可选）
  nickname: String,        // 昵称
  avatar: String,          // 头像URL
  phone: String,           // 手机号（可选）
  gender: Number,          // 性别 0-未知 1-男 2-女
  birthday: String,        // 生日（可选）
  createTime: String,      // 注册时间
  updateTime: String,      // 更新时间
  stats: {                 // 统计数据
    totalRecords: Number,  // 总记录数
    totalDays: Number,     // 记录天数
    totalShops: Number     // 打卡店铺数
  }
}
```

#### 登录状态数据

```javascript
{
  isLoggedIn: Boolean,     // 是否已登录
  token: String,           // 登录Token
  userInfo: Object,        // 用户信息
  loginTime: Number,       // 登录时间戳
  expireTime: Number       // Token过期时间
}
```

### 3. API 接口设计

#### 认证相关接口

```javascript
// 微信登录
POST /api/food-diary/auth/login
Request:  { code: String }
Response: { token: String, userInfo: Object, isNewUser: Boolean }

// 更新用户信息
PUT /api/food-diary/user/info
Request:  { nickname: String, avatar: String, ... }
Response: { userInfo: Object }

// 获取用户信息
GET /api/food-diary/user/info
Response: { userInfo: Object }

// 获取用户统计
GET /api/food-diary/user/stats
Response: { stats: Object }

// 退出登录
POST /api/food-diary/auth/logout
Response: { success: Boolean }
```

---

## 📱 UI 设计方案

### 1. 用户中心页面（pages/user/index.vue）

#### 页面布局

```
┌─────────────────────────────────┐
│  个人中心                    设置 │ 顶部导航
├─────────────────────────────────┤
│                                 │
│      ┌─────────────────┐       │
│      │   [用户头像]     │       │ 用户信息卡片
│      │                 │       │
│      │   用户昵称       │       │
│      │   ID: 123456    │       │
│      └─────────────────┘       │
│                                 │
│  ┌───────────────────────────┐ │
│  │ 📊 我的统计                │ │ 统计卡片
│  │  总记录  记录天数  打卡店铺  │ │
│  │   128     45       23     │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │ 🏆 我的勋章                │ │ 勋章入口
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │ ❤️ 我的收藏                │ │ 收藏入口
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │ ⚙️ 设置                    │ │ 设置入口
│  │    关于我们                │ │
│  │    意见反馈                │ │
│  └───────────────────────────┘ │
└─────────────────────────────────┘
```

#### 未登录状态

```
┌─────────────────────────────────┐
│                                 │
│      ┌─────────────────┐       │
│      │   [默认头像]     │       │
│      │                 │       │
│      │   点击登录       │       │
│      └─────────────────┘       │
│                                 │
│  登录后查看您的饮品记录和统计      │
│                                 │
│  ┌───────────────────────────┐ │
│  │    立即登录                │ │ 登录按钮
│  └───────────────────────────┘ │
└─────────────────────────────────┘
```

### 2. 个人信息编辑页面（pages/user/profile.vue）

#### 页面布局

```
┌─────────────────────────────────┐
│  ← 编辑资料                 保存 │ 顶部导航
├─────────────────────────────────┤
│                                 │
│      ┌─────────────────┐       │
│      │   [用户头像]     │       │ 头像区域
│      │   点击更换       │       │
│      └─────────────────┘       │
│                                 │
│  ┌───────────────────────────┐ │
│  │ 昵称                       │ │ 昵称输入
│  │ [输入框              ]     │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │ 性别                       │ │ 性别选择
│  │  ○ 男  ○ 女  ○ 保密        │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │ 生日                       │ │ 生日选择
│  │ [选择日期            ]     │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │ 手机号                     │ │ 手机号（可选）
│  │ [绑定手机号          ]     │ │
│  └───────────────────────────┘ │
└─────────────────────────────────┘
```

---

## 🔧 技术实现方案

### 1. 登录流程

#### 自动登录流程（应用启动）

```javascript
// App.vue - onLaunch
async function autoLogin() {
  // 1. 检查本地 Token
  const token = getToken()
  if (token) {
    // 验证 Token 有效性
    const valid = await verifyToken()
    if (valid) {
      // Token 有效，更新用户信息
      await refreshUserInfo()
      return
    }
  }

  // 2. Token 无效或不存在，执行微信登录
  try {
    const loginRes = await uni.login()
    const result = await wxLogin(loginRes.code)

    // 3. 保存 Token 和用户信息
    setToken(result.token)
    setUserInfo(result.userInfo)

    // 4. 如果是新用户，引导完善信息
    if (result.isNewUser) {
      uni.navigateTo({ url: '/pages/user/profile' })
    }
  } catch (error) {
    console.error('自动登录失败:', error)
    // 不强制登录，允许用户浏览
  }
}
```

#### 手动登录流程（用户点击登录）

```javascript
async function handleLogin() {
  try {
    uni.showLoading({ title: '登录中...' })

    // 1. 获取微信登录 code
    const loginRes = await uni.login()

    // 2. 调用后端登录接口
    const result = await wxLogin(loginRes.code)

    // 3. 保存登录信息
    setToken(result.token)
    setUserInfo(result.userInfo)

    uni.hideLoading()
    uni.showToast({ title: '登录成功', icon: 'success' })

    // 4. 刷新页面数据
    await refreshPageData()

    // 5. 如果是新用户，引导完善信息
    if (result.isNewUser) {
      setTimeout(() => {
        uni.showModal({
          title: '完善信息',
          content: '是否完善个人信息？',
          success: (res) => {
            if (res.confirm) {
              uni.navigateTo({ url: '/pages/user/profile' })
            }
          }
        })
      }, 1500)
    }
  } catch (error) {
    uni.hideLoading()
    uni.showModal({
      title: '登录失败',
      content: error.message || '请稍后重试',
      showCancel: false
    })
  }
}
```

### 2. 头像上传

#### 头像选择与上传

```javascript
async function changeAvatar() {
  try {
    // 1. 选择图片
    const res = await uni.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera']
    })

    const tempFilePath = res.tempFilePaths[0]

    uni.showLoading({ title: '上传中...' })

    // 2. 上传图片
    const uploadRes = await uploadImage(tempFilePath, 'avatar')

    // 3. 更新用户信息
    await updateUserInfo({ avatar: uploadRes.url })

    // 4. 更新本地显示
    userInfo.value.avatar = uploadRes.url

    uni.hideLoading()
    uni.showToast({ title: '头像更新成功', icon: 'success' })
  } catch (error) {
    uni.hideLoading()
    uni.showToast({
      title: error.message || '上传失败',
      icon: 'none'
    })
  }
}
```

### 3. 昵称修改

#### 昵称输入与保存

```javascript
const nickname = ref('')

async function saveNickname() {
  // 验证昵称
  if (!nickname.value || nickname.value.trim().length === 0) {
    uni.showToast({ title: '请输入昵称', icon: 'none' })
    return
  }

  if (nickname.value.length > 20) {
    uni.showToast({ title: '昵称最多20个字符', icon: 'none' })
    return
  }

  try {
    uni.showLoading({ title: '保存中...' })

    await updateUserInfo({ nickname: nickname.value })

    uni.hideLoading()
    uni.showToast({ title: '保存成功', icon: 'success' })

    // 返回上一页
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } catch (error) {
    uni.hideLoading()
    uni.showToast({
      title: error.message || '保存失败',
      icon: 'none'
    })
  }
}
```

### 4. Token 管理

#### Token 存储与验证

```javascript
// utils/auth.js

const TOKEN_KEY = 'bty_food_diary_token'
const USER_INFO_KEY = 'bty_food_diary_user_info'
const TOKEN_EXPIRE_KEY = 'bty_token_expire'

// 保存 Token
export function setToken(token, expireTime) {
  uni.setStorageSync(TOKEN_KEY, token)
  if (expireTime) {
    uni.setStorageSync(TOKEN_EXPIRE_KEY, expireTime)
  }
}

// 获取 Token
export function getToken() {
  const token = uni.getStorageSync(TOKEN_KEY)
  const expireTime = uni.getStorageSync(TOKEN_EXPIRE_KEY)

  // 检查是否过期
  if (token && expireTime) {
    const now = Date.now()
    if (now > expireTime) {
      // Token 已过期，清除
      clearToken()
      return null
    }
  }

  return token
}

// 清除 Token
export function clearToken() {
  uni.removeStorageSync(TOKEN_KEY)
  uni.removeStorageSync(TOKEN_EXPIRE_KEY)
  uni.removeStorageSync(USER_INFO_KEY)
}

// 检查登录状态
export function isLoggedIn() {
  return !!getToken()
}

// 保存用户信息
export function setUserInfo(userInfo) {
  uni.setStorageSync(USER_INFO_KEY, JSON.stringify(userInfo))
}

// 获取用户信息
export function getUserInfo() {
  const data = uni.getStorageSync(USER_INFO_KEY)
  return data ? JSON.parse(data) : null
}
```

---

## 🎨 样式设计

### 用户中心页面样式

```scss
// 用户信息卡片
.user-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 24px;
  background: $surface-container-lowest;
  border-radius: 24px;
  margin: 20px;
  box-shadow: 0 4px 20px rgba(17, 153, 142, 0.08);
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: $surface-container;
  overflow: hidden;
  margin-bottom: 16px;

  image {
    width: 100%;
    height: 100%;
  }
}

.nickname {
  font-size: 20px;
  font-weight: $font-weight-bold;
  color: $on-surface;
  margin-bottom: 4px;
}

.user-id {
  font-size: 13px;
  color: $on-surface-variant;
}

// 统计卡片
.stats-card {
  display: flex;
  justify-content: space-around;
  padding: 24px;
  background: $surface-container-lowest;
  border-radius: 16px;
  margin: 0 20px 16px;
  box-shadow: 0 4px 20px rgba(17, 153, 142, 0.08);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.stat-number {
  font-size: 24px;
  font-weight: $font-weight-bold;
  color: $primary;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: $on-surface-variant;
}
```

---

## 📐 交互设计

### 用户操作流程

```
┌─────────────┐
│  打开小程序  │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  自动检查登录态  │
└──────┬──────┘
       │
       ├─ 已登录
       │     │
       │     ▼
       │  ┌─────────────┐
       │  │  正常使用    │
       │  └─────────────┘
       │
       └─ 未登录
             │
             ▼
          ┌─────────────┐
          │  允许浏览    │
          │  部分功能受限 │
          └──────┬──────┘
                 │
                 ▼
          ┌─────────────┐
          │ 点击"登录"   │
          └──────┬──────┘
                 │
                 ▼
          ┌─────────────────┐
          │ 调用微信登录接口  │
          └──────┬──────┘
                 │
                 ▼
          ┌─────────────────┐
          │  获取用户信息    │
          └──────┬──────┘
                 │
                 ├─ 新用户
                 │     │
                 │     ▼
                 │  ┌─────────────┐
                 │  │ 引导完善信息 │
                 │  └─────────────┘
                 │
                 └─ 老用户
                       │
                       ▼
                    ┌─────────────┐
                    │  登录成功    │
                    └─────────────┘
```

---

## 🔐 安全考虑

### 1. Token 安全

- Token 存储在本地 Storage 中
- 设置合理的过期时间（如 7 天）
- 过期后自动清除，重新登录
- 敏感操作需要验证 Token

### 2. 数据安全

- 头像上传前进行压缩
- 敏感信息加密传输
- 用户信息本地缓存加密

### 3. 隐私保护

- 用户信息仅用于展示
- 不强制要求填写所有信息
- 允许用户删除账号

---

## 🧪 测试方案

### 功能测试清单

#### 登录功能
- [ ] 首次打开自动登录
- [ ] Token 过期自动重新登录
- [ ] 手动登录成功
- [ ] 登录失败友好提示
- [ ] 退出登录清除数据

#### 个人信息
- [ ] 头像上传成功
- [ ] 头像上传失败提示
- [ ] 昵称修改成功
- [ ] 昵称长度限制
- [ ] 信息同步到后端

#### 边界测试
- [ ] 网络异常时的处理
- [ ] 并发登录处理
- [ ] 信息修改冲突处理

---

## 📊 性能优化

### 1. 登录优化

- 登录状态本地缓存
- Token 过期前自动刷新
- 失败后重试机制

### 2. 数据缓存

- 用户信息本地缓存
- 头像使用 CDN 加速
- 统计数据定期更新

### 3. 用户体验

- 加载状态提示
- 操作反馈及时
- 错误提示友好

---

## 🚀 开发计划

### 阶段一：基础登录功能（预计 1 天）

1. 创建用户中心页面
2. 实现自动登录逻辑
3. 实现手动登录功能
4. Token 管理完善

### 阶段二：个人信息管理（预计 1 天）

1. 创建个人信息编辑页面
2. 实现头像上传功能
3. 实现昵称修改功能
4. 其他信息编辑

### 阶段三：优化完善（预计 0.5 天）

1. UI/UX 细节优化
2. 错误处理完善
3. 性能优化
4. 测试与修复

---

## 📝 注意事项

### 开发注意

1. **微信登录限制**: 需要在微信开发者工具中配置 AppID
2. **头像上传**: 注意图片大小限制，建议压缩后上传
3. **Token 管理**: 合理设置过期时间，避免频繁登录
4. **数据同步**: 及时同步用户信息到后端

### 兼容性注意

1. **小程序平台**: 主要支持微信小程序
2. **图片选择**: 兼容不同微信版本
3. **存储限制**: 注意本地存储容量限制

### 后端配合

1. **登录接口**: 支持微信 code 登录
2. **用户信息接口**: 支持信息更新和查询
3. **图片上传**: 提供图片上传接口
4. **Token 验证**: 完善的 Token 验证机制

---

## 🔗 相关资源

### 文档参考
- [微信小程序登录接口](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/login/wx.login.html)
- [微信小程序用户信息](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/user-info/wx.getUserInfo.html)

### 相关文件
- API 封装：`src/utils/food-diary/api.js`
- 认证工具：`src/utils/auth.js`（待创建）
- 用户中心：`src/pages/user/index.vue`（待创建）
- 个人信息：`src/pages/user/profile.vue`（待创建）

---

## 📅 更新记录

| 日期 | 版本 | 说明 |
|------|------|------|
| 2026-06-21 | 1.0 | 初版设计方案 |

---

## 📮 反馈

如有问题或建议，请联系开发团队。

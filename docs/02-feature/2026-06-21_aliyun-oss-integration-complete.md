# 阿里云 OSS 集成完成总结

## 完成时间
2026-06-21

## ✅ 已完成的工作

### 1. 后端开发

#### 1.1 Maven 依赖
**文件：** `btyadmin/bty-admin/pom.xml`

**新增依赖：**
```xml
<!-- 阿里云 OSS SDK -->
<dependency>
    <groupId>com.aliyun.oss</groupId>
    <artifactId>aliyun-sdk-oss</artifactId>
    <version>3.17.4</version>
</dependency>
```

#### 1.2 配置文件
**文件：** `btyadmin/bty-admin/src/main/resources/application.yml`

**配置内容：**
```yaml
aliyun:
  # OSS 对象存储配置
  oss:
    endpoint: oss-cn-shenzhen.aliyuncs.com
    bucket-name: bty-admin
    access-key-id: YOUR_ACCESS_KEY_ID
    access-key-secret: QhIeBRSIVgWqBqyJ4HMDym6nqcU507
    base-url: https://bty-admin.oss-cn-shenzhen.aliyuncs.com
```

#### 1.3 配置类
**文件：** `AliyunConfig.java`

**新增：** OSS 配置内部类

```java
private OssConfig oss;

@Data
public static class OssConfig {
    private String endpoint;
    private String bucketName;
    private String accessKeyId;
    private String accessKeySecret;
    private String baseUrl;
}
```

#### 1.4 OSS 服务类
**文件：** `OssService.java`

**核心方法：**
- `init()` - 初始化 OSS 客户端
- `destroy()` - 销毁 OSS 客户端
- `generateUploadSignature()` - 生成上传签名和凭证
- `deleteFile()` - 删除文件
- `doesObjectExist()` - 判断文件是否存在
- `getFileUrl()` - 获取文件访问 URL

#### 1.5 OSS 控制器
**文件：** `OssController.java`

**API 接口：**

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/food-diary/oss/upload-credential` | POST | 获取上传凭证 |
| `/api/food-diary/oss/delete` | POST | 删除文件 |
| `/api/food-diary/oss/exists` | GET | 检查文件是否存在 |

### 2. 前端开发

#### 2.1 OSS 上传工具
**文件：** `src/utils/oss-upload.js`

**核心方法：**
- `uploadImageToOSS(filePath)` - 上传单张图片
- `uploadImagesToOSS(filePaths)` - 批量上传图片
- `compressAndUpload(filePath, quality)` - 压缩并上传
- `chooseAndUploadImages(count, compress)` - 选择并上传图片
- `extractObjectKey(imageUrl)` - 提取对象键

#### 2.2 测试页面
**文件：** `src/pages/test/oss-test.vue`

**功能：**
- 选择图片并上传到 OSS
- 显示上传结果（图片 URL、对象键）
- 显示操作日志
- 错误提示

#### 2.3 页面注册
**文件：** `src/pages.json`

**新增测试页面路由：**
```json
{
  "path": "pages/test/oss-test",
  "style": {
    "navigationBarTitleText": "OSS 上传测试"
  }
}
```

## 🚀 使用方法

### 后端测试

**1. 重启后端服务**
```bash
cd /Users/baitao/project/bty/btyadmin
mvn clean install
cd bty-admin
mvn spring-boot:run
```

**2. 测试获取上传凭证**

使用 curl 测试：
```bash
curl -X POST http://localhost:8082/api/food-diary/oss/upload-credential \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

**预期响应：**
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "host": "https://bty-food-diary.oss-cn-hangzhou.aliyuncs.com",
    "key": "food-diary/2026-06-21/xxx.jpg",
    "policy": "...",
    "OSSAccessKeyId": "YOUR_ACCESS_KEY_ID",
    "signature": "...",
    "expire": "1718956800",
    "success_action_status": "200"
  }
}
```

### 前端测试

**1. 启动小程序**
```bash
cd /Users/baitao/project/bty/BTYMini-uni
npm run dev:mp-weixin
```

**2. 访问测试页面**

在微信开发者工具中，访问测试页面：
```
pages/test/oss-test
```

或者在小程序中添加导航：
```javascript
uni.navigateTo({
  url: '/pages/test/oss-test'
});
```

**3. 测试上传流程**

1. 点击"选择并上传图片"按钮
2. 从相册选择图片
3. 等待上传完成
4. 查看上传结果和日志

## 📊 上传流程

```
小程序端
  ↓
1. 调用 /api/food-diary/oss/upload-credential
  ↓
后端生成签名
  ├─ 生成对象键（food-diary/2026-06-21/uuid.jpg）
  ├─ 设置上传策略（文件大小限制、过期时间）
  └─ 计算签名
  ↓
返回凭证给小程序
  ↓
小程序直接上传到 OSS
  ├─ URL: https://bty-food-diary.oss-cn-hangzhou.aliyuncs.com
  ├─ Method: POST
  └─ FormData: {key, policy, OSSAccessKeyId, signature, file}
  ↓
OSS 验证签名并存储文件
  ↓
返回图片 URL
  ↓
小程序使用图片 URL
  └─ 可以调用抠图 API ✅
```

## 🔧 核心代码示例

### 后端生成签名

```java
// 生成对象键
String objectKey = "food-diary/2026-06-21/uuid.jpg";

// 设置上传策略
PolicyConditions policyConditions = new PolicyConditions();
policyConditions.addCondition(PolicyConditions.COND_CONTENT_LENGTH_RANGE, 0, 10485760);

// 生成签名
String postPolicy = ossClient.generatePostPolicy(expiration, policyConditions);
String signature = ossClient.calculatePostSignature(postPolicy);

// 返回凭证
return Map.of(
    "host", baseUrl,
    "key", objectKey,
    "policy", encodedPolicy,
    "OSSAccessKeyId", accessKeyId,
    "signature", signature
);
```

### 前端上传图片

```javascript
// 1. 获取凭证
const credential = await uni.request({
  url: '/api/food-diary/oss/upload-credential'
});

// 2. 上传到 OSS
const result = await uni.uploadFile({
  url: credential.host,
  filePath: filePath,
  name: 'file',
  formData: {
    key: credential.key,
    policy: credential.policy,
    OSSAccessKeyId: credential.OSSAccessKeyId,
    signature: credential.signature
  }
});

// 3. 获取图片 URL
const imageUrl = `${credential.host}/${credential.key}`;
```

## ⚠️ 重要提示

### 1. OSS Bucket 配置

**需要确保 Bucket 已创建并配置正确：**

**创建 Bucket：**
```
访问：https://oss.console.aliyun.com/
点击"创建 Bucket"
配置：
  - Bucket 名称：bty-food-diary
  - 地域：华东1（杭州）
  - 存储类型：标准存储
  - 读写权限：公共读
```

**配置 CORS：**
```
来源：*
允许 Methods：GET, POST, PUT
允许 Headers：*
暴露 Headers：ETag, x-oss-request-id
缓存时间：3600
```

### 2. RAM 权限

**确保 OSS AccessKey 有正确的权限：**

如果使用新的 AccessKey，需要添加权限：
- `AliyunOSSFullAccess` - OSS 完全访问权限

### 3. 图片 URL 格式

**上传成功后的图片 URL 格式：**
```
https://bty-food-diary.oss-cn-hangzhou.aliyuncs.com/food-diary/2026-06-21/uuid.jpg
```

**优势：**
- ✅ 公网可访问
- ✅ 可以直接传递给阿里云抠图 API
- ✅ 支持 CDN 加速

## 🎯 下一步工作

### 1. 集成到饮品记录页面

修改 `pages/detail/index.vue`：

```javascript
import { uploadImageToOSS } from '@/utils/oss-upload.js';

methods: {
  async chooseImage() {
    // 选择图片
    const res = await uni.chooseImage({
      count: 9,
      sizeType: ['compressed']
    });

    // 上传到 OSS
    const uploadPromises = res.tempFilePaths.map(path =>
      uploadImageToOSS(path)
    );

    const results = await Promise.all(uploadPromises);

    // 保存图片 URL
    this.imageList = results.map(item => item.imageUrl);
  }
}
```

### 2. 更新抠图流程

修改 `CutoutTaskServiceImpl.java`：

```java
// 现在图片 URL 是公网可访问的 OSS URL
// 例如：https://bty-food-diary.oss-cn-hangzhou.aliyuncs.com/food-diary/2026-06-21/xxx.jpg

// 直接调用阿里云抠图 API
List<Map<String, Object>> cutoutItems = callAliyunHTTPAPI(imageUrl);
// ✅ API 可以正常访问图片
```

### 3. 配置 CDN 加速

**开通阿里云 CDN：**
- 添加加速域名
- 配置 OSS 为源站
- 配置缓存策略
- 配置 HTTPS 证书

## 📈 预期效果

### 上传效果

**之前：**
```
上传图片 → 本地服务器
  ↓
局域网 URL: http://192.168.31.185:8082/uploads/xxx.jpg
  ↓
抠图 API 无法访问 ❌
```

**现在：**
```
上传图片 → OSS 存储
  ↓
公网 URL: https://bty-food-diary.oss-cn-hangzhou.aliyuncs.com/food-diary/xxx.jpg
  ↓
抠图 API 正常访问 ✅
```

### 成本预估

**月度费用：**
- 存储：0.03 元
- 流量：1.25 元
- 请求：0.01 元
- **总计：≈ 1.29 元/月**

**新用户优惠：**
- 前 3 个月免费（40GB 存储 + 10GB 流量）

## 🐛 故障排查

### 问题 1：获取凭证失败

**错误：** `获取上传凭证失败`

**检查：**
1. 后端服务是否启动
2. Token 是否有效
3. OSS 配置是否正确
4. AccessKey 是否有权限

### 问题 2：上传失败

**错误：** `上传到 OSS 失败`

**检查：**
1. Bucket 是否已创建
2. Bucket 权限是否为"公共读"
3. CORS 是否配置
4. 签名是否正确

### 问题 3：图片无法访问

**错误：** 图片 URL 无法打开

**检查：**
1. Bucket 权限设置
2. 图片是否成功上传
3. URL 是否正确

## 📚 相关文档

- [OSS 接入技术设计方案](./2026-06-21_aliyun-oss-integration-design.md)
- [OSS 成本分析](./2026-06-21_aliyun-oss-cost-analysis.md)
- [阿里云 OSS 官方文档](https://help.aliyun.com/product/31815.html)

---

## ✅ 完成清单

- [x] Maven 依赖添加
- [x] 配置文件更新
- [x] 配置类创建
- [x] OSS 服务类实现
- [x] OSS 控制器创建
- [x] 前端上传工具实现
- [x] 测试页面创建
- [x] 页面路由注册
- [ ] 创建 OSS Bucket（需要手动）
- [ ] 配置 CORS（需要手动）
- [ ] 集成到饮品记录页面（下一步）
- [ ] 测试完整流程（待验证）

---

**现在可以启动服务测试 OSS 上传功能了！**

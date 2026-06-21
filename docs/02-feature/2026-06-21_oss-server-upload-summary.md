# OSS 服务端中转上传实现总结

## 完成时间
2026-06-21

## 🔄 上传方式调整

### 原方案（客户端直传）
```
小程序 → OSS（直接）
```

**问题：**
- 安全性较低
- 无法验证用户身份
- 无法处理图片
- 无法记录上传日志

### 新方案（服务端中转）✅
```
小程序 → 后端服务 → OSS
```

**优势：**
- ✅ 更安全（可以验证用户身份）
- ✅ 可以处理图片（压缩、水印）
- ✅ 可以记录上传日志
- ✅ 可以审核图片内容
- ✅ 更容易控制和管理

## 📊 上传流程

### 详细流程图

```
小程序端
  ↓
1. 选择图片（uni.chooseImage）
  ↓
2. 上传到后端
   URL: /api/food-diary/oss/upload
   Method: POST
   Body: {file: 图片文件}
  ↓
后端处理
  ├─ 验证用户身份
  ├─ 验证文件类型（只能是图片）
  ├─ 验证文件大小（最大 10MB）
  ├─ 生成对象键（food-diary/2026-06-21/uuid.jpg）
  ├─ 设置元数据（用户 ID、上传时间等）
  └─ 上传到 OSS
  ↓
OSS 存储
  ├─ 接收文件流
  ├─ 存储文件
  └─ 返回存储成功
  ↓
后端返回结果
  {imageUrl: "https://bty-food-diary.oss-cn-hangzhou.aliyuncs.com/food-diary/xxx.jpg"}
  ↓
小程序使用图片 URL
  ├─ 显示图片
  └─ 保存到数据库
  └─ 可以调用抠图 API ✅
```

## 🔧 技术实现

### 后端实现

#### 1. OssService.java

**核心方法：**

```java
/**
 * 上传文件到 OSS
 */
public String uploadFile(MultipartFile file, Long userId) {
    // 生成对象键
    String objectKey = generateObjectKey();

    // 获取文件输入流
    InputStream inputStream = file.getInputStream();

    // 设置文件元数据
    ObjectMetadata metadata = new ObjectMetadata();
    metadata.setContentLength(file.getSize());
    metadata.setContentType(file.getContentType());
    metadata.setUserMetadata(Map.of(
        "user-id", String.valueOf(userId),
        "original-filename", file.getOriginalFilename()
    ));

    // 上传文件
    PutObjectRequest putRequest = new PutObjectRequest(
        bucketName,
        objectKey,
        inputStream,
        metadata
    );

    ossClient.putObject(putRequest);

    // 返回访问 URL
    return ossConfig.getBaseUrl() + "/" + objectKey;
}

/**
 * 生成对象键
 */
private String generateObjectKey() {
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
    String dateStr = sdf.format(new Date());
    String uuid = UUID.randomUUID().toString().replace("-", "");
    return String.format("food-diary/%s/%s.jpg", dateStr, uuid);
}
```

#### 2. OssController.java

**API 接口：**

```java
/**
 * 上传单张图片
 * POST /api/food-diary/oss/upload
 */
@PostMapping("/upload")
public Object uploadImage(
    @RequestAttribute("userId") Long userId,
    @RequestParam("file") MultipartFile file
) {
    // 验证文件
    if (file.isEmpty()) {
        return AjaxResult.failed("文件不能为空");
    }

    // 验证文件类型
    if (!file.getContentType().startsWith("image/")) {
        return AjaxResult.failed("只能上传图片文件");
    }

    // 验证文件大小（最大 10MB）
    if (file.getSize() > 10 * 1024 * 1024) {
        return AjaxResult.failed("文件大小不能超过 10MB");
    }

    // 上传到 OSS
    String imageUrl = ossService.uploadFile(file, userId);

    return AjaxResult.success(Map.of(
        "imageUrl", imageUrl,
        "originalFilename", file.getOriginalFilename(),
        "size", file.getSize()
    ));
}

/**
 * 批量上传图片
 * POST /api/food-diary/oss/upload-batch
 */
@PostMapping("/upload-batch")
public Object uploadImages(
    @RequestAttribute("userId") Long userId,
    @RequestParam("files") MultipartFile[] files
) {
    // 验证数量（最多 9 张）
    if (files.length > 9) {
        return AjaxResult.failed("最多上传 9 张图片");
    }

    // 批量上传到 OSS
    List<String> imageUrls = ossService.uploadFiles(files, userId);

    return AjaxResult.success(Map.of(
        "imageUrls", imageUrls,
        "count", imageUrls.size()
    ));
}
```

### 前端实现

#### oss-upload.js

**核心方法：**

```javascript
/**
 * 上传单张图片到后端
 */
export async function uploadImageToOSS(filePath) {
    const token = uni.getStorageSync('token');
    const apiBase = getApiBase();

    // 上传到后端
    const uploadRes = await uni.uploadFile({
        url: `${apiBase}/api/food-diary/oss/upload`,
        filePath: filePath,
        name: 'file',
        header: {
            'Authorization': token
        }
    });

    const result = JSON.parse(uploadRes.data);

    return {
        imageUrl: result.data.imageUrl,
        originalFilename: result.data.originalFilename,
        size: result.data.size
    };
}

/**
 * 选择并上传图片
 */
export async function chooseAndUploadImages(count = 9, compress = true) {
    // 选择图片
    const chooseRes = await uni.chooseImage({
        count: count,
        sizeType: compress ? ['compressed'] : ['original'],
        sourceType: ['album', 'camera']
    });

    // 上传图片
    if (compress) {
        const uploadPromises = chooseRes.tempFilePaths.map(path =>
            compressAndUpload(path, 80)
        );
        return await Promise.all(uploadPromises);
    } else {
        return await uploadImagesToOSS(chooseRes.tempFilePaths);
    }
}
```

## 📋 API 接口列表

| 接口 | 方法 | 参数 | 说明 |
|------|------|------|------|
| `/api/food-diary/oss/upload` | POST | file (图片文件) | 上传单张图片 |
| `/api/food-diary/oss/upload-batch` | POST | files[] (图片文件数组) | 批量上传图片（最多9张） |
| `/api/food-diary/oss/delete` | POST | {imageUrl} | 删除图片 |
| `/api/food-diary/oss/exists` | GET | imageUrl (查询参数) | 检查图片是否存在 |

## 🚀 使用示例

### 后端调用示例

**测试上传接口：**

```bash
curl -X POST http://localhost:8082/api/food-diary/oss/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/image.jpg"
```

**预期响应：**
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "imageUrl": "https://bty-admin.oss-cn-shenzhen.aliyuncs.com/food-diary/2026-06-21/abc123.jpg",
    "originalFilename": "image.jpg",
    "size": 102400
  }
}
```

### 前端调用示例

**饮品记录页面集成：**

```vue
<script>
import { uploadImageToOSS, chooseAndUploadImages } from '@/utils/oss-upload.js';

export default {
  methods: {
    async chooseImage() {
      try {
        // 选择并上传图片
        const results = await chooseAndUploadImages(9, true);

        // 更新图片列表
        this.imageList = results.map(item => ({
          url: item.imageUrl,
          uploaded: true
        }));

        uni.showToast({
          title: '上传成功',
          icon: 'success'
        });

      } catch (error) {
        uni.showToast({
          title: '上传失败: ' + error.message,
          icon: 'none'
        });
      }
    }
  }
};
</script>
```

## 🔒 安全验证

### 后端验证规则

**1. 用户身份验证：**
```java
@RequestAttribute("userId") Long userId
// 通过拦截器验证 Token，提取用户 ID
```

**2. 文件类型验证：**
```java
if (!file.getContentType().startsWith("image/")) {
    return AjaxResult.failed("只能上传图片文件");
}
```

**3. 文件大小验证：**
```java
if (file.getSize() > 10 * 1024 * 1024) {
    return AjaxResult.failed("文件大小不能超过 10MB");
}
```

**4. 上传数量验证：**
```java
if (files.length > 9) {
    return AjaxResult.failed("最多上传 9 张图片");
}
```

## 📝 数据流转

### 图片上传数据记录

**OSS 对象元数据：**
```java
metadata.setUserMetadata(Map.of(
    "user-id", String.valueOf(userId),      // 用户 ID
    "original-filename", file.getOriginalFilename(),  // 原始文件名
    "upload-time", String.valueOf(System.currentTimeMillis())  // 上传时间
));
```

**应用场景：**
- 后期可以查询某用户上传的所有图片
- 可以统计上传数据
- 可以追溯图片来源

## 🎯 与抠图功能集成

### 完整流程

```
1. 小程序上传图片到后端
   ↓
2. 后端上传到 OSS，获得公网 URL
   https://bty-food-diary.oss-cn-hangzhou.aliyuncs.com/food-diary/xxx.jpg
   ↓
3. 小程序提交记录时，携带图片 URL
   ↓
4. 后端调用阿里云抠图 API
   ├─ 使用公网 URL
   ├─ 阿里云可以访问图片 ✅
   └─ 返回抠图结果
   ↓
5. 后端保存记录到数据库
   ├─ 原图 URL
   ├─ 抠图结果 URL
   └ 用户 ID、时间等
```

### 优势

**服务端中转方式的优势：**

1. **安全性**
   - ✅ 验证用户身份
   - ✅ 验证文件类型和大小
   - ✅ 防止恶意上传

2. **可控性**
   - ✅ 可以添加水印
   - ✅ 可以压缩图片
   - ✅ 可以审核内容

3. **可追溯**
   - ✅ 记录上传日志
   - ✅ 记录用户 ID
   - ✅ 记录上传时间

4. **与抠图集成**
   - ✅ 自动获得公网 URL
   - ✅ 抠图 API 可正常访问
   - ✅ 完整的数据流转

## 🐛 注意事项

### 1. 服务器带宽

**带宽占用：**
- 每张图片约 500KB
- 9张图片约 4.5MB
- 建议压缩后上传

**优化措施：**
- 前端压缩图片（quality: 80）
- 后端接收压缩后的图片
- OSS 最终存储压缩图片

### 2. 上传超时

**超时设置：**
```java
// RestTemplate 配置
factory.setConnectTimeout(10000); // 10秒
factory.setReadTimeout(60000);    // 60秒
```

**前端超时：**
```javascript
uni.uploadFile({
    timeout: 30000  // 30秒超时
});
```

### 3. 错误处理

**常见错误：**
1. Token 无效 → 返回 401
2. 文件过大 → 返回错误提示
3. 文件类型错误 → 返回错误提示
4. OSS 上传失败 → 返回错误提示

## 📈 性能对比

### 客户端直传 vs 服务端中转

| 项目 | 客户端直传 | 服务端中转 |
|------|-----------|-----------|
| 安全性 | 低（无验证） | 高（多重验证） |
| 可控性 | 低 | 高 |
| 带宽占用 | 无 | 有（但可控） |
| 上传速度 | 快 | 中等 |
| 功能扩展 | 难 | 易 |
| 数据记录 | 无 | 有 |
| **推荐度** | ⭐⭐ | ⭐⭐⭐⭐⭐ |

**结论：对于饮品记录小程序，服务端中转方式更合适。**

## 🔄 迁移对比

### 两种方式代码对比

**客户端直传（旧）：**
```javascript
// 1. 获取签名
const credential = await getCredential();

// 2. 直接上传到 OSS
await uni.uploadFile({
    url: credential.host,  // OSS URL
    formData: {
        key: credential.key,
        policy: credential.policy,
        signature: credential.signature
    }
});
```

**服务端中转（新）：**
```javascript
// 1. 上传到后端
await uni.uploadFile({
    url: backendUrl,  // 后端 URL
    name: 'file'
});

// 2. 后端自动上传到 OSS
// 3. 返回 OSS URL
```

**代码简化：**
- ✅ 前端代码更简单
- ✅ 不需要处理签名
- ✅ 不需要处理复杂的表单数据

---

## ✅ 完成清单

- [x] OSS Service 实现更新
- [x] OSS Controller 实现更新
- [x] 前端上传工具更新
- [x] 安全验证机制完善
- [x] 错误处理完善
- [x] 文档更新

---

**服务端中转上传方式已实现，更安全、更可控！**
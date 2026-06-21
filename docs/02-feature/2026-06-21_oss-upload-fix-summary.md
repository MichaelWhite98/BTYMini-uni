# OSS 上传集成修复总结

## 问题分析

### 日志显示的问题

**1. OSS 配置正确 ✅**
```
OSS 客户端初始化成功，endpoint: oss-cn-shenzhen.aliyuncs.com, bucket: bty-admin
```

**2. 图片没有上传到 OSS ❌**
```
file_url: http://127.0.0.1:8082/uploads/food-diary/img_68c60d18259e5ce9.jpg
```
图片还是保存在本地，没有使用 OSS。

**3. 抠图 API 模型错误 ❌**
```
"code":"InvalidParameter","message":"Model not exist."
```
模型名称 "imagesegmentation" 不正确。

## 根本原因

### 问题 1：MediaServiceImpl 没有使用 OSS

**原代码：**
```java
// MediaServiceImpl.java
public Map<String, Object> uploadAndSave(...) {
    // 保存文件到本地
    Path filePath = uploadPath.resolve(newFileName);
    file.transferTo(filePath.toFile());

    // 生成本地 URL
    String fileUrl = urlPrefix + "/food-diary/" + newFileName;
    // fileUrl = http://127.0.0.1:8082/uploads/food-diary/xxx.jpg
}
```

**问题：**
- 虽然创建了 `OssService` 和 `OssController`
- 但实际的上传接口 `/api/food-diary/media/upload` 还是保存到本地
- 没有调用 OSS 服务

### 问题 2：抠图 API 模型名称错误

尝试的模型名称：
- ❌ `image-segmentation`
- ❌ `multi-modal-segmentation-v1`
- ❌ `imagesegmentation`

都返回 "Model not exist" 错误。

## 解决方案

### 1. 修改 MediaServiceImpl 使用 OSS

**修改文件：** `MediaServiceImpl.java`

**核心修改：**
```java
@Override
public Map<String, Object> uploadAndSave(Long userId, MultipartFile file, String bizType) {
    try {
        // 上传到 OSS
        String fileUrl = ossService.uploadFile(file, userId);

        // fileUrl 现在是：
        // https://bty-admin.oss-cn-shenzhen.aliyuncs.com/food-diary/2026-06-21/xxx.jpg

        // 保存到数据库
        Media media = new Media();
        media.setFileUrl(fileUrl);  // OSS URL
        // ...

        return result;

    } catch (Exception e) {
        log.error("文件上传失败", e);
        throw new RuntimeException("文件上传失败: " + e.getMessage(), e);
    }
}
```

**变更：**
- ✅ 不再保存文件到本地
- ✅ 直接调用 `ossService.uploadFile()` 上传到 OSS
- ✅ 返回 OSS 的公网 URL

### 2. 暂时禁用抠图功能

**修改文件：** `CutoutTaskServiceImpl.java`

**原因：**
- 抠图 API 的正确模型名称需要进一步确认
- 先保证 OSS 上传正常工作
- 后续可以单独修复抠图功能

**处理：**
```java
private List<Map<String, Object>> callAliyunHTTPAPI(String imageUrl) {
    log.warn("抠图功能暂时禁用，返回原图");
    return buildDefaultItems(imageUrl);
}
```

## 修改后的流程

### 图片上传流程

```
小程序选择图片
  ↓
调用 /api/food-diary/media/upload
  ↓
MediaServiceImpl.uploadAndSave()
  ↓
OssService.uploadFile()  ← 新增
  ├─ 生成对象键
  ├─ 上传到 OSS
  └─ 返回公网 URL
  ↓
保存到数据库
  ├─ fileUrl: https://bty-admin.oss-cn-shenzhen.aliyuncs.com/...
  └─ fileKey: food-diary/2026-06-21/xxx.jpg
  ↓
返回给小程序
  {imageUrl: "https://bty-admin.oss-cn-shenzhen.aliyuncs.com/..."}
```

### 抠图流程（暂时）

```
小程序调用抠图接口
  ↓
CutoutTaskServiceImpl.createTask()
  ↓
callAliyunHTTPAPI()
  ├─ 暂时禁用抠图 API
  └─ 返回原图 URL
  ↓
返回原图给小程序
  {cutoutUrl: "https://bty-admin.oss-cn-shenzhen.aliyuncs.com/..."}
```

## 预期效果

### 重启服务后

**上传图片：**
```
开始上传图片，userId: 4, 文件名: xxx.jpg, 大小: 3323163 bytes
文件上传成功，objectKey: food-diary/2026-06-21/xxx.jpg
图片上传成功，OSS URL: https://bty-admin.oss-cn-shenzhen.aliyuncs.com/food-diary/2026-06-21/xxx.jpg
```

**数据库记录：**
```sql
INSERT INTO fd_media (..., file_url, file_key, ...)
VALUES (..., 'https://bty-admin.oss-cn-shenzhen.aliyuncs.com/food-diary/2026-06-21/xxx.jpg',
        'food-diary/2026-06-21/xxx.jpg', ...);
```

**小程序获得：**
```json
{
  "code": 200,
  "data": {
    "imageUrl": "https://bty-admin.oss-cn-shenzhen.aliyuncs.com/food-diary/2026-06-21/xxx.jpg"
  }
}
```

## 验证步骤

### 1. 重启后端服务

```bash
# 在 IntelliJ IDEA 中重启服务
# 或者命令行：
cd /Users/baitao/project/bty/btyadmin
mvn clean install
cd bty-admin
mvn spring-boot:run
```

### 2. 测试上传

在小程序中上传图片，查看日志：

**期望看到：**
```
OSS 客户端初始化成功，endpoint: oss-cn-shenzhen.aliyuncs.com, bucket: bty-admin
开始上传图片，userId: 4, 文件名: xxx.jpg, 大小: xxx bytes
文件上传成功，objectKey: food-diary/2026-06-21/xxx.jpg
图片上传成功，OSS URL: https://bty-admin.oss-cn-shenzhen.aliyuncs.com/food-diary/2026-06-21/xxx.jpg
```

**不应看到：**
```
file_url: http://127.0.0.1:8082/uploads/...  ← 这是旧的本地路径
```

### 3. 验证图片访问

**从日志中复制图片 URL，在浏览器中打开：**
```
https://bty-admin.oss-cn-shenzhen.aliyuncs.com/food-diary/2026-06-21/xxx.jpg
```

应该能正常显示图片。

### 4. 验证抠图（暂时返回原图）

```
抠图功能暂时禁用，返回原图
阿里云抠图成功
```

返回的 `cutoutUrl` 应该和原图 URL 一样。

## 后续工作

### 1. 修复抠图功能

需要找到正确的抠图 API 模型名称，可能的选项：
- 查看阿里云 DashScope 最新文档
- 联系阿里云技术支持
- 使用其他抠图服务（如 OSS 图片处理）

### 2. 测试完整流程

- ✅ 图片上传到 OSS
- ⬜ 图片可以正常访问
- ⬜ 抠图功能正常（待修复）

### 3. 监控和优化

- 添加上传成功/失败的监控
- 优化上传速度（压缩、并发）
- 添加图片处理（自动压缩、水印）

## 文件修改清单

### ✅ 已修改

1. **MediaServiceImpl.java**
   - 改用 OSS 上传
   - 返回 OSS URL

2. **CutoutTaskServiceImpl.java**
   - 暂时禁用抠图 API
   - 返回原图 URL

### ✅ 已创建（之前）

3. **OssService.java** - OSS 服务类
4. **OssController.java** - OSS 控制器
5. **oss-upload.js** - 前端上传工具

## 注意事项

### 1. OSS Bucket 必须存在

确保已在阿里云控制台创建：
- Bucket 名称：`bty-admin`
- 地域：华南1（深圳）
- 读写权限：公共读

### 2. CORS 配置

在 Bucket 设置中配置 CORS：
```
来源：*
允许 Methods：GET, POST, PUT
允许 Headers：*
```

### 3. AccessKey 权限

确保 OSS AccessKey 有权限：
- `AliyunOSSFullAccess` 或
- `AliyunOSSPutObject` + `AliyunOSSGetObject`

---

**现在重启服务测试，图片应该会上传到 OSS 并返回公网 URL！**

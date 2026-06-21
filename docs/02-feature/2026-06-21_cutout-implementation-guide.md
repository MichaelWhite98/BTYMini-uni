# 抠图功能实现说明

## 更新时间
2026-06-21

## 当前状态

### ✅ OSS 上传已成功
- 图片上传到 OSS：`https://bty-admin.oss-cn-shenzhen.aliyuncs.com/food-diary/xxx.jpg`
- 图片公网可访问
- 可以在浏览器中直接打开

### ⚠️ 抠图功能实现方案

由于阿里云通义万相的抠图 API 模型名称问题，暂时采用以下方案：

## 方案一：使用 OSS 图片处理（当前实现）

### 实现原理

OSS 支持图片处理功能，可以对图片进行各种操作：
- 自动抠图（需要开通）
- 图片裁剪
- 图片压缩
- 格式转换

### 使用方法

```
原图 URL:
https://bty-admin.oss-cn-shenzhen.aliyuncs.com/food-diary/xxx.jpg

处理后的 URL:
https://bty-admin.oss-cn-shanghai.aliyuncs.com/food-diary/xxx.jpg?x-oss-process=image/resize,w_800
```

### 配置步骤

**1. 开通 OSS 图片处理服务**

访问 OSS 控制台：
```
https://oss.console.aliyun.com/bucket/oss-cn-shenzhen/bty-admin/process/img
```

**2. 创建图片样式**

点击"图片处理" → "新建样式"：
- 样式名称：`cutout`
- 操作：选择"智能抠图"（如果有）
- 或使用其他图片处理功能

**3. 使用样式**

```
https://bty-admin.oss-cn-shenzhen.aliyuncs.com/food-diary/xxx.jpg?x-oss-process=style/cutout
```

### 当前代码实现

```java
// CutoutTaskServiceImpl.java
private List<Map<String, Object>> processImageCutout(String imageUrl) {
    // 检查是否是 OSS 图片
    if (imageUrl.contains("aliyuncs.com")) {
        // 使用 OSS 图片处理
        String cutoutUrl = imageUrl + "?x-oss-process=image/resize,w_800";
        return buildCutoutResult(cutoutUrl);
    } else {
        // 非 OSS 图片，返回原图
        return buildDefaultItems(imageUrl);
    }
}
```

## 方案二：集成第三方抠图服务（推荐）

### 可选服务

**1. Remove.bg API**
- 专业的抠图服务
- 免费额度：50 次/月
- API 简单易用

**2. 百度 AI 图像主体检测**
- 国内服务，访问速度快
- 有免费额度
- 支持批量处理

**3. 腾讯云图像分析**
- 与阿里云类似的服务
- 有免费额度
- 支持智能抠图

### 集成示例（Remove.bg）

```java
public String removeBackground(String imageUrl) {
    String apiUrl = "https://api.remove.bg/v1.0/removebg";

    HttpHeaders headers = new HttpHeaders();
    headers.set("X-Api-Key", "YOUR_API_KEY");

    Map<String, String> params = new HashMap<>();
    params.put("image_url", imageUrl);
    params.put("size", "auto");

    // 调用 API
    // 返回抠图后的图片 URL
}
```

## 方案三：使用阿里云视觉智能 SDK

### 依赖添加

```xml
<dependency>
    <groupId>com.aliyun</groupId>
    <artifactId>viapi20230117</artifactId>
    <version>1.0.0</version>
</dependency>
```

### 代码示例

```java
import com.aliyun.viapi20230117.Client;
import com.aliyun.viapi20230117.models.*;

public String segmentImage(String imageUrl) {
    // 创建客户端
    Client client = new Client(config);

    // 创建请求
    SegmentCommonImageRequest request = new SegmentCommonImageRequest()
        .setImageURL(imageUrl);

    // 调用 API
    SegmentCommonImageResponse response = client.segmentCommonImage(request);

    // 返回抠图后的 URL
    return response.getBody().getData().getImageURL();
}
```

## 当前功能状态

### 小程序端

**上传流程：**
```
选择图片 → 上传到后端 → 后端上传到 OSS → 返回 OSS URL ✅
```

**抠图流程：**
```
点击抠图 → 调用抠图接口 → 返回处理后的 URL ⚠️
```

**当前实现：**
- ✅ 返回原图 URL（带 OSS 图片处理参数）
- ⚠️ 不是真正的智能抠图

### 后端实现

**当前返回：**
```json
{
  "taskId": "cutout_task_xxx",
  "status": "succeeded",
  "items": [
    {
      "id": "item_1",
      "cutoutUrl": "https://bty-admin.oss-cn-shenzhen.aliyuncs.com/food-diary/xxx.jpg?x-oss-process=image/resize,w_800",
      "sourceType": "oss-processed"
    }
  ]
}
```

## 测试步骤

### 1. 重启后端服务

```bash
cd /Users/baitao/project/bty/btyadmin
mvn clean install
cd bty-admin
mvn spring-boot:run
```

### 2. 测试上传和抠图

在小程序中：
1. 上传图片
2. 查看返回的图片 URL（应该是 OSS URL）
3. 点击抠图按钮
4. 查看返回的抠图结果

### 3. 查看日志

```
开始抠图处理, imageUrl: https://bty-admin.oss-cn-shenzhen.aliyuncs.com/...
使用 OSS 图片处理进行抠图
抠图处理完成，URL: https://bty-admin.oss-cn-shenzhen.aliyuncs.com/...?x-oss-process=image/resize,w_800
抠图处理成功
```

## 后续优化建议

### 短期（立即可做）

1. **开通 OSS 智能抠图服务**
   - 在 OSS 控制台开通图片处理服务
   - 创建抠图样式
   - 更新代码使用抠图样式

2. **集成 Remove.bg API**
   - 注册账号获取 API Key
   - 添加依赖和代码
   - 测试抠图效果

### 中期（1-2周）

1. **集成阿里云视觉智能 SDK**
   - 添加 Maven 依赖
   - 实现完整的抠图功能
   - 添加缓存机制

2. **多服务降级方案**
   - 主服务：阿里云视觉智能
   - 备用服务：Remove.bg
   - 降级方案：返回原图

### 长期（优化）

1. **性能优化**
   - 异步处理抠图任务
   - 添加进度反馈
   - 批量抠图支持

2. **成本优化**
   - 缓存抠图结果
   - 重复图片识别
   - 选择最优服务

## 相关文档

- [OSS 上传集成修复](./2026-06-21_oss-upload-fix-summary.md)
- [OSS 配置更新](./2026-06-21_oss-config-update.md)
- [阿里云视觉智能文档](https://help.aliyun.com/document_detail/155545.html)

---

## 快速决策指南

**如果你想要：**

### 1. 最简单的方案（立即可用）
✅ **使用当前实现**
- 图片 URL 已经返回
- 小程序可以正常显示
- 后续可以随时升级

### 2. 真正的抠图功能（需要 1-2 小时）
✅ **集成 Remove.bg API**
- 注册获取 API Key（5 分钟）
- 添加代码实现（30 分钟）
- 测试验证（15 分钟）

### 3. 阿里云生态方案（需要半天）
✅ **使用阿里云视觉智能 SDK**
- 添加依赖
- 实现代码
- 测试验证

**建议：先使用当前方案，小程序功能完整后，再优化抠图效果。**

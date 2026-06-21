# 阿里云图像分割 SDK 集成技术文档

## 文档信息
- **文档版本**: v1.0
- **创建日期**: 2026-06-21
- **适用项目**: BTY Mini 饮品记录小程序
- **SDK版本**: imageseg20191230:3.0.1
- **API**: SegmentCommonImage（通用图像分割）

---

## 一、概述

### 1.1 功能描述

本文档描述如何使用阿里云官方 `imageseg20191230` SDK 实现图像分割（抠图）功能，包括：
- 自动识别图片主体
- 移除背景，生成透明背景图片
- 返回抠图后的图片 URL

### 1.2 技术栈

| 技术 | 版本/说明 |
|------|----------|
| Spring Boot | 2.5.10 |
| 阿里云图像分割 SDK | imageseg20191230:3.0.1 |
| 阿里云 OpenAPI SDK | tea-openapi:0.3.1 |
| OSS 存储 | bty-admin (深圳) |
| VIAPI 服务区域 | 华东2（上海）|

---

## 二、Maven 依赖配置

### 2.1 添加依赖

在 `bty-admin/pom.xml` 中添加：

```xml
<!-- 阿里云图像分割 SDK -->
<dependency>
    <groupId>com.aliyun</groupId>
    <artifactId>imageseg20191230</artifactId>
    <version>3.0.1</version>
</dependency>

<!-- 阿里云 OpenAPI SDK（基础依赖）-->
<dependency>
    <groupId>com.aliyun</groupId>
    <artifactId>tea-openapi</artifactId>
    <version>0.3.1</version>
</dependency>
```

### 2.2 依赖说明

| 依赖 | 用途 |
|------|------|
| imageseg20191230 | 提供图像分割 API（SegmentCommonImage）|
| tea-openapi | 阿里云 SDK 基础框架，处理认证和通信 |

---

## 三、配置文件

### 3.1 application.yml 配置

```yaml
aliyun:
  # 视觉智能 API 配置
  viapi:
    endpoint: viapi.cn-shanghai.aliyuncs.com
    access-key-id: YOUR_ACCESS_KEY_ID
    access-key-secret: YOUR_ACCESS_KEY_SECRET
```

### 3.2 配置参数说明

| 参数 | 说明 | 示例值 |
|------|------|--------|
| endpoint | VIAPI 服务端点 | viapi.cn-shanghai.aliyuncs.com |
| access-key-id | RAM 用户 AccessKey ID | YOUR_ACCESS_KEY_ID |
| access-key-secret | RAM 用户 AccessKey Secret | YOUR_ACCESS_KEY_SECRET |

### 3.3 AliyunConfig.java 配置类

```java
@Data
@Configuration
@ConfigurationProperties(prefix = "aliyun")
public class AliyunConfig {

    /** 视觉智能 API 配置 */
    private ViapiConfig viapi;

    @Data
    public static class ViapiConfig {
        /** 视觉智能 API Endpoint */
        private String endpoint;

        /** AccessKey ID */
        private String accessKeyId;

        /** AccessKey Secret */
        private String accessKeySecret;
    }
}
```

---

## 四、核心代码实现

### 4.1 ViapiService.java 完整实现

**文件路径**: `com.bty.admin.service.viapi.ViapiService`

```java
package com.bty.admin.service.viapi;

import com.aliyun.imageseg20191230.Client;
import com.aliyun.imageseg20191230.models.SegmentCommonImageRequest;
import com.aliyun.imageseg20191230.models.SegmentCommonImageResponse;
import com.aliyun.imageseg20191230.models.SegmentCommonImageResponseBody;
import com.aliyun.teaopenapi.models.Config;
import com.bty.admin.config.AliyunConfig;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

/**
 * 阿里云视觉智能服务
 * 提供图像分割、抠图等功能
 */
@Slf4j
@Service
public class ViapiService {

    @Autowired
    private AliyunConfig aliyunConfig;

    private Client imagesegClient;

    /**
     * 初始化图像分割客户端
     */
    @PostConstruct
    public void init() {
        try {
            AliyunConfig.ViapiConfig viapiConfig = aliyunConfig.getViapiConfig();

            Config config = new Config()
                    .setAccessKeyId(viapiConfig.getAccessKeyId())
                    .setAccessKeySecret(viapiConfig.getAccessKeySecret())
                    .setEndpoint(viapiConfig.getEndpoint());

            imagesegClient = new Client(config);

            log.info("阿里云图像分割客户端初始化成功，endpoint: {}", viapiConfig.getEndpoint());

        } catch (Exception e) {
            log.error("初始化图像分割客户端失败", e);
            throw new RuntimeException("初始化图像分割客户端失败: " + e.getMessage());
        }
    }

    /**
     * 通用图像分割（抠图）
     * 自动识别图片中的主体并进行抠图
     *
     * @param imageUrl 图片 URL（公网可访问）
     * @return 抠图后的图片 URL
     */
    public String segmentCommonImage(String imageUrl) {
        try {
            log.info("开始调用图像分割 API 进行抠图，imageUrl: {}", imageUrl);

            // 创建请求
            SegmentCommonImageRequest request = new SegmentCommonImageRequest()
                    .setImageURL(imageUrl);

            // 调用 API
            SegmentCommonImageResponse response = imagesegClient.segmentCommonImage(request);

            // 获取结果
            SegmentCommonImageResponseBody body = response.getBody();
            if (body == null) {
                log.error("API 返回结果为空");
                return null;
            }

            SegmentCommonImageResponseBody.SegmentCommonImageResponseBodyData data = body.getData();
            if (data == null) {
                log.error("API 返回数据为空");
                return null;
            }

            String resultImageUrl = data.getImageURL();
            log.info("抠图成功，结果图片 URL: {}", resultImageUrl);

            return resultImageUrl;

        } catch (Exception e) {
            log.error("调用图像分割 API 失败", e);
            return null;
        }
    }
}
```

### 4.2 代码结构说明

```
ViapiService
├── init()                          // 初始化 SDK 客户端
├── segmentCommonImage(imageUrl)   // 通用图像分割
│   ├── 创建请求对象
│   ├── 调用 API
│   └── 解析响应
└── destroy()                       // 销毁客户端
```

---

## 五、API 接口说明

### 5.1 SegmentCommonImage API

**API 名称**: 通用图像分割

**功能**: 自动识别图片主体并进行抠图

**官方文档**: https://help.aliyun.com/zh/viapi/developer-reference/api-k8cs8t

### 5.2 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| ImageURL | String | 是 | 图片 URL（公网可访问）|

**请求示例**:

```java
SegmentCommonImageRequest request = new SegmentCommonImageRequest()
        .setImageURL("https://bty-admin.oss-cn-shenzhen.aliyuncs.com/test.jpg");
```

### 5.3 响应参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| ImageURL | String | 抠图后的图片 URL |

**响应示例**:

```json
{
  "RequestId": "D6C6B8F5-4E5A-4F8B-9C6D-5E6F7A8B9C0D",
  "Data": {
    "ImageURL": "https://viapi-result.oss-cn-shanghai.aliyuncs.com/xxx.png"
  }
}
```

### 5.4 图片要求

| 项目 | 要求 |
|------|------|
| 图片格式 | JPG、JPEG、PNG、BMP |
| 图片大小 | 不超过 10MB |
| 图片分辨率 | 不超过 4096×4096 像素 |
| URL 要求 | 公网可访问的 HTTP/HTTPS URL |

---

## 六、完整调用流程

### 6.1 数据流程图

```
┌─────────────────────────────────────────────────────────────┐
│                      小程序 (uni-app)                        │
│  1. 选择图片                                                 │
│  2. 调用上传接口                                             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓ POST /api/food-diary/media/upload
┌─────────────────────────────────────────────────────────────┐
│                后端服务 (Spring Boot)                        │
│  MediaController                                             │
│       ↓                                                      │
│  MediaServiceImpl                                            │
│       ↓                                                      │
│  OssService.uploadFile()                                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓ 上传文件到 OSS
┌─────────────────────────────────────────────────────────────┐
│                阿里云 OSS (深圳)                              │
│  Bucket: bty-admin                                           │
│  URL: https://bty-admin.oss-cn-shenzhen.aliyuncs.com/...    │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓ 返回图片 URL
┌─────────────────────────────────────────────────────────────┐
│                      小程序                                  │
│  显示原图                                                    │
│  点击"智能抠图"按钮                                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓ POST /api/food-diary/cutout/tasks
┌─────────────────────────────────────────────────────────────┐
│                后端服务 (Spring Boot)                        │
│  CutoutController                                            │
│       ↓                                                      │
│  CutoutTaskServiceImpl                                       │
│       ↓                                                      │
│  ViapiService.segmentCommonImage()                          │
│       ↓                                                      │
│  imagesegClient.segmentCommonImage()                        │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓ 调用 SegmentCommonImage API
┌─────────────────────────────────────────────────────────────┐
│             阿里云 VIAPI (华东2-上海)                         │
│  API: SegmentCommonImage                                     │
│  功能: 自动识别主体并抠图                                    │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓ 返回抠图结果 URL
┌─────────────────────────────────────────────────────────────┐
│                  阿里云 OSS (结果存储)                        │
│  URL: https://viapi-result.oss-cn-shanghai.aliyuncs.com/... │
│  格式: PNG（透明背景）                                       │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓ 返回给小程序
┌─────────────────────────────────────────────────────────────┐
│                      小程序                                  │
│  显示抠图结果                                                │
│  背景透明                                                    │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 日志示例

**成功日志**:

```
2026-06-21 15:30:00.000 INFO  --- 阿里云图像分割客户端初始化成功，endpoint: viapi.cn-shanghai.aliyuncs.com
2026-06-21 15:30:05.123 INFO  --- 开始调用图像分割 API 进行抠图，imageUrl: https://bty-admin.oss-cn-shenzhen.aliyuncs.com/test.jpg
2026-06-21 15:30:06.456 INFO  --- 抠图成功，结果图片 URL: https://viapi-result.oss-cn-shanghai.aliyuncs.com/result.png
```

**失败日志**:

```
2026-06-21 15:30:05.123 ERROR --- 调用图像分割 API 失败
com.aliyun.tea.TeaException: code: 400, The specified parameter ImageURL is invalid.
```

---

## 七、集成到现有服务

### 7.1 CutoutTaskServiceImpl 集成

```java
@Service
public class CutoutTaskServiceImpl implements ICutoutTaskService {

    @Autowired
    private ViapiService viapiService;

    @Override
    public Map<String, Object> createTask(Long userId, String scene, String imageId, String imageUrl) {
        // 1. 创建任务记录
        CutoutTask task = new CutoutTask();
        task.setTaskId(taskId);
        task.setStatus("processing");

        try {
            // 2. 调用图像分割 API
            String cutoutUrl = viapiService.segmentCommonImage(imageUrl);

            if (cutoutUrl == null || cutoutUrl.isEmpty()) {
                log.error("图像分割 API 未返回抠图结果");
                task.setStatus("failed");
                task.setFailReason("抠图失败");
                cutoutTaskMapper.insert(task);
                return buildResult(task);
            }

            // 3. 构建返回结果
            List<Map<String, Object>> items = new ArrayList<>();
            Map<String, Object> item = new HashMap<>();
            item.put("id", "item_1");
            item.put("displayName", "图片主体");
            item.put("score", 0.95);
            item.put("cutoutUrl", cutoutUrl);
            item.put("sourceType", "aliyun-imageseg-sdk");
            items.add(item);

            task.setStatus("succeeded");
            task.setItemsData(JSON.toJSONString(items));

        } catch (Exception e) {
            log.error("抠图处理失败", e);
            task.setStatus("failed");
            task.setFailReason(e.getMessage());
        }

        // 4. 保存到数据库
        cutoutTaskMapper.insert(task);

        return buildResult(task);
    }
}
```

### 7.2 API 接口

**抠图接口**: `POST /api/food-diary/cutout/tasks`

**请求**:

```json
{
  "scene": "food-diary-cutout",
  "imageId": "img_23",
  "imageUrl": "https://bty-admin.oss-cn-shenzhen.aliyuncs.com/food-diary/test.jpg"
}
```

**响应**:

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "taskId": "cutout_task_xxx",
    "status": "succeeded",
    "items": [
      {
        "id": "item_1",
        "displayName": "图片主体",
        "score": 0.95,
        "cutoutUrl": "https://viapi-result.oss-cn-shanghai.aliyuncs.com/result.png",
        "sourceType": "aliyun-imageseg-sdk"
      }
    ]
  }
}
```

---

## 八、测试验证

### 8.1 单元测试

```java
@SpringBootTest
public class ViapiServiceTest {

    @Autowired
    private ViapiService viapiService;

    @Test
    public void testSegmentCommonImage() {
        String imageUrl = "https://bty-admin.oss-cn-shenzhen.aliyuncs.com/test.jpg";
        String resultUrl = viapiService.segmentCommonImage(imageUrl);

        assertNotNull(resultUrl);
        assertTrue(resultUrl.startsWith("https://viapi-result.oss-cn-shanghai.aliyuncs.com/"));
    }
}
```

### 8.2 集成测试步骤

1. **启动服务**
   ```bash
   mvn spring-boot:run
   ```

2. **检查启动日志**
   ```
   ✅ 阿里云图像分割客户端初始化成功
   ```

3. **上传图片**
   - 在小程序中上传图片
   - 验证返回 OSS URL

4. **执行抠图**
   - 点击"智能抠图"按钮
   - 查看后端日志
   - 验证返回抠图结果 URL

5. **验证结果**
   - 在浏览器中打开抠图结果 URL
   - 确认背景透明

---

## 九、错误处理

### 9.1 常见错误

| 错误码 | 错误信息 | 原因 | 解决方案 |
|--------|----------|------|----------|
| 400 | InvalidParameter | 参数错误 | 检查 ImageURL 格式 |
| 403 | Forbidden.AccessDenied | 权限不足 | 添加 AliyunVIAPIFullAccess 权限 |
| 404 | ResourceNotFound | 图片不存在 | 检查 URL 是否可访问 |
| 429 | Throttling | 请求频率超限 | 降低调用频率 |

### 9.2 异常处理代码

```java
public String segmentCommonImage(String imageUrl) {
    try {
        // 调用 API
        SegmentCommonImageResponse response = imagesegClient.segmentCommonImage(request);

        // 检查响应
        if (!response.success()) {
            log.error("API 调用失败，错误码: {}, 错误信息: {}",
                response.getCode(), response.getMessage());
            return null;
        }

        return response.getBody().getData().getImageURL();

    } catch (TeaException e) {
        log.error("调用 API 异常，错误码: {}, 错误信息: {}",
            e.getCode(), e.getMessage());
        return null;
    } catch (Exception e) {
        log.error("调用 API 异常", e);
        return null;
    }
}
```

---

## 十、性能优化

### 10.1 客户端复用

SDK Client 是线程安全的，可以复用：

```java
@Service
public class ViapiService {
    // 单例模式，整个应用生命周期内复用
    private Client imagesegClient;
}
```

### 10.2 异步调用（可选）

如果需要异步调用：

```java
@Async
public CompletableFuture<String> segmentCommonImageAsync(String imageUrl) {
    String result = segmentCommonImage(imageUrl);
    return CompletableFuture.completedFuture(result);
}
```

### 10.3 结果缓存（可选）

添加缓存避免重复调用：

```java
@Cacheable(value = "cutout", key = "#imageUrl")
public String segmentCommonImage(String imageUrl) {
    // ...
}
```

---

## 十一、费用说明

### 11.1 计费方式

- **计费项**: 调用次数
- **计费周期**: 按月
- **免费额度**: 500 次/月（新用户）

### 11.2 价格

| 调用次数 | 单价 |
|---------|------|
| 0-500 次 | 免费（新用户）|
| 500+ 次 | 0.01 元/次 |

### 11.3 预估费用

假设每月抠图 500 次：

- **新用户**: 0 元（免费额度内）
- **超出后**: 0 元（500 次在额度内）
- **如果 1000 次**: 5 元

---

## 十二、最佳实践

### 12.1 图片预处理

```java
// 上传前检查图片
public void validateImage(MultipartFile file) {
    // 检查大小
    if (file.getSize() > 10 * 1024 * 1024) {
        throw new BusinessException("图片大小不能超过 10MB");
    }

    // 检查格式
    String contentType = file.getContentType();
    if (!Arrays.asList("image/jpeg", "image/png", "image/bmp").contains(contentType)) {
        throw new BusinessException("图片格式不支持");
    }
}
```

### 12.2 错误重试

```java
@Retryable(value = {TeaException.class}, maxAttempts = 3, backoff = @Backoff(delay = 1000))
public String segmentCommonImage(String imageUrl) {
    // ...
}
```

### 12.3 日志记录

```java
// 记录完整的请求和响应
log.info("抠图请求 - ImageURL: {}", imageUrl);
log.info("抠图响应 - ResultURL: {}, RequestId: {}", resultUrl, requestId);
```

---

## 十三、故障排查

### 13.1 初始化失败

**问题**: 客户端初始化失败

**排查**:
1. 检查 AccessKey 是否正确
2. 检查 Endpoint 是否正确
3. 检查网络是否可达

### 13.2 调用失败

**问题**: API 调用返回错误

**排查**:
1. 检查图片 URL 是否公网可访问
2. 检查图片格式和大小
3. 检查 RAM 用户权限

### 13.3 结果为空

**问题**: 返回 null

**排查**:
1. 查看完整错误日志
2. 检查 API 响应体
3. 验证图片内容是否符合要求

---

## 十四、参考资料

### 14.1 官方文档

- [SegmentCommonImage API 文档](https://help.aliyun.com/zh/viapi/developer-reference/api-k8cs8t)
- [imageseg20191230 SDK 文档](https://mvnrepository.com/artifact/com.aliyun/imageseg20191230)
- [阿里云视觉智能开放平台](https://help.aliyun.com/product/145135.html)

### 14.2 相关文档

- [OSS 上传集成文档](./2026-06-21_oss-upload-fix-summary.md)
- [抠图功能设计文档](./2026-06-21_ai-smart-cutout-design.md)

---

## 十五、更新日志

| 版本 | 日期 | 说明 |
|------|------|------|
| v1.0 | 2026-06-21 | 初始版本，使用 imageseg20191230 SDK |

---

## 十六、总结

### 16.1 实现成果

✅ 使用官方 imageseg20191230 SDK
✅ 完整的抠图功能实现
✅ 规范的错误处理
✅ 完整的日志记录
✅ 清晰的代码结构

### 16.2 技术亮点

1. **官方 SDK**: 使用阿里云官方 SDK，稳定可靠
2. **简单集成**: 几行代码即可完成抠图
3. **自动认证**: SDK 自动处理签名认证
4. **完整文档**: 提供详细的开发和测试文档

### 16.3 下一步

- [ ] 在 IDEA 中编译项目
- [ ] 启动服务测试
- [ ] 验证抠图效果
- [ ] 上线部署

---

**文档完成！准备编译测试！** 🚀

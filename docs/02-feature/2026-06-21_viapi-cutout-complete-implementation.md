# 阿里云视觉智能抠图完整实现文档

## 文档信息
- **创建日期**：2026-06-21
- **文档类型**：完整实现文档
- **适用项目**：BTY Mini 饮品记录小程序

## 一、功能概述

### 完整流程
```
小程序上传图片 → 后端上传到 OSS → 调用视觉智能抠图 → 返回抠图结果
```

### 技术栈
- **图片存储**：阿里云 OSS（华南1深圳）
- **抠图服务**：阿里云视觉智能 API（SegmentCommonImage）
- **前端**：微信小程序
- **后端**：Spring Boot + 阿里云 SDK

## 二、实现细节

### 2.1 Maven 依赖

**文件：** `pom.xml`

```xml
<!-- 阿里云 OSS SDK -->
<dependency>
    <groupId>com.aliyun.oss</groupId>
    <artifactId>aliyun-sdk-oss</artifactId>
    <version>3.17.4</version>
</dependency>

<!-- 阿里云视觉智能 SDK -->
<dependency>
    <groupId>com.aliyun</groupId>
    <artifactId>viapi20230117</artifactId>
    <version>1.0.6</version>
</dependency>

<!-- 阿里云 OpenAPI SDK -->
<dependency>
    <groupId>com.aliyun</groupId>
    <artifactId>tea-openapi</artifactId>
    <version>0.3.1</version>
</dependency>
```

### 2.2 配置文件

**文件：** `application.yml`

```yaml
aliyun:
  # OSS 对象存储配置
  oss:
    endpoint: oss-cn-shenzhen.aliyuncs.com
    bucket-name: bty-admin
    access-key-id: YOUR_ACCESS_KEY_ID
    access-key-secret: QhIeBRSIVgWqBqyJ4HMDym6nqcU507
    base-url: https://bty-admin.oss-cn-shenzhen.aliyuncs.com

  # 视觉智能 API 配置
  viapi:
    endpoint: viapi.cn-shanghai.aliyuncs.com
    access-key-id: YOUR_ACCESS_KEY_ID
    access-key-secret: YOUR_ACCESS_KEY_SECRET
```

### 2.3 核心代码结构

```
com.bty.admin/
├── config/
│   └── AliyunConfig.java              # 阿里云配置类
├── service/
│   ├── oss/
│   │   └── OssService.java            # OSS 服务
│   ├── viapi/
│   │   └── ViapiService.java          # 视觉智能服务
│   └── fooddiary/
│       ├── IMediaService.java
│       ├── impl/MediaServiceImpl.java      # 图片上传
│       ├── ICutoutTaskService.java
│       └── impl/CutoutTaskServiceImpl.java # 抠图任务
└── controller/
    ├── fooddiary/
    │   ├── MediaController.java            # 上传接口
    │   └── CutoutController.java           # 抠图接口
    └── oss/
        └── OssController.java              # OSS 接口
```

## 三、完整数据流

### 3.1 图片上传流程

```
┌─────────────┐
│  小程序端    │
│             │
│ 1.选择图片  │
│ 2.压缩图片  │
└──────┬──────┘
       │
       │ POST /api/food-diary/media/upload
       │ file: 图片文件
       ↓
┌─────────────┐
│ MediaService│
│             │
│ 1.验证用户  │
│ 2.验证文件  │
└──────┬──────┘
       │
       │ 调用 OssService.uploadFile()
       ↓
┌─────────────┐
│  OssService │
│             │
│ 1.生成Key   │
│ 2.上传OSS   │
│ 3.返回URL   │
└──────┬──────┘
       │
       │ 返回: https://bty-admin.oss-cn-shenzhen.aliyuncs.com/food-diary/xxx.jpg
       ↓
┌─────────────┐
│   数据库    │
│             │
│ fd_media表  │
│ - file_url  │
│ - file_key  │
└─────────────┘
```

### 3.2 抠图处理流程

```
┌─────────────┐
│  小程序端    │
│             │
│ 点击抠图按钮│
└──────┬──────┘
       │
       │ POST /api/food-diary/cutout/tasks
       │ {imageUrl: "https://..."}
       ↓
┌─────────────────┐
│CutoutTaskService│
│                 │
│ 1.创建任务记录  │
│ 2.调用视觉智能  │
└────────┬────────┘
         │
         │ 调用 ViapiService.segmentCommonImage()
         ↓
┌─────────────────┐
│  ViapiService   │
│                 │
│ 1.初始化客户端  │
│ 2.调用分割API   │
│ 3.返回结果URL   │
└────────┬────────┘
         │
         │ 阿里云视觉智能 API
         │ - 识别图片主体
         │ - 自动抠图
         │ - 返回抠图后的图片URL
         ↓
┌─────────────────┐
│   返回结果      │
│                 │
│ {               │
│  "cutoutUrl":   │
│   "https://..." │
│ }               │
└─────────────────┘
```

## 四、核心代码实现

### 4.1 ViapiService.java

```java
@Service
public class ViapiService {

    private Client viapiClient;

    @PostConstruct
    public void init() {
        // 初始化视觉智能客户端
        Config config = new Config()
            .setAccessKeyId(accessKeyId)
            .setAccessKeySecret(accessKeySecret)
            .setEndpoint("viapi.cn-shanghai.aliyuncs.com");

        viapiClient = new Client(config);
    }

    /**
     * 通用图像分割（抠图）
     */
    public String segmentCommonImage(String imageUrl) {
        // 创建请求
        SegmentCommonImageRequest request = new SegmentCommonImageRequest()
            .setImageURL(imageUrl);

        // 调用 API
        SegmentCommonImageResponse response = viapiClient.segmentCommonImage(request);

        // 返回抠图后的图片 URL
        return response.getBody().getImageURL();
    }
}
```

### 4.2 CutoutTaskServiceImpl.java

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
            // 2. 调用视觉智能 API 进行抠图
            String cutoutUrl = viapiService.segmentCommonImage(imageUrl);

            // 3. 构建返回结果
            List<Map<String, Object>> items = new ArrayList<>();
            Map<String, Object> item = new HashMap<>();
            item.put("cutoutUrl", cutoutUrl);
            item.put("sourceType", "aliyun-viapi");
            items.add(item);

            task.setStatus("succeeded");
            task.setItemsData(JSON.toJSONString(items));

        } catch (Exception e) {
            task.setStatus("failed");
            task.setFailReason(e.getMessage());
        }

        // 4. 保存到数据库
        cutoutTaskMapper.insert(task);

        return buildResult(task);
    }
}
```

### 4.3 MediaServiceImpl.java

```java
@Service
public class MediaServiceImpl implements IMediaService {

    @Autowired
    private OssService ossService;

    @Override
    public Map<String, Object> uploadAndSave(Long userId, MultipartFile file, String bizType) {
        // 1. 上传到 OSS
        String fileUrl = ossService.uploadFile(file, userId);

        // 2. 保存到数据库
        Media media = new Media();
        media.setFileUrl(fileUrl);  // OSS URL
        media.setFileKey(ossService.extractObjectKey(fileUrl));
        mediaMapper.insert(media);

        // 3. 返回结果
        return Map.of(
            "imageUrl", fileUrl,
            "imageId", "img_" + media.getId()
        );
    }
}
```

## 五、API 接口说明

### 5.1 图片上传接口

**接口：** `POST /api/food-diary/media/upload`

**请求：**
```
Content-Type: multipart/form-data

file: 图片文件
bizType: food-diary（可选）
```

**响应：**
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "imageId": "img_23",
    "imageUrl": "https://bty-admin.oss-cn-shenzhen.aliyuncs.com/food-diary/2026-06-21/xxx.jpg",
    "fileKey": "food-diary/2026-06-21/xxx.jpg"
  }
}
```

### 5.2 抠图接口

**接口：** `POST /api/food-diary/cutout/tasks`

**请求：**
```json
{
  "scene": "food-diary-cutout",
  "imageId": "img_23",
  "imageUrl": "https://bty-admin.oss-cn-shenzhen.aliyuncs.com/food-diary/2026-06-21/xxx.jpg"
}
```

**响应：**
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "taskId": "cutout_task_1782024771098_02d22c9d",
    "status": "succeeded",
    "items": [
      {
        "id": "item_1",
        "displayName": "图片主体",
        "score": 0.95,
        "cutoutUrl": "https://viapi-result.oss-cn-shanghai.aliyuncs.com/xxx.png",
        "maskUrl": "https://viapi-result.oss-cn-shanghai.aliyuncs.com/xxx.png",
        "thumbnailUrl": "https://viapi-result.oss-cn-shanghai.aliyuncs.com/xxx.png",
        "sourceType": "aliyun-viapi"
      }
    ],
    "primaryItemId": "item_1"
  }
}
```

### 5.3 查询抠图任务

**接口：** `GET /api/food-diary/cutout/tasks/{taskId}`

**响应：**
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "taskId": "cutout_task_xxx",
    "status": "succeeded",
    "imageUrl": "https://bty-admin.oss-cn-shenzhen.aliyuncs.com/...",
    "items": [...]
  }
}
```

## 六、小程序端集成

### 6.1 上传图片

```javascript
// 选择并上传图片
async function uploadImage() {
  // 1. 选择图片
  const res = await uni.chooseImage({
    count: 1,
    sizeType: ['compressed']
  });

  // 2. 上传到后端
  const uploadRes = await uni.uploadFile({
    url: `${apiBase}/api/food-diary/media/upload`,
    filePath: res.tempFilePaths[0],
    name: 'file',
    header: {
      'Authorization': token
    }
  });

  const result = JSON.parse(uploadRes.data);

  // 3. 获得 OSS URL
  console.log('图片 URL:', result.data.imageUrl);
  // https://bty-admin.oss-cn-shenzhen.aliyuncs.com/food-diary/xxx.jpg

  return result.data;
}
```

### 6.2 调用抠图

```javascript
// 调用抠图功能
async function cutoutImage(imageUrl) {
  const res = await uni.request({
    url: `${apiBase}/api/food-diary/cutout/tasks`,
    method: 'POST',
    header: {
      'Authorization': token,
      'Content-Type': 'application/json'
    },
    data: {
      imageUrl: imageUrl
    }
  });

  if (res.data.code === 200) {
    const cutoutUrl = res.data.data.items[0].cutoutUrl;
    console.log('抠图结果:', cutoutUrl);
    // https://viapi-result.oss-cn-shanghai.aliyuncs.com/xxx.png

    return cutoutUrl;
  }
}
```

### 6.3 完整示例

```vue
<template>
  <view>
    <!-- 原图 -->
    <image :src="originalImage" mode="aspectFill" />

    <!-- 抠图结果 -->
    <image :src="cutoutImage" mode="aspectFill" />

    <!-- 操作按钮 -->
    <button @click="handleUpload">上传图片</button>
    <button @click="handleCutout">智能抠图</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      originalImage: '',
      cutoutImage: ''
    };
  },

  methods: {
    async handleUpload() {
      // 选择图片
      const res = await uni.chooseImage({ count: 1 });

      // 上传
      const uploadRes = await uni.uploadFile({
        url: `${apiBase}/api/food-diary/media/upload`,
        filePath: res.tempFilePaths[0],
        name: 'file',
        header: { 'Authorization': this.token }
      });

      const result = JSON.parse(uploadRes.data);
      this.originalImage = result.data.imageUrl;

      uni.showToast({ title: '上传成功', icon: 'success' });
    },

    async handleCutout() {
      if (!this.originalImage) {
        uni.showToast({ title: '请先上传图片', icon: 'none' });
        return;
      }

      uni.showLoading({ title: '抠图中...' });

      // 调用抠图
      const res = await uni.request({
        url: `${apiBase}/api/food-diary/cutout/tasks`,
        method: 'POST',
        header: {
          'Authorization': this.token,
          'Content-Type': 'application/json'
        },
        data: { imageUrl: this.originalImage }
      });

      uni.hideLoading();

      if (res.data.code === 200) {
        this.cutoutImage = res.data.data.items[0].cutoutUrl;
        uni.showToast({ title: '抠图成功', icon: 'success' });
      } else {
        uni.showToast({ title: '抠图失败', icon: 'none' });
      }
    }
  }
};
</script>
```

## 七、测试验证

### 7.1 启动服务

```bash
cd /Users/baitao/project/bty/btyadmin
mvn clean install
cd bty-admin
mvn spring-boot:run
```

### 7.2 查看启动日志

**成功标志：**
```
OSS 客户端初始化成功，endpoint: oss-cn-shenzhen.aliyuncs.com, bucket: bty-admin
阿里云视觉智能客户端初始化成功，endpoint: viapi.cn-shanghai.aliyuncs.com
```

### 7.3 测试上传

**日志应显示：**
```
开始上传图片，userId: 4, 文件名: xxx.jpg, 大小: xxx bytes
文件上传成功，objectKey: food-diary/2026-06-21/xxx.jpg
图片上传成功，OSS URL: https://bty-admin.oss-cn-shenzhen.aliyuncs.com/...
```

### 7.4 测试抠图

**日志应显示：**
```
开始智能抠图，userId: 4, imageUrl: https://bty-admin.oss-cn-shenzhen.aliyuncs.com/...
调用阿里云视觉智能 API 进行抠图
开始调用视觉智能 API 进行抠图，imageUrl: https://...
抠图成功，结果图片 URL: https://viapi-result.oss-cn-shanghai.aliyuncs.com/...
智能抠图成功
```

### 7.5 验证结果

**数据库记录：**

fd_media 表：
```sql
file_url: https://bty-admin.oss-cn-shenzhen.aliyuncs.com/food-diary/2026-06-21/xxx.jpg
file_key: food-diary/2026-06-21/xxx.jpg
```

fd_cutout_task 表：
```sql
image_url: https://bty-admin.oss-cn-shenzhen.aliyuncs.com/food-diary/2026-06-21/xxx.jpg
status: succeeded
items_data: [{"cutoutUrl":"https://viapi-result.oss-cn-shanghai.aliyuncs.com/xxx.png",...}]
```

## 八、费用说明

### 8.1 OSS 费用

**免费额度（新用户）：**
- 存储：40GB（3个月）
- 流量：10GB（3个月）
- 请求：100万次（3个月）

**超出费用：**
- 存储：0.12 元/GB/月
- 流量：0.50 元/GB

### 8.2 视觉智能费用

**通用图像分割：**
- 免费额度：500 次/月（新用户）
- 超出费用：0.01 元/次

**预估月费用：**
- 上传 500 张图片
- 抠图 500 次
- OSS：≈ 1.3 元
- 视觉智能：免费（在额度内）
- **总计：≈ 1.3 元/月**

## 九、故障排查

### 9.1 常见问题

**问题 1：视觉智能客户端初始化失败**

```
错误：初始化视觉智能客户端失败
```

**检查：**
1. AccessKey 是否正确
2. RAM 用户是否有权限：`AliyunVIAPIFullAccess`
3. 网络是否可访问 `viapi.cn-shanghai.aliyuncs.com`

**问题 2：抠图返回 null**

```
错误：视觉智能 API 未返回抠图结果
```

**检查：**
1. 图片 URL 是否公网可访问
2. 图片格式是否支持（JPG、PNG）
3. 图片大小是否超过限制（最大 10MB）

**问题 3：图片 URL 无法访问**

```
错误：OSS 图片无法在浏览器中打开
```

**检查：**
1. Bucket 权限是否为"公共读"
2. 图片是否成功上传
3. URL 是否正确

### 9.2 日志分析

**正常流程日志：**
```
OSS 客户端初始化成功
阿里云视觉智能客户端初始化成功
开始上传图片
文件上传成功
图片上传成功
开始智能抠图
调用阿里云视觉智能 API 进行抠图
抠图成功
智能抠图成功
```

**异常流程日志：**
```
初始化失败 → 检查 AccessKey
上传失败 → 检查 OSS 配置
抠图失败 → 检查视觉智能配置和权限
```

## 十、相关文档

- [OSS 配置更新说明](./2026-06-21_oss-config-update.md)
- [OSS 上传集成修复](./2026-06-21_oss-upload-fix-summary.md)
- [OSS 成本分析](./2026-06-21_aliyun-oss-cost-analysis.md)

---

## ✅ 完成清单

- [x] 添加视觉智能 SDK 依赖
- [x] 配置视觉智能 AccessKey
- [x] 实现 ViapiService 服务类
- [x] 更新抠图服务实现
- [x] 完整的数据流程
- [x] API 接口说明
- [x] 小程序集成示例
- [x] 测试验证步骤
- [x] 费用说明
- [x] 故障排查指南

---

**阿里云视觉智能抠图功能完整实现！重启服务即可测试完整流程。**

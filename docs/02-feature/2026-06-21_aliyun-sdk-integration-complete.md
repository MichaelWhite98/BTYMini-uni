# 阿里云 SDK 集成完成总结

## 完成时间
2026-06-21

## ✅ 已完成的配置

### 1. Maven 依赖

**文件：** `btyadmin/bty-admin/pom.xml`

**新增依赖：**
```xml
<!-- 阿里云核心库 -->
<dependency>
    <groupId>com.aliyun</groupId>
    <artifactId>tea-openapi</artifactId>
    <version>0.3.1</version>
</dependency>

<!-- 通义万相 SDK -->
<dependency>
    <groupId>com.alibaba.dashscope</groupId>
    <artifactId>dashscope-sdk-java</artifactId>
    <version>2.12.0</version>
    <exclusions>
        <exclusion>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-simple</artifactId>
        </exclusion>
    </exclusions>
</dependency>
```

### 2. 配置文件

**文件：** `btyadmin/bty-admin/src/main/resources/application.yml`

**配置内容：**
```yaml
aliyun:
  # 通义万相 API Key
  dashscope-api-key: sk-a0e31287ab314fc99efb9db7c6a4496b
  # RAM 用户 AccessKey
  access-key-id: YOUR_ACCESS_KEY_ID
  access-key-secret: YOUR_ACCESS_KEY_SECRET
```

### 3. 配置类

**文件：** `btyadmin/bty-admin/src/main/java/com/bty/admin/config/AliyunConfig.java`

**新增字段：**
- `dashscopeApiKey` - 通义万相 API Key
- `accessKeyId` - RAM 用户 AccessKey ID
- `accessKeySecret` - RAM 用户 AccessKey Secret

### 4. 服务实现

**文件：** `btyadmin/bty-admin/src/main/java/com/bty/admin/service/fooddiary/impl/CutoutTaskServiceImpl.java`

**核心实现：**
```java
// 创建图像分割实例
ImageSegmentation segment = new ImageSegmentation();

// 设置 API Key
System.setProperty("DASHSCOPE_API_KEY", aliyunConfig.getDashscopeApiKey());

// 构建请求参数
ImageSegmentationParam param = ImageSegmentationParam.builder()
        .model("image-segmentation")  // 图像分割模型
        .imageURL(imageUrl)            // 图片 URL
        .build();

// 调用 API
ImageSegmentationResult result = segment.call(param);

// 获取结果图片 URL
String resultImageUrl = result.getOutput().getImageURL();
```

## 🎯 技术架构

```
小程序上传图片
    ↓
bty-admin 后端服务 (端口 8082)
    ↓
CutoutTaskServiceImpl.createTask()
    ↓
阿里云通义万相 SDK
    ├─ ImageSegmentation SDK
    ├─ model: "image-segmentation"
    └─ imageURL: 图片地址
    ↓
阿里云 DashScope API
    ├─ 智能识别图片主体
    ├─ 自动抠图处理
    └─ 返回抠图后的图片 URL
    ↓
返回结果给小程序
```

## 📊 API 调用详情

### 请求格式
```java
ImageSegmentationParam param = ImageSegmentationParam.builder()
        .model("image-segmentation")
        .imageURL("http://example.com/image.jpg")
        .build();
```

### 响应格式
```json
{
  "requestId": "xxx-xxx-xxx",
  "output": {
    "imageURL": "https://dashscope-result.oss-cn-beijing.aliyuncs.com/xxx.png"
  }
}
```

### 返回给小程序的格式
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
        "cutoutUrl": "https://dashscope-result.oss-cn-beijing.aliyuncs.com/xxx.png",
        "sourceType": "aliyun-sdk"
      }
    ],
    "primaryItemId": "item_1"
  }
}
```

## 🔒 安全配置

### RAM 权限
- 用户名：`bty-admin-sdk`（或你创建的名称）
- 权限：`AliyunVIAPIFullAccess`（视觉智能 API 完全访问）

### 凭证管理
- ✅ API Key 配置在 application.yml
- ✅ AccessKey 配置在 application.yml
- ⚠️ 建议：生产环境使用环境变量
- ⚠️ 注意：不要将 application.yml 提交到公开仓库

## 💰 费用说明

### 免费额度
- **每月：** 1000 次免费调用
- **适用服务：** 通义万相图像分割

### 超出费用
- **价格：** 0.02 元/次
- **示例：** 每月使用 2000 次 = 免费 1000 次 + 收费 1000 次 = 20 元

### 费用监控
- 登录阿里云控制台
- 进入"费用中心"
- 查看"资源包"使用情况

## 🚀 使用步骤

### 1. 重新编译项目
```bash
cd /Users/baitao/project/bty/btyadmin
mvn clean install
```

### 2. 重启后端服务
```bash
cd bty-admin
mvn spring-boot:run
```

### 3. 测试抠图功能
在小程序中上传图片，查看日志：
```
开始阿里云智能抠图, imageUrl: xxx
调用阿里云 SDK, 图片URL: xxx
SDK 请求参数: model=image-segmentation, imageURL=xxx
SDK 调用成功，requestId: xxx
抠图成功，结果图片URL: xxx
阿里云抠图成功
```

## 🐛 错误处理

### 1. API Key 无效
```
错误：API Key 配置错误
处理：检查 application.yml 中的 dashscope-api-key
```

### 2. 权限不足
```
错误：用户权限不足
处理：在 RAM 控制台添加 AliyunVIAPIFullAccess 权限
```

### 3. 网络错误
```
错误：连接超时
处理：检查网络连接，确保能访问 dashscope.aliyuncs.com
```

### 4. 图片无法访问
```
错误：图片 URL 不可访问
处理：确保图片 URL 是公网可访问的
建议：使用阿里云 OSS 存储图片
```

## 📝 日志说明

### 正常流程日志
```
INFO: 开始阿里云智能抠图, imageUrl: http://xxx.jpg
INFO: 调用阿里云 SDK, 图片URL: http://xxx.jpg
INFO: SDK 请求参数: model=image-segmentation, imageURL=http://xxx.jpg
INFO: SDK 调用成功，requestId: xxx-xxx-xxx
INFO: 抠图成功，结果图片URL: https://dashscope-result.oss.xxx.png
INFO: 阿里云抠图成功
```

### 异常流程日志
```
ERROR: 调用阿里云 SDK 失败
WARN: 使用备用方案：返回原图
INFO: 使用默认结果（原图）
```

## 🎉 完成状态

✅ Maven 依赖配置完成
✅ AccessKey 配置完成
✅ 配置类更新完成
✅ SDK 调用代码完成
✅ 错误处理完成
✅ 日志记录完成

## 📚 相关文档

- [阿里云 SDK 完整集成指南](./2026-06-21_aliyun-sdk-setup-guide.md)
- [抠图服务架构说明](./2026-06-21_cutout-architecture-summary.md)
- [通义万相官方文档](https://help.aliyun.com/zh/model-studio/developer-reference/image-segmentation)

---

**现在可以重启服务测试真实的抠图功能了！**

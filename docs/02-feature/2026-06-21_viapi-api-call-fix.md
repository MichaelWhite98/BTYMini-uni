# VIAPI 抠图 API 调用问题修复

## 问题描述

调用 DashScope API 时返回错误：

```json
{
  "code": "InvalidParameter",
  "message": "Model not exist.",
  "request_id": "27807440-96c3-9ccd-98ac-cdeb8189fc02"
}
```

## 问题原因

DashScope API 不支持 `model: "imagesegmentation"` 参数。DashScope 和 VIAPI 是两个不同的服务：

- **DashScope**: 通义千问等大模型服务
- **VIAPI**: 视觉智能开放平台（图像分割、OCR 等）

## 解决方案

### 方案 1: 使用阿里云 OpenAPI SDK 通用调用（已实现）

使用 `tea-openapi` SDK 的通用 API 调用方式：

```java
// 创建 API 请求参数
Params params = new Params()
        .setAction("SegmentCommonImage")  // API 名称
        .setVersion("2023-01-17")         // API 版本
        .setMethod("POST")
        .setPathname("/")
        .setProtocol("HTTPS");

// 设置请求体
Map<String, Object> body = new HashMap<>();
body.put("Url", imageUrl);

OpenApiRequest request = new OpenApiRequest()
        .setBody(JSON.toJSONString(body));

// 调用 API
Map<String, Object> response = viapiClient.callApi(params, request);
```

**优点**:
- ✅ 使用官方 SDK，自动处理签名
- ✅ 支持所有阿里云 API
- ✅ 代码简洁

### 方案 2: 使用 VIAPI SDK（如果可用）

如果 VIAPI SDK 包含具体的 API 类，可以直接使用：

```java
SegmentCommonImageRequest request = new SegmentCommonImageRequest()
        .setUrl(imageUrl);

SegmentCommonImageResponse response = viapiClient.segmentCommonImage(request);
String resultUrl = response.getBody().getData().getImageURL();
```

**问题**: VIAPI SDK 不包含这些类，所以不能使用。

## 当前实现状态

✅ 已更新 ViapiService.java，使用 OpenAPI SDK 通用调用方式

## 测试步骤

### 1. 在 IDEA 中重新编译

```
Build → Rebuild Project
```

### 2. 重启服务

```
Run 'BTYAdminApplication'
```

### 3. 查看启动日志

应该看到：

```
✅ 阿里云视觉智能客户端初始化成功，endpoint: viapi.cn-shanghai.aliyuncs.com
```

### 4. 测试抠图功能

在小程序中：
1. 上传图片
2. 点击抠图按钮
3. 查看后端日志

**预期日志**:

```
开始调用视觉智能 API 进行抠图，imageUrl: https://bty-admin.oss-cn-shenzhen.aliyuncs.com/...
VIAPI 响应: {"Data":{"ImageURL":"https://viapi-result.oss-cn-shanghai.aliyuncs.com/..."}}
抠图成功，结果图片 URL: https://viapi-result.oss-cn-shanghai.aliyuncs.com/...
```

## 可能的问题

### 问题 1: API 不存在

**错误**: `InvalidAction`

**原因**: API 名称或版本不正确

**解决**: 查看阿里云官方文档确认 API 名称

### 问题 2: 参数错误

**错误**: `InvalidParameter`

**原因**: 请求参数不正确

**解决**: 检查参数名称和格式

### 问题 3: 权限不足

**错误**: `Unauthorized`

**原因**: RAM 用户没有 VIAPI 权限

**解决**: 添加 `AliyunVIAPIFullAccess` 权限

## 备选方案

如果 OpenAPI 方式也不行，可以考虑：

### 方案 A: 使用阿里云 POP API

POP API 是阿里云的统一开放平台，支持所有服务：

```java
String endpoint = "viapi.cn-shanghai.aliyuncs.com";
String action = "SegmentCommonImage";
String version = "2023-01-17";
```

### 方案 B: 使用 HTTP 直接调用

直接构造 HTTP 请求，手动添加签名：

```java
// 构造请求
String url = "https://viapi.cn-shanghai.aliyuncs.com/?Action=SegmentCommonImage&Version=2023-01-17&Url=" + imageUrl;

// 添加签名
String signature = calculateSignature(accessKeyId, accessKeySecret, ...);

// 发送请求
```

### 方案 C: 使用其他抠图服务

如果阿里云 VIAPI 一直有问题，可以考虑：

1. **百度 AI 图像分割**
2. **腾讯云图像处理**
3. **七牛云智能抠图**

## 相关文档

- [阿里云视觉智能开放平台文档](https://help.aliyun.com/product/145135.html)
- [SegmentCommonImage API 文档](https://help.aliyun.com/document_detail/462256.html)
- [OpenAPI SDK 使用指南](https://help.aliyun.com/document_detail/446858.html)

---

**下一步**: 在 IDEA 中重新编译并测试，查看 VIAPI 响应结果。

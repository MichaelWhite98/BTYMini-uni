# 阿里云图像分割 SDK 快速实施指南

## 📋 实施清单

### ✅ 已完成
- [x] 添加 imageseg20191230 SDK 依赖 (v3.0.1)
- [x] 更新 ViapiService.java 使用官方 SDK
- [x] 编写完整技术文档

### ⏳ 待执行
- [ ] 在 IDEA 中编译项目
- [ ] 重启服务
- [ ] 测试抠图功能

---

## 🚀 快速开始

### 步骤 1: 编译项目

在 IntelliJ IDEA 中：

```
Build → Rebuild Project
```

### 步骤 2: 重启服务

```
Run 'BTYAdminApplication'
```

### 步骤 3: 查看启动日志

确认看到：

```
✅ 阿里云图像分割客户端初始化成功，endpoint: viapi.cn-shanghai.aliyuncs.com
```

### 步骤 4: 测试抠图

1. 在小程序中上传图片
2. 点击"智能抠图"按钮
3. 查看后端日志

**预期日志**:

```
开始调用图像分割 API 进行抠图，imageUrl: https://bty-admin.oss-cn-shenzhen.aliyuncs.com/...
抠图成功，结果图片 URL: https://viapi-result.oss-cn-shanghai.aliyuncs.com/...
```

---

## 📦 SDK 信息

| 项目 | 信息 |
|------|------|
| SDK 名称 | imageseg20191230 |
| 版本 | 3.0.1 |
| Maven 坐标 | com.aliyun:imageseg20191230:3.0.1 |
| API | SegmentCommonImage |
| 文档 | https://help.aliyun.com/zh/viapi/developer-reference/api-k8cs8t |

---

## 💻 核心代码

### ViapiService.java

```java
// 初始化客户端
Config config = new Config()
    .setAccessKeyId(accessKeyId)
    .setAccessKeySecret(accessKeySecret)
    .setEndpoint("viapi.cn-shanghai.aliyuncs.com");

imagesegClient = new Client(config);

// 调用抠图 API
SegmentCommonImageRequest request = new SegmentCommonImageRequest()
    .setImageURL(imageUrl);

SegmentCommonImageResponse response = imagesegClient.segmentCommonImage(request);

String resultUrl = response.getBody().getData().getImageURL();
```

---

## 🔧 配置说明

### application.yml

```yaml
aliyun:
  viapi:
    endpoint: viapi.cn-shanghai.aliyuncs.com
    access-key-id: YOUR_ACCESS_KEY_ID
    access-key-secret: YOUR_ACCESS_KEY_SECRET
```

---

## ⚠️ 注意事项

1. **图片要求**
   - 格式: JPG、PNG、BMP
   - 大小: ≤ 10MB
   - 分辨率: ≤ 4096×4096
   - URL: 公网可访问

2. **权限要求**
   - RAM 用户需要 `AliyunVIAPIFullAccess` 权限

3. **费用说明**
   - 免费额度: 500 次/月（新用户）
   - 超出费用: 0.01 元/次

---

## 📊 预期结果

### 成功响应示例

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "taskId": "cutout_task_xxx",
    "status": "succeeded",
    "items": [
      {
        "cutoutUrl": "https://viapi-result.oss-cn-shanghai.aliyuncs.com/result.png",
        "sourceType": "aliyun-imageseg-sdk"
      }
    ]
  }
}
```

### 抠图效果

- ✅ 自动识别主体
- ✅ 背景透明
- ✅ 边缘平滑
- ✅ 格式为 PNG

---

## 🐛 问题排查

### 问题 1: 初始化失败

**日志**: `初始化图像分割客户端失败`

**排查**:
1. 检查 AccessKey 是否正确
2. 检查网络连接
3. 检查 endpoint 配置

### 问题 2: 调用失败

**日志**: `调用图像分割 API 失败`

**排查**:
1. 检查图片 URL 是否可访问
2. 检查图片格式和大小
3. 查看 SDK 详细错误信息

### 问题 3: 返回 null

**日志**: `API 返回数据为空`

**排查**:
1. 检查图片内容是否符合要求
2. 查看完整 API 响应
3. 检查 RAM 用户权限

---

## 📝 相关文档

- [完整技术文档](./2026-06-21_imageseg-sdk-integration-technical-document.md)
- [API 官方文档](https://help.aliyun.com/zh/viapi/developer-reference/api-k8cs8t)
- [SDK Maven 仓库](https://mvnrepository.com/artifact/com.aliyun/imageseg20191230)

---

**准备就绪，开始测试！** 🎉

# 阿里云抠图 API 最终集成方案

## 完成时间
2026-06-21

## ✅ 最终方案：HTTP API 直接调用

### 为什么不用 SDK？

**遇到的问题：**
1. Maven 仓库找不到 `dashscope-sdk-java` 依赖
2. 内网 Nexus 镜像无法访问
3. SDK 依赖复杂，版本兼容性问题

**解决方案：**
- ✅ 移除 SDK 依赖
- ✅ 直接使用 HTTP API 调用
- ✅ 使用已有的 RestTemplate
- ✅ 无需额外依赖

## 📋 最终配置

### 1. Maven 配置

**~/.m2/settings.xml** 和 **Maven 全局 settings.xml**
- ✅ 已修复：注释掉内网 Nexus 镜像
- ✅ 已修复：使用阿里云镜像
- ✅ 已修复：XML 格式错误

### 2. 应用配置

**application.yml**
```yaml
aliyun:
  dashscope-api-key: sk-a0e31287ab314fc99efb9db7c6a4496b
  access-key-id: YOUR_ACCESS_KEY_ID
  access-key-secret: YOUR_ACCESS_KEY_SECRET
```

### 3. 实现代码

**CutoutTaskServiceImpl.java**

使用 HTTP API 直接调用：
```java
// API 地址
private static final String DASHSCOPE_API_URL =
    "https://dashscope.aliyuncs.com/api/v1/services/aigc/imagesegmentation/generation";

// 请求参数
{
  "model": "imagesegmentation",
  "input": {
    "image": "http://example.com/image.jpg"
  }
}

// 请求头
Authorization: Bearer sk-a0e31287ab314fc99efb9db7c6a4496b
```

## 🚀 启动步骤

### 1. 编译项目
```bash
cd /Users/baitao/project/bty/btyadmin
mvn clean install
```

### 2. 启动服务
```bash
cd bty-admin
mvn spring-boot:run
```

### 3. 测试上传
在小程序中上传图片，查看日志。

## 📊 API 调用流程

```
小程序上传图片
    ↓
后端接收图片 (http://192.168.31.185:8082)
    ↓
调用阿里云 HTTP API
    ├─ URL: https://dashscope.aliyuncs.com/api/v1/services/aigc/imagesegmentation/generation
    ├─ Method: POST
    ├─ Headers: Authorization: Bearer {API_KEY}
    └─ Body: {"model":"imagesegmentation","input":{"image":"图片URL"}}
    ↓
阿里云处理抠图
    ↓
返回抠图后的图片URL
    ↓
返回给小程序
```

## 🔍 日志示例

### 成功日志
```
开始阿里云智能抠图, imageUrl: http://xxx.jpg
调用阿里云 HTTP API, 图片URL: http://xxx.jpg
请求URL: https://dashscope.aliyuncs.com/api/v1/services/aigc/imagesegmentation/generation
请求参数: {"model":"imagesegmentation","input":{"image":"http://xxx.jpg"}}
响应状态: 200 OK
抠图成功，结果URL: https://dashscope-result.oss.aliyuncs.com/xxx.png
阿里云抠图成功
```

### 失败日志
```
调用阿里云 HTTP API 失败: [错误信息]
使用默认结果（原图）
```

## ⚠️ 重要提示

### 图片 URL 问题

**当前问题：**
- 小程序上传的图片 URL 是：`http://192.168.31.185:8082/uploads/...`
- 这是局域网地址，阿里云无法访问

**解决方案：**

**方案 1：使用公网 IP 或域名**
- 配置服务器公网 IP
- 或使用阿里云 OSS 存储图片

**方案 2：使用内网穿透**
- 使用 ngrok、frp 等工具
- 将局域网映射到公网

**方案 3：临时测试**
- 使用公网可访问的测试图片
- 例如：`https://help-oss.aliyuncs.com/dashscope/images/dog_and_cat.png`

## 🧪 测试建议

### 使用测试图片

修改小程序临时使用公网图片测试：

```javascript
// 临时测试
const testImageUrl = 'https://help-oss.aliyuncs.com/dashscope/images/dog_and_cat.png';

// 调用抠图 API
const result = await createCutoutTask(testImageUrl);
```

### 验证 API 是否正常

```bash
curl -X POST https://dashscope.aliyuncs.com/api/v1/services/aigc/imagesegmentation/generation \
  -H "Authorization: Bearer sk-a0e31287ab314fc99efb9db7c6a4496b" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "imagesegmentation",
    "input": {
      "image": "https://help-oss.aliyuncs.com/dashscope/images/dog_and_cat.png"
    }
  }'
```

## 📝 后续优化建议

### 1. 图片存储优化
- 使用阿里云 OSS 存储图片
- 图片 URL 自动转换为公网可访问地址

### 2. 错误处理优化
- 添加重试机制
- 区分不同错误类型
- 提供更友好的错误提示

### 3. 性能优化
- 添加缓存机制
- 异步处理抠图任务
- 添加进度反馈

## 🎉 完成状态

✅ Maven 配置修复
✅ HTTP API 实现完成
✅ 配置文件完成
✅ 错误处理完成
✅ 日志记录完成
⬜ 需要解决图片 URL 公网访问问题

## 📚 相关文档

- [Maven 配置修复说明](./2026-06-21_maven-settings-fix.md)
- [阿里云 HTTP API 文档](https://help.aliyun.com/zh/model-studio/developer-reference/image-segmentation)

---

**现在可以启动服务测试了！建议先用公网图片测试 API 是否正常工作。**

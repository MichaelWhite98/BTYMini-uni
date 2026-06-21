# 阿里云抠图 API 集成方案

## 问题说明

当前尝试调用阿里云 DashScope 的多模态分割 API 失败，错误信息：
```
"code":"InvalidParameter","message":"Model not exist."
```

## 原因分析

1. **模型名称错误**：DashScope 的多模态分割 API 的模型名称不是 `image-segmentation` 或 `multi-modal-segmentation-v1`
2. **API 需要签名**：阿里云的视觉智能 API 需要复杂的签名验证，直接 HTTP 调用比较困难

## 解决方案

### 方案一：使用阿里云 SDK（推荐）

#### 1. 添加 Maven 依赖

在 `bty-admin/pom.xml` 中添加：

```xml
<!-- 阿里云核心库 -->
<dependency>
    <groupId>com.aliyun</groupId>
    <artifactId>aliyun-java-sdk-core</artifactId>
    <version>4.6.0</version>
</dependency>

<!-- 阿里云视觉智能开放平台 SDK -->
<dependency>
    <groupId>com.aliyun</groupId>
    <artifactId>viapi20230117</artifactId>
    <version>1.0.0</version>
</dependency>

<!-- 或者使用通义万相 SDK -->
<dependency>
    <groupId>com.aliyun</groupId>
    <artifactId>dashscope-sdk-java</artifactId>
    <version>2.12.0</version>
</dependency>
```

#### 2. 配置 AccessKey

在 `application.yml` 中添加：

```yaml
aliyun:
  access-key-id: 你的AccessKeyID
  access-key-secret: 你的AccessKeySecret
  dashscope-api-key: sk-a0e31287ab314fc99efb9db7c6a4496b
```

#### 3. 使用 SDK 调用示例

**方案A：使用通义万相 SDK**

```java
import com.alibaba.dashscope.aigc.multimodalsegmentation.MultiModalSegmentation;
import com.alibaba.dashscope.aigc.multimodalsegmentation.MultiModalSegmentationParam;
import com.alibaba.dashscope.aigc.multimodalsegmentation.MultiModalSegmentationResult;
import com.alibaba.dashscope.exception.NoApiKeyException;

public List<Map<String, Object>> callAliyunWithSDK(String imageUrl) {
    try {
        MultiModalSegmentation segment = new MultiModalSegmentation();

        MultiModalSegmentationParam param = MultiModalSegmentationParam.builder()
                .model("multi-modal-segmentation-v1") // 正确的模型名称
                .imageURL(imageUrl)
                .build();

        MultiModalSegmentationResult result = segment.call(param);

        // 解析结果
        String resultImageUrl = result.getOutput().getImageURL();

        // 构建返回数据
        List<Map<String, Object>> items = new ArrayList<>();
        Map<String, Object> item = new HashMap<>();
        item.put("id", "item_1");
        item.put("cutoutUrl", resultImageUrl);
        items.add(item);

        return items;

    } catch (Exception e) {
        log.error("调用阿里云 SDK 失败", e);
        throw new OperateException("抠图失败: " + e.getMessage());
    }
}
```

**方案B：使用视觉智能开放平台 SDK**

```java
import com.aliyun.viapi20230117.Client;
import com.aliyun.viapi20230117.models.SegmentCommonImageRequest;
import com.aliyun.viapi20230117.models.SegmentCommonImageResponse;

public List<Map<String, Object>> callViApiWithSDK(String imageUrl) {
    try {
        // 创建客户端
        Config config = new Config()
                .setAccessKeyId(aliyunConfig.getAccessKeyId())
                .setAccessKeySecret(aliyunConfig.getAccessKeySecret())
                .setRegionId("cn-shanghai");

        Client client = new Client(config);

        // 创建请求
        SegmentCommonImageRequest request = new SegmentCommonImageRequest()
                .setImageURL(imageUrl);

        // 调用 API
        SegmentCommonImageResponse response = client.segmentCommonImage(request);

        // 获取结果
        String resultUrl = response.getBody().getData().getImageURL();

        // 构建返回数据
        List<Map<String, Object>> items = new ArrayList<>();
        Map<String, Object> item = new HashMap<>();
        item.put("id", "item_1");
        item.put("cutoutUrl", resultUrl);
        items.add(item);

        return items;

    } catch (Exception e) {
        log.error("调用阿里云视觉智能 API 失败", e);
        throw new OperateException("抠图失败: " + e.getMessage());
    }
}
```

### 方案二：使用第三方抠图服务（备选）

如果阿里云 SDK 集成困难，可以考虑：

1. **Remove.bg API** - 专业抠图服务
2. **百度 AI 图像主体检测**
3. **腾讯云图像分析**

### 方案三：临时方案（当前使用）

当前代码使用模拟数据，前端可以正常工作，但抠图效果是假的。

## 推荐实施步骤

### 第一步：获取 AccessKey

1. 登录阿里云控制台
2. 进入 AccessKey 管理页面
3. 创建 AccessKey（建议使用 RAM 子账号）
4. 记录 AccessKey ID 和 Secret

### 第二步：添加 SDK 依赖

在 `pom.xml` 中添加对应的依赖。

### 第三步：更新配置

在 `application.yml` 中添加完整的阿里云配置。

### 第四步：修改代码实现

将当前的模拟实现替换为 SDK 调用。

## 阿里云视觉智能服务对比

| 服务 | 特点 | 费用 | 推荐度 |
|------|------|------|--------|
| 通义万相多模态分割 | 最新 AI 技术，支持自然语言描述 | 免费额度 + 按量付费 | ⭐⭐⭐⭐⭐ |
| 视觉智能-通用分割 | 成熟稳定，专为抠图设计 | 免费额度 + 按量付费 | ⭐⭐⭐⭐ |
| 视觉智能-人体分割 | 专注人体抠图 | 免费额度 + 按量付费 | ⭐⭐⭐ |

## 参考文档

- [通义万相多模态分割 API 文档](https://help.aliyun.com/zh/model-studio/developer-reference/image-segmentation)
- [视觉智能开放平台文档](https://help.aliyun.com/document_detail/145864.html)
- [阿里云 Java SDK 使用指南](https://help.aliyun.com/document_detail/52740.html)
- [DashScope SDK for Java](https://github.com/aliyun/alibabacloud-dashscope-sdk)

## 当前状态

✅ 代码框架已完成
✅ 返回格式正确
⬜ 需要集成正确的 SDK
⬜ 需要配置 AccessKey

## 下一步

建议按照方案一，使用通义万相 SDK 进行集成，这样可以：
1. 避免复杂的签名计算
2. 获得官方技术支持
3. 代码更简洁易维护

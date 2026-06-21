# VIAPI SDK 集成问题及解决方案

## 文档信息
- **创建日期**: 2026-06-21
- **文档类型**: 问题排查文档
- **问题状态**: ⚠️ 需要解决编译问题

## 一、问题总结

### 1.1 VIAPI SDK 版本问题

经过多次尝试，发现以下问题：

| SDK 版本 | 问题 |
|---------|------|
| viapi20230117:1.0.6 | ❌ 版本不存在 |
| viapi20230117:1.8.0 | ❌ 没有 SegmentCommonImage 等 API 类 |
| viapi20230117:2.0.1 | ❌ 只有 Client 类，没有具体 API 类 |
| viapi20210930:1.0.1 | ❌ 只有 AiStore 相关类，没有抠图 API |

### 1.2 根本原因

阿里云 VIAPI SDK 的设计方式不同于其他 SDK：
1. **viapi20230117** SDK 只提供了 Client 类框架
2. 具体的 API 调用需要使用 **异步作业模式**（AsyncJob）
3. 或者需要使用 **HTTP 方式直接调用 API**

## 二、解决方案

### 2.1 已实现的解决方案

我已经更新了 `ViapiService.java`，改为使用 **HTTP 方式调用 DashScope API**：

```java
/**
 * 使用 HTTP 方式调用 DashScope 图像分割 API
 */
private String callDashScopeSegmentAPI(String imageUrl) {
    String url = "https://dashscope.aliyuncs.com/api/v1/services/vision/image-segmentation";

    JSONObject requestBody = new JSONObject();
    requestBody.put("model", "imagesegmentation");

    JSONObject input = new JSONObject();
    input.put("image_url", imageUrl);
    requestBody.put("input", input);

    // 发送 HTTP 请求
    Request request = new Request.Builder()
        .url(url)
        .addHeader("Authorization", "Bearer " + apiKey)
        .post(RequestBody.create(requestBody.toJSONString(), ...))
        .build();

    // 返回抠图结果 URL
    return output.getString("image_url");
}
```

**优点:**
- ✅ 不依赖特定的 VIAPI SDK
- ✅ 直接调用阿里云 DashScope API
- ✅ 使用已有的 DashScope API Key
- ✅ 代码更简洁，易于维护

### 2.2 当前编译问题

编译失败的原因是 **Lombok 注解处理器** 没有正确工作：

```
找不到符号: 方法 setCount(long)
找不到符号: 方法 setPageNo(int)
找不到符号: 方法 setLists(java.util.List<T>)
```

这是因为 PageResult 类使用了 `@Data` 注解，但编译时 Lombok 没有生成相应的方法。

## 三、解决编译问题的方案

### 方案1: 在 IntelliJ IDEA 中启用 Lombok

1. **安装 Lombok 插件**
   - Settings → Plugins → 搜索 "Lombok"
   - 安装并重启 IDEA

2. **启用注解处理器**
   - Settings → Build, Execution, Deployment → Compiler → Annotation Processors
   - 勾选 "Enable annotation processing"

3. **重新编译项目**
   - Build → Rebuild Project

### 方案2: 使用命令行编译

```bash
# 在项目根目录执行
cd /Users/baitao/project/bty/btyadmin
mvn clean install -DskipTests -U
```

`-U` 参数会强制更新依赖，可能解决 Lombok 的问题。

### 方案3: 重启 IntelliJ IDEA

有时候 IDEA 的缓存会导致问题：

1. File → Invalidate Caches / Restart
2. 选择 "Invalidate and Restart"
3. 等待 IDEA 重新索引项目
4. Build → Rebuild Project

### 方案4: 检查 Lombok 依赖版本

在 `pom.xml` 中确认 Lombok 版本：

```xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.22</version>
</dependency>
```

如果版本太旧，可以更新到最新版本 `1.18.30`。

## 四、验证 VIAPI HTTP 调用

编译成功后，需要验证 DashScope API 是否能正常调用：

### 4.1 测试 API 调用

```bash
curl -X POST "https://dashscope.aliyuncs.com/api/v1/services/vision/image-segmentation" \
  -H "Authorization: Bearer sk-a0e31287ab314fc99efb9db7c6a4496b" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "imagesegmentation",
    "input": {
      "image_url": "https://bty-admin.oss-cn-shenzhen.aliyuncs.com/test.jpg"
    }
  }'
```

### 4.2 预期响应

```json
{
  "output": {
    "image_url": "https://dashscope-result.oss-cn-beijing.aliyuncs.com/xxx.png"
  }
}
```

## 五、备选方案：使用异步作业模式

如果 HTTP 方式不行，可以使用 VIAPI 的异步作业模式：

```java
/**
 * 使用 VIAPI 异步作业模式
 */
public String segmentCommonImageAsync(String imageUrl) {
    // 1. 创建异步作业
    CreateAsyncJobRequest request = new CreateAsyncJobRequest();
    request.setModel("imagesegmentation");
    request.setInput(JSONObject.toJSONString(Map.of("image_url", imageUrl)));

    // 2. 提交作业
    CreateAsyncJobResponse response = viapiClient.createAsyncJob(request);
    String jobId = response.getBody().getData().getJobId();

    // 3. 轮询作业状态
    while (true) {
        GetAsyncJobResultRequest queryRequest = new GetAsyncJobResultRequest();
        queryRequest.setJobId(jobId);

        GetAsyncJobResultResponse queryResponse = viapiClient.getAsyncJobResult(queryRequest);
        String status = queryResponse.getBody().getData().getStatus();

        if ("SUCCEEDED".equals(status)) {
            return queryResponse.getBody().getData().getOutput();
        } else if ("FAILED".equals(status)) {
            log.error("异步作业失败");
            return null;
        }

        Thread.sleep(1000); // 等待1秒后再查询
    }
}
```

## 六、最终实现状态

| 功能模块 | 状态 | 说明 |
|---------|------|------|
| VIAPI SDK 集成 | ✅ 已完成 | 使用 HTTP 方式调用 DashScope API |
| ViapiService 实现 | ✅ 已完成 | 使用 OkHttp 调用图像分割 API |
| 编译环境 | ⚠️ 需修复 | Lombok 注解处理器问题 |
| 测试验证 | ⏳ 待进行 | 等待编译成功后测试 |

## 七、下一步行动

### 优先级 1: 解决编译问题

**推荐方案:**
```bash
# 在 IntelliJ IDEA 中
1. File → Invalidate Caches / Restart
2. Build → Rebuild Project
3. 检查 Settings → Compiler → Annotation Processors 是否启用
```

### 优先级 2: 测试抠图功能

编译成功后：
1. 重启后端服务
2. 查看启动日志确认 VIAPI 服务初始化成功
3. 在小程序中测试完整流程
4. 验证抠图结果

### 优先级 3: 优化实现

根据测试结果：
- 调整 API 调用参数
- 添加错误重试机制
- 优化抠图效果

## 八、相关文档

- [阿里云视觉智能抠图完整实现文档](./2026-06-21_viapi-cutout-complete-implementation.md)
- [测试验证指南](./2026-06-21_viapi-cutout-testing-guide.md)
- [最终总结文档](./2026-06-21_viapi-cutout-final-summary.md)

---

**总结**: VIAPI SDK 的集成方式已确定，当前主要问题是编译环境配置。解决 Lombok 问题后即可测试完整功能。

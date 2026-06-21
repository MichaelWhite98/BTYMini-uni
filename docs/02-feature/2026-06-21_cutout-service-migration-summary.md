# 抠图服务迁移到阿里云总结

## 完成时间
2026-06-21

## 问题描述
小程序上传图片时，后端调用的是 Python 抠图服务（`http://127.0.0.1:8090/api/cutout/tasks`），但该服务未启动，导致以下错误：
```
调用 Python 抠图服务失败，使用模拟数据: I/O error on POST request for "http://127.0.0.1:8090/api/cutout/tasks": Connection refused
```

## 解决方案
将抠图服务从 Python 服务迁移到阿里云通义万相 API。

## 修改的文件

### 1. bty-admin 模块

**已修改：**
- `CutoutTaskServiceImpl.java` - 将 Python 服务调用改为阿里云 API 调用
  - 移除 Python 服务配置（`${python.cutout.base-url}`）
  - 注入 `AliyunConfig` 和 `RestTemplate`
  - 调用阿里云 DashScope API 进行智能抠图
  - 支持异步任务轮询
  - 完整的错误处理和日志记录

**已创建（之前）：**
- `AliyunConfig.java` - 阿里云配置类
- `RestTemplateConfig.java` - HTTP 客户端配置
- `AiCutoutController.java` - 新的 AI 抠图 API 接口
- `IAiCutoutService.java` - AI 抠图服务接口
- `AiCutoutServiceImpl.java` - AI 抠图服务实现
- `SmartCutoutDTO.java` - 智能抠图请求参数
- `DetectSubjectsDTO.java` - 检测主体请求参数
- `SmartCutoutVO.java` - 智能抠图返回结果
- `SubjectsVO.java` - 检测主体返回结果

**配置文件：**
- `application.yml` 已配置：
  ```yaml
  aliyun:
    dashscope-api-key: sk-a0e31287ab314fc99efb9db7c6a4496b
  ```

### 2. bty-front 模块

**已修改：**
- `CutoutTaskServiceImpl.java` - 同样改为阿里云 API 调用

**已创建：**
- `AliyunConfig.java` - 阿里云配置类
- `RestTemplateConfig.java` - HTTP 客户端配置

**配置文件：**
- `application.yml` 已添加：
  ```yaml
  aliyun:
    dashscope-api-key: sk-a0e31287ab314fc99efb9db7c6a4496b
  ```

## 技术实现

### API 调用流程

1. **小程序上传图片** → 调用 `/api/food-diary/cutout/tasks`
2. **后端接收请求** → `CutoutController.createTask()`
3. **调用阿里云服务** → `CutoutTaskServiceImpl.createTask()`
4. **构建请求参数**：
   ```json
   {
     "model": "image-segmentation",
     "input": {
       "image": "图片URL",
       "prompt": "图片中的主要物体"
     },
     "parameters": {
       "return_form": "image"
     }
   }
   ```
5. **发送到阿里云** → `https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-segmentation/generation`
6. **处理响应**：
   - 如果是同步响应，直接获取结果图片 URL
   - 如果是异步任务，轮询获取结果（最多 30 次，每次等待 2 秒）
7. **返回抠图结果** → 包含抠图后的图片 URL

### 返回数据格式

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
        "bbox": [0, 0, 100, 100],
        "areaRatio": 0.5,
        "maskUrl": "https://dashscope-result.oss-cn-beijing.aliyuncs.com/xxx.png",
        "cutoutUrl": "https://dashscope-result.oss-cn-beijing.aliyuncs.com/xxx.png",
        "thumbnailUrl": "https://dashscope-result.oss-cn-beijing.aliyuncs.com/xxx.png",
        "sourceType": "auto-detected"
      }
    ],
    "primaryItemId": "item_1"
  }
}
```

## 主要改进

### 1. 不再依赖 Python 服务
- ✅ 移除了对本地 Python 服务的依赖
- ✅ 使用阿里云企业级服务，更稳定可靠
- ✅ 免费额度：1000 次/月

### 2. 更智能的抠图
- ✅ 支持自然语言描述抠图主体
- ✅ 自动检测图片中的主要物体
- ✅ 更准确的抠图效果

### 3. 更好的错误处理
- ✅ 完整的异常捕获和日志记录
- ✅ 使用 `OperateException` 抛出业务异常
- ✅ 异步任务超时处理（60 秒）

### 4. 兼容性保证
- ✅ API 接口路径不变：`/api/food-diary/cutout/tasks`
- ✅ 返回数据格式不变
- ✅ 前端代码无需修改

## 测试验证

### 1. 启动后端服务
```bash
cd /Users/baitao/project/bty/btyadmin
mvn clean install
mvn spring-boot:run
```

### 2. 小程序测试
- 上传饮品记录图片
- 查看控制台日志，应该看到：
  ```
  开始阿里云智能抠图, imageUrl: xxx
  阿里云抠图成功, 检测到 1 个主体
  ```
- 不应再看到 "调用 Python 抠图服务失败" 的错误

### 3. 验证抠图效果
- 检查返回的 `cutoutUrl` 是否为阿里云 OSS 地址
- 下载图片验证抠图效果

## 注意事项

1. **API Key 安全**：
   - API Key 已配置在 `application.yml` 中
   - 生产环境建议使用环境变量管理

2. **调用次数限制**：
   - 阿里云免费额度：1000 次/月
   - 超出后需要付费或等待下月重置

3. **网络要求**：
   - 后端服务器需要能访问阿里云 API（`dashscope.aliyuncs.com`）
   - 确保防火墙允许 HTTPS (443) 出站连接

4. **图片要求**：
   - 图片必须可以通过公网访问
   - 支持的格式：JPG、PNG、BMP 等
   - 图片大小不超过 10MB

## 相关文档

- [AI 智能抠图设计方案](./2026-06-21_ai-smart-cutout-design.md)
- [AI 智能抠图实现计划](./2026-06-21_ai-smart-cutout-implementation-plan.md)
- [AI 智能抠图后端完成总结](./2026-06-21_ai-smart-cutout-backend-complete.md)
- [阿里云 API Key 配置指南](../config/aliyun-dashscope-api-key-config.md)

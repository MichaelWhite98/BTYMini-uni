# 抠图服务架构调整总结

## 完成时间
2026-06-21

## 架构说明

### 模块划分
- **bty-admin** (端口 8082) - **主服务，小程序直接调用此模块**
- **bty-front** (端口 8083) - 辅助模块，调用 bty-admin 的服务

### 小程序调用流程
```
小程序 (8082端口)
    ↓
bty-admin 模块
    ↓
阿里云通义万相 API
```

## 最终实现

### 1. bty-admin 模块（主服务）

**功能：直接调用阿里云 API 进行智能抠图**

#### 核心文件

**配置类：**
- `AliyunConfig.java` - 阿里云 API Key 配置
- `RestTemplateConfig.java` - HTTP 客户端配置

**Controller 层：**
- `CutoutController.java` - 抠图任务接口（小程序调用）
  - `POST /api/food-diary/cutout/tasks` - 创建抠图任务
  - `GET /api/food-diary/cutout/tasks/{taskId}` - 查询任务状态

- `AiCutoutController.java` - 新增 AI 智能抠图接口（可选）
  - `POST /api/food-diary/ai/smart-cutout` - 智能抠图
  - `POST /api/food-diary/ai/detect-subjects` - 检测图片主体

**Service 层：**
- `ICutoutTaskService.java` - 抠图任务服务接口
- `CutoutTaskServiceImpl.java` - **已改为调用阿里云 API**
  - 移除了 Python 服务调用
  - 注入 AliyunConfig 和 RestTemplate
  - 调用阿里云 DashScope API
  - 支持异步任务轮询

- `IAiCutoutService.java` - AI 抠图服务接口（新增）
- `AiCutoutServiceImpl.java` - AI 抠图服务实现（新增）

**DTO/VO 类：**
- `SmartCutoutDTO.java` - 智能抠图请求参数
- `DetectSubjectsDTO.java` - 检测主体请求参数
- `SmartCutoutVO.java` - 智能抠图返回结果
- `SubjectsVO.java` - 检测主体返回结果

**配置文件：**
```yaml
# application.yml
aliyun:
  dashscope-api-key: sk-a0e31287ab314fc99efb9db7c6a4496b
```

#### API 调用流程

1. 小程序上传图片 → `POST /api/food-diary/cutout/tasks`
2. `CutoutController` 接收请求
3. `CutoutTaskServiceImpl.createTask()` 处理
4. 调用阿里云 DashScope API:
   ```
   POST https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-segmentation/generation
   ```
5. 返回抠图结果给小程序

### 2. bty-front 模块（辅助服务）

**功能：调用 bty-admin 的抠图服务**

#### 核心文件

**Service 层：**
- `CutoutTaskServiceImpl.java` - **已改为调用 bty-admin 接口**
  - 调用 `http://127.0.0.1:8082/api/food-diary/cutout/tasks`
  - 不直接调用阿里云 API
  - 作为代理转发请求

**配置文件：**
```yaml
# application.yml（已移除阿里云配置）
# 通过 HTTP 调用 bty-admin 服务
```

## 主要修改点

### ✅ 已完成的修改

#### bty-admin 模块

1. **CutoutTaskServiceImpl.java**
   - ❌ 移除：Python 服务调用
   - ✅ 新增：阿里云 API 调用
   - ✅ 注入：AliyunConfig, RestTemplate
   - ✅ 实现：异步任务轮询机制

2. **application.yml**
   - ❌ 删除：`python.cutout.base-url` 配置
   - ✅ 保留：`aliyun.dashscope-api-key` 配置

3. **新增 AI 接口（可选使用）**
   - `AiCutoutController.java`
   - `IAiCutoutService.java` + `AiCutoutServiceImpl.java`
   - 提供更灵活的自然语言抠图功能

#### bty-front 模块

1. **CutoutTaskServiceImpl.java**
   - ❌ 移除：直接调用阿里云 API
   - ✅ 改为：调用 bty-admin 的抠图接口
   - ✅ 简化：仅作为代理转发

2. **application.yml**
   - ❌ 删除：阿里云 API Key 配置
   - ✅ 使用：通过 HTTP 调用 bty-admin

## 架构优势

### 1. 统一入口
- 小程序只调用 8082 端口（bty-admin）
- 所有业务逻辑集中在 bty-admin
- bty-front 作为辅助服务

### 2. 职责清晰
- **bty-admin**: 核心业务逻辑 + 外部 API 调用
- **bty-front**: 辅助服务 + 代理转发

### 3. 配置集中
- 阿里云 API Key 只配置在 bty-admin
- 避免多处配置导致的不一致

### 4. 易于维护
- 阿里云相关代码都在 bty-admin
- 修改时只需关注一个模块

## API 接口列表

### 小程序调用的接口（bty-admin, 端口 8082）

#### 1. 创建抠图任务
```
POST /api/food-diary/cutout/tasks

Request:
{
  "scene": "food-diary-cutout",
  "imageId": "xxx",
  "imageUrl": "https://..."
}

Response:
{
  "code": 200,
  "msg": "success",
  "data": {
    "taskId": "cutout_task_xxx",
    "status": "succeeded",
    "items": [...],
    "primaryItemId": "item_1"
  }
}
```

#### 2. 查询任务状态
```
GET /api/food-diary/cutout/tasks/{taskId}

Response:
{
  "code": 200,
  "msg": "success",
  "data": {
    "taskId": "cutout_task_xxx",
    "status": "succeeded",
    "items": [...],
    "primaryItemId": "item_1"
  }
}
```

#### 3. 智能抠图（新增，可选）
```
POST /api/food-diary/ai/smart-cutout

Request:
{
  "imageUrl": "https://...",
  "description": "盘子里的牛排",
  "returnMask": false
}

Response:
{
  "code": 200,
  "msg": "success",
  "data": {
    "resultUrl": "https://...",
    "isMask": false,
    "duration": 2345
  }
}
```

## 测试验证

### 1. 启动 bty-admin 服务
```bash
cd /Users/baitao/project/bty/btyadmin/bty-admin
mvn clean install
mvn spring-boot:run
```

### 2. 检查日志
启动时应该看到：
```
开始阿里云智能抠图, imageUrl: xxx
阿里云抠图成功, 检测到 1 个主体
```

**不应再看到：**
```
调用 Python 抠图服务失败
```

### 3. 小程序测试
- 上传饮品记录图片
- 查看控制台日志
- 验证抠图效果

## 阿里云服务信息

### API Key
```
sk-a0e31287ab314fc99efb9db7c6a4496b
```

### 免费额度
- **每月**: 1000 次免费调用
- **超出后**: 0.02 元/次

### API 文档
- [通义万相图像分割](https://help.aliyun.com/zh/model-studio/developer-reference/image-segmentation)

## 相关文档

- [AI 智能抠图设计方案](./2026-06-21_ai-smart-cutout-design.md)
- [AI 智能抠图后端完成总结](./2026-06-21_ai-smart-cutout-backend-complete.md)
- [阿里云 API Key 配置指南](../config/aliyun-dashscope-api-key-config.md)

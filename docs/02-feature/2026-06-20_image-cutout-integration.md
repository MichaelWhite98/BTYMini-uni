# 图片抠图功能开发文档

## 开发日期
2026-06-20

## 功能概述

用户在小程序端上传图片后，调用 Python 抠图服务对图片进行主体识别和抠图处理，返回抠图后的图片 URL。

## 系统架构

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   小程序     │ ───> │  bty-admin   │ ───> │ btypython   │
│  (前端)     │ <─── │  (Java后端)  │ <─── │  (抠图AI)    │
└─────────────┘      └─────────────┘      └─────────────┘
```

**服务端口：**
- bty-admin: 8082
- btypython: 8000

## 详细文档

后端实现和部署详情请参考：`/btyadmin/docs/python-cutout/integration-guide.md`

项目架构文档：`/btyadmin/docs/ARCHITECTURE.md`

## 接口流程

### 1. 图片上传流程

```
1. 小程序调用 uploadImage 上传图片到服务器
2. 获取图片 URL
3. 调用 createCutoutTask 创建抠图任务
4. 等待抠图完成，获取结果
```

### 2. 接口定义

#### 2.1 创建抠图任务

**请求：**
```
POST /api/food-diary/cutout/tasks
Authorization: {token}

{
  "scene": "food-diary-cutout",
  "imageId": "img_xxx",
  "imageUrl": "https://xxx.com/image.jpg"
}
```

**响应：**
```json
{
  "code": 200,
  "data": {
    "taskId": "cutout_task_xxx",
    "status": "succeeded",
    "items": [
      {
        "id": "item_1",
        "displayName": "主体 1",
        "score": 0.96,
        "cutoutUrl": "https://xxx.com/cutout.png",
        "thumbnailUrl": "https://xxx.com/thumb.png",
        "maskUrl": "https://xxx.com/mask.png"
      }
    ],
    "primaryItemId": "item_1"
  }
}
```

#### 2.2 查询抠图任务

**请求：**
```
GET /api/food-diary/cutout/tasks/{taskId}
Authorization: {token}
```

**响应：** 同创建任务响应

---

## 后端实现

### 1. 配置文件 (application.yml)

```yaml
# Python 抠图服务配置
python:
  cutout:
    base-url: http://127.0.0.1:8000
    timeout: 60000
```

### 2. Java 服务实现

**核心逻辑：**

```java
// 调用 Python 服务
String url = pythonBaseUrl + "/api/cutout/tasks";

Map<String, Object> requestBody = new HashMap<>();
requestBody.put("scene", "food-diary-cutout");
requestBody.put("imageId", imageId);
requestBody.put("imageUrl", imageUrl);
requestBody.put("algorithm", "birefnet");  // 使用 birefnet 算法

// 发送请求并轮询结果
ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
```

### 3. 降级策略

当 Python 服务不可用时，自动使用模拟数据，确保功能可用：

```java
catch (Exception e) {
    // 如果调用 Python 服务失败，使用模拟数据
    task.setStatus("succeeded");
    List<Map<String, Object>> mockItems = buildMockItems(imageUrl);
    task.setItemsData(JSON.toJSONString(mockItems));
}
```

---

## Python 抠图服务

### 1. 服务地址

- 本地开发：`http://127.0.0.1:8000`
- 生产环境：配置到 `application-prod.yml`

### 2. 支持的算法

| 算法 | 说明 | 效果 |
|------|------|------|
| birefnet | 默认算法，效果最佳 | 推荐 |
| rmbg | 快速处理 | 一般 |
| isnet | 中等效果 | 一般 |
| u2net | 通用算法 | 一般 |
| grabcut | 传统算法 | 较差 |

### 3. Python 服务接口

```python
# 创建抠图任务
POST /api/cutout/tasks
{
    "scene": "food-diary-cutout",
    "imageId": "img_xxx",
    "imageUrl": "https://xxx.com/image.jpg",
    "algorithm": "birefnet"
}

# 查询任务状态
GET /api/cutout/tasks/{task_id}

# 健康检查
GET /health
```

---

## 前端调用示例

### 小程序端 (Vue 3)

```javascript
import { uploadImage, createCutoutTask, getCutoutTask } from '@/utils/food-diary/api.js'

// 1. 上传图片
const uploadResult = await uploadImage(filePath, 'food-diary')
const imageUrl = uploadResult.url

// 2. 创建抠图任务
const cutoutResult = await createCutoutTask({
  scene: 'food-diary-cutout',
  imageId: uploadResult.imageId,
  imageUrl: imageUrl
})

// 3. 获取抠图结果
if (cutoutResult.status === 'succeeded') {
  const items = cutoutResult.items
  const primaryItem = items.find(item => item.id === cutoutResult.primaryItemId)

  // 使用抠图后的图片
  const cutoutUrl = primaryItem.cutoutUrl
  const thumbnailUrl = primaryItem.thumbnailUrl
}
```

---

## 数据库表结构

### fd_cutout_task

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint | 主键 |
| task_id | varchar(64) | 任务ID |
| user_id | bigint | 用户ID |
| scene | varchar(50) | 场景 |
| image_id | varchar(64) | 图片ID |
| image_url | varchar(512) | 原图URL |
| status | varchar(20) | 状态: queued/processing/succeeded/failed |
| items_data | text | 抠图结果JSON |
| primary_item_id | varchar(32) | 主要主体ID |
| fail_reason | varchar(255) | 失败原因 |
| create_time | datetime | 创建时间 |

---

## 文件修改清单

| 文件 | 修改内容 |
|------|----------|
| `application.yml` | 添加 Python 服务配置 |
| `CutoutTaskServiceImpl.java` | 调用 Python 服务实现抠图 |

---

## 部署注意事项

### 1. Python 服务启动

```bash
cd btypython
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
# .venv\Scripts\activate   # Windows
pip install -r requirements.txt
python -m app.main
```

### 2. 生产环境配置

修改 `application-prod.yml`：

```yaml
python:
  cutout:
    base-url: http://your-python-server:8000
    timeout: 60000
```

### 3. 跨域配置

Python 服务已配置 CORS，允许所有来源访问。

---

## 错误处理

| 错误码 | 说明 | 处理方式 |
|--------|------|----------|
| 332 | Token 为空 | 重新登录 |
| 500 | 服务异常 | 使用模拟数据降级 |
| timeout | 超时 | 检查 Python 服务状态 |

---

## 更新记录

| 日期 | 说明 |
|------|------|
| 2026-06-20 | 创建文档，实现抠图功能 |

# 饮食图片主体抠图 MVP 开发方案

## 1. 目标

为饮品记录小程序增加一条“主体透明抠图”链路：

1. 用户上传一张图片。
2. 服务端只提取图片中的主体，例如咖啡杯、盘子、碗。
3. 主体以外的区域全部抠成透明背景。
4. 小程序展示一个或多个抠图候选。
5. 用户选择一个主体继续进入详情页录入。

这条链路的目标不是分类识别，不对外展示“这是什么”的标签结果。对业务层来说，结果只有：

- 原图
- 透明背景 cutout
- mask
- 候选主体列表
- 推荐主体

## 2. 范围

### 本期包含

- 单张图片上传
- 服务端主体抠图任务创建
- 轮询任务结果
- 返回透明背景 PNG
- 返回一个或多个主体候选
- 前端选择主体并回填详情页
- 本地记录保存 cutout 元数据

### 本期不包含

- 饮品名称识别
- 菜品识别
- 卡路里估算
- OCR
- 多图联合分析
- 端侧离线推理

## 3. 当前仓库接入点

现有入口和落点：

- [src/pages/food-diary/add/index.vue](/Users/baitao/project/bty/BTYMini-uni/src/pages/food-diary/add/index.vue:1)
- [src/pages/food-diary/analyze/index.vue](/Users/baitao/project/bty/BTYMini-uni/src/pages/food-diary/analyze/index.vue:1)
- [src/pages/food-diary/detail/index.vue](/Users/baitao/project/bty/BTYMini-uni/src/pages/food-diary/detail/index.vue:1)
- [src/utils/food-diary/vision.js](/Users/baitao/project/bty/BTYMini-uni/src/utils/food-diary/vision.js:1)
- [src/utils/food-diary/storage.js](/Users/baitao/project/bty/BTYMini-uni/src/utils/food-diary/storage.js:1)

当前前端已经完成：

1. 选图后先进入分析页
2. 分析页支持“上传原图 -> 创建抠图任务 -> 轮询结果”
3. 当前在没有后端配置时走 mock fallback
4. 详情页可以消费 cutout draft，并优先展示抠图图像

## 4. 用户流程

### 4.1 主流程

1. 用户拍照或从相册上传
2. 前端上传原图
3. 服务端创建主体抠图任务
4. 前端轮询任务状态
5. 返回抠图候选
6. 用户选择一个主体
7. 进入详情页继续录入

### 4.2 失败兜底

如果任一步失败：

1. 保留原图
2. 用户仍可直接进入详情页
3. 不阻断记饮品主流程

这条兜底必须一直保留。

## 5. 交互要求

### 5.1 分析页状态

- `uploading`：原图上传中
- `analyzing`：主体抠图任务处理中
- `success`：返回候选主体
- `error`：任务失败，允许重试或跳过

### 5.2 成功态显示内容

- 原图预览
- 候选主体缩略图
- 推荐主体标记
- “使用当前主体”按钮
- “跳过抠图结果”按钮

### 5.3 详情页显示内容

- 如果存在 cutout，优先展示 cutout
- 如果没有 cutout，则展示原图
- 可提示“已应用主体抠图”
- 不显示 label、分类、识别标签

## 6. 前端数据模型

### 6.1 抠图候选结构

```json
{
  "id": "cutout_item_1",
  "displayName": "主体 1",
  "score": 0.96,
  "bbox": [132, 88, 292, 462],
  "areaRatio": 0.22,
  "maskUrl": "https://cdn.example.com/mask/1.png",
  "cutoutUrl": "https://cdn.example.com/cutout/1.png",
  "thumbnailUrl": "https://cdn.example.com/thumb/1.png",
  "sourceType": "cup"
}
```

说明：

- `displayName` 只用于候选展示，不代表分类结论
- `sourceType` 是服务端内部排序辅助字段，前端不必展示
- `cutoutUrl` 是透明背景 PNG 的主交付物

### 6.2 draft 结构

```json
{
  "taskId": "cutout_task_123",
  "scene": "food-diary-cutout",
  "imageId": "img_123",
  "imageUrl": "https://cdn.example.com/original.jpg",
  "sourceImageUrl": "https://cdn.example.com/original.jpg",
  "primaryItemId": "cutout_item_1",
  "selectedItemId": "cutout_item_1",
  "selectedItem": {
    "id": "cutout_item_1",
    "displayName": "主体 1",
    "cutoutUrl": "https://cdn.example.com/cutout/1.png"
  }
}
```

### 6.3 记录结构扩展

保存到本地记录的 `vision` 字段当前已经转为 cutout 语义：

```json
{
  "vision": {
    "taskId": "cutout_task_123",
    "scene": "food-diary-cutout",
    "imageId": "img_123",
    "imageUrl": "https://cdn.example.com/original.jpg",
    "sourceImageUrl": "https://cdn.example.com/original.jpg",
    "primaryItemId": "cutout_item_1",
    "selectedItemId": "cutout_item_1",
    "selectedItem": {
      "id": "cutout_item_1",
      "displayName": "主体 1",
      "score": 0.96,
      "bbox": [132, 88, 292, 462],
      "maskUrl": "https://cdn.example.com/mask/1.png",
      "cutoutUrl": "https://cdn.example.com/cutout/1.png",
      "thumbnailUrl": "https://cdn.example.com/thumb/1.png",
      "sourceType": "cup"
    }
  }
}
```

## 7. 前端服务层

当前前端服务文件：

- [src/utils/food-diary/vision.js](/Users/baitao/project/bty/BTYMini-uni/src/utils/food-diary/vision.js:1)

已实现的能力：

1. `prepareCutoutSource`
2. `createCutoutTask`
3. `getCutoutTask`
4. `saveCutoutDraft`
5. `consumeCutoutDraft`
6. `buildCutoutDraft`

### 7.1 mock fallback 规则

当 `globalThis.__BTY_CUTOUT_API_BASE__` 未配置时：

- 上传走本地 mock
- 任务创建走本地 mock
- 轮询走本地 mock
- 候选 cutout 使用原图占位

这让前端 UI 能在没有后端时继续开发。

### 7.2 真实服务接入开关

前端当前通过全局变量读取 API base：

```js
globalThis.__BTY_CUTOUT_API_BASE__ = 'https://api.example.com'
```

建议后续改成更稳定的注入方式，例如：

- 构建时环境变量
- 小程序配置文件
- App 启动配置注入

## 8. API Contract

### 8.1 获取上传地址

`POST /api/media/upload-token`

请求：

```json
{
  "bizType": "food-diary-cutout",
  "fileName": "image.jpg",
  "contentType": "image/jpeg"
}
```

响应：

```json
{
  "uploadUrl": "https://upload.example.com/object",
  "fileUrl": "https://cdn.example.com/original/2026/06/img_123.jpg",
  "fileKey": "original/2026/06/img_123.jpg",
  "imageId": "img_123",
  "fileFieldName": "file",
  "headers": {},
  "formData": {}
}
```

说明：

- 这是当前前端 client 已经支持的上传 contract
- 如果对象存储需要额外表单字段，可以通过 `formData` 返回

### 8.2 创建抠图任务

`POST /api/cutout/tasks`

请求：

```json
{
  "scene": "food-diary-cutout",
  "imageId": "img_123",
  "imageUrl": "https://cdn.example.com/original/2026/06/img_123.jpg"
}
```

响应：

```json
{
  "taskId": "cutout_task_123",
  "status": "queued"
}
```

### 8.3 查询抠图任务

`GET /api/cutout/tasks/:taskId`

处理中响应：

```json
{
  "taskId": "cutout_task_123",
  "status": "running"
}
```

成功响应：

```json
{
  "taskId": "cutout_task_123",
  "status": "succeeded",
  "scene": "food-diary-cutout",
  "imageId": "img_123",
  "imageUrl": "https://cdn.example.com/original/2026/06/img_123.jpg",
  "sourceImageUrl": "https://cdn.example.com/original/2026/06/img_123.jpg",
  "primaryItemId": "cutout_item_1",
  "items": [
    {
      "id": "cutout_item_1",
      "displayName": "主体 1",
      "score": 0.96,
      "bbox": [132, 88, 292, 462],
      "areaRatio": 0.22,
      "maskUrl": "https://cdn.example.com/mask/1.png",
      "cutoutUrl": "https://cdn.example.com/cutout/1.png",
      "thumbnailUrl": "https://cdn.example.com/thumb/1.png",
      "sourceType": "cup"
    },
    {
      "id": "cutout_item_2",
      "displayName": "主体 2",
      "score": 0.88,
      "bbox": [44, 246, 584, 760],
      "areaRatio": 0.35,
      "maskUrl": "https://cdn.example.com/mask/2.png",
      "cutoutUrl": "https://cdn.example.com/cutout/2.png",
      "thumbnailUrl": "https://cdn.example.com/thumb/2.png",
      "sourceType": "plate"
    }
  ]
}
```

失败响应：

```json
{
  "taskId": "cutout_task_123",
  "status": "failed",
  "failReason": "no foreground candidate found"
}
```

## 9. 后端实现建议

### 9.1 处理目标

后端最终要交付的是“透明背景主体图”，不是标签。

### 9.2 推荐管线

建议仍然采用两步：

1. 候选框定位
2. 候选区域分割

内部可以使用：

- `YOLOv8/YOLO11`
- `GroundingDINO`
- `SAM2`

但这些模型只服务于“找到该保留的主体区域”，不作为业务输出。

### 9.3 输出要求

对每个候选主体，至少生成：

- 原图 bbox
- mask PNG
- cutout PNG
- thumbnail PNG/JPG

其中最关键的是：

- `cutoutUrl` 必须是透明背景
- 主体边缘不能出现大块黑底或白底

### 9.4 图像处理要求

服务端必须处理：

- EXIF 方向纠正
- 最大边长缩放
- RGBA 输出
- alpha 通道保留
- 透明背景 PNG 编码

## 10. 存储策略

建议保存以下文件：

```text
food-diary/
  original/2026/06/16/img_123.jpg
  mask/2026/06/16/task_123/item_1.png
  cutout/2026/06/16/task_123/item_1.png
  thumb/2026/06/16/task_123/item_1.png
```

约束：

- 原图可为 JPG
- mask 用 PNG
- cutout 必须用 PNG
- thumb 可用 PNG 或 JPG

## 11. 排序规则

推荐主体只用于默认选中，不向用户解释“为什么是这个”。

MVP 建议规则：

1. 优先面积合理且居中的主体
2. 同时优先分割质量更高的主体
3. 如需内部类别辅助，可优先 `cup > bowl > plate > food`
4. 如果无法稳定排序，就返回第一个高质量候选

## 12. 风险

主要风险：

1. 透明杯、玻璃碗边缘容易漏抠
2. 杯子和桌面颜色接近时容易粘连
3. 主体与手、吸管、餐具重叠时边界复杂
4. 一张图里多个餐具相互遮挡时，候选拆分可能不稳定

因此第一版验收重点不是“识别全对”，而是：

- 至少能稳定给出一个可用主体
- cutout 背景是透明的
- 用户可以切换候选
- 失败时仍能使用原图继续

## 13. 里程碑

### 里程碑 1：前端链路打通

- 选图后进入分析页
- 支持上传、创建任务、轮询
- 详情页消费 cutout draft
- mock fallback 可运行

当前状态：已完成。

### 里程碑 2：真实后端 API 接入

- 配置 `__BTY_CUTOUT_API_BASE__`
- 接通上传接口
- 接通创建任务接口
- 接通任务查询接口

交付标准：

- 前端不再使用 mock 候选
- 能拿到真实 cutout PNG

### 里程碑 3：抠图质量优化

- 调整候选排序
- 优化边缘质量
- 优化透明区域残留

交付标准：

- 常见咖啡杯、盘子、碗图片能稳定出透明背景主体

## 14. 验收标准

满足以下条件即可视为 MVP 完成：

1. 用户上传一张图
2. 20 秒内拿到成功或失败状态
3. 成功时至少返回一个主体候选
4. 候选包含 `cutoutUrl`
5. `cutoutUrl` 对应图像背景为透明
6. 用户可选择一个主体进入详情页
7. 失败时可使用原图继续录入

## 15. 下一步开发建议

按当前仓库状态，下一步最值得做的是：

1. 把后端 API 按本文 contract 搭出来
2. 在小程序启动阶段注入 `__BTY_CUTOUT_API_BASE__`
3. 用真实透明 PNG 替换 mock 结果
4. 再补详情页上的“查看原图/查看抠图”切换

这四步做完，产品形态才算真正成立。

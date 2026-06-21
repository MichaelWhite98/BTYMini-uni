# AI 智能抠图功能快速集成指南

## ✅ 小程序端已完成

### 已创建的文件

1. **AI 工具类** (`src/utils/ai-cutout.js`)
   - ✅ `smartCutout()` - 智能抠图
   - ✅ `detectSubjects()` - 主体识别
   - ✅ `quickCutout()` - 快速抠图

2. **详情页集成** (`src/pages/detail/index.vue`)
   - ✅ 点击主体识别卡片触发
   - ✅ 5 种抠图选项
   - ✅ 自动识别主体
   - ✅ 自定义描述抠图
   - ✅ 结果展示和保存

---

## 🔧 后端集成步骤

### 步骤 1: 获取阿里云 API Key

1. 访问 [阿里云 DashScope 控制台](https://dashscope.console.aliyun.com/)
2. 开通"通义万相"服务
3. 创建 API Key 并复制

### 步骤 2: 配置后端项目

#### 2.1 添加配置

在 `application.yml` 中添加：

```yaml
aliyun:
  dashscope-api-key: sk-xxxxxxxxxxxxxxxx  # 替换为你的 API Key
```

#### 2.2 创建必要的类

参考模板文件：
```
docs/backend-templates/AiCutoutBackendTemplate.java
```

需要创建的文件：
- `AiCutoutController.java` - 控制器
- `AiCutoutService.java` - 服务接口
- `AiCutoutServiceImpl.java` - 服务实现
- `SmartCutoutDTO.java` - 请求参数
- `DetectSubjectsDTO.java` - 识别参数
- `SmartCutoutVO.java` - 抠图结果
- `SubjectsVO.java` - 主体列表
- `AliyunConfig.java` - 配置类

### 步骤 3: 测试接口

#### 使用 curl 测试

```bash
# 测试抠图接口
curl -X POST http://localhost:8082/api/food-diary/ai/smart-cutout \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "https://example.com/coffee.jpg",
    "description": "咖啡杯"
  }'

# 测试主体识别接口
curl -X POST http://localhost:8082/api/food-diary/ai/detect-subjects \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "https://example.com/coffee.jpg"
  }'
```

#### 预期响应

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "cutoutUrl": "https://oss.example.com/cutout/result.png"
  }
}
```

---

## 🧪 测试流程

### 小程序端测试

1. **重新编译小程序**
   ```bash
   npm run dev:mp-weixin
   ```

2. **在微信开发者工具中测试**
   - 打开详情页
   - 上传一张图片
   - 点击"主体识别"卡片
   - 选择抠图选项
   - 查看抠图结果

### 功能测试清单

- [ ] 上传图片成功
- [ ] 点击主体识别卡片显示选项
- [ ] 选择"智能识别主体"能识别
- [ ] 选择"抠出咖啡杯"能抠图
- [ ] 选择"抠出食物"能抠图
- [ ] 选择"抠出盘子"能抠图
- [ ] 选择"抠出所有主体"能处理
- [ ] 抠图结果正确显示
- [ ] 保存记录时包含抠图结果

---

## 📊 接口说明

### 1. 智能抠图接口

**URL**: `POST /api/food-diary/ai/smart-cutout`

**请求参数**:
```json
{
  "imageUrl": "https://example.com/image.jpg",
  "description": "咖啡杯",
  "returnMask": false
}
```

**响应结果**:
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "cutoutUrl": "https://oss.example.com/cutout/result.png",
    "maskUrl": null
  }
}
```

### 2. 主体识别接口

**URL**: `POST /api/food-diary/ai/detect-subjects`

**请求参数**:
```json
{
  "imageUrl": "https://example.com/image.jpg"
}
```

**响应结果**:
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "subjects": [
      {
        "label": "咖啡杯",
        "confidence": 0.95,
        "bbox": [100, 100, 300, 400]
      },
      {
        "label": "盘子",
        "confidence": 0.88,
        "bbox": [50, 200, 350, 450]
      }
    ]
  }
}
```

---

## 🚨 常见问题

### 问题 1: API 调用失败

**原因**: API Key 无效或网络问题

**解决**:
- 检查 API Key 是否正确
- 确认网络能访问阿里云 API
- 查看后端日志

### 问题 2: 图片上传失败

**原因**: 图片 URL 不是公网地址

**解决**:
- 确保图片已上传到 OSS
- 使用公网可访问的 URL

### 问题 3: 超时

**原因**: 图片过大或网络慢

**解决**:
- 压缩图片（建议 < 2MB）
- 增加超时时间（已设置 30 秒）

---

## 💡 优化建议

### 性能优化

1. **结果缓存**: 相同图片不重复调用 API
2. **图片压缩**: 上传前压缩到 2MB 以内
3. **异步处理**: 批量任务使用队列

### 成本控制

1. **监控调用量**: 设置费用告警
2. **结果缓存**: 减少重复调用
3. **免费额度**: 每月 1000 次免费

---

## 📞 需要帮助？

参考完整文档：
- 技术设计: `docs/02-feature/2026-06-21_ai-smart-cutout-design.md`
- 实施计划: `docs/02-feature/2026-06-21_ai-smart-cutout-implementation-plan.md`
- 后端模板: `docs/backend-templates/AiCutoutBackendTemplate.java`

---

**更新时间**: 2026-06-21
**小程序端状态**: ✅ 已完成
**后端状态**: ⬜ 等待实现

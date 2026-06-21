# AI 智能抠图功能实施计划

## 📋 任务分解

基于设计文档 `2026-06-21_ai-smart-cutout-design.md`，本计划详细说明实施步骤。

---

## 🎯 实施目标

完成以下功能：

1. ⬜ 后端 API 接口开发
2. ⬜ 阿里云通义万相集成
3. ⬜ 小程序端 API 封装
4. ⬜ 页面功能集成
5. ⬜ 测试与优化

---

## 📝 任务清单

### 阶段一：后端服务开发（预计 2 天）

#### 任务 1: 创建基础类结构

**优先级**: P0（最高）
**预计时间**: 1 小时

**文件清单**:
```
src/main/java/com/bty/admin/
├── controller/fooddiary/
│   └── AiCutoutController.java
├── service/fooddiary/
│   ├── AiCutoutService.java
│   └── impl/AiCutoutServiceImpl.java
├── dto/fooddiary/
│   ├── SmartCutoutDTO.java
│   └── DetectSubjectsDTO.java
└── vo/fooddiary/
    ├── SmartCutoutVO.java
    └── SubjectsVO.java
```

**依赖**: 无

---

#### 任务 2: 配置阿里云 SDK

**优先级**: P0（最高）
**预计时间**: 0.5 小时

**步骤**:
1. 添加 Maven 依赖
2. 配置 application.yml
3. 创建配置类

**Maven 依赖**:
```xml
<!-- 阿里云 SDK -->
<dependency>
    <groupId>com.aliyun</groupId>
    <artifactId>dashscope-sdk-java</artifactId>
    <version>2.12.0</version>
</dependency>

<!-- RestTemplate（如已存在可跳过）-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

**配置文件**:
```yaml
aliyun:
  dashscope-api-key: ${ALIYUN_DASHSCOPE_API_KEY:sk-xxxx}
```

**依赖**: 任务 1

---

#### 任务 3: 实现 Controller 层

**优先级**: P0（最高）
**预计时间**: 0.5 小时

**功能**:
- 智能抠图接口
- 批量主体识别接口

**依赖**: 任务 1

---

#### 任务 4: 实现 Service 层

**优先级**: P0（最高）
**预计时间**: 3 小时

**功能**:
- 调用阿里云 API
- 参数构建
- 结果解析
- 错误处理
- 结果缓存（可选）

**依赖**: 任务 2, 任务 3

---

#### 任务 5: 集成 OSS 存储

**优先级**: P1（高）
**预计时间**: 1 小时

**功能**:
- 抠图结果上传到 OSS
- 返回公网可访问的 URL

**依赖**: 任务 4

---

### 阶段二：小程序端开发（预计 1 天）

#### 任务 6: 创建 AI 抠图工具类

**优先级**: P0（最高）
**预计时间**: 0.5 小时

**文件**: `src/utils/ai-cutout.js`

**功能**:
- smartCutout() - 智能抠图
- detectSubjects() - 主体识别

**依赖**: 无

---

#### 任务 7: 集成到详情页

**优先级**: P1（高）
**预计时间**: 2 小时

**功能**:
- 替换现有抠图逻辑
- 添加智能抠图选项
- 显示抠图结果

**依赖**: 任务 6

---

#### 任务 8: UI 优化

**优先级**: P2（中）
**预计时间**: 1 小时

**功能**:
- 优化抠图选项菜单
- 添加加载动画
- 错误提示优化

**依赖**: 任务 7

---

### 阶段三：测试与优化（预计 0.5 天）

#### 任务 9: 功能测试

**优先级**: P1（高）
**预计时间**: 2 小时

**测试清单**:
- [ ] 正常抠图流程
- [ ] 不同主体描述测试
- [ ] 多主体识别测试
- [ ] 错误情况测试
- [ ] 性能测试

**依赖**: 阶段一、阶段二

---

#### 任务 10: 优化与文档

**优先级**: P2（中）
**预计时间**: 1 小时

**内容**:
- 性能优化
- 日志完善
- 文档更新

**依赖**: 任务 9

---

## 🔄 实施流程

```
┌─────────────────────────────────┐
│  阶段一：后端服务开发            │
├─────────────────────────────────┤
│  任务 1: 创建基础类结构          │  1h
│  任务 2: 配置阿里云 SDK         │  0.5h
│  任务 3: 实现 Controller 层      │  0.5h
│  任务 4: 实现 Service 层         │  3h
│  任务 5: 集成 OSS 存储          │  1h
└─────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  阶段二：小程序端开发            │
├─────────────────────────────────┤
│  任务 6: 创建工具类              │  0.5h
│  任务 7: 集成到详情页            │  2h
│  任务 8: UI 优化                │  1h
└─────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  阶段三：测试与优化              │
├─────────────────────────────────┤
│  任务 9: 功能测试                │  2h
│  任务 10: 优化与文档             │  1h
└─────────────────────────────────┘

总计：约 12 小时（1.5 个工作日）
```

---

## 📁 文件结构

### 新建文件

```
后端：
src/main/java/com/bty/admin/
├── controller/fooddiary/
│   └── AiCutoutController.java         # 控制器（新建）
├── service/fooddiary/
│   ├── AiCutoutService.java            # 服务接口（新建）
│   └── impl/AiCutoutServiceImpl.java   # 服务实现（新建）
├── dto/fooddiary/
│   ├── SmartCutoutDTO.java             # 请求参数（新建）
│   └── DetectSubjectsDTO.java          # 识别参数（新建）
└── vo/fooddiary/
    ├── SmartCutoutVO.java              # 响应结果（新建）
    └── SubjectsVO.java                 # 主体列表（新建）

小程序：
src/utils/
└── ai-cutout.js                         # AI 工具类（新建）
```

### 修改文件

```
后端：
src/main/resources/
└── application.yml                      # 添加阿里云配置

小程序：
src/pages/detail/index.vue               # 集成智能抠图
```

---

## 🔧 快速开始

### 第一步：申请阿里云 API

1. 访问 [阿里云 DashScope 控制台](https://dashscope.console.aliyun.com/)
2. 开通"通义万相"服务
3. 获取 API Key

### 第二步：配置后端

```yaml
# application.yml
aliyun:
  dashscope-api-key: sk-xxxxxxxxxxxxxxxx
```

### 第三步：实现后端代码

参考设计文档中的完整代码实现。

### 第四步：测试接口

```bash
# 测试抠图接口
curl -X POST http://localhost:8082/api/food-diary/ai/smart-cutout \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "https://example.com/coffee.jpg",
    "description": "咖啡杯"
  }'
```

---

## 🧪 测试验证

### 功能测试清单

#### 基础功能
- [ ] 上传图片并抠图
- [ ] 指定主体描述抠图
- [ ] 自动识别主体
- [ ] 多主体识别
- [ ] 返回蒙版

#### 异常情况
- [ ] 图片 URL 无效
- [ ] API 调用失败
- [ ] 超时处理
- [ ] 并发限制

#### 性能测试
- [ ] 单次抠图响应时间 < 5s
- [ ] 并发 10 QPS 正常响应
- [ ] 内存占用合理

---

## 📊 验收标准

### 功能验收

- [ ] 支持上传图片并智能抠图
- [ ] 支持自然语言描述主体
- [ ] 支持自动识别多个主体
- [ ] 返回高质量抠图结果
- [ ] 响应时间 < 5 秒

### 体验验收

- [ ] 操作流程简洁
- [ ] 加载状态清晰
- [ ] 错误提示友好
- [ ] 结果展示直观

### 技术验收

- [ ] 代码结构清晰
- [ ] 错误处理完善
- [ ] 日志记录详细
- [ ] 性能达标

---

## 🚨 风险与应对

### 风险 1: API 调用失败

**应对措施**:
- 实现重试机制
- 提供降级方案
- 记录错误日志

### 风险 2: 费用超预算

**应对措施**:
- 实现结果缓存
- 监控调用量
- 设置费用告警

### 风险 3: 响应时间慢

**应对措施**:
- 优化图片大小
- 使用异步处理
- CDN 加速

---

## 💡 优化建议

### 性能优化

1. **图片压缩**: 上传前压缩到 2MB 以内
2. **结果缓存**: 相同图片不重复调用 API
3. **异步处理**: 批量任务使用异步队列

### 成本优化

1. **智能缓存**: 缓存热点图片结果
2. **批量请求**: 一次请求识别多个主体
3. **降级方案**: API 失败时使用简单抠图

---

## 📞 需要帮助？

在实施过程中遇到问题，请参考：
- 设计文档：`docs/02-feature/2026-06-21_ai-smart-cutout-design.md`
- 阿里云文档：https://help.aliyun.com/zh/dashscope/

---

**更新时间**: 2026-06-21
**预计完成**: 1.5 个工作日

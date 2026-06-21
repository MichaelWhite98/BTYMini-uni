# 阿里云视觉智能抠图测试验证文档

## 文档信息
- **创建日期**: 2026-06-21
- **文档类型**: 测试验证文档
- **适用项目**: BTY Mini 饮品记录小程序

## 一、测试前检查

### 1.1 服务状态检查

后端服务已在运行中（PID: 99975）

**检查启动日志关键信息:**

```bash
# 在 IntelliJ IDEA 控制台中查找以下日志:

✅ OSS 客户端初始化成功，endpoint: oss-cn-shenzhen.aliyuncs.com, bucket: bty-admin
✅ 阿里云视觉智能客户端初始化成功，endpoint: viapi.cn-shanghai.aliyuncs.com
```

如果看到以上两条日志，说明服务启动成功。

### 1.2 配置验证

**检查配置文件** (`application.yml`):

```yaml
aliyun:
  # OSS 配置
  oss:
    endpoint: oss-cn-shenzhen.aliyuncs.com
    bucket-name: bty-admin
    access-key-id: YOUR_ACCESS_KEY_ID
    access-key-secret: QhIeBRSIVgWqBqyJ4HMDym6nqcU507
    base-url: https://bty-admin.oss-cn-shenzhen.aliyuncs.com

  # 视觉智能配置
  viapi:
    endpoint: viapi.cn-shanghai.aliyuncs.com
    access-key-id: YOUR_ACCESS_KEY_ID
    access-key-secret: YOUR_ACCESS_KEY_SECRET
```

## 二、完整测试流程

### 2.1 小程序测试

#### 步骤1: 上传图片

1. 打开小程序
2. 进入饮品记录页面
3. 点击上传图片按钮
4. 选择一张图片上传

**预期日志:**

```
开始上传图片，userId: 4, 文件名: xxx.jpg
文件上传成功，objectKey: food-diary/2026-06-21/xxx.jpg
图片上传成功，OSS URL: https://bty-admin.oss-cn-shenzhen.aliyuncs.com/food-diary/2026-06-21/xxx.jpg
```

**验证:**

- ✅ 小程序显示上传成功
- ✅ 图片在小程序中正常显示
- ✅ 图片URL为OSS地址（https://bty-admin.oss-cn-shenzhen.aliyuncs.com/...）

#### 步骤2: 调用抠图

1. 在小程序中点击"智能抠图"按钮
2. 等待处理完成（通常需要1-3秒）

**预期日志:**

```
开始智能抠图，userId: 4, imageUrl: https://bty-admin.oss-cn-shenzhen.aliyuncs.com/food-diary/2026-06-21/xxx.jpg
调用阿里云视觉智能 API 进行抠图
开始调用视觉智能 API 进行抠图，imageUrl: https://bty-admin.oss-cn-shenzhen.aliyuncs.com/food-diary/2026-06-21/xxx.jpg
抠图成功，结果图片 URL: https://viapi-result.oss-cn-shanghai.aliyuncs.com/xxx.png
智能抠图成功
```

**验证:**

- ✅ 小程序显示抠图成功
- ✅ 抠图结果图片正常显示
- ✅ 背景已透明化（抠出主体）

### 2.2 API 测试（使用 Postman 或 curl）

#### 测试1: 上传图片

**请求:**

```bash
curl -X POST http://localhost:8082/api/food-diary/media/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/test-image.jpg" \
  -F "bizType=food-diary"
```

**响应:**

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "imageId": "img_23",
    "imageUrl": "https://bty-admin.oss-cn-shenzhen.aliyuncs.com/food-diary/2026-06-21/xxx.jpg",
    "fileKey": "food-diary/2026-06-21/xxx.jpg"
  }
}
```

**验证:**

1. 在浏览器中打开 `imageUrl`
2. 确认图片可以正常访问
3. URL 应该是 OSS 地址，不是本地地址

#### 测试2: 抠图

**请求:**

```bash
curl -X POST http://localhost:8082/api/food-diary/cutout/tasks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "scene": "food-diary-cutout",
    "imageId": "img_23",
    "imageUrl": "https://bty-admin.oss-cn-shenzhen.aliyuncs.com/food-diary/2026-06-21/xxx.jpg"
  }'
```

**响应:**

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "taskId": "cutout_task_1782024771098_02d22c9d",
    "status": "succeeded",
    "items": [
      {
        "id": "item_1",
        "displayName": "图片主体",
        "score": 0.95,
        "cutoutUrl": "https://viapi-result.oss-cn-shanghai.aliyuncs.com/xxx.png",
        "maskUrl": "https://viapi-result.oss-cn-shanghai.aliyuncs.com/xxx.png",
        "thumbnailUrl": "https://viapi-result.oss-cn-shanghai.aliyuncs.com/xxx.png",
        "sourceType": "aliyun-viapi"
      }
    ],
    "primaryItemId": "item_1"
  }
}
```

**验证:**

1. 在浏览器中打开 `cutoutUrl`
2. 确认图片已抠图（背景透明）
3. `sourceType` 为 "aliyun-viapi" 表示使用了真实的抠图 API

## 三、数据库验证

### 3.1 检查上传记录

```sql
SELECT * FROM fd_media
WHERE file_url LIKE 'https://bty-admin.oss-cn-shenzhen.aliyuncs.com%'
ORDER BY id DESC
LIMIT 1;
```

**预期结果:**

```
id: 23
file_url: https://bty-admin.oss-cn-shenzhen.aliyuncs.com/food-diary/2026-06-21/xxx.jpg
file_key: food-diary/2026-06-21/xxx.jpg
```

### 3.2 检查抠图任务

```sql
SELECT * FROM fd_cutout_task
WHERE image_url LIKE 'https://bty-admin.oss-cn-shenzhen.aliyuncs.com%'
ORDER BY id DESC
LIMIT 1;
```

**预期结果:**

```
task_id: cutout_task_xxx
status: succeeded
image_url: https://bty-admin.oss-cn-shenzhen.aliyuncs.com/food-diary/2026-06-21/xxx.jpg
items_data: [{"cutoutUrl":"https://viapi-result.oss-cn-shanghai.aliyuncs.com/xxx.png",...}]
```

## 四、浏览器验证

### 4.1 验证原图

1. 从数据库或API响应中获取原图URL
2. 在浏览器中打开 URL
3. 验证图片正常显示

**示例:**

```
https://bty-admin.oss-cn-shenzhen.aliyuncs.com/food-diary/2026-06-21/test-image.jpg
```

### 4.2 验证抠图结果

1. 从API响应中获取抠图结果URL
2. 在浏览器中打开 URL
3. 验证图片已抠图（背景透明）

**示例:**

```
https://viapi-result.oss-cn-shanghai.aliyuncs.com/xxx.png
```

**对比:**

| 项目 | 原图 | 抠图结果 |
|------|------|----------|
| URL | `bty-admin.oss-cn-shenzhen.aliyuncs.com` | `viapi-result.oss-cn-shanghai.aliyuncs.com` |
| 格式 | JPG | PNG |
| 背景 | 原始背景 | 透明 |
| 内容 | 完整图片 | 仅主体 |

## 五、常见问题排查

### 5.1 上传失败

**问题:** 图片上传失败或返回本地地址

**检查:**

1. 查看后端日志，是否有 OSS 初始化错误
2. 检查 OSS AccessKey 是否正确
3. 检查 Bucket 权限是否为"公共读"
4. 检查 OSS endpoint 是否正确（oss-cn-shenzhen.aliyuncs.com）

### 5.2 抠图失败

**问题:** 抠图返回 null 或失败

**检查:**

1. 查看后端日志，是否有视觉智能初始化错误
2. 检查 VIAPI AccessKey 是否正确
3. 检查 RAM 用户是否有 `AliyunVIAPIFullAccess` 权限
4. 检查图片 URL 是否公网可访问
5. 检查图片格式和大小（支持 JPG/PNG，最大 10MB）

### 5.3 图片无法访问

**问题:** OSS 图片在浏览器中无法打开

**检查:**

1. Bucket 权限是否为"公共读"
2. 图片是否成功上传到 OSS
3. URL 是否正确
4. 是否配置了 CORS

## 六、成功标准

### ✅ 完整流程成功

- [ ] 后端服务启动成功
- [ ] OSS 客户端初始化成功
- [ ] 视觉智能客户端初始化成功
- [ ] 图片上传到 OSS 成功
- [ ] 图片 URL 为 OSS 地址
- [ ] 抠图 API 调用成功
- [ ] 返回抠图结果 URL
- [ ] 抠图结果图片可访问
- [ ] 背景已透明化
- [ ] 小程序显示正常

### ✅ 数据正确

- [ ] fd_media 表记录正确
- [ ] fd_cutout_task 表记录正确
- [ ] sourceType 为 "aliyun-viapi"
- [ ] 抠图结果 URL 在阿里云 OSS（viapi-result）

## 七、测试报告模板

```
### 阿里云视觉智能抠图测试报告

**测试时间**: 2026-06-21 XX:XX
**测试人员**: XXX
**测试环境**: 开发环境

#### 测试结果:

1. 服务启动:
   - [ ] OSS 客户端初始化: 成功/失败
   - [ ] 视觉智能客户端初始化: 成功/失败

2. 图片上传:
   - [ ] 上传成功: 是/否
   - [ ] OSS URL: https://bty-admin.oss-cn-shenzhen.aliyuncs.com/food-diary/2026-06-21/xxx.jpg
   - [ ] 图片可访问: 是/否

3. 抠图功能:
   - [ ] API 调用成功: 是/否
   - [ ] 返回抠图结果: 是/否
   - [ ] 抠图结果 URL: https://viapi-result.oss-cn-shanghai.aliyuncs.com/xxx.png
   - [ ] 抠图效果: 背景透明/未抠图

4. 数据库记录:
   - [ ] fd_media 记录正确: 是/否
   - [ ] fd_cutout_task 记录正确: 是/否

#### 问题记录:
- 问题1: ...
- 问题2: ...

#### 总体评价:
✅ 所有测试通过 / ❌ 存在问题需修复
```

---

## 相关文档

- [阿里云视觉智能抠图完整实现文档](./2026-06-21_viapi-cutout-complete-implementation.md)
- [快速开始指南](./2026-06-21_viapi-cutout-quick-start.md)

---

**测试准备就绪，开始验证吧！**

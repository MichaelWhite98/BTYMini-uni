# 阿里云 OSS 配置更新说明

## 更新时间
2026-06-21

## 配置变更

### OSS Bucket 信息

**更新前：**
- Bucket 名称：`bty-food-diary`
- 地域：华东1（杭州）
- Endpoint：`oss-cn-hangzhou.aliyuncs.com`
- 访问 URL：`https://bty-food-diary.oss-cn-hangzhou.aliyuncs.com`

**更新后：**
- Bucket 名称：`bty-admin`
- 地域：华南1（深圳）
- Endpoint：`oss-cn-shenzhen.aliyuncs.com`
- 访问 URL：`https://bty-admin.oss-cn-shenzhen.aliyuncs.com`

### 完整配置

**文件位置：** `btyadmin/bty-admin/src/main/resources/application.yml`

```yaml
aliyun:
  # OSS 对象存储配置
  oss:
    endpoint: oss-cn-shenzhen.aliyuncs.com
    bucket-name: bty-admin
    access-key-id: YOUR_ACCESS_KEY_ID
    access-key-secret: QhIeBRSIVgWqBqyJ4HMDym6nqcU507
    base-url: https://bty-admin.oss-cn-shenzhen.aliyuncs.com
```

## 变更影响

### 图片 URL 格式

**旧格式：**
```
https://bty-food-diary.oss-cn-hangzhou.aliyuncs.com/food-diary/2026-06-21/xxx.jpg
```

**新格式：**
```
https://bty-admin.oss-cn-shenzhen.aliyuncs.com/food-diary/2026-06-21/xxx.jpg
```

### 地域优势

**华南1（深圳）的优势：**
- ✅ 地理位置更近（如果你的服务器或用户在华南地区）
- ✅ 访问速度可能更快
- ✅ 网络延迟更低

## 需要更新的文件

### 1. 后端代码 ✅
已自动更新（通过读取配置文件）

### 2. 需要手动更新的文档

以下文档需要更新其中的 Bucket 名称和 URL：

- [ ] 集成设计方案
- [ ] 集成完成总结
- [ ] 成本分析文档
- [ ] 其他相关文档

## 注意事项

### 1. Bucket 创建

确保在阿里云控制台创建了新的 Bucket：

**创建步骤：**
1. 访问：https://oss.console.aliyun.com/
2. 点击"创建 Bucket"
3. 配置：
   - Bucket 名称：`bty-admin`
   - 地域：华南1（深圳）
   - 存储类型：标准存储
   - 读写权限：公共读

### 2. CORS 配置

在 Bucket 设置中添加 CORS 规则：
```
来源：*
允许 Methods：GET, POST, PUT
允许 Headers：*
暴露 Headers：ETag, x-oss-request-id
缓存时间：3600
```

### 3. 已上传的图片

如果之前已经上传了图片到旧 Bucket：
- 旧图片 URL 仍然有效（如果旧 Bucket 还存在）
- 新上传的图片会使用新 Bucket
- 建议迁移旧图片到新 Bucket（可选）

### 4. 跨区域复制

如果需要高可用性，可以配置跨区域复制：
- 源 Bucket：华南1（深圳）
- 目标 Bucket：其他地域（如华东1杭州）

## 测试验证

### 后端测试

启动后端服务，上传图片测试：

```bash
curl -X POST http://localhost:8082/api/food-diary/oss/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/image.jpg"
```

**预期响应：**
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "imageUrl": "https://bty-admin.oss-cn-shenzhen.aliyuncs.com/food-diary/2026-06-21/xxx.jpg",
    "originalFilename": "image.jpg",
    "size": 102400
  }
}
```

### 前端测试

在小程序中调用上传接口，检查返回的图片 URL 是否为新格式。

## 相关链接

- [OSS 控制台](https://oss.console.aliyun.com/)
- [华南1（深圳）节点信息](https://help.aliyun.com/document_detail/31837.html)

---

**配置已更新，所有上传的图片将使用新的 Bucket 和地域！**

# OSS 配置更新总结

## 配置变更

### 从华东1（杭州）迁移到华南1（深圳）

**变更内容：**
- Bucket 名称：`bty-food-diary` → `bty-admin`
- 地域：华东1（杭州） → 华南1（深圳）
- Endpoint：`oss-cn-hangzhou.aliyuncs.com` → `oss-cn-shenzhen.aliyuncs.com`
- 访问 URL：`https://bty-food-diary.oss-cn-hangzhou.aliyuncs.com` → `https://bty-admin.oss-cn-shenzhen.aliyuncs.com`

### 实际配置（application.yml）

```yaml
aliyun:
  oss:
    endpoint: oss-cn-shenzhen.aliyuncs.com
    bucket-name: bty-admin
    access-key-id: YOUR_ACCESS_KEY_ID
    access-key-secret: QhIeBRSIVgWqBqyJ4HMDym6nqcU507
    base-url: https://bty-admin.oss-cn-shenzhen.aliyuncs.com
```

## 文档更新状态

### ✅ 已更新的文档

1. **2026-06-21_aliyun-oss-integration-design.md**
   - 更新 Bucket 创建说明
   - 更新开通 OSS 说明
   - 保留其他技术设计内容

2. **2026-06-21_aliyun-oss-integration-complete.md**
   - 更新配置示例
   - 更新 URL 示例

3. **2026-06-21_oss-server-upload-summary.md**
   - 更新响应示例中的 URL

4. **2026-06-21_oss-config-update.md** （新建）
   - 详细说明配置变更
   - 包含新旧对比
   - 包含测试验证步骤

### 📝 文档中使用新配置的地方

所有文档中涉及以下内容的都已更新或需要注意：

- Bucket 名称：`bty-admin`
- 访问 URL：`https://bty-admin.oss-cn-shenzhen.aliyuncs.com/...`
- API 测试示例中的 URL
- 图片 URL 格式示例

## 代码自动适配

### ✅ 后端代码

所有后端代码通过读取 `application.yml` 配置文件自动适配新配置：
- `OssService.java` - 从配置读取 endpoint、bucketName、baseUrl
- `OssController.java` - 无需修改
- 其他相关代码 - 自动适配

### ✅ 前端代码

前端代码通过调用后端 API，自动获得新的图片 URL，无需修改：
- `oss-upload.js` - 调用后端接口，返回新 URL
- 小程序页面 - 显示新 URL 的图片

## 图片 URL 格式

### 新格式（生效）

上传图片后返回的 URL 格式：
```
https://bty-admin.oss-cn-shenzhen.aliyuncs.com/food-diary/2026-06-21/uuid.jpg
```

**特点：**
- Bucket：`bty-admin`
- 地域：华南1（深圳）
- 路径：`food-diary/日期/uuid.jpg`

## 注意事项

### 1. Bucket 创建确认

确保已在阿里云控制台创建 `bty-admin` Bucket：
- 地域：华南1（深圳）
- 读写权限：公共读

### 2. CORS 配置

在新 Bucket 中配置 CORS（跨域访问）：
```
来源：*
允许 Methods：GET, POST, PUT
允许 Headers：*
暴露 Headers：ETag, x-oss-request-id
缓存时间：3600
```

### 3. 地域选择优势

华南1（深圳）的优势：
- ✅ 如果服务器在华南地区，访问速度更快
- ✅ 网络延迟更低
- ✅ 数据传输效率更高

### 4. 已上传的图片

- 新上传：使用新 Bucket
- 旧图片：如果旧 Bucket 存在，旧 URL 仍有效
- 建议：无需迁移，新旧可以共存

## 测试验证

### 启动服务测试

```bash
# 后端
cd /Users/baitao/project/bty/btyadmin
mvn clean install
cd bty-admin
mvn spring-boot:run

# 前端
cd /Users/baitao/project/bty/BTYMini-uni
npm run dev:mp-weixin
```

### 测试上传

在小程序饮品记录页面上传图片，检查返回的 URL：

**预期结果：**
```json
{
  "imageUrl": "https://bty-admin.oss-cn-shenzhen.aliyuncs.com/food-diary/2026-06-21/xxx.jpg"
}
```

### 验证抠图

使用新 URL 调用阿里云抠图 API，应该可以正常工作（公网可访问）。

## 配置生效确认

### ✅ 自动生效

以下内容通过配置文件自动生效：
- OSS Endpoint
- Bucket 名称
- 访问基础 URL
- AccessKey

### ✅ 无需手动修改

以下内容无需手动修改：
- 后端代码
- 前端代码
- API 接口
- 上传逻辑

## 相关链接

- [OSS 控制台](https://oss.console.aliyun.com/)
- [配置更新详细说明](./2026-06-21_oss-config-update.md)
- [OSS 集成完成总结](./2026-06-21_aliyun-oss-integration-complete.md)

---

**配置更新完成，所有上传将使用华南1（深圳）的 bty-admin Bucket！**
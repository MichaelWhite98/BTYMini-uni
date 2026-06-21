# 阿里云 OSS 对象存储接入技术设计方案

## 文档信息

- **创建日期**：2026-06-21
- **文档类型**：技术设计方案
- **适用项目**：BTY Mini 饮品记录小程序
- **版本**：v1.0

## 一、需求背景

### 1.1 当前问题

**图片存储现状：**
- 图片存储在本地服务器：`http://192.168.31.185:8082/uploads/food-diary/`
- 局域网地址，公网无法访问
- 阿里云抠图 API 需要公网可访问的图片 URL
- 本地存储占用服务器磁盘空间
- 图片加载速度受限于服务器带宽

**核心痛点：**
```
小程序上传图片 → 本地服务器存储
                  ↓
              局域网 URL
                  ↓
          阿里云抠图 API 无法访问 ❌
```

### 1.2 解决方案

使用阿里云 OSS 对象存储服务：

```
小程序上传图片 → 阿里云 OSS 存储
                  ↓
              公网 URL
                  ↓
          阿里云抠图 API 可正常访问 ✅
```

## 二、技术方案设计

### 2.1 整体架构

```
┌─────────────────┐
│   微信小程序     │
│                 │
│  1. 选择图片     │
│  2. 上传到 OSS   │
│  3. 获取 URL     │
└────────┬────────┘
         │
         │ HTTPS
         ↓
┌─────────────────┐
│  阿里云 OSS      │
│                 │
│  - 图片存储      │
│  - CDN 加速     │
│  - 图片处理      │
└────────┬────────┘
         │
         │ 返回公网 URL
         ↓
┌─────────────────┐
│   后端服务       │
│                 │
│  1. 接收图片URL  │
│  2. 调用抠图API  │
│  3. 保存记录     │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  阿里云抠图API   │
│                 │
│  - 识别图片主体  │
│  - 智能抠图      │
└─────────────────┘
```

### 2.2 技术选型

| 技术组件 | 选型方案 | 说明 |
|---------|---------|------|
| **对象存储** | 阿里云 OSS | 企业级存储服务 |
| **上传方式** | 服务端签名 + 客户端直传 | 安全、高效、节省带宽 |
| **CDN 加速** | 阿里云 CDN | 提升图片加载速度 |
| **图片处理** | OSS 图片处理服务 | 自动压缩、裁剪 |
| **SDK** | aliyun-sdk-oss (Java) | 官方 SDK |

### 2.3 核心功能设计

#### 2.3.1 图片上传流程

**推荐方案：服务端签名 + 客户端直传**

```
1. 小程序请求上传凭证
   ↓
2. 后端生成 OSS 签名 URL（STS 临时凭证）
   ↓
3. 小程序直接上传图片到 OSS
   ↓
4. OSS 返回图片公网 URL
   ↓
5. 小程序将 URL 提交给后端保存
```

**优势：**
- ✅ 图片不经过后端服务器，节省带宽
- ✅ 上传速度更快，直连 OSS
- ✅ 安全性高，使用临时凭证
- ✅ 支持断点续传、分片上传

#### 2.3.2 图片访问流程

```
小程序请求图片
   ↓
CDN 节点（就近访问）
   ↓
OSS 存储（回源）
   ↓
返回图片数据
```

**优化措施：**
- CDN 缓存策略：热点图片缓存 7 天
- 图片压缩：自动压缩至 500KB 以下
- WebP 格式：自动转换为 WebP 格式（减小体积）

#### 2.3.3 图片安全设计

**访问控制：**
1. **Bucket 权限**：公共读（图片需要公开访问）
2. **防盗链**：配置 Referer 白名单
3. **签名 URL**：敏感图片使用签名 URL（有效期 1 小时）
4. **STS 临时凭证**：上传使用临时凭证（有效期 15 分钟）

**数据安全：**
- 跨域配置（CORS）：仅允许小程序域名访问
- 日志记录：记录所有访问日志
- 数据备份：开启跨区域复制

### 2.4 数据流转设计

#### 2.4.1 图片上传数据流

```javascript
// 小程序端
async function uploadImageToOSS(filePath) {
  // 1. 获取上传凭证
  const { data: credential } = await uni.request({
    url: '/api/food-diary/oss/upload-credential',
    method: 'POST'
  });

  // 2. 直接上传到 OSS
  const uploadResult = await uni.uploadFile({
    url: credential.host,
    filePath: filePath,
    name: 'file',
    formData: {
      key: credential.key,
      policy: credential.policy,
      OSSAccessKeyId: credential.accessKeyId,
      signature: credential.signature,
      success_action_status: '200'
    }
  });

  // 3. 返回图片 URL
  return {
    imageUrl: credential.host + '/' + credential.key,
    imageKey: credential.key
  };
}
```

#### 2.4.2 后端签名生成

```java
// 后端服务
@PostMapping("/api/food-diary/oss/upload-credential")
public Object getUploadCredential() {
    // 1. 生成文件路径
    String key = "food-diary/" + DateUtil.today() + "/" +
                 UUID.randomUUID().toString() + ".jpg";

    // 2. 生成签名
    String policy = generatePolicy();
    String signature = generateSignature(policy);

    // 3. 返回凭证
    return AjaxResult.success(Map.of(
        "host", "https://bty-food-diary.oss-cn-hangzhou.aliyuncs.com",
        "key", key,
        "policy", policy,
        "accessKeyId", aliyunConfig.getAccessKeyId(),
        "signature", signature
    ));
}
```

#### 2.4.3 抠图流程集成

```java
// 后端服务
public void processImageWithCutout(String imageUrl) {
    // imageUrl 现在是公网可访问的 OSS URL
    // 例如：https://bty-food-diary.oss-cn-hangzhou.aliyuncs.com/food-diary/2026-06-21/xxx.jpg

    // 调用阿里云抠图 API
    List<Map<String, Object>> cutoutItems = callAliyunHTTPAPI(imageUrl);

    // 保存记录到数据库
    saveFoodRecord(imageUrl, cutoutItems);
}
```

## 三、实施计划

### 3.1 准备工作（Day 1）

#### 任务清单

- [ ] 开通阿里云 OSS 服务
- [ ] 创建 Bucket（存储桶）
- [ ] 配置 Bucket 基本属性
- [ ] 创建 RAM 子账号并授权
- [ ] 获取 AccessKey

#### 详细步骤

**1. 开通 OSS**

访问：https://oss.console.aliyun.com/

点击"立即开通"，确认开通。

**注意：Bucket 已创建为 bty-admin（华南1深圳）**

**2. 创建 Bucket**

```
Bucket 名称：bty-admin
地域：华南1（深圳）
存储类型：标准存储
读写权限：公共读
版本控制：不开启
```

**3. 配置 CORS（跨域）**

```
来源：*
允许 Methods：GET, POST, PUT, DELETE, HEAD
允许 Headers：*
暴露 Headers：ETag, x-oss-request-id
缓存时间：3600
```

**4. 创建 RAM 用户**

```
用户名：bty-oss-admin
访问方式：OpenAPI 调用访问
权限：AliyunOSSFullAccess（OSS 完全访问）
```

记录 AccessKey ID 和 Secret。

### 3.2 后端开发（Day 2-3）

#### 任务清单

- [ ] 添加 OSS SDK 依赖
- [ ] 更新配置文件
- [ ] 创建 OSS 服务类
- [ ] 实现签名生成接口
- [ ] 实现图片处理接口
- [ ] 更新数据表结构

#### 技术实现

**1. Maven 依赖**

```xml
<!-- 阿里云 OSS SDK -->
<dependency>
    <groupId>com.aliyun.oss</groupId>
    <artifactId>aliyun-sdk-oss</artifactId>
    <version>3.17.4</version>
</dependency>
```

**2. 配置文件**

```yaml
aliyun:
  oss:
    endpoint: oss-cn-hangzhou.aliyuncs.com
    bucket-name: bty-food-diary
    access-key-id: YOUR_ACCESS_KEY_ID
    access-key-secret: YOUR_ACCESS_KEY_SECRET
    base-url: https://bty-food-diary.oss-cn-hangzhou.aliyuncs.com
```

**3. 服务类实现**

```java
@Service
public class OssService {

    @Autowired
    private AliyunConfig config;

    private OSS ossClient;

    @PostConstruct
    public void init() {
        ossClient = new OSSClientBuilder().build(
            config.getOss().getEndpoint(),
            config.getOss().getAccessKeyId(),
            config.getOss().getAccessKeySecret()
        );
    }

    /**
     * 生成上传签名
     */
    public Map<String, Object> generateUploadSignature() {
        String key = generateObjectKey();

        PolicyConditions policyConditions = new PolicyConditions();
        policyConditions.addCondition(
            PolicyConditions.COND_CONTENT_LENGTH_RANGE,
            0, 10485760 // 最大 10MB
        );

        String policy = ossClient.generatePostPolicy(
            DateUtil.offsetHour(new Date(), 1), // 1小时有效
            policyConditions
        );

        String signature = ossClient.calculatePostSignature(policy);

        return Map.of(
            "host", config.getOss().getBaseUrl(),
            "key", key,
            "policy", policy,
            "accessKeyId", config.getOss().getAccessKeyId(),
            "signature", signature
        );
    }

    /**
     * 生成对象键
     */
    private String generateObjectKey() {
        return String.format("food-diary/%s/%s.jpg",
            DateUtil.today(),
            UUID.randomUUID().toString()
        );
    }
}
```

**4. Controller 接口**

```java
@RestController
@RequestMapping("/api/food-diary/oss")
public class OssController {

    @Autowired
    private OssService ossService;

    /**
     * 获取上传凭证
     */
    @PostMapping("/upload-credential")
    public Object getUploadCredential(@RequestAttribute("userId") Long userId) {
        Map<String, Object> credential = ossService.generateUploadSignature();
        return AjaxResult.success(credential);
    }

    /**
     * 图片处理（压缩、裁剪）
     */
    @PostMapping("/process-image")
    public Object processImage(@RequestBody Map<String, String> params) {
        String imageUrl = params.get("imageUrl");

        // 使用 OSS 图片处理服务
        String processedUrl = ossService.processImage(imageUrl);

        return AjaxResult.success(Map.of(
            "processedUrl", processedUrl
        ));
    }
}
```

### 3.3 前端开发（Day 3-4）

#### 任务清单

- [ ] 创建 OSS 上传工具类
- [ ] 修改图片上传组件
- [ ] 集成到饮品记录页面
- [ ] 测试上传功能

#### 技术实现

**1. OSS 上传工具类**

```javascript
// src/utils/oss-upload.js
import { getApiBase } from './env.config';

/**
 * 上传图片到 OSS
 */
export async function uploadImageToOSS(filePath) {
  // 1. 获取上传凭证
  const credentialRes = await uni.request({
    url: `${getApiBase()}/api/food-diary/oss/upload-credential`,
    method: 'POST',
    header: {
      'Authorization': uni.getStorageSync('token')
    }
  });

  if (credentialRes.data.code !== 200) {
    throw new Error('获取上传凭证失败');
  }

  const credential = credentialRes.data.data;

  // 2. 上传到 OSS
  const uploadRes = await uni.uploadFile({
    url: credential.host,
    filePath: filePath,
    name: 'file',
    formData: {
      key: credential.key,
      policy: credential.policy,
      OSSAccessKeyId: credential.accessKeyId,
      signature: credential.signature,
      success_action_status: '200'
    }
  });

  if (uploadRes.statusCode !== 200) {
    throw new Error('上传失败');
  }

  // 3. 返回图片 URL
  return {
    imageUrl: `${credential.host}/${credential.key}`,
    key: credential.key
  };
}

/**
 * 批量上传图片
 */
export async function uploadImagesToOSS(filePaths) {
  const uploadPromises = filePaths.map(path => uploadImageToOSS(path));
  return await Promise.all(uploadPromises);
}
```

**2. 修改饮品记录页面**

```vue
<!-- src/pages/detail/index.vue -->
<script>
import { uploadImageToOSS } from '@/utils/oss-upload';

export default {
  methods: {
    async chooseImage() {
      // 选择图片
      const res = await uni.chooseImage({
        count: 9,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera']
      });

      // 上传到 OSS
      const uploadPromises = res.tempFilePaths.map(path =>
        uploadImageToOSS(path)
      );

      const uploadResults = await Promise.all(uploadPromises);

      // 更新图片列表
      this.imageList = uploadResults.map(item => ({
        url: item.imageUrl,
        key: item.key
      }));

      // 提示用户
      uni.showToast({
        title: '上传成功',
        icon: 'success'
      });
    }
  }
};
</script>
```

### 3.4 数据迁移（Day 5）

#### 任务清单

- [ ] 迁移现有图片到 OSS
- [ ] 更新数据库图片 URL
- [ ] 保留本地备份
- [ ] 测试迁移结果

#### 迁移脚本

```java
@Service
public class ImageMigrationService {

    public void migrateImagesToOSS() {
        // 1. 查询所有本地图片记录
        List<FoodRecord> records = foodRecordMapper.selectList(
            new QueryWrapper<FoodRecord>()
                .like("image_url", "192.168.31.185")
        );

        // 2. 逐个迁移
        for (FoodRecord record : records) {
            // 下载本地图片
            byte[] imageData = downloadImage(record.getImageUrl());

            // 上传到 OSS
            String ossUrl = ossService.uploadImage(imageData);

            // 更新数据库
            record.setImageUrl(ossUrl);
            foodRecordMapper.updateById(record);
        }
    }
}
```

### 3.5 CDN 配置（Day 6）

#### 任务清单

- [ ] 开通阿里云 CDN
- [ ] 添加 OSS 域名
- [ ] 配置缓存策略
- [ ] 配置 HTTPS 证书
- [ ] 测试加速效果

#### CDN 配置

```
加速域名：cdn.bty-food-diary.com
源站类型：OSS 域名
源站地址：bty-food-diary.oss-cn-hangzhou.aliyuncs.com

缓存配置：
  - 图片文件（.jpg, .png, .webp）：缓存 7 天
  - 其他文件：缓存 1 天

HTTPS 配置：
  - 开启 HTTPS
  - 强制跳转 HTTPS
```

## 四、成本预算

### 4.1 开发成本

| 项目 | 工作量 | 说明 |
|------|-------|------|
| 后端开发 | 2 天 | OSS SDK 集成、签名生成 |
| 前端开发 | 2 天 | 上传组件修改、测试 |
| 数据迁移 | 1 天 | 现有图片迁移 |
| CDN 配置 | 1 天 | 域名、证书、缓存配置 |
| **总计** | **6 天** | |

### 4.2 运营成本

#### 按量付费（月度）

**假设：**
- 月上传图片：500 张
- 平均图片大小：500KB（压缩后）
- 月存储量：0.25GB
- 月流量：2.5GB（每张被查看10次）

**费用明细：**

| 费用项 | 单价 | 用量 | 月费用 |
|--------|------|------|--------|
| 存储费用 | 0.12元/GB | 0.25GB | 0.03元 |
| 外网流量 | 0.50元/GB | 2.5GB | 1.25元 |
| 请求费用 | 0.01元/万次 | 5500次 | 0.01元 |
| CDN 流量 | 0.24元/GB | 2.5GB | 0.60元 |
| **总计** | - | - | **≈ 1.89元/月** |

#### 新用户优惠（前3个月）

| 免费额度 | 数量 | 价值 |
|---------|------|------|
| 存储空间 | 40GB | 4.8元/月 |
| 外网流量 | 10GB | 5.0元/月 |
| 请求次数 | 100万次 | 1.0元/月 |
| **总计** | - | **≈ 10.8元/月** |

**前3个月实际费用：≈ 0元**（在免费额度内）

### 4.3 成本优化建议

**1. 开启图片压缩**
- 自动压缩至 500KB 以下
- 节省存储和流量成本 50%-70%

**2. 使用 CDN 加速**
- CDN 流量费用：0.24元/GB
- OSS 直接访问：0.50元/GB
- 节省：52%

**3. 配置生命周期规则**
- 90天未访问转为低频存储
- 存储费用从 0.12元降至 0.08元
- 节省：33%

## 五、风险评估与应对

### 5.1 技术风险

| 风险 | 影响 | 应对措施 |
|------|------|---------|
| OSS 服务故障 | 图片无法上传/访问 | 配置跨区域复制，准备降级方案 |
| 签名泄露 | 恶意上传 | 使用 STS 临时凭证，定期轮换密钥 |
| 流量超限 | 费用超支 | 设置流量告警，配置 QPS 限制 |

### 5.2 成本风险

| 风险 | 影响 | 应对措施 |
|------|------|---------|
| 流量激增 | 费用超支 | 配置流量阈值告警 |
| 恶意访问 | 流量消耗 | 配置防盗链、IP 黑名单 |
| 存储膨胀 | 存储费用增加 | 定期清理无用图片，配置生命周期 |

### 5.3 数据安全

| 风险 | 影响 | 应对措施 |
|------|------|---------|
| 数据丢失 | 用户图片丢失 | 开启跨区域复制，定期备份 |
| 隐私泄露 | 用户信息泄露 | 敏感图片使用签名 URL |
| 非法内容 | 违规图片上传 | 接入内容审核服务 |

## 六、监控与运维

### 6.1 监控指标

**OSS 监控：**
- 存储容量使用量
- 流量使用量
- 请求次数
- 错误率

**告警规则：**
```
存储容量 > 10GB → 发送告警
月流量 > 5GB → 发送告警
错误率 > 5% → 发送告警
```

### 6.2 日志管理

**开启 OSS 访问日志：**
```
日志存储位置：bty-food-diary-logs
日志前缀：oss-access-logs/
日志字段：访问时间、IP、请求方法、对象键、响应状态等
```

**日志分析：**
- 定期分析热门图片
- 分析访问来源
- 检测异常访问

### 6.3 备份策略

**跨区域复制：**
- 源 Bucket：华东1（杭州）
- 目标 Bucket：华北2（北京）
- 复制规则：实时复制所有对象

**定期备份：**
- 每周全量备份一次
- 保留最近 4 周的备份

## 七、测试计划

### 7.1 功能测试

| 测试项 | 测试内容 | 预期结果 |
|--------|---------|---------|
| 图片上传 | 上传单张图片 | 成功返回 URL |
| 批量上传 | 上传多张图片 | 全部成功 |
| 大文件上传 | 上传 > 5MB 图片 | 自动压缩后上传 |
| 图片访问 | 访问已上传图片 | 正常显示 |
| CDN 加速 | 访问速度测试 | 延迟 < 200ms |

### 7.2 性能测试

| 测试项 | 测试条件 | 性能指标 |
|--------|---------|---------|
| 上传性能 | 1MB 图片 | < 2 秒 |
| 下载性能 | 1MB 图片 | < 1 秒 |
| 并发上传 | 10 个并发 | 全部成功 |
| 高并发访问 | 100 QPS | 响应正常 |

### 7.3 安全测试

| 测试项 | 测试内容 | 预期结果 |
|--------|---------|---------|
| 非法上传 | 无签名上传 | 拒绝访问 |
| 跨域访问 | 非 whitelist 域名 | CORS 拒绝 |
| 防盗链 | 非 whitelist Referer | 拒绝访问 |

## 八、上线计划

### 8.1 上线检查清单

- [ ] OSS 配置完成
- [ ] CDN 配置完成
- [ ] 后端代码部署
- [ ] 前端代码发布
- [ ] 监控告警配置
- [ ] 文档更新完成
- [ ] 测试验证通过

### 8.2 灰度发布

**阶段 1：小范围测试（10% 用户）**
- 时间：1-2 天
- 观察指标：上传成功率、错误日志

**阶段 2：扩大范围（50% 用户）**
- 时间：2-3 天
- 观察指标：性能表现、用户反馈

**阶段 3：全量发布（100% 用户）**
- 时间：正式上线
- 持续监控各项指标

### 8.3 回滚方案

**如果出现问题：**
1. 立即切换回本地存储
2. 修改配置使用本地路径
3. 发布修复版本
4. 排查问题原因

## 九、总结

### 9.1 核心收益

✅ **解决核心问题**
- 图片获得公网 URL
- 阿里云抠图 API 可正常调用
- 小程序图片上传功能完善

✅ **性能提升**
- CDN 加速，图片加载更快
- 节省服务器带宽
- 支持高并发访问

✅ **成本优化**
- 每月成本 < 2 元
- 新用户前 3 个月免费
- 按需付费，无浪费

✅ **运维简化**
- 无需维护存储服务器
- 自动备份和容灾
- 完善的监控告警

### 9.2 后续优化

**短期优化：**
1. 图片自动压缩优化
2. 图片水印功能
3. 图片审核功能

**长期优化：**
1. 图片智能标签
2. 图片搜索功能
3. 图片 CDN 智能调度

---

## 附录

### A. 相关文档链接

- [阿里云 OSS 官方文档](https://help.aliyun.com/product/31815.html)
- [OSS 快速入门](https://help.aliyun.com/document_detail/31883.html)
- [OSS SDK for Java](https://help.aliyun.com/document_detail/32008.html)
- [OSS 最佳实践](https://help.aliyun.com/document_detail/32111.html)

### B. 技术支持

**遇到问题时：**
1. 查看官方文档
2. 搜索错误信息
3. 提交工单求助
4. 查看社区问答

### C. 变更记录

| 日期 | 版本 | 变更内容 | 作者 |
|------|------|---------|------|
| 2026-06-21 | v1.0 | 初始版本 | Claude |

# VIAPI Endpoint 修复说明

## 问题

调用图像分割 API 时返回错误：

```
com.aliyun.tea.TeaException: code: 400, Specified parameter Version is not valid.
```

## 原因分析

`imageseg20191230` SDK 是专门的图像分割 SDK，使用的是独立的 endpoint，不是通用的 VIAPI endpoint。

- ❌ 错误的 endpoint: `viapi.cn-shanghai.aliyuncs.com`
- ✅ 正确的 endpoint: `imageseg.cn-shanghai.aliyuncs.com`

## 修复方案

### 修改 application.yml

```yaml
aliyun:
  # 视觉智能 API 配置 (imageseg20191230 SDK)
  viapi:
    endpoint: imageseg.cn-shanghai.aliyuncs.com  # ← 修改这里
    access-key-id: YOUR_ACCESS_KEY_ID
    access-key-secret: YOUR_ACCESS_KEY_SECRET
```

## Endpoint 说明

不同 SDK 使用不同的 endpoint：

| SDK | Endpoint | 说明 |
|-----|----------|------|
| imageseg20191230 | imageseg.cn-shanghai.aliyuncs.com | 图像分割专用 |
| viapi20230117 | viapi.cn-shanghai.aliyuncs.com | 通用 VIAPI（但不包含具体 API）|

## 下一步

1. **重启服务**
   - 在 IDEA 中停止服务
   - 重新运行 BTYAdminApplication

2. **查看启动日志**
   ```
   ✅ 阿里云图像分割客户端初始化成功，endpoint: imageseg.cn-shanghai.aliyuncs.com
   ```

3. **重新测试**
   - 小程序上传图片
   - 点击抠图按钮
   - 查看结果

## 预期日志

```
开始调用图像分割 API 进行抠图，imageUrl: https://bty-admin.oss-cn-shenzhen.aliyuncs.com/...
抠图成功，结果图片 URL: https://viapi-result.oss-cn-shanghai.aliyuncs.com/...
```

---

**修复时间**: 2026-06-21
**修复状态**: ✅ 已修复，待重启测试

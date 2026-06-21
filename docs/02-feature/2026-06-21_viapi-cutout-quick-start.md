# 阿里云视觉智能抠图快速开始

## 快速测试步骤

### 1. 重启后端服务

在 IntelliJ IDEA 中重启服务，或命令行：

```bash
cd /Users/baitao/project/bty/btyadmin
mvn clean install
cd bty-admin
mvn spring-boot:run
```

### 2. 查看启动日志

**成功标志：**
```
OSS 客户端初始化成功，endpoint: oss-cn-shenzhen.aliyuncs.com, bucket: bty-admin
阿里云视觉智能客户端初始化成功，endpoint: viapi.cn-shanghai.aliyuncs.com
```

### 3. 小程序测试

**上传图片：**
1. 打开小程序
2. 进入饮品记录页面
3. 点击上传图片
4. 选择图片并上传

**查看日志：**
```
开始上传图片，userId: 4, 文件名: xxx.jpg
文件上传成功，objectKey: food-diary/2026-06-21/xxx.jpg
图片上传成功，OSS URL: https://bty-admin.oss-cn-shenzhen.aliyuncs.com/...
```

**抠图处理：**
1. 点击抠图按钮
2. 等待处理完成

**查看日志：**
```
开始智能抠图，userId: 4, imageUrl: https://...
调用阿里云视觉智能 API 进行抠图
抠图成功，结果图片 URL: https://viapi-result.oss-cn-shanghai.aliyuncs.com/...
智能抠图成功
```

### 4. 验证结果

**原图 URL：**
```
https://bty-admin.oss-cn-shenzhen.aliyuncs.com/food-diary/2026-06-21/xxx.jpg
```

**抠图结果 URL：**
```
https://viapi-result.oss-cn-shanghai.aliyuncs.com/xxx.png
```

在浏览器中打开这两个 URL：
- 原图：显示完整图片
- 抠图结果：显示抠出的主体，背景透明

## 预期效果

### 上传成功
- ✅ 图片存储在 OSS
- ✅ 返回公网 URL
- ✅ 可以在浏览器中访问

### 抠图成功
- ✅ 自动识别图片主体
- ✅ 抠出主体，背景透明
- ✅ 返回抠图后的图片 URL
- ✅ 小程序显示抠图结果

## 常见问题

### Q1: 视觉智能客户端初始化失败？

**检查：**
1. AccessKey 是否正确
2. RAM 用户权限：需要 `AliyunVIAPIFullAccess`

### Q2: 抠图返回 null？

**检查：**
1. 图片 URL 是否公网可访问
2. 图片格式：JPG、PNG
3. 图片大小：最大 10MB

### Q3: 图片无法访问？

**检查：**
1. Bucket 权限：公共读
2. CORS 配置：允许跨域

## 完整流程图

```
小程序上传图片
    ↓
后端上传到 OSS
    ↓
返回 OSS URL
    ↓
调用视觉智能抠图
    ↓
返回抠图结果 URL
    ↓
小程序显示抠图结果
```

## 费用说明

- OSS：免费额度 40GB 存储 + 10GB 流量（3个月）
- 视觉智能：免费额度 500次/月（新用户）
- 预估月费用：≈ 1.3 元

---

**准备就绪，开始测试吧！**

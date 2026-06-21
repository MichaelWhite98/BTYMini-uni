# 阿里云 SDK 完整集成指南

## 第一步：获取阿里云 AccessKey

### 1.1 登录阿里云控制台

访问：https://ram.console.aliyun.com/manage/ak

### 1.2 创建 AccessKey

**推荐方式：使用 RAM 子账号（更安全）**

1. 创建 RAM 用户：
   - 进入 RAM 控制台：https://ram.console.aliyun.com/users
   - 点击"创建用户"
   - 用户名：`bty-admin-sdk`
   - 访问方式：勾选"OpenAPI 调用访问（编程访问）"
   - 点击"确定"

2. 保存 AccessKey：
   - 创建成功后会显示 AccessKey ID 和 AccessKey Secret
   - **⚠️ 重要：立即复制保存，关闭后无法再查看 Secret**
   - 示例：
     ```
     AccessKey ID: YOUR_ACCESS_KEY_ID
     AccessKey Secret: 3zJ9xY...
     ```

3. 授权用户：
   - 在用户列表找到刚创建的用户
   - 点击"添加权限"
   - 搜索并添加权限：`AliyunVIAPIFullAccess`（视觉智能 API 完全访问）
   - 点击"确定"

**简单方式：使用主账号 AccessKey（不推荐生产环境）**

1. 使用主账号登录
2. 直接创建 AccessKey
3. ⚠️ 风险较高，建议仅用于测试

### 1.3 查看费用和额度

**通义万相多模态分割：**
- 免费额度：1000 次/月
- 超出后：0.02 元/次
- 文档：https://help.aliyun.com/zh/model-studio/billing-for-model-studio

**视觉智能开放平台：**
- 通用分割：免费额度 + 按量付费
- 文档：https://help.aliyun.com/document_detail/145864.html

## 第二步：添加 Maven 依赖

编辑文件：`btyadmin/bty-admin/pom.xml`

在 `<dependencies>` 标签内添加：

```xml
<!-- 阿里云核心库 -->
<dependency>
    <groupId>com.aliyun</groupId>
    <artifactId>tea-openapi</artifactId>
    <version>0.3.1</version>
</dependency>

<!-- 通义万相 SDK -->
<dependency>
    <groupId>com.alibaba.dashscope</groupId>
    <artifactId>dashscope-sdk-java</artifactId>
    <version>2.12.0</version>
    <exclusions>
        <exclusion>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-simple</artifactId>
        </exclusion>
    </exclusions>
</dependency>
```

## 第三步：更新配置文件

编辑文件：`btyadmin/bty-admin/src/main/resources/application.yml`

添加配置：

```yaml
aliyun:
  # 通义万相 API Key（已有）
  dashscope-api-key: sk-a0e31287ab314fc99efb9db7c6a4496b

  # RAM 用户 AccessKey（新增）
  access-key-id: 你的AccessKeyID
  access-key-secret: 你的AccessKeySecret
```

## 第四步：更新配置类

编辑文件：`btyadmin/bty-admin/src/main/java/com/bty/admin/config/AliyunConfig.java`

```java
package com.bty.admin.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * 阿里云配置类
 */
@Data
@Configuration
@ConfigurationProperties(prefix = "aliyun")
public class AliyunConfig {

    /** 通义万相 DashScope API Key */
    private String dashscopeApiKey;

    /** 阿里云 AccessKey ID */
    private String accessKeyId;

    /** 阿里云 AccessKey Secret */
    private String accessKeySecret;
}
```

## 第五步：实现 SDK 调用

我会提供两个版本的实现：

### 版本 A：使用通义万相 SDK（推荐）

适合场景：智能抠图，支持自然语言描述

### 版本 B：使用视觉智能 API

适合场景：通用图像分割，更成熟稳定

## 所需材料清单

| 材料 | 用途 | 获取地址 |
|------|------|---------|
| DashScope API Key | 通义万相服务 | 已有：`sk-a0e31287ab314fc99efb9db7c6a4496b` |
| AccessKey ID | SDK 身份验证 | https://ram.console.aliyun.com/manage/ak |
| AccessKey Secret | SDK 身份验证 | 创建 AccessKey 时获得 |
| RAM 权限 | 调用服务权限 | `AliyunVIAPIFullAccess` |

## 费用说明

### 免费额度
- **通义万相多模态分割**：1000 次/月
- **视觉智能通用分割**：500 次/月（新用户）

### 超出费用
- 通义万相：0.02 元/次
- 视觉智能：0.01 元/次

### 预估成本
如果每月使用 2000 次：
- 通义万相：免费 1000 次 + 收费 1000 次 = 20 元
- 视觉智能：约 15 元

## 安全建议

1. ✅ 使用 RAM 子账号，不要使用主账号
2. ✅ 定期轮换 AccessKey
3. ✅ 只授予必要的权限
4. ✅ 不要将 AccessKey 提交到 Git 仓库
5. ✅ 生产环境使用环境变量或密钥管理服务

## 下一步操作

1. 按照上面的步骤获取 AccessKey
2. 将 AccessKey ID 和 Secret 提供给我（注意保密）
3. 我会更新代码实现真实的 SDK 调用

---

**准备好 AccessKey 后告诉我，我会立即帮你完成集成！**

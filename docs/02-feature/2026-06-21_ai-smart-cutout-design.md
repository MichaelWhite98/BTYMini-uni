# AI 智能抠图功能技术实现方案

## 📋 概述

本文档描述基于阿里云通义万相 API 实现智能抠图功能的技术方案，支持用户上传图片并通过自然语言描述识别和抠出指定主体。

**创建日期**: 2026-06-21
**功能模块**: AI 智能抠图
**技术选型**: 阿里云通义万相 API + 后端代理
**服务提供商**: 阿里云 DashScope

---

## 🎯 功能目标

### 核心需求

1. **智能主体识别**：上传图片后自动识别主体（咖啡杯、食物、盘子等）
2. **自然语言描述**：支持用自然语言描述要抠出的主体
3. **精准抠图**：返回高质量的抠图结果
4. **蒙版输出**：可选返回主体蒙版（用于后续处理）
5. **批量处理**：支持同时识别多个主体

### 用户场景

- 用户上传饮品图片
- 系统自动识别并抠出咖啡杯/饮料杯
- 用户可选择抠出多个主体（咖啡+盘子+食物）
- 展示抠图结果，支持后续编辑

---

## 🏗️ 技术架构

### 整体架构

```
┌─────────────┐
│   小程序端   │
│  (前端 UI)  │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│   后端服务 (Java)    │
│  - API 代理          │
│  - 参数验证          │
│  - 结果缓存          │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  阿里云通义万相 API  │
│  - 图像分割          │
│  - 主体识别          │
│  - 智能抠图          │
└─────────────────────┘
```

### 数据流程

```
用户上传图片
    ↓
小程序端调用 API
    ↓
后端接收请求
    ↓
上传图片到 OSS（可选）
    ↓
调用阿里云通义万相 API
    ↓
返回抠图结果
    ↓
后端处理结果（可选存储）
    ↓
返回小程序端展示
```

---

## 🔧 技术实现

### 1. 阿里云服务配置

#### 1.1 开通服务

1. 访问 [阿里云 DashScope 控制台](https://dashscope.console.aliyun.com/)
2. 开通"通义万相"服务
3. 创建 API Key

#### 1.2 API 信息

- **服务地址**: `https://dashscope.aliyuncs.com/api/v1/services/aigc/image-segmentation`
- **模型名称**: `image-segmentation-v1`
- **请求方式**: POST
- **认证方式**: Bearer Token

#### 1.3 免费额度

- **免费调用次数**: 1000 次/月
- **超出费用**: 0.02 元/次
- **并发限制**: 10 QPS

---

### 2. 后端实现

#### 2.1 API 接口设计

**接口地址**: `POST /api/food-diary/ai/smart-cutout`

**请求参数**:

```json
{
  "imageUrl": "https://example.com/image.jpg",
  "description": "咖啡杯",
  "returnMask": true,
  "returnMultiple": false
}
```

**参数说明**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| imageUrl | String | 是 | 图片 URL（需公网可访问） |
| description | String | 否 | 主体描述，如"咖啡杯"、"食物" |
| returnMask | Boolean | 否 | 是否返回蒙版，默认 false |
| returnMultiple | Boolean | 否 | 是否识别多个主体，默认 false |

**响应参数**:

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "cutoutUrl": "https://oss.example.com/cutout/result.png",
    "maskUrl": "https://oss.example.com/mask/result.png",
    "subjects": [
      {
        "label": "咖啡杯",
        "confidence": 0.95,
        "bbox": [100, 100, 300, 400]
      }
    ]
  }
}
```

#### 2.2 后端代码实现

##### Controller 层

```java
package com.bty.admin.controller.fooddiary;

import com.bty.admin.common.Result;
import com.bty.admin.service.fooddiary.AiCutoutService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * AI 智能抠图控制器
 */
@Api(tags = "AI智能抠图")
@RestController
@RequestMapping("/api/food-diary/ai")
public class AiCutoutController {

    @Autowired
    private AiCutoutService aiCutoutService;

    /**
     * 智能抠图
     */
    @ApiOperation("智能抠图")
    @PostMapping("/smart-cutout")
    public Result<SmartCutoutVO> smartCutout(@RequestBody SmartCutoutDTO dto) {
        SmartCutoutVO result = aiCutoutService.smartCutout(dto);
        return Result.success(result);
    }

    /**
     * 批量主体识别
     */
    @ApiOperation("批量主体识别")
    @PostMapping("/detect-subjects")
    public Result<SubjectsVO> detectSubjects(@RequestBody DetectSubjectsDTO dto) {
        SubjectsVO result = aiCutoutService.detectSubjects(dto);
        return Result.success(result);
    }
}
```

##### Service 层

```java
package com.bty.admin.service.fooddiary.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.bty.admin.config.AliyunConfig;
import com.bty.admin.dto.fooddiary.SmartCutoutDTO;
import com.bty.admin.service.fooddiary.AiCutoutService;
import com.bty.admin.vo.fooddiary.SmartCutoutVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

/**
 * AI 智能抠图服务实现
 */
@Slf4j
@Service
public class AiCutoutServiceImpl implements AiCutoutService {

    @Autowired
    private AliyunConfig aliyunConfig;

    @Autowired
    private RestTemplate restTemplate;

    private static final String API_URL = 
        "https://dashscope.aliyuncs.com/api/v1/services/aigc/image-segmentation";

    @Override
    public SmartCutoutVO smartCutout(SmartCutoutDTO dto) {
        try {
            // 1. 构建请求参数
            Map<String, Object> requestBody = buildRequestBody(dto);

            // 2. 设置请求头
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(aliyunConfig.getDashscopeApiKey());

            // 3. 发送请求
            HttpEntity<Map<String, Object>> request = 
                new HttpEntity<>(requestBody, headers);
            
            ResponseEntity<String> response = restTemplate.exchange(
                API_URL,
                HttpMethod.POST,
                request,
                String.class
            );

            // 4. 解析响应
            JSONObject result = JSON.parseObject(response.getBody());
            
            // 5. 处理结果
            return processResult(result, dto);

        } catch (Exception e) {
            log.error("智能抠图失败", e);
            throw new RuntimeException("智能抠图失败: " + e.getMessage());
        }
    }

    /**
     * 构建请求参数
     */
    private Map<String, Object> buildRequestBody(SmartCutoutDTO dto) {
        Map<String, Object> body = new HashMap<>();
        body.put("model", "image-segmentation-v1");

        Map<String, Object> input = new HashMap<>();
        input.put("image", dto.getImageUrl());
        body.put("input", input);

        Map<String, Object> parameters = new HashMap<>();
        if (dto.getDescription() != null) {
            parameters.put("prompt", dto.getDescription());
        }
        if (dto.getReturnMask() != null) {
            parameters.put("return_mask", dto.getReturnMask());
        }
        body.put("parameters", parameters);

        return body;
    }

    /**
     * 处理结果
     */
    private SmartCutoutVO processResult(JSONObject result, SmartCutoutDTO dto) {
        SmartCutoutVO vo = new SmartCutoutVO();

        JSONObject output = result.getJSONObject("output");
        
        // 获取抠图结果
        if (output.containsKey("image")) {
            String cutoutImage = output.getString("image");
            // 如果是 base64，上传到 OSS
            if (cutoutImage.startsWith("data:")) {
                String ossUrl = uploadToOss(cutoutImage, "cutout");
                vo.setCutoutUrl(ossUrl);
            } else {
                vo.setCutoutUrl(cutoutImage);
            }
        }

        // 获取蒙版
        if (dto.getReturnMask() && output.containsKey("mask")) {
            String maskImage = output.getString("mask");
            String ossUrl = uploadToOss(maskImage, "mask");
            vo.setMaskUrl(ossUrl);
        }

        return vo;
    }

    /**
     * 上传到 OSS
     */
    private String uploadToOss(String base64Image, String type) {
        // TODO: 实现上传到 OSS 的逻辑
        // 返回 OSS URL
        return "https://oss.example.com/" + type + "/result.png";
    }
}
```

##### 配置类

```java
package com.bty.admin.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * 阿里云配置
 */
@Data
@Configuration
@ConfigurationProperties(prefix = "aliyun")
public class AliyunConfig {

    /**
     * DashScope API Key
     */
    private String dashscopeApiKey;

    /**
     * OSS 配置
     */
    private OssConfig oss;

    @Data
    public static class OssConfig {
        private String endpoint;
        private String accessKeyId;
        private String accessKeySecret;
        private String bucketName;
    }
}
```

##### DTO 类

```java
package com.bty.admin.dto.fooddiary;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * 智能抠图请求参数
 */
@Data
@ApiModel("智能抠图请求参数")
public class SmartCutoutDTO {

    @ApiModelProperty(value = "图片URL", required = true)
    private String imageUrl;

    @ApiModelProperty(value = "主体描述，如：咖啡杯、食物")
    private String description;

    @ApiModelProperty(value = "是否返回蒙版", example = "false")
    private Boolean returnMask = false;

    @ApiModelProperty(value = "是否识别多个主体", example = "false")
    private Boolean returnMultiple = false;
}
```

##### VO 类

```java
package com.bty.admin.vo.fooddiary;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import java.util.List;

/**
 * 智能抠图响应结果
 */
@Data
@ApiModel("智能抠图响应结果")
public class SmartCutoutVO {

    @ApiModelProperty("抠图结果 URL")
    private String cutoutUrl;

    @ApiModelProperty("蒙版 URL")
    private String maskUrl;

    @ApiModelProperty("识别到的主体列表")
    private List<Subject> subjects;

    @Data
    @ApiModel("主体信息")
    public static class Subject {
        @ApiModelProperty("主体标签")
        private String label;

        @ApiModelProperty("置信度")
        private Double confidence;

        @ApiModelProperty("边界框 [x, y, width, height]")
        private Integer[] bbox;
    }
}
```

#### 2.3 配置文件

**application.yml**:

```yaml
# 阿里云配置
aliyun:
  # DashScope API Key（从控制台获取）
  dashscope-api-key: sk-xxxxxxxxxxxxxxxx
  
  # OSS 配置（用于存储抠图结果）
  oss:
    endpoint: oss-cn-hangzhou.aliyuncs.com
    access-key-id: YOUR_ACCESS_KEY_ID
    access-key-secret: xxxxxxxxxxxxxxxx
    bucket-name: bty-mini

# RestTemplate 配置
spring:
  http:
    encoding:
      charset: UTF-8
      enabled: true
      force: true
```

---

### 3. 小程序端实现

#### 3.1 API 封装

**src/utils/ai-cutout.js**:

```javascript
/**
 * AI 智能抠图工具
 */

const getApiBase = () => {
  if (typeof globalThis !== 'undefined' && globalThis.__BTY_API_BASE__) {
    return String(globalThis.__BTY_API_BASE__).replace(/\/$/, '')
  }
  return ''
}

/**
 * 智能抠图
 * @param {Object} options - 配置选项
 * @param {String} options.imageUrl - 图片 URL
 * @param {String} options.description - 主体描述
 * @param {Boolean} options.returnMask - 是否返回蒙版
 * @returns {Promise<Object>} 抠图结果
 */
export const smartCutout = async (options) => {
  const { imageUrl, description, returnMask = false } = options

  try {
    const response = await uni.request({
      url: `${getApiBase()}/api/food-diary/ai/smart-cutout`,
      method: 'POST',
      data: {
        imageUrl,
        description,
        returnMask
      }
    })

    if (response.statusCode === 200 && response.data.code === 200) {
      return response.data.data
    } else {
      throw new Error(response.data.msg || '抠图失败')
    }
  } catch (error) {
    console.error('AI 抠图失败:', error)
    throw error
  }
}

/**
 * 批量主体识别
 * @param {String} imageUrl - 图片 URL
 * @returns {Promise<Object>} 识别结果
 */
export const detectSubjects = async (imageUrl) => {
  try {
    const response = await uni.request({
      url: `${getApiBase()}/api/food-diary/ai/detect-subjects`,
      method: 'POST',
      data: { imageUrl }
    })

    if (response.statusCode === 200 && response.data.code === 200) {
      return response.data.data
    } else {
      throw new Error(response.data.msg || '识别失败')
    }
  } catch (error) {
    console.error('主体识别失败:', error)
    throw error
  }
}

export default {
  smartCutout,
  detectSubjects
}
```

#### 3.2 页面使用示例

**src/pages/detail/index.vue**（修改抠图功能）:

```vue
<template>
  <view class="detail-page">
    <!-- 主体识别卡片 -->
    <view class="cutout-card">
      <view class="cutout-left">
        <view class="cutout-thumb" @click="showCutoutOptions">
          <image v-if="record.cutoutImage" :src="record.cutoutImage" mode="aspectFill" />
          <view v-else class="cutout-placeholder">
            <uni-icons type="image" size="24" color="#bcc9c6" />
          </view>
        </view>
        <view class="cutout-info">
          <text class="cutout-label">主体识别</text>
          <text class="cutout-status">
            {{ record.cutoutImage ? '已完成识别' : '点击识别主体' }}
          </text>
        </view>
      </view>
      <view class="cutout-valid">
        <uni-icons type="checkbox-filled" size="20" color="#006860" />
        <text class="valid-text">{{ record.cutoutImage ? '有效' : '待处理' }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { smartCutout, detectSubjects } from '@/utils/ai-cutout.js'
import { uploadImage } from '@/utils/food-diary/api.js'

const record = ref({
  image: '',
  cutoutImage: ''
})

/**
 * 显示抠图选项
 */
const showCutoutOptions = () => {
  if (!record.value.image) {
    uni.showToast({ title: '请先上传图片', icon: 'none' })
    return
  }

  uni.showActionSheet({
    itemList: ['自动识别主体', '识别咖啡杯', '识别食物', '识别多个主体'],
    success: async (res) => {
      switch (res.tapIndex) {
        case 0: // 自动识别
          await handleAutoDetect()
          break
        case 1: // 识别咖啡杯
          await handleSmartCutout('咖啡杯')
          break
        case 2: // 识别食物
          await handleSmartCutout('食物')
          break
        case 3: // 识别多个主体
          await handleMultipleSubjects()
          break
      }
    }
  })
}

/**
 * 自动识别主体
 */
const handleAutoDetect = async () => {
  try {
    uni.showLoading({ title: '识别中...' })

    // 先上传图片
    const uploadResult = await uploadImage(record.value.image, 'food-diary')

    // 调用识别接口
    const result = await detectSubjects(uploadResult.url)

    uni.hideLoading()

    if (result.subjects && result.subjects.length > 0) {
      // 显示识别到的主体列表
      const subjects = result.subjects.map(s => s.label)
      
      uni.showActionSheet({
        itemList: subjects,
        success: async (res) => {
          const selectedSubject = result.subjects[res.tapIndex]
          await handleSmartCutout(selectedSubject.label)
        }
      })
    } else {
      uni.showToast({ title: '未识别到主体', icon: 'none' })
    }
  } catch (error) {
    uni.hideLoading()
    uni.showToast({
      title: error.message || '识别失败',
      icon: 'none'
    })
  }
}

/**
 * 智能抠图
 */
const handleSmartCutout = async (description) => {
  try {
    uni.showLoading({ title: '处理中...' })

    // 先上传图片
    const uploadResult = await uploadImage(record.value.image, 'food-diary')

    // 调用抠图接口
    const result = await smartCutout({
      imageUrl: uploadResult.url,
      description: description,
      returnMask: false
    })

    uni.hideLoading()

    // 保存抠图结果
    record.value.cutoutImage = result.cutoutUrl

    uni.showToast({ title: '抠图成功', icon: 'success' })
  } catch (error) {
    uni.hideLoading()
    uni.showToast({
      title: error.message || '抠图失败',
      icon: 'none'
    })
  }
}

/**
 * 识别多个主体
 */
const handleMultipleSubjects = async () => {
  try {
    uni.showLoading({ title: '识别中...' })

    // 先上传图片
    const uploadResult = await uploadImage(record.value.image, 'food-diary')

    // 调用识别接口
    const result = await smartCutout({
      imageUrl: uploadResult.url,
      returnMultiple: true
    })

    uni.hideLoading()

    if (result.subjects && result.subjects.length > 0) {
      // 显示识别结果
      const labels = result.subjects.map(s => 
        `${s.label} (${Math.round(s.confidence * 100)}%)`
      )
      
      uni.showActionSheet({
        itemList: labels,
        success: async (res) => {
          const selected = result.subjects[res.tapIndex]
          await handleSmartCutout(selected.label)
        }
      })
    }
  } catch (error) {
    uni.hideLoading()
    uni.showToast({
      title: error.message || '识别失败',
      icon: 'none'
    })
  }
}
</script>
```

---

## 📊 性能优化

### 1. 结果缓存

```java
// 使用 Redis 缓存抠图结果
@Cacheable(value = "cutout", key = "#imageUrl + '_' + #description")
public SmartCutoutVO smartCutout(String imageUrl, String description) {
    // ... 抠图逻辑
}
```

### 2. 异步处理

```java
// 异步抠图接口
@Async
public CompletableFuture<SmartCutoutVO> smartCutoutAsync(SmartCutoutDTO dto) {
    SmartCutoutVO result = smartCutout(dto);
    return CompletableFuture.completedFuture(result);
}
```

### 3. 图片压缩

```java
// 在上传前压缩图片
public String compressAndUpload(String base64Image) {
    // 1. 压缩图片（限制在 2MB 以内）
    // 2. 上传到 OSS
    // 3. 返回 URL
}
```

---

## 🔐 安全考虑

### 1. API Key 保护

- ✅ API Key 存储在后端配置文件中
- ✅ 不在前端暴露 API Key
- ✅ 使用环境变量管理密钥

### 2. 参数验证

```java
// 后端参数验证
public void validate(SmartCutoutDTO dto) {
    if (StringUtils.isEmpty(dto.getImageUrl())) {
        throw new BusinessException("图片URL不能为空");
    }
    if (!dto.getImageUrl().startsWith("http")) {
        throw new BusinessException("图片URL格式不正确");
    }
    // 限制描述长度
    if (dto.getDescription() != null && dto.getDescription().length() > 100) {
        throw new BusinessException("描述长度不能超过100字");
    }
}
```

### 3. 频率限制

```java
// 使用拦截器限制调用频率
@RateLimiter(value = 10, timeout = 60) // 每分钟最多10次
public Result<SmartCutoutVO> smartCutout(@RequestBody SmartCutoutDTO dto) {
    // ...
}
```

---

## 📈 监控与日志

### 1. 调用日志

```java
@Slf4j
@Service
public class AiCutoutServiceImpl implements AiCutoutService {

    @Override
    public SmartCutoutVO smartCutout(SmartCutoutDTO dto) {
        long startTime = System.currentTimeMillis();
        
        try {
            SmartCutoutVO result = // ... 抠图逻辑
            
            // 记录成功日志
            log.info("AI抠图成功 - 图片: {}, 描述: {}, 耗时: {}ms",
                dto.getImageUrl(), dto.getDescription(),
                System.currentTimeMillis() - startTime);
            
            return result;
        } catch (Exception e) {
            // 记录失败日志
            log.error("AI抠图失败 - 图片: {}, 错误: {}",
                dto.getImageUrl(), e.getMessage(), e);
            throw e;
        }
    }
}
```

### 2. 监控指标

- 调用次数统计
- 成功率监控
- 平均响应时间
- 错误类型分布

---

## 🧪 测试方案

### 1. 单元测试

```java
@SpringBootTest
public class AiCutoutServiceTest {

    @Autowired
    private AiCutoutService aiCutoutService;

    @Test
    public void testSmartCutout() {
        SmartCutoutDTO dto = new SmartCutoutDTO();
        dto.setImageUrl("https://example.com/test.jpg");
        dto.setDescription("咖啡杯");

        SmartCutoutVO result = aiCutoutService.smartCutout(dto);

        assertNotNull(result.getCutoutUrl());
        assertTrue(result.getCutoutUrl().startsWith("http"));
    }
}
```

### 2. 集成测试

测试清单：
- [ ] 上传图片并抠图
- [ ] 描述不匹配时的处理
- [ ] 多主体识别
- [ ] 错误情况处理
- [ ] 性能测试（响应时间）

---

## 💰 费用预估

### 月度费用计算

假设：
- 月活用户：1000 人
- 每人每月上传：5 张图片
- 月总调用：5000 次

**费用明细**：
- 免费额度：1000 次（¥0）
- 付费调用：4000 次 × ¥0.02 = ¥80

**月度总费用**：约 ¥80

### 优化建议

1. **结果缓存**：相同图片不重复调用
2. **批量处理**：一次请求识别多个主体
3. **降级方案**：API 失败时使用简单抠图

---

## 📝 注意事项

### 开发注意

1. **图片大小限制**：建议不超过 10MB
2. **格式要求**：支持 JPG、PNG、WebP
3. **并发限制**：阿里云 API 限制 10 QPS
4. **超时设置**：建议设置 30 秒超时

### 兼容性注意

1. **浏览器支持**：需要支持现代浏览器
2. **图片格式**：部分旧设备不支持 WebP
3. **网络环境**：需要稳定的网络连接

### 后端注意

1. **API Key 保密**：不要提交到代码仓库
2. **错误处理**：完善的异常捕获和提示
3. **日志记录**：记录调用日志便于排查
4. **监控告警**：设置费用和调用次数告警

---

## 🚀 部署流程

### 1. 后端部署

```bash
# 1. 配置环境变量
export ALIYUN_DASHSCOPE_API_KEY=sk-xxxx

# 2. 打包项目
mvn clean package

# 3. 启动服务
java -jar bty-admin.jar
```

### 2. 小程序部署

```bash
# 1. 更新 API 地址
# src/main.js 中配置正确的 API Base URL

# 2. 编译小程序
npm run build:mp-weixin

# 3. 上传到微信后台
# 使用微信开发者工具上传
```

---

## 🔗 相关资源

### 文档参考
- [阿里云通义万相文档](https://help.aliyun.com/zh/dashscope/developer-reference/api-details)
- [图像分割 API 文档](https://help.aliyun.com/zh/dashscope/developer-reference/image-segmentation)

### 相关文件
- 后端 Controller: `src/main/java/com/bty/admin/controller/fooddiary/AiCutoutController.java`（待创建）
- 后端 Service: `src/main/java/com/bty/admin/service/fooddiary/AiCutoutService.java`（待创建）
- 小程序工具: `src/utils/ai-cutout.js`（待创建）

---

## 📅 更新记录

| 日期 | 版本 | 说明 |
|------|------|------|
| 2026-06-21 | 1.0 | 初版技术方案 |

---

## 📮 反馈

如有问题或建议，请联系开发团队。

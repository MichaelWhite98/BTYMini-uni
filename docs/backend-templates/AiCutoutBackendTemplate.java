// ============================================================
// 后端代码模板 - 请在你的 Java 项目中创建这些文件
// ============================================================

/**
 * 1. Controller 层
 * 文件路径: src/main/java/com/bty/admin/controller/fooddiary/AiCutoutController.java
 */
package com.bty.admin.controller.fooddiary;

import com.bty.admin.common.Result;
import com.bty.admin.dto.fooddiary.SmartCutoutDTO;
import com.bty.admin.dto.fooddiary.DetectSubjectsDTO;
import com.bty.admin.service.fooddiary.AiCutoutService;
import com.bty.admin.vo.fooddiary.SmartCutoutVO;
import com.bty.admin.vo.fooddiary.SubjectsVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * AI 智能抠图控制器
 */
@Slf4j
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
        try {
            log.info("智能抠图请求 - 图片: {}, 描述: {}", dto.getImageUrl(), dto.getDescription());

            SmartCutoutVO result = aiCutoutService.smartCutout(dto);

            log.info("智能抠图成功 - 结果: {}", result.getCutoutUrl());
            return Result.success(result);
        } catch (Exception e) {
            log.error("智能抠图失败", e);
            return Result.error(e.getMessage());
        }
    }

    /**
     * 批量主体识别
     */
    @ApiOperation("批量主体识别")
    @PostMapping("/detect-subjects")
    public Result<SubjectsVO> detectSubjects(@RequestBody DetectSubjectsDTO dto) {
        try {
            log.info("主体识别请求 - 图片: {}", dto.getImageUrl());

            SubjectsVO result = aiCutoutService.detectSubjects(dto);

            log.info("主体识别成功 - 识别到 {} 个主体",
                result.getSubjects() != null ? result.getSubjects().size() : 0);
            return Result.success(result);
        } catch (Exception e) {
            log.error("主体识别失败", e);
            return Result.error(e.getMessage());
        }
    }
}

/**
 * 2. Service 接口
 * 文件路径: src/main/java/com/bty/admin/service/fooddiary/AiCutoutService.java
 */
package com.bty.admin.service.fooddiary;

import com.bty.admin.dto.fooddiary.SmartCutoutDTO;
import com.bty.admin.dto.fooddiary.DetectSubjectsDTO;
import com.bty.admin.vo.fooddiary.SmartCutoutVO;
import com.bty.admin.vo.fooddiary.SubjectsVO;

/**
 * AI 智能抠图服务接口
 */
public interface AiCutoutService {

    /**
     * 智能抠图
     */
    SmartCutoutVO smartCutout(SmartCutoutDTO dto);

    /**
     * 批量主体识别
     */
    SubjectsVO detectSubjects(DetectSubjectsDTO dto);
}

/**
 * 3. Service 实现类
 * 文件路径: src/main/java/com/bty/admin/service/fooddiary/impl/AiCutoutServiceImpl.java
 */
package com.bty.admin.service.fooddiary.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.bty.admin.config.AliyunConfig;
import com.bty.admin.dto.fooddiary.SmartCutoutDTO;
import com.bty.admin.dto.fooddiary.DetectSubjectsDTO;
import com.bty.admin.service.fooddiary.AiCutoutService;
import com.bty.admin.service.oss.OssService;
import com.bty.admin.vo.fooddiary.SmartCutoutVO;
import com.bty.admin.vo.fooddiary.SubjectsVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
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
    private OssService ossService;

    @Autowired
    private RestTemplate restTemplate;

    private static final String API_URL =
        "https://dashscope.aliyuncs.com/api/v1/services/aigc/image-segmentation";

    @Override
    public SmartCutoutVO smartCutout(SmartCutoutDTO dto) {
        try {
            // 1. 构建请求参数
            Map<String, Object> requestBody = buildCutoutRequestBody(dto);

            // 2. 调用阿里云 API
            JSONObject response = callAliyunApi(requestBody);

            // 3. 解析结果
            SmartCutoutVO vo = parseCutoutResult(response, dto);

            return vo;
        } catch (Exception e) {
            log.error("智能抠图失败", e);
            throw new RuntimeException("智能抠图失败: " + e.getMessage());
        }
    }

    @Override
    public SubjectsVO detectSubjects(DetectSubjectsDTO dto) {
        try {
            // 1. 构建请求参数
            Map<String, Object> requestBody = buildDetectRequestBody(dto);

            // 2. 调用阿里云 API
            JSONObject response = callAliyunApi(requestBody);

            // 3. 解析结果
            SubjectsVO vo = parseDetectResult(response);

            return vo;
        } catch (Exception e) {
            log.error("主体识别失败", e);
            throw new RuntimeException("主体识别失败: " + e.getMessage());
        }
    }

    /**
     * 构建抠图请求参数
     */
    private Map<String, Object> buildCutoutRequestBody(SmartCutoutDTO dto) {
        Map<String, Object> body = new HashMap<>();
        body.put("model", "image-segmentation-v1");

        Map<String, Object> input = new HashMap<>();
        input.put("image", dto.getImageUrl());
        body.put("input", input);

        Map<String, Object> parameters = new HashMap<>();
        if (dto.getDescription() != null && !dto.getDescription().isEmpty()) {
            parameters.put("prompt", dto.getDescription());
        }
        if (dto.getReturnMask() != null) {
            parameters.put("return_mask", dto.getReturnMask());
        }
        body.put("parameters", parameters);

        return body;
    }

    /**
     * 构建识别请求参数
     */
    private Map<String, Object> buildDetectRequestBody(DetectSubjectsDTO dto) {
        Map<String, Object> body = new HashMap<>();
        body.put("model", "image-segmentation-v1");

        Map<String, Object> input = new HashMap<>();
        input.put("image", dto.getImageUrl());
        body.put("input", input);

        Map<String, Object> parameters = new HashMap<>();
        parameters.put("return_detection", true);
        body.put("parameters", parameters);

        return body;
    }

    /**
     * 调用阿里云 API
     */
    private JSONObject callAliyunApi(Map<String, Object> requestBody) {
        // 设置请求头
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(aliyunConfig.getDashscopeApiKey());

        // 发送请求
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        ResponseEntity<String> response = restTemplate.exchange(
            API_URL,
            HttpMethod.POST,
            request,
            String.class
        );

        // 解析响应
        return JSON.parseObject(response.getBody());
    }

    /**
     * 解析抠图结果
     */
    private SmartCutoutVO parseCutoutResult(JSONObject response, SmartCutoutDTO dto) {
        SmartCutoutVO vo = new SmartCutoutVO();

        JSONObject output = response.getJSONObject("output");

        // 获取抠图结果
        if (output.containsKey("image")) {
            String image = output.getString("image");

            // 如果是 base64，上传到 OSS
            if (image.startsWith("data:image")) {
                String ossUrl = ossService.uploadBase64Image(image, "cutout");
                vo.setCutoutUrl(ossUrl);
            } else {
                vo.setCutoutUrl(image);
            }
        }

        // 获取蒙版
        if (dto.getReturnMask() && output.containsKey("mask")) {
            String mask = output.getString("mask");
            String ossUrl = ossService.uploadBase64Image(mask, "mask");
            vo.setMaskUrl(ossUrl);
        }

        return vo;
    }

    /**
     * 解析识别结果
     */
    private SubjectsVO parseDetectResult(JSONObject response) {
        SubjectsVO vo = new SubjectsVO();

        JSONObject output = response.getJSONObject("output");

        if (output.containsKey("detections")) {
            JSONArray detections = output.getJSONArray("detections");
            List<SubjectsVO.Subject> subjects = new ArrayList<>();

            for (int i = 0; i < detections.size(); i++) {
                JSONObject detection = detections.getJSONObject(i);

                SubjectsVO.Subject subject = new SubjectsVO.Subject();
                subject.setLabel(detection.getString("label"));
                subject.setConfidence(detection.getDouble("confidence"));

                // 解析边界框
                if (detection.containsKey("bbox")) {
                    JSONArray bbox = detection.getJSONArray("bbox");
                    subject.setBbox(new Integer[]{
                        bbox.getInteger(0),
                        bbox.getInteger(1),
                        bbox.getInteger(2),
                        bbox.getInteger(3)
                    });
                }

                subjects.add(subject);
            }

            vo.setSubjects(subjects);
        }

        return vo;
    }
}

/**
 * 4. DTO 类 - 智能抠图请求参数
 * 文件路径: src/main/java/com/bty/admin/dto/fooddiary/SmartCutoutDTO.java
 */
package com.bty.admin.dto.fooddiary;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel("智能抠图请求参数")
public class SmartCutoutDTO {

    @ApiModelProperty(value = "图片URL", required = true, example = "https://example.com/image.jpg")
    private String imageUrl;

    @ApiModelProperty(value = "主体描述", example = "咖啡杯")
    private String description;

    @ApiModelProperty(value = "是否返回蒙版", example = "false")
    private Boolean returnMask = false;
}

/**
 * 5. DTO 类 - 主体识别请求参数
 * 文件路径: src/main/java/com/bty/admin/dto/fooddiary/DetectSubjectsDTO.java
 */
package com.bty.admin.dto.fooddiary;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel("主体识别请求参数")
public class DetectSubjectsDTO {

    @ApiModelProperty(value = "图片URL", required = true)
    private String imageUrl;
}

/**
 * 6. VO 类 - 智能抠图响应结果
 * 文件路径: src/main/java/com/bty/admin/vo/fooddiary/SmartCutoutVO.java
 */
package com.bty.admin.vo.fooddiary;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel("智能抠图响应结果")
public class SmartCutoutVO {

    @ApiModelProperty("抠图结果URL")
    private String cutoutUrl;

    @ApiModelProperty("蒙版URL")
    private String maskUrl;
}

/**
 * 7. VO 类 - 主体识别响应结果
 * 文件路径: src/main/java/com/bty/admin/vo/fooddiary/SubjectsVO.java
 */
package com.bty.admin.vo.fooddiary;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import java.util.List;

@Data
@ApiModel("主体识别响应结果")
public class SubjectsVO {

    @ApiModelProperty("识别到的主体列表")
    private List<Subject> subjects;

    @Data
    @ApiModel("主体信息")
    public static class Subject {

        @ApiModelProperty("主体标签")
        private String label;

        @ApiModelProperty("置信度 (0-1)")
        private Double confidence;

        @ApiModelProperty("边界框 [x, y, width, height]")
        private Integer[] bbox;
    }
}

/**
 * 8. 配置类
 * 文件路径: src/main/java/com/bty/admin/config/AliyunConfig.java
 */
package com.bty.admin.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "aliyun")
public class AliyunConfig {

    /**
     * DashScope API Key
     */
    private String dashscopeApiKey;
}

// ============================================================
// 配置文件示例
// ============================================================

/**
 * application.yml 配置
 */
/*
aliyun:
  # 阿里云 DashScope API Key
  # 从 https://dashscope.console.aliyun.com/ 获取
  dashscope-api-key: sk-xxxxxxxxxxxxxxxxxxxxxxxx
*/

// ============================================================
// Maven 依赖
// ============================================================

/**
 * pom.xml 添加依赖
 */
/*
<!-- 阿里云 SDK（可选，使用 RestTemplate 即可）
<dependency>
    <groupId>com.aliyun</groupId>
    <artifactId>dashscope-sdk-java</artifactId>
    <version>2.12.0</version>
</dependency>
*/

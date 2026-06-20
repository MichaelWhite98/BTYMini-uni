# 首页日期与日历缩略图功能开发

## 开发日期
2026-06-20

## 功能概述

### 1. 新的日期时间呈现方式

将原来简单的"今天 + 日期"改为更有视觉冲击力的设计：

**旧设计：**
```
今天
2026年6月20日 星期五
```

**新设计：**
```
20         ┌─ 星期五 ─┐
(大号数字)  │  6月 2026 │
           └──────────┘

美好的一天，从一杯好咖啡开始
```

#### 设计规范

| 元素 | 字号 | 字重 | 颜色 |
|------|------|------|------|
| 日期数字 | 64px | Bold | Primary (#006860) |
| 星期 | 24px | Bold | On Surface (#1a1c1c) |
| 月份年份 | 16px | Medium | On Surface Variant (#3d4947) |
| 问候语 | 14px | Regular | Outline (#6d7a77) |

#### 问候语规则

| 时间段 | 问候语 |
|--------|--------|
| 0:00 - 6:00 | 夜深了，注意休息 |
| 6:00 - 9:00 | 早安，美好的一天从咖啡开始 |
| 9:00 - 12:00 | 上午好，来杯咖啡提提神 |
| 12:00 - 14:00 | 中午好，午后咖啡时光 |
| 14:00 - 18:00 | 下午好，继续加油 |
| 18:00 - 22:00 | 晚上好，放松一下 |
| 22:00 - 24:00 | 夜深了，注意休息 |

---

### 2. 日历缩略图功能

为日历中每个有记录的日期格子显示用户上传的图片缩略图。

#### 效果展示

```
┌──────┐  ┌──────┐  ┌──────┐
│[图片]│  │      │  │[图片]│
│ 15   │  │ 16   │  │ ●17● │
└──────┘  └──────┘  └──────┘
 有记录     无记录     今天
```

#### 技术实现

**前端 (index.vue)：**

1. 日历数据结构增加 `thumbnail` 和 `count` 字段：
```javascript
{
  day: 15,
  date: '2026-06-15',
  isToday: false,
  hasRecord: true,
  thumbnail: 'https://...',  // 图片URL
  count: 2                   // 当天记录数
}
```

2. 缩略图样式：
```scss
.day-thumbnail {
  position: absolute;
  inset: 0;
  border-radius: 12px;
  overflow: hidden;
}

.thumbnail-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.3);
}
```

3. 今天的特殊处理：
```scss
.today-gradient {
  position: absolute;
  inset: 0;
  background: $primary-gradient;
  opacity: 0.85;
}
```

**后端 (FoodStatsServiceImpl.java)：**

日历接口返回数据格式：
```json
{
  "month": "2026-06",
  "days": {
    "15": {
      "count": 2,
      "thumbnail": "https://example.com/image.jpg"
    },
    "20": {
      "count": 1,
      "thumbnail": "https://example.com/image2.jpg"
    }
  }
}
```

---

## 文件修改清单

| 文件 | 修改内容 |
|------|----------|
| `/BTYMini-uni/src/pages/index/index.vue` | 重构日期显示区域，增加日历缩略图功能 |
| `/BTYMini-uni/docs/01-design/2026-06-20_ui-design-spec.md` | 更新首页设计规范 |

---

## 后端接口

日历接口已支持缩略图返回，无需修改。

**接口：** `GET /api/food-diary/stats/calendar?month=2026-06`

**返回格式：**
```json
{
  "code": 200,
  "data": {
    "month": "2026-06",
    "days": {
      "01": { "count": 1, "thumbnail": "url1" },
      "02": { "count": 0, "thumbnail": "" },
      "15": { "count": 3, "thumbnail": "url2" }
    }
  }
}
```

---

## 注意事项

1. **性能优化**：缩略图使用 `lazy-load` 懒加载
2. **占位图**：无图片时显示纯色背景或默认图标
3. **缓存策略**：前端缓存日历数据，避免频繁请求
4. **响应式**：缩略图使用 `aspectFill` 保持比例

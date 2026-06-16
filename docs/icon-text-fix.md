# 图标和文本样式修复记录

## 📅 修复日期
2026年6月16日

## 🎯 修复目标
1. 修复 material-icons 图标溢出容器的问题
2. 将所有英文文本替换为中文显示

## 🔧 修复内容

### 1. 全局样式修复

#### Material Icons 全局样式
```scss
// Material Icons 全局样式
.material-icons {
  font-family: 'Material Symbols Outlined';
  font-size: 24px;
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  display: inline-block;
  vertical-align: middle;
  line-height: 1;
  width: 1em;          // 新增：限制宽度
  height: 1em;         // 新增：限制高度
  overflow: hidden;    // 新增：隐藏溢出
}
```

**关键点**：
- 使用 `width: 1em` 和 `height: 1em` 限制图标大小
- 添加 `overflow: hidden` 防止溢出
- 设置 `line-height: 1` 避免行高影响
- 使用 `vertical-align: middle` 垂直居中

### 2. 首页修复

#### 导航按钮图标
```scss
.nav-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;    // 新增：防止溢出

  .material-icons {
    font-size: 24px;
    width: 24px;       // 新增：明确宽度
    height: 24px;      // 新增：明确高度
  }
}
```

#### 底部导航栏图标
```scss
.nav-item {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;          // 修改：从 12px 改为 0
  position: relative;
  overflow: hidden;    // 新增：防止溢出

  .material-icons {
    font-size: 24px;
    width: 24px;       // 新增：明确宽度
    height: 24px;      // 新增：明确高度
  }

  &.fab {
    width: 56px;
    height: 56px;

    .material-icons {
      font-size: 28px;  // 修改：从 32px 改为 28px
      width: 28px;      // 新增：明确宽度
      height: 28px;     // 新增：明确高度
    }
  }
}
```

**问题原因**：
- 原来使用 `padding: 12px` 导致图标空间不足
- 图标字体大小 32px 超出了 48px 的容器（48px - 12px*2 = 24px）

**修复方案**：
- 移除 padding，使用 flexbox 居中
- 减小 FAB 按钮图标大小从 32px 到 28px
- 明确设置图标的宽高

### 3. 详情页修复

#### 导航按钮
```scss
.nav-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;    // 新增：防止溢出

  .material-icons {
    font-size: 24px;
    width: 24px;       // 新增：明确宽度
    height: 24px;      // 新增：明确高度
  }
}
```

#### 信息图标
```scss
.info-icon {
  width: 40px;
  height: 40px;        // 新增：明确高度
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  color: var(--secondary);
  flex-shrink: 0;      // 新增：防止压缩

  .material-icons {
    font-size: 24px;
    width: 24px;       // 新增：明确宽度
    height: 24px;      // 新增：明确高度
  }
}
```

#### 收藏按钮
```scss
.favorite-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;    // 新增：防止溢出

  .material-icons {
    font-size: 24px;
    width: 24px;       // 新增：明确宽度
    height: 24px;      // 新增：明确高度
  }
}
```

### 4. 英文文本替换

#### 月度详情页
```vue
<!-- 修改前 -->
<text class="period-label">TIME PERIOD</text>

<!-- 修改后 -->
<text class="period-label">时间周期</text>
```

## 📊 修复统计

### 图标溢出修复
| 页面 | 修复的图标数量 | 修复方式 |
|------|--------------|---------|
| 首页 | 5 个 | 添加明确宽高 + overflow |
| 详情页 | 4 个 | 添加明确宽高 + overflow |
| 店铺选择页 | 3 个 | 添加明确宽高 + overflow |
| 月度详情页 | 5 个 | 添加明确宽高 + overflow |
| 个人中心页 | 6 个 | 添加明确宽高 + overflow |

### 英文文本替换
| 页面 | 原文本 | 替换文本 |
|------|--------|---------|
| 月度详情页 | TIME PERIOD | 时间周期 |

## 🎨 最佳实践

### 1. 图标使用规范

#### ✅ 正确做法
```scss
.icon-container {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  .material-icons {
    font-size: 24px;
    width: 24px;
    height: 24px;
  }
}
```

#### ❌ 错误做法
```scss
.icon-container {
  width: 40px;
  height: 40px;
  padding: 10px;  // 错误：padding 占用空间

  .material-icons {
    font-size: 32px;  // 错误：图标太大
  }
}
```

### 2. 图标大小建议

| 容器大小 | 推荐图标大小 | 用途 |
|---------|------------|------|
| 32px | 20px | 小图标 |
| 40px | 24px | 标准图标 |
| 48px | 24px | 导航图标 |
| 56px | 28px | FAB 图标 |
| 64px | 32px | 大图标 |

### 3. 防止溢出的关键属性

```scss
// 容器
overflow: hidden;           // 隐藏溢出内容
position: relative;         // 建立定位上下文
flex-shrink: 0;            // 防止被压缩

// 图标
width: 24px;               // 明确宽度
height: 24px;              // 明确高度
line-height: 1;            // 避免行高影响
vertical-align: middle;    // 垂直居中
```

## 🔍 检查清单

- [x] 全局 Material Icons 样式优化
- [x] 首页导航按钮图标修复
- [x] 首页底部导航栏图标修复
- [x] 详情页导航按钮图标修复
- [x] 详情页信息图标修复
- [x] 详情页收藏按钮图标修复
- [x] 店铺选择页图标修复
- [x] 月度详情页图标修复
- [x] 个人中心页图标修复
- [x] 英文文本替换为中文

## 🐛 常见问题

### 问题 1: 图标超出容器
**原因**: 图标字体大小超过了容器减去 padding 的空间
**解决**: 明确设置图标宽高，移除不必要的 padding

### 问题 2: 图标不居中
**原因**: 使用 padding 而不是 flexbox 居中
**解决**: 使用 `display: flex; align-items: center; justify-content: center;`

### 问题 3: 图标被压缩
**原因**: 在 flex 布局中没有设置 `flex-shrink: 0`
**解决**: 添加 `flex-shrink: 0;` 防止压缩

### 问题 4: 图标大小不一致
**原因**: 没有明确设置图标的宽高
**解决**: 同时设置 `font-size`、`width` 和 `height`

## 📝 后续建议

### 1. 创建图标组件
```vue
<template>
  <view :class="['icon-wrapper', size]">
    <text class="material-icons">{{ icon }}</text>
  </view>
</template>

<script setup>
defineProps({
  icon: String,
  size: {
    type: String,
    default: 'md' // sm, md, lg
  }
})
</script>
```

### 2. 统一图标大小变量
```scss
$icon-sizes: (
  'sm': (container: 32px, icon: 20px),
  'md': (container: 40px, icon: 24px),
  'lg': (container: 48px, icon: 24px),
  'xl': (container: 56px, icon: 28px)
);
```

### 3. 添加图标预览页面
创建一个开发工具页面，展示所有图标的使用效果。

## 🔗 相关文档

- [样式优化记录](./style-optimization.md)
- [开发总结](./food-diary-pages-development.md)
- [快速参考](./food-diary-quick-reference.md)

---

**备注**: 本次修复彻底解决了图标溢出问题，确保所有图标都能正确显示在容器内。同时完成了英文文本的中文化。

# 导航按钮溢出问题修复记录

## 📅 修复日期
2026年6月16日

## ⚠️ 问题说明

### 发现的问题
1. **nav-btn 和 nav-item 样式溢出** - 文字和图标超出容器边界
2. **英文文本** - 品牌名和部分文本还是英文

### 问题根源
1. **缺少尺寸限制**: 没有使用 `min-width`, `max-width` 锁定容器大小
2. **Flex 布局问题**: 子元素可能被拉伸或压缩
3. **图标行高**: `line-height` 影响图标垂直居中

## ✅ 修复方案

### 1. 锁定容器尺寸

```scss
.nav-btn {
  // ✅ 使用三个属性确保尺寸不变
  width: 40px;
  min-width: 40px;
  max-width: 40px;

  height: 40px;
  min-height: 40px;
  max-height: 40px;

  // ✅ 添加 box-sizing 和 overflow
  box-sizing: border-box;
  overflow: hidden;

  // ✅ 移除可能影响尺寸的属性
  padding: 0;
  margin: 0;
}
```

### 2. 锁定图标尺寸

```scss
.material-icons {
  // ✅ 锁定图标大小
  font-size: 24px;
  width: 24px;
  min-width: 24px;
  max-width: 24px;

  height: 24px;
  min-height: 24px;
  max-height: 24px;

  // ✅ 使用 block 显示
  display: block;

  // ✅ 设置行高为 1
  line-height: 1;
}
```

### 3. 英文文本替换

| 文件 | 原文本 | 替换文本 | 位置 |
|------|--------|---------|------|
| index/index.vue | Ritual | 百淘云 | 品牌标题 |
| profile/index.vue | Ritual | 百淘云 | 品牌标题 |
| monthly/index.vue | Ritual Roasters | 星巴克甄选 | 店铺名 |
| monthly/index.vue | Manner Coffee | 瑞幸咖啡 | 店铺名 |
| monthly/index.vue | Ritual 燕麦拿铁 | 燕麦拿铁 | 饮品名 |
| monthly/index.vue | Manner 冰美式 | 冰美式 | 饮品名 |

## 📊 修复统计

### 样式修复
| 页面 | 修复内容 | 状态 |
|------|---------|------|
| index/index.vue | nav-btn 和 nav-item 样式 | ✅ |
| detail/index.vue | nav-btn 样式 | ✅ |
| 其他页面 | 需要逐个修复 | ⏳ |

### 英文替换
| 类型 | 数量 | 状态 |
|------|------|------|
| 品牌名 | 2 处 | ✅ |
| 店铺名 | 2 处 | ✅ |
| 饮品名 | 3 处 | ✅ |

## 🔧 关键技术点

### 1. 三重锁定机制

```scss
// 宽度锁定
width: 40px;      // 基础宽度
min-width: 40px;  // 最小宽度
max-width: 40px;  // 最大宽度

// 高度锁定
height: 40px;
min-height: 40px;
max-height: 40px;
```

**原理**:
- `width`: 设置基础宽度
- `min-width`: 防止在 flex 容器中被压缩
- `max-width`: 防止在 flex 容器中被拉伸

### 2. Flex 布局最佳实践

```scss
// ✅ 推荐
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;  // 不使用 padding
}

// ❌ 避免
.container {
  display: flex;
  padding: 8px;  // 可能导致溢出
}
```

### 3. 图标显示优化

```scss
// ✅ 推荐
.icon {
  display: block;  // 使用 block 显示
  line-height: 1;  // 重置行高
  width: 24px;
  height: 24px;
}

// ❌ 避免
.icon {
  display: inline;  // 可能受行高影响
  line-height: 1.5; // 影响垂直居中
}
```

## 🎯 修复检查清单

### 样式层面
- [x] 使用 min-width 和 max-width 锁定宽度
- [x] 使用 min-height 和 max-height 锁定高度
- [x] 添加 box-sizing: border-box
- [x] 添加 overflow: hidden
- [x] 设置 padding: 0
- [x] 设置 margin: 0
- [x] 图标使用 display: block
- [x] 图标设置 line-height: 1

### 文本层面
- [x] 品牌名替换为中文
- [x] 店铺名替换为中文
- [x] 饮品名替换为中文
- [x] 检查所有英文文本

## 📝 完整样式代码

### 顶部导航按钮
```scss
.nav-btn {
  width: 40px;
  height: 40px;
  min-width: 40px;
  min-height: 40px;
  max-width: 40px;
  max-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;

  &:active {
    transform: scale(0.95);
    opacity: 0.8;
  }

  .material-icons {
    font-size: 24px;
    width: 24px;
    height: 24px;
    min-width: 24px;
    min-height: 24px;
    max-width: 24px;
    max-height: 24px;
    display: block;
    line-height: 1;
  }
}
```

### 底部导航项
```scss
.nav-item {
  width: 48px;
  height: 48px;
  min-width: 48px;
  min-height: 48px;
  max-width: 48px;
  max-height: 48px;
  border-radius: 50%;
  background: transparent;
  border: none;
  color: var(--on-surface-variant);
  padding: 0;
  margin: 0;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;

  &:active {
    transform: scale(0.9);
  }

  &.active {
    color: var(--secondary);
    background: rgba(255, 202, 152, 0.3);
  }

  .material-icons {
    font-size: 24px;
    width: 24px;
    height: 24px;
    min-width: 24px;
    min-height: 24px;
    max-width: 24px;
    max-height: 24px;
    display: block;
    line-height: 1;
  }

  &.fab {
    background: var(--primary-container);
    color: var(--on-primary);
    width: 56px;
    height: 56px;
    min-width: 56px;
    min-height: 56px;
    max-width: 56px;
    max-height: 56px;
    box-shadow: 0 4px 12px rgba(62, 39, 35, 0.08);

    .material-icons {
      font-size: 28px;
      width: 28px;
      height: 28px;
      min-width: 28px;
      min-height: 28px;
      max-width: 28px;
      max-height: 28px;
    }
  }
}
```

## 🔍 验证方法

### 1. 视觉检查
- 打开微信开发者工具
- 检查导航按钮是否正常显示
- 检查图标是否居中
- 检查文字是否溢出

### 2. 元素检查
```javascript
// 在浏览器控制台运行
document.querySelectorAll('.nav-btn, .nav-item').forEach(el => {
  const rect = el.getBoundingClientRect();
  console.log({
    element: el.className,
    width: rect.width,
    height: rect.height,
    expectedWidth: el.classList.contains('nav-item') ? 48 : 40,
    expectedHeight: el.classList.contains('nav-item') ? 48 : 40
  });
});
```

### 3. 文本检查
```bash
# 搜索英文文本
grep -rn "Ritual\|TIME PERIOD" src/pages --include="*.vue"
```

## 🎉 完成状态

### 已修复
- ✅ 首页 nav-btn 和 nav-item 样式
- ✅ 详情页 nav-btn 样式
- ✅ 所有英文文本替换

### 待修复
- ⏳ 其他页面的导航按钮样式
- ⏳ 统一样式规范

---

**修复状态**: 进行中

**下一步**: 修复其他页面的导航按钮样式

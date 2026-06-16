/**
 * Material Icons 样式修复脚本
 *
 * 使用方法：
 * 1. 在每个页面的 <style> 标签中添加以下样式
 * 2. 确保所有图标容器都有 overflow: hidden
 * 3. 确保所有图标都有明确的 width 和 height
 */

// ==================== 通用图标样式修复 ====================

// 所有包含 .material-icons 的容器
.container-with-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;          // 关键：防止溢出
  position: relative;         // 关键：建立定位上下文
}

// 所有 material-icons
.material-icons {
  font-family: 'Material Symbols Outlined';
  display: inline-block;
  vertical-align: middle;
  line-height: 1;             // 关键：避免行高影响
  overflow: hidden;           // 关键：隐藏溢出
  flex-shrink: 0;            // 关键：防止压缩
}

// ==================== 具体尺寸规范 ====================

// 小图标 (20px)
.icon-sm {
  font-size: 20px;
  width: 20px;
  height: 20px;
}

// 标准图标 (24px)
.icon-md {
  font-size: 24px;
  width: 24px;
  height: 24px;
}

// 大图标 (28px)
.icon-lg {
  font-size: 28px;
  width: 28px;
  height: 28px;
}

// 超大图标 (32px)
.icon-xl {
  font-size: 32px;
  width: 32px;
  height: 32px;
}

// ==================== 容器尺寸规范 ====================

// 小容器 (32px)
.container-sm {
  width: 32px;
  height: 32px;
}

// 标准容器 (40px)
.container-md {
  width: 40px;
  height: 40px;
}

// 大容器 (48px)
.container-lg {
  width: 48px;
  height: 48px;
}

// FAB 容器 (56px)
.container-xl {
  width: 56px;
  height: 56px;
}

// ==================== 组合类 ====================

// 导航按钮 (40px 容器 + 24px 图标)
.nav-button {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  background: transparent;
  border: none;
  padding: 0;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;

  .material-icons {
    font-size: 24px;
    width: 24px;
    height: 24px;
  }
}

// FAB 按钮 (56px 容器 + 28px 图标)
.fab-button {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  background: var(--primary-container);
  border: none;
  padding: 0;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(62, 39, 35, 0.08);
  cursor: pointer;
  transition: all 0.2s ease;

  .material-icons {
    font-size: 28px;
    width: 28px;
    height: 28px;
    color: var(--on-primary);
  }
}

// 信息图标 (40px 容器 + 24px 图标)
.info-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
  margin-right: 16px;

  .material-icons {
    font-size: 24px;
    width: 24px;
    height: 24px;
  }
}

// 箭头图标
.arrow-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-left: 8px;

  .material-icons {
    font-size: 24px;
    width: 24px;
    height: 24px;
    color: var(--outline-variant);
  }
}

// ==================== 修复检查清单 ====================

/**
 * 检查项目：
 *
 * 1. ✅ 容器是否设置了 overflow: hidden?
 * 2. ✅ 容器是否设置了明确的 width 和 height?
 * 3. ✅ 图标是否设置了明确的 font-size, width, height?
 * 4. ✅ 是否使用了 padding? (应该移除，改用 flexbox)
 * 5. ✅ 是否设置了 flex-shrink: 0? (在 flex 容器中)
 * 6. ✅ 是否设置了 line-height: 1?
 * 7. ✅ 是否设置了 vertical-align: middle?
 * 8. ✅ 图标大小是否小于容器大小?
 */

// ==================== 常见问题解决 ====================

/**
 * 问题 1: 图标超出容器
 * 原因: font-size 过大或容器 padding 过大
 * 解决:
 *   - 移除容器 padding
 *   - 减小 font-size
 *   - 添加 overflow: hidden
 */

/**
 * 问题 2: 图标不居中
 * 原因: 使用 padding 或 margin 居中
 * 解决: 使用 flexbox 居中
 *   display: flex;
 *   align-items: center;
 *   justify-content: center;
 */

/**
 * 问题 3: 图标大小不一致
 * 原因: 没有明确设置 width 和 height
 * 解决: 同时设置 font-size, width, height
 */

/**
 * 问题 4: 图标在 flex 容器中被压缩
 * 原因: 没有设置 flex-shrink: 0
 * 解决: 添加 flex-shrink: 0
 */

// ==================== 测试代码 ====================

/*
 * 在浏览器控制台运行以下代码测试图标是否溢出:
 *
 * document.querySelectorAll('.material-icons').forEach(icon => {
 *   const parent = icon.parentElement;
 *   const iconRect = icon.getBoundingClientRect();
 *   const parentRect = parent.getBoundingClientRect();
 *
 *   if (iconRect.width > parentRect.width || iconRect.height > parentRect.height) {
 *     console.error('图标溢出:', icon, {
 *       iconSize: `${iconRect.width}x${iconRect.height}`,
 *       parentSize: `${parentRect.width}x${parentRect.height}`
 *     });
 *   }
 * });
 */

#!/bin/bash

# 批量更新所有页面的安全区域适配

# 定义要处理的页面文件
pages=(
  "src/pages/food-diary/add/index.vue"
  "src/pages/food-diary/detail/index.vue"
  "src/pages/food-diary/monthly/index.vue"
  "src/pages/food-diary/profile/index.vue"
  "src/pages/food-diary/store/index.vue"
)

for page in "${pages[@]}"; do
  if [ -f "$page" ]; then
    echo "Processing $page..."

    # 更新导航栏样式
    # 查找并替换 height: 64px 为适配版本
    sed -i 's/height: 64px;/\/\/ 适配灵动岛：padding-top = 状态栏高度\n  padding-top: var(--status-bar-height);\n  height: calc(var(--nav-bar-height));/g' "$page"

    # 更新 padding: 0 \$container-padding 为适配版本
    sed -i 's/padding: 0 \$container-padding;/padding-top: var(--status-bar-height);\n  padding-left: \$container-padding;\n  padding-right: \$container-padding;/g' "$page"

    # 更新底部导航栏 padding-bottom
    sed -i 's/padding-bottom: 32px;/padding-bottom: calc(32px + var(--safe-area-bottom));/g' "$page"
    sed -i 's/padding: 16px 24px 32px;/padding: 16px 24px;\n  padding-bottom: calc(32px + var(--safe-area-bottom));/g' "$page"

    echo "✅ $page updated"
  else
    echo "⚠️  $page not found"
  fi
done

echo ""
echo "🎉 All pages updated for safe area adaptation!"
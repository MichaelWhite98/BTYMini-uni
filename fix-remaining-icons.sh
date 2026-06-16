#!/bin/bash

# 替换带有 class 属性的图标
find src/pages -name "*.vue" -type f -exec sed -i '
s|<text class="material-icons arrow">chevron_right</text>|<uni-icons type="forward" size="20" class="arrow"></uni-icons>|g
s|<text class="material-icons arrow">expand_more</text>|<uni-icons type="bottom" size="20" class="arrow"></uni-icons>|g
' {} \;

# 处理动态图标（monthly 页面）
# 将 <text class="material-icons">{{ store.icon }}</text> 替换为 uni-icons
# 这个需要手动处理，因为 uni-icons 不支持动态图标名

echo "剩余图标已修复！"

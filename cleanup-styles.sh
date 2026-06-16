#!/bin/bash

# 清理不再需要的 material-icons 样式

for file in src/pages/food-diary/*/index.vue; do
  echo "Cleaning: $file"
  
  # 删除 .material-icons 样式块（包括嵌套的属性）
  sed -i '/^  \.material-icons {$/,/^  }$/d' "$file"
  sed -i '/^\.material-icons {$/,/^}$/d' "$file"
  
done

echo "✅ 样式清理完成！"

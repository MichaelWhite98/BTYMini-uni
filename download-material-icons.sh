#!/bin/bash
# Material Icons 字体下载脚本

echo "正在下载 Material Icons 字体文件..."

# 创建字体目录
mkdir -p src/static/fonts

# 下载 Material Symbols Outlined 字体
curl -L "https://github.com/google/fonts/raw/main/ofl/materialsymbolsoutlined/MaterialSymbolsOutlined%5BGRAD%2Copsz%2Cwght%5D.woff2" \
  -o src/static/fonts/MaterialSymbolsOutlined.woff2

echo "字体文件下载完成！"
echo "文件位置: src/static/fonts/MaterialSymbolsOutlined.woff2"

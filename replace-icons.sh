#!/bin/bash

# 批量替换 Material Icons 为 uni-icons

# 定义替换规则
declare -A replacements=(
  ["<text class=\"material-icons\">menu</text>"]="<uni-icons type=\"bars\" size=\"20\"></uni-icons>"
  ["<text class=\"material-icons\">person</text>"]="<uni-icons type=\"person\" size=\"20\"></uni-icons>"
  ["<text class=\"material-icons\">calendar_today</text>"]="<uni-icons type=\"calendar\" size=\"20\"></uni-icons>"
  ["<text class=\"material-icons\">add_circle</text>"]="<uni-icons type=\"plus\" size=\"24\"></uni-icons>"
  ["<text class=\"material-icons\">close</text>"]="<uni-icons type=\"close\" size=\"20\"></uni-icons>"
  ["<text class=\"material-icons\">check_circle</text>"]="<uni-icons type=\"checkbox\" size=\"20\"></uni-icons>"
  ["<text class=\"material-icons\">check</text>"]="<uni-icons type=\"checkmarkempty\" size=\"20\"></uni-icons>"
  ["<text class=\"material-icons\">edit</text>"]="<uni-icons type=\"compose\" size=\"20\"></uni-icons>"
  ["<text class=\"material-icons\">delete</text>"]="<uni-icons type=\"trash\" size=\"20\"></uni-icons>"
  ["<text class=\"material-icons\">search</text>"]="<uni-icons type=\"search\" size=\"20\"></uni-icons>"
  ["<text class=\"material-icons\">photo_camera</text>"]="<uni-icons type=\"camera\" size=\"20\"></uni-icons>"
  ["<text class=\"material-icons\">image</text>"]="<uni-icons type=\"image\" size=\"20\"></uni-icons>"
  ["<text class=\"material-icons\">arrow_back</text>"]="<uni-icons type=\"back\" size=\"20\"></uni-icons>"
  ["<text class=\"material-icons\">chevron_right</text>"]="<uni-icons type=\"forward\" size=\"20\"></uni-icons>"
  ["<text class=\"material-icons\">expand_more</text>"]="<uni-icons type=\"bottom\" size=\"20\"></uni-icons>"
  ["<text class=\"material-icons\">star</text>"]="<uni-icons type=\"star\" size=\"20\"></uni-icons>"
  ["<text class=\"material-icons\">coffee</text>"]="<uni-icons type=\"fire\" size=\"20\"></uni-icons>"
  ["<text class=\"material-icons\">storefront</text>"]="<uni-icons type=\"shop\" size=\"20\"></uni-icons>"
  ["<text class=\"material-icons\">location_on</text>"]="<uni-icons type=\"location\" size=\"20\"></uni-icons>"
  ["<text class=\"material-icons\">notifications_none</text>"]="<uni-icons type=\"sound\" size=\"20\"></uni-icons>"
  ["<text class=\"material-icons\">dark_mode</text>"]="<uni-icons type=\"eye-slash\" size=\"20\"></uni-icons>"
  ["<text class=\"material-icons\">language</text>"]="<uni-icons type=\"globe\" size=\"20\"></uni-icons>"
  ["<text class=\"material-icons\">info</text>"]="<uni-icons type=\"info\" size=\"20\"></uni-icons>"
  ["<text class=\"material-icons\">cleaning_services</text>"]="<uni-icons type=\"refresh\" size=\"20\"></uni-icons>"
  ["<text class=\"material-icons\">shield_person</text>"]="<uni-icons type=\"locked\" size=\"20\"></uni-icons>"
  ["<text class=\"material-icons\">person_outline</text>"]="<uni-icons type=\"person\" size=\"20\"></uni-icons>"
  ["<text class=\"material-icons\">edit_note</text>"]="<uni-icons type=\"compose\" size=\"20\"></uni-icons>"
  ["<text class=\"material-icons\">local_cafe</text>"]="<uni-icons type=\"fire\" size=\"20\"></uni-icons>"
)

# 遍历所有页面文件
for file in src/pages/food-diary/*/index.vue; do
  echo "Processing: $file"
  for key in "${!replacements[@]}"; do
    sed -i "s|$key|${replacements[$key]}|g" "$file"
  done
done

echo "All icons replaced!"

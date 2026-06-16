<template>
  <!-- 使用 uni-icons 组件 -->
  <uni-icons
    :type="iconType"
    :size="iconSize"
    :color="iconColor"
  />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // Material Icons 名称
  name: {
    type: String,
    required: true
  },
  // 图标大小
  size: {
    type: [Number, String],
    default: 20
  },
  // 图标颜色
  color: {
    type: String,
    default: ''
  }
})

// Material Icons 到 uni-icons 的映射
const iconMap = {
  // 导航
  'menu': 'bars',
  'person': 'person',
  'calendar_today': 'calendar',

  // 操作
  'add_circle': 'plus',
  'close': 'close',
  'check': 'checkmarkempty',
  'check_circle': 'checkbox',

  // 编辑
  'edit': 'compose',
  'delete': 'trash',

  // 媒体
  'search': 'search',
  'photo_camera': 'camera',
  'image': 'image',

  // 导航箭头
  'arrow_back': 'back',
  'chevron_right': 'forward',
  'expand_more': 'bottom',

  // 其他
  'star': 'star',
  'coffee': 'fire',
  'storefront': 'shop',
  'location_on': 'location',
  'notifications_none': 'sound',
  'dark_mode': 'eye-slash',
  'language': 'globe',
  'info': 'info',
  'cleaning_services': 'refresh',
  'shield_person': 'locked',
  'person_outline': 'person',
  'edit_note': 'compose',
  'local_cafe': 'fire'
}

// 计算实际使用的图标类型
const iconType = computed(() => {
  return iconMap[props.name] || props.name
})

// 处理图标大小
const iconSize = computed(() => {
  if (typeof props.size === 'string') {
    return parseInt(props.size)
  }
  return props.size
})

// 图标颜色
const iconColor = computed(() => {
  return props.color || 'inherit'
})
</script>

<style scoped>
/* uni-icons 自带样式 */
</style>

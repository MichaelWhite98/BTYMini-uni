export const STORAGE_KEYS = {
  RECORDS: 'bty_uni_food_records',
  MONTH_INDEX: 'bty_uni_food_month_index',
  SELECTED_STORE: 'bty_uni_food_selected_store',
  VISION_TASK_PREFIX: 'bty_uni_food_vision_task_',
  VISION_DRAFT_PREFIX: 'bty_uni_food_vision_draft_'
}

export const WEEK_LABELS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

export const CATEGORY_LIST = [
  { code: 'coffee', name: '咖啡', icon: '☕' },
  { code: 'americano', name: '美式', icon: '▣' },
  { code: 'latte', name: '拿铁', icon: '◎' },
  { code: 'tea', name: '茶饮', icon: '◇' },
  { code: 'juice', name: '果汁', icon: '○' },
  { code: 'other', name: '其他', icon: '□' }
]

export const MOOD_LIST = [
  { code: 'happy', name: '开心', icon: '🙂' },
  { code: 'good', name: '舒适', icon: '☺' },
  { code: 'normal', name: '平常', icon: '·' },
  { code: 'tired', name: '提神', icon: '!' },
  { code: 'busy', name: '忙碌', icon: '*' }
]

export const STORE_LIST = [
  {
    name: '星巴克(深圳国家工程实验室店)',
    address: '高新南七道20号深圳国家工程实验室大楼B106-107号，深圳市',
    city: '深圳市',
    distance: ''
  },
  {
    name: '老碗会(国家工程实验室店)',
    address: '科技南路国家工程实验室大楼B座1楼，深圳市',
    city: '深圳市',
    distance: '85 ft'
  },
  {
    name: '静悦坊素食(惠恒大楼店)',
    address: '惠恒大楼(粤海门地铁站C口步行390米)，深圳市',
    city: '深圳市',
    distance: '314 ft'
  },
  {
    name: 'Manner Coffee(安居高新花园店)',
    address: '科技南八路51号安居高新花园，深圳市',
    city: '深圳市',
    distance: '0.1 mi'
  }
]

export const DEFAULT_STORE = STORE_LIST[0]

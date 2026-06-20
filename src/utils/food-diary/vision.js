import { STORAGE_KEYS } from '../../constants/food-diary.js'
import { createUniStorageAdapter } from './storage.js'
import { getMiniRuntime } from './runtime.js'
import { createCutoutTask, getCutoutTask, uploadImage } from './api.js'

const storage = createUniStorageAdapter()

const safeParse = (value, fallback = null) => {
  if (!value) return fallback

  try {
    return typeof value === 'string' ? JSON.parse(value) : value
  } catch (error) {
    return fallback
  }
}

const safeStringify = (value) => JSON.stringify(value)

const delay = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms)
})

const createId = (prefix) => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

const taskKey = (taskId) => `${STORAGE_KEYS.VISION_TASK_PREFIX}${taskId}`
const draftKey = (draftId) => `${STORAGE_KEYS.VISION_DRAFT_PREFIX}${draftId}`

const CANDIDATE_PRIORITY = ['cup', 'drink', 'bowl', 'plate', 'food']
const DEFAULT_SCENE = 'food-diary-cutout'

const getCutoutApiBase = () => {
  if (typeof globalThis !== 'undefined' && globalThis.__BTY_CUTOUT_API_BASE__) {
    return String(globalThis.__BTY_CUTOUT_API_BASE__).replace(/\/$/, '')
  }

  return ''
}

const getRuntime = () => getMiniRuntime()

const normalizeItem = (item, index = 0) => ({
  id: item.id || createId('cutout_item'),
  displayName: item.displayName || `主体 ${index + 1}`,
  score: Number(item.score || 0),
  bbox: Array.isArray(item.bbox) ? item.bbox.slice(0, 4) : [],
  areaRatio: Number(item.areaRatio || 0),
  maskUrl: item.maskUrl || '',
  cutoutUrl: item.cutoutUrl || '',
  thumbnailUrl: item.thumbnailUrl || item.cutoutUrl || '',
  sourceType: item.sourceType || ''
})

const normalizeTaskPayload = (task) => {
  const items = Array.isArray(task.items) ? task.items.map(normalizeItem) : []
  return {
    taskId: task.taskId || createId('cutout_task'),
    scene: task.scene || DEFAULT_SCENE,
    imageId: task.imageId || '',
    imageUrl: task.imageUrl || '',
    sourceImageUrl: task.sourceImageUrl || task.imageUrl || '',
    createdAt: Number(task.createdAt || Date.now()),
    primaryItemId: task.primaryItemId || buildPrimaryItemId(items),
    items
  }
}

const buildPrimaryItemId = (items) => {
  const sorted = items.slice().sort((left, right) => {
    const leftPriority = CANDIDATE_PRIORITY.indexOf(left.sourceType)
    const rightPriority = CANDIDATE_PRIORITY.indexOf(right.sourceType)

    if (leftPriority !== rightPriority) {
      return (leftPriority === -1 ? 999 : leftPriority) - (rightPriority === -1 ? 999 : rightPriority)
    }

    if (left.score !== right.score) return right.score - left.score
    return right.areaRatio - left.areaRatio
  })

  return sorted[0] ? sorted[0].id : ''
}

const buildMockItems = (imageUrl) => {
  const suffix = imageUrl.split('/').pop() || 'image'

  return [
    {
      id: `${suffix}_item_1`,
      displayName: '主体 1',
      score: 0.96,
      bbox: [132, 88, 292, 462],
      areaRatio: 0.22,
      maskUrl: imageUrl,
      cutoutUrl: imageUrl,
      thumbnailUrl: imageUrl,
      sourceType: 'cup'
    },
    {
      id: `${suffix}_item_2`,
      displayName: '主体 2',
      score: 0.88,
      bbox: [44, 246, 584, 760],
      areaRatio: 0.35,
      maskUrl: imageUrl,
      cutoutUrl: imageUrl,
      thumbnailUrl: imageUrl,
      sourceType: 'plate'
    }
  ].map(normalizeItem)
}

const writeTask = (task) => {
  storage.setItem(taskKey(task.taskId), safeStringify(task))
}

const readTask = (taskId) => safeParse(storage.getItem(taskKey(taskId)), null)

const writeDraft = (draftId, payload) => {
  storage.setItem(draftKey(draftId), safeStringify(payload))
}

/**
 * 准备抠图源图片 - 使用后端API
 */
export const prepareCutoutSource = async ({ filePath, fileName = 'image.jpg', contentType = 'image/jpeg' }) => {
  const base = getCutoutApiBase()

  // 如果没有配置后端API，使用本地Mock
  if (!base) {
    await delay(120)
    return {
      imageId: createId('local_image'),
      imageUrl: filePath,
      fileKey: ''
    }
  }

  try {
    // 上传图片到后端
    const result = await uploadImage(filePath, 'food-diary-cutout')
    return {
      imageId: result.imageId || createId('img'),
      imageUrl: result.imageUrl || filePath,
      fileKey: result.fileKey || ''
    }
  } catch (error) {
    console.error('上传图片失败:', error)
    // 失败时返回本地路径
    return {
      imageId: createId('local_image'),
      imageUrl: filePath,
      fileKey: ''
    }
  }
}

/**
 * 创建抠图任务 - 使用后端API
 */
export const createCutoutTask = async ({
  imageId = '',
  imageUrl,
  sourceImageUrl = imageUrl,
  scene = DEFAULT_SCENE
}) => {
  const base = getCutoutApiBase()

  // 如果没有配置后端API，使用本地Mock
  if (!base) {
    await delay(150)

    const task = normalizeTaskPayload({
      taskId: createId('cutout_task'),
      scene,
      imageId,
      imageUrl,
      sourceImageUrl,
      createdAt: Date.now(),
      items: buildMockItems(imageUrl)
    })

    writeTask(task)

    return {
      taskId: task.taskId,
      status: 'queued'
    }
  }

  try {
    // 调用后端API
    const result = await createCutoutTaskApi({ scene, imageId, imageUrl })
    return {
      taskId: result.taskId,
      status: result.status || 'queued'
    }
  } catch (error) {
    console.error('创建抠图任务失败:', error)
    // 失败时返回Mock数据
    const task = normalizeTaskPayload({
      taskId: createId('cutout_task'),
      scene,
      imageId,
      imageUrl,
      sourceImageUrl,
      createdAt: Date.now(),
      items: buildMockItems(imageUrl)
    })

    writeTask(task)

    return {
      taskId: task.taskId,
      status: 'queued'
    }
  }
}

// 重命名导入避免冲突
const createCutoutTaskApi = createCutoutTask

/**
 * 查询抠图任务 - 使用后端API
 */
export const getCutoutTask = async (taskId) => {
  const base = getCutoutApiBase()

  // 如果没有配置后端API，使用本地Mock
  if (!base) {
    await delay(120)

    const task = readTask(taskId)
    if (!task) {
      return {
        taskId,
        status: 'failed',
        failReason: '任务不存在或已过期'
      }
    }

    const elapsed = Date.now() - Number(task.createdAt || 0)

    if (elapsed < 800) return { taskId, status: 'queued' }
    if (elapsed < 2200) return { taskId, status: 'running' }

    return {
      taskId,
      status: 'succeeded',
      scene: task.scene,
      imageId: task.imageId,
      imageUrl: task.imageUrl,
      sourceImageUrl: task.sourceImageUrl,
      primaryItemId: task.primaryItemId,
      items: task.items
    }
  }

  try {
    // 调用后端API
    const result = await getCutoutTaskApi(taskId)
    return {
      taskId: result.taskId,
      status: result.status,
      scene: result.scene || DEFAULT_SCENE,
      imageId: result.imageId || '',
      imageUrl: result.imageUrl || '',
      sourceImageUrl: result.sourceImageUrl || result.imageUrl || '',
      primaryItemId: result.primaryItemId || '',
      items: Array.isArray(result.items) ? result.items.map(normalizeItem) : [],
      failReason: result.failReason || ''
    }
  } catch (error) {
    console.error('查询抠图任务失败:', error)
    return {
      taskId,
      status: 'failed',
      failReason: error.message || '查询失败'
    }
  }
}

// 重命名导入避免冲突
const getCutoutTaskApi = getCutoutTask

export const saveCutoutDraft = (payload) => {
  const draftId = createId('cutout_draft')
  writeDraft(draftId, payload)
  return draftId
}

export const consumeCutoutDraft = (draftId) => {
  const payload = safeParse(storage.getItem(draftKey(draftId)), null)
  if (!payload) return null
  storage.removeItem(draftKey(draftId))
  return payload
}

export const buildCutoutDraft = ({ task, selectedItemId }) => {
  const normalizedTask = normalizeTaskPayload(task)
  const fallbackId = selectedItemId || normalizedTask.primaryItemId || ''
  const selectedItem = normalizedTask.items.find((item) => item.id === fallbackId) || normalizedTask.items[0] || null

  return {
    taskId: normalizedTask.taskId,
    scene: normalizedTask.scene,
    imageId: normalizedTask.imageId,
    imageUrl: normalizedTask.imageUrl,
    sourceImageUrl: normalizedTask.sourceImageUrl,
    primaryItemId: normalizedTask.primaryItemId || (selectedItem && selectedItem.id) || '',
    selectedItemId: (selectedItem && selectedItem.id) || '',
    selectedItem,
    items: normalizedTask.items
  }
}

export const createVisionTask = createCutoutTask
export const getVisionTask = getCutoutTask
export const saveVisionDraft = saveCutoutDraft
export const consumeVisionDraft = consumeCutoutDraft
export const buildVisionDraft = buildCutoutDraft

import { STORAGE_KEYS } from '../../constants/food-diary.js'
import { getMiniRuntime } from './runtime.js'
import { buildRecordStamp, getMonthKey } from './date.js'

const hasOwn = Object.prototype.hasOwnProperty

const safeParse = (value, fallback) => {
  if (value == null || value === '') return fallback
  if (typeof value === 'object') return value
  if (typeof value !== 'string') return fallback

  try {
    return JSON.parse(value)
  } catch (error) {
    return fallback
  }
}

const safeStringify = (value) => JSON.stringify(value)

export const createMemoryStorage = (initialState = {}) => {
  const state = { ...initialState }

  return {
    getItem(key) {
      return hasOwn.call(state, key) ? state[key] : null
    },
    setItem(key, value) {
      state[key] = value
    },
    removeItem(key) {
      delete state[key]
    },
    clear() {
      Object.keys(state).forEach((key) => {
        delete state[key]
      })
    },
    dump() {
      return { ...state }
    }
  }
}

export const createUniStorageAdapter = () => {
  const runtime = getMiniRuntime()
  if (!runtime) return createMemoryStorage()

  return {
    getItem(key) {
      const value = runtime.getStorageSync ? runtime.getStorageSync(key) : null
      if (value == null) return null
      return typeof value === 'string' ? value : safeStringify(value)
    },
    setItem(key, value) {
      if (runtime.setStorageSync) runtime.setStorageSync(key, value)
    },
    removeItem(key) {
      if (runtime.removeStorageSync) runtime.removeStorageSync(key)
    },
    clear() {
      if (runtime.clearStorageSync) runtime.clearStorageSync()
    }
  }
}

const createId = () => `record_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`

const normalizeImages = (images) => (Array.isArray(images) ? images.filter(Boolean) : [])

const normalizeLocation = (record) => {
  if (record.location && typeof record.location === 'object') {
    return {
      name: record.location.name || record.storeName || '',
      address: record.location.address || record.storeAddress || '',
      latitude: record.location.latitude,
      longitude: record.location.longitude
    }
  }

  if (!record.storeName && !record.storeAddress) return null

  return {
    name: record.storeName || '',
    address: record.storeAddress || '',
    latitude: record.latitude,
    longitude: record.longitude
  }
}

const normalizeRecord = (record, base = {}) => {
  const now = new Date().toISOString()
  const next = {
    ...base,
    ...record
  }

  return {
    id: next.id || createId(),
    date: next.date || '',
    time: next.time || '00:00',
    category: next.category || 'coffee',
    images: normalizeImages(next.images),
    description: next.description || '',
    mood: next.mood || 'good',
    storeName: next.storeName || (next.location && next.location.name) || '',
    storeAddress: next.storeAddress || (next.location && next.location.address) || '',
    city: next.city || '',
    note: next.note || '',
    isFavorite: !!next.isFavorite,
    location: normalizeLocation(next),
    createdAt: next.createdAt || now,
    updatedAt: now
  }
}

const sortByStampDesc = (left, right) => {
  const aStamp = buildRecordStamp(left)
  const bStamp = buildRecordStamp(right)
  if (aStamp === bStamp) return 0
  return aStamp > bStamp ? -1 : 1
}

const readRecords = (storage) => safeParse(storage.getItem(STORAGE_KEYS.RECORDS), [])

const writeRecords = (storage, records) => {
  storage.setItem(STORAGE_KEYS.RECORDS, safeStringify(records))
}

const buildMonthIndex = (records) => {
  const index = {}

  records.forEach((record) => {
    if (!record.date) return

    const month = getMonthKey(record.date)
    const day = record.date.slice(8, 10)

    if (!index[month]) {
      index[month] = { month, days: {} }
    }

    if (!index[month].days[day]) {
      index[month].days[day] = { count: 0, thumbnail: '' }
    }

    index[month].days[day].count += 1

    if (!index[month].days[day].thumbnail && record.images && record.images.length) {
      index[month].days[day].thumbnail = record.images[0]
    }
  })

  return index
}

const writeMonthIndex = (storage, records) => {
  storage.setItem(STORAGE_KEYS.MONTH_INDEX, safeStringify(buildMonthIndex(records)))
}

export const createRecordRepository = (storage = createMemoryStorage()) => {
  const getRecords = () => readRecords(storage)

  const persist = (records) => {
    writeRecords(storage, records)
    writeMonthIndex(storage, records)
  }

  return {
    getRecords() {
      return getRecords().slice().sort(sortByStampDesc)
    },
    saveRecord(record) {
      const records = getRecords()
      const nextRecord = normalizeRecord(record)
      records.unshift(nextRecord)
      persist(records)
      return nextRecord
    },
    updateRecord(id, data) {
      const records = getRecords()
      const index = records.findIndex((item) => item.id === id)
      if (index === -1) return null

      records[index] = normalizeRecord({
        ...records[index],
        ...data,
        id
      }, records[index])

      persist(records)
      return records[index]
    },
    deleteRecord(id) {
      const records = getRecords()
      const index = records.findIndex((item) => item.id === id)
      if (index === -1) return false

      records.splice(index, 1)
      persist(records)
      return true
    },
    clearAllRecords() {
      storage.removeItem(STORAGE_KEYS.RECORDS)
      storage.removeItem(STORAGE_KEYS.MONTH_INDEX)
    },
    getRecordsByDate(date) {
      return getRecords()
        .filter((item) => item.date === date)
        .sort(sortByStampDesc)
    },
    getRecordsByMonth(month) {
      return getRecords().filter((item) => item.date && item.date.startsWith(month))
    },
    getMonthIndex(month) {
      const cached = safeParse(storage.getItem(STORAGE_KEYS.MONTH_INDEX), null)
      if (cached && cached[month]) return cached[month]

      const rebuilt = buildMonthIndex(getRecords())
      storage.setItem(STORAGE_KEYS.MONTH_INDEX, safeStringify(rebuilt))
      return rebuilt[month] || { month, days: {} }
    },
    getMonthStats(month) {
      const records = getRecords().filter((item) => item.date && item.date.startsWith(month))
      const days = new Set()
      const stores = new Set()
      let imageCount = 0

      records.forEach((item) => {
        days.add(item.date)
        const storeName = item.storeName || (item.location && item.location.name)
        if (storeName) stores.add(storeName)
        imageCount += Array.isArray(item.images) ? item.images.length : 0
      })

      return {
        recordDays: days.size,
        recordCount: records.length,
        imageCount,
        storeCount: stores.size
      }
    }
  }
}

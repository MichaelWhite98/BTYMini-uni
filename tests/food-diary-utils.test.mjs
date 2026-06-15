import assert from 'node:assert/strict'
import {
  createMemoryStorage,
  createRecordRepository,
  formatDate,
  formatTime,
  getMonthKey
} from '../src/utils/food-diary/index.js'

const storage = createMemoryStorage()
const repository = createRecordRepository(storage)

assert.equal(formatDate(new Date('2026-06-15T01:02:03')), '2026-06-15')
assert.equal(formatTime(new Date('2026-06-15T01:02:03')), '01:02')
assert.equal(getMonthKey('2026-06-15'), '2026-06')

const first = repository.saveRecord({
  date: '2026-06-15',
  time: '09:30',
  category: 'coffee',
  images: ['a.png'],
  description: '自制便携美式咖啡',
  storeName: '深圳市一览网络股份有限公司(总部)',
  storeAddress: '高新南七道20号深圳国家工程实验室大楼B106-107号',
  city: '深圳市'
})

repository.saveRecord({
  date: '2026-06-15',
  time: '14:51',
  category: 'latte',
  images: ['b.png', 'c.png'],
  description: '拿铁',
  storeName: 'Manner Coffee(安居高新花园店)',
  storeAddress: '科技南八路51号安居高新花园',
  city: '深圳市'
})

assert.equal(repository.getRecords().length, 2)
assert.equal(repository.getRecordsByDate('2026-06-15')[0].time, '14:51')

const monthIndex = repository.getMonthIndex('2026-06')
assert.equal(monthIndex.days['15'].count, 2)
assert.equal(monthIndex.days['15'].thumbnail, 'b.png')

const stats = repository.getMonthStats('2026-06')
assert.deepEqual(stats, {
  recordDays: 1,
  recordCount: 2,
  imageCount: 3,
  storeCount: 2
})

repository.updateRecord(first.id, { description: '冰美式' })
assert.equal(repository.getRecords().find(item => item.id === first.id).description, '冰美式')

repository.deleteRecord(first.id)
assert.equal(repository.getRecords().length, 1)

repository.clearAllRecords()
assert.equal(repository.getRecords().length, 0)

console.log('food diary utils tests passed')


import { createRecordRepository, createUniStorageAdapter } from './storage.js'

const repository = createRecordRepository(createUniStorageAdapter())

export const getRepository = () => repository

export const getRecords = () => repository.getRecords()
export const saveRecord = (record) => repository.saveRecord(record)
export const updateRecord = (id, data) => repository.updateRecord(id, data)
export const deleteRecord = (id) => repository.deleteRecord(id)
export const clearAllRecords = () => repository.clearAllRecords()
export const getRecordsByDate = (date) => repository.getRecordsByDate(date)
export const getRecordsByMonth = (month) => repository.getRecordsByMonth(month)
export const getMonthIndex = (month) => repository.getMonthIndex(month)
export const getMonthStats = (month) => repository.getMonthStats(month)


import { getMiniRuntime } from './runtime.js'

const callRuntimeMethod = (method, payload = {}) => {
  const runtime = getMiniRuntime()
  if (!runtime || typeof runtime[method] !== 'function') {
    return Promise.reject(new Error(`${method} is unavailable in the current runtime`))
  }

  return new Promise((resolve, reject) => {
    runtime[method]({
      ...payload,
      success: resolve,
      fail: reject
    })
  })
}

export const chooseImage = ({
  count = 1,
  sourceType = ['album', 'camera'],
  sizeType = ['compressed']
} = {}) => callRuntimeMethod('chooseImage', { count, sourceType, sizeType })
  .then((result) => result.tempFilePaths || [])

export const previewImage = (urls, current = 0) => {
  const runtime = getMiniRuntime()
  if (!runtime || typeof runtime.previewImage !== 'function') return

  runtime.previewImage({
    urls,
    current: urls[current] || urls[0]
  })
}

export const compressImage = (filePath, quality = 80) => callRuntimeMethod('compressImage', {
  src: filePath,
  quality
}).then((result) => result.tempFilePath)

export const saveImageToPhotosAlbum = (filePath) => callRuntimeMethod('saveImageToPhotosAlbum', {
  filePath
})


/**
 * OSS 上传工具类
 * 服务端中转上传方式：小程序上传到后端，后端上传到 OSS
 */
import config from '@/config/env.config.js';

/**
 * 获取 API 基础地址
 */
function getApiBase() {
  return config.apiBase || 'http://192.168.31.185:8082';
}

/**
 * 上传单张图片到后端，后端再上传到 OSS
 * @param {string} filePath - 本地图片路径
 * @returns {Promise<{imageUrl: string, originalFilename: string, size: number}>} 上传结果
 */
export async function uploadImageToOSS(filePath) {
  try {
    console.log('开始上传图片到后端:', filePath);

    const token = uni.getStorageSync('token');
    const apiBase = getApiBase();

    // 直接上传到后端
    const uploadRes = await uni.uploadFile({
      url: `${apiBase}/api/food-diary/oss/upload`,
      filePath: filePath,
      name: 'file',
      header: {
        'Authorization': token
      }
    });

    console.log('上传响应:', uploadRes);

    if (uploadRes.statusCode !== 200) {
      throw new Error('上传失败');
    }

    const result = JSON.parse(uploadRes.data);

    if (result.code !== 200) {
      throw new Error(result.msg || '上传失败');
    }

    console.log('上传成功，图片 URL:', result.data.imageUrl);

    return {
      imageUrl: result.data.imageUrl,
      originalFilename: result.data.originalFilename,
      size: result.data.size
    };

  } catch (error) {
    console.error('上传图片失败:', error);
    throw error;
  }
}

/**
 * 批量上传图片到后端
 * @param {string[]} filePaths - 本地图片路径数组
 * @returns {Promise<Array<{imageUrl: string}>>} 上传结果数组
 */
export async function uploadImagesToOSS(filePaths) {
  console.log('开始批量上传图片，数量:', filePaths.length);

  const uploadPromises = filePaths.map((path, index) => {
    return uploadImageToOSS(path).catch(error => {
      console.error(`第 ${index + 1} 张图片上传失败:`, error);
      return null;
    });
  });

  const results = await Promise.all(uploadPromises);

  // 过滤掉失败的结果
  const successResults = results.filter(result => result !== null);

  console.log('批量上传完成，成功:', successResults.length, '失败:', results.length - successResults.length);

  return successResults;
}

/**
 * 压缩图片并上传
 * @param {string} filePath - 本地图片路径
 * @param {number} quality - 压缩质量 0-100
 * @returns {Promise<{imageUrl: string}>} 上传结果
 */
export async function compressAndUpload(filePath, quality = 80) {
  try {
    // 压缩图片
    const compressRes = await uni.compressImage({
      src: filePath,
      quality: quality
    });

    console.log('图片压缩完成:', compressRes.tempFilePath);

    // 上传压缩后的图片
    return await uploadImageToOSS(compressRes.tempFilePath);

  } catch (error) {
    console.error('压缩并上传失败，尝试直接上传:', error);
    // 如果压缩失败，直接上传原图
    return await uploadImageToOSS(filePath);
  }
}

/**
 * 选择并上传图片
 * @param {number} count - 选择图片数量
 * @param {boolean} compress - 是否压缩
 * @returns {Promise<Array<{imageUrl: string}>>} 上传结果数组
 */
export async function chooseAndUploadImages(count = 9, compress = true) {
  try {
    // 选择图片
    const chooseRes = await uni.chooseImage({
      count: count,
      sizeType: compress ? ['compressed'] : ['original'],
      sourceType: ['album', 'camera']
    });

    console.log('选择图片完成，数量:', chooseRes.tempFilePaths.length);

    // 上传图片
    if (compress) {
      const uploadPromises = chooseRes.tempFilePaths.map(path =>
        compressAndUpload(path, 80)
      );
      return await Promise.all(uploadPromises);
    } else {
      return await uploadImagesToOSS(chooseRes.tempFilePaths);
    }

  } catch (error) {
    console.error('选择并上传图片失败:', error);
    throw error;
  }
}

/**
 * 位置服务功能测试
 * 测试常用地点管理、距离计算等功能
 */

import {
  saveFrequentLocation,
  getFrequentLocations,
  deleteFrequentLocation,
  clearFrequentLocations,
  calculateDistance,
  formatDistance,
  formatLocationText
} from './location.js'

/**
 * 测试常用地点管理功能
 */
const testFrequentLocations = async () => {
  console.log('=== 测试常用地点管理功能 ===')

  try {
    // 清空测试环境
    await clearFrequentLocations()
    console.log('✓ 清空常用地点')

    // 测试保存地点
    const location1 = {
      name: '星巴克（中关村店）',
      address: '北京市海淀区中关村大街1号',
      latitude: 39.984120,
      longitude: 116.307430
    }

    const location2 = {
      name: '瑞幸咖啡（望京店）',
      address: '北京市朝阳区望京街9号',
      latitude: 39.995850,
      longitude: 116.477450
    }

    await saveFrequentLocation(location1)
    console.log('✓ 保存地点1:', location1.name)

    await saveFrequentLocation(location2)
    console.log('✓ 保存地点2:', location2.name)

    // 测试获取地点列表
    const locations = await getFrequentLocations()
    console.log('✓ 获取常用地点列表:', locations.length, '个')
    console.log('  地点列表:', locations)

    // 测试多次保存同一地点（增加使用次数）
    await saveFrequentLocation(location1)
    const updatedLocations = await getFrequentLocations()
    console.log('✓ 再次保存地点1，使用次数:', updatedLocations[0].useCount)

    // 测试删除地点
    await deleteFrequentLocation(1)
    const afterDelete = await getFrequentLocations()
    console.log('✓ 删除地点后剩余:', afterDelete.length, '个')

    // 清空
    await clearFrequentLocations()
    const finalLocations = await getFrequentLocations()
    console.log('✓ 最终清空，剩余:', finalLocations.length, '个')

    console.log('\n✅ 常用地点管理功能测试通过\n')
    return true
  } catch (error) {
    console.error('❌ 常用地点管理功能测试失败:', error)
    return false
  }
}

/**
 * 测试距离计算功能
 */
const testDistanceCalculation = () => {
  console.log('=== 测试距离计算功能 ===')

  try {
    // 测试距离计算（北京天安门到故宫）
    const distance1 = calculateDistance(
      39.908722, 116.397499, // 天安门
      39.916342, 116.397154  // 故宫
    )
    console.log('✓ 天安门到故宫距离:', formatDistance(distance1))

    // 测试距离计算（北京到上海）
    const distance2 = calculateDistance(
      39.904202, 116.407394, // 北京
      31.230416, 121.473701  // 上海
    )
    console.log('✓ 北京到上海距离:', formatDistance(distance2))

    // 测试格式化功能
    console.log('✓ 500m 格式化:', formatDistance(500))
    console.log('✓ 1500m 格式化:', formatDistance(1500))
    console.log('✓ 10000m 格式化:', formatDistance(10000))

    console.log('\n✅ 距离计算功能测试通过\n')
    return true
  } catch (error) {
    console.error('❌ 距离计算功能测试失败:', error)
    return false
  }
}

/**
 * 测试位置文本格式化
 */
const testLocationFormatting = () => {
  console.log('=== 测试位置文本格式化 ===')

  try {
    const locationWithName = {
      name: '星巴克',
      address: '北京市海淀区中关村大街1号'
    }

    const locationWithoutName = {
      name: '',
      address: '北京市朝阳区望京街9号'
    }

    console.log('✓ 有名称:', formatLocationText(locationWithName))
    console.log('✓ 无名称:', formatLocationText(locationWithoutName))
    console.log('✓ null:', formatLocationText(null))

    console.log('\n✅ 位置文本格式化测试通过\n')
    return true
  } catch (error) {
    console.error('❌ 位置文本格式化测试失败:', error)
    return false
  }
}

/**
 * 运行所有测试
 */
export const runAllTests = async () => {
  console.log('\n🧪 开始运行位置服务功能测试\n')

  const results = []

  // 运行测试
  results.push(await testFrequentLocations())
  results.push(testDistanceCalculation())
  results.push(testLocationFormatting())

  // 输出结果
  const passed = results.filter(r => r).length
  const total = results.length

  console.log('====================================')
  console.log(`测试完成: ${passed}/${total} 通过`)
  console.log('====================================\n')

  return passed === total
}

// 如果直接运行此文件
if (typeof require !== 'undefined' && require.main === module) {
  runAllTests()
}

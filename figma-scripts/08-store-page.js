/**
 * Figma Plugin Script: 创建店铺页设计
 * 在 Figma 中运行: Plugins > Development > 运行此脚本
 */

const pageWidth = 375;
const pageHeight = 812;
const safeAreaTop = 44;
const safeAreaBottom = 34;

// 创建页面 frame
const page = figma.createFrame();
page.name = "店铺页 - Store";
page.resize(pageWidth, pageHeight);
page.fills = [{ type: 'SOLID', color: { r: 250/255, g: 250/255, b: 250/255 } }];

// ==================== 顶部导航栏 ====================
const header = figma.createFrame();
header.name = "顶部导航栏";
header.resize(pageWidth, safeAreaTop + 44);
header.fills = [{ type: 'SOLID', color: { r: 250/255, g: 250/255, b: 250/255 } }];
header.layoutMode = 'HORIZONTAL';
header.primaryAxisSizingMode = 'SPACE_BETWEEN';
header.counterAxisSizingMode = 'CENTER';
header.paddingLeft = 20;
header.paddingRight = 20;
header.paddingTop = safeAreaTop;
page.appendChild(header);

// 返回按钮
const backBtn = figma.createFrame();
backBtn.name = "返回";
backBtn.resize(40, 40);
backBtn.fills = [];
const backIcon = figma.createVector();
backIcon.vectorPaths = [{ windingRule: 'EVENODD', data: 'M 20 11 L 7.83 11 L 13.42 5.41 L 12 4 L 4 12 L 12 20 L 13.41 18.59 L 7.83 13 L 20 13 L 20 11 Z' }];
backIcon.strokeWeight = 0;
backIcon.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
backBtn.addChild(backIcon);
header.appendChild(backBtn);

// 标题
const title = figma.createText();
title.characters = "店铺详情";
title.fontSize = 18;
title.fontName = { family: "PingFang SC", style: "Semibold" };
title.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
header.appendChild(title);

// 收藏按钮
const favBtn = figma.createText();
favBtn.characters = "☆";
favBtn.fontSize = 24;
favBtn.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
header.appendChild(favBtn);

// ==================== 店铺信息头部 ====================
const storeHeader = figma.createFrame();
storeHeader.name = "店铺信息";
storeHeader.resize(pageWidth - 40, 120);
storeHeader.x = 20;
storeHeader.y = safeAreaTop + 60;
storeHeader.fills = [];
storeHeader.layoutMode = 'HORIZONTAL';
storeHeader.itemSpacing = 16;
page.appendChild(storeHeader);

// 店铺图标
const storeIcon = figma.createFrame();
storeIcon.resize(100, 100);
storeIcon.cornerRadius = 24;
storeIcon.fills = [{ type: 'GRADIENT_LINEAR', gradientHandlePositions: [0, 0, 0, 1], gradientStops: [{ position: 0, color: { r: 0.067, g: 0.6, b: 0.557 } }, { position: 1, color: { r: 0.22, g: 0.937, b: 0.49 } }] }];
storeIcon.effects = [{ type: 'DROP_SHADOW', color: { r: 0.067, g: 0.6, b: 0.557, a: 0.2 }, offset: { x: 0, y: 4 }, blur: 16, spread: 0 }];
storeIcon.layoutMode = 'VERTICAL';
storeIcon.counterAxisSizingMode = 'CENTER';
storeIcon.primaryAxisSizingMode = 'CENTER';
storeHeader.appendChild(storeIcon);

const storeEmoji = figma.createText();
storeEmoji.characters = "☕";
storeEmoji.fontSize = 40;
storeIcon.addChild(storeEmoji);

// 店铺信息
const storeInfo = figma.createFrame();
storeInfo.fills = [];
storeInfo.layoutMode = 'VERTICAL';
storeInfo.counterAxisSizingMode = 'CENTER';
storeInfo.itemSpacing = 8;
storeHeader.appendChild(storeInfo);

const storeName = figma.createText();
storeName.characters = "星巴克咖啡";
storeName.fontSize = 22;
storeName.fontName = { family: "PingFang SC", style: "Semibold" };
storeName.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
storeInfo.appendChild(storeName);

const storeAddress = figma.createText();
storeAddress.characters = "北京市朝阳区建国路88号";
storeAddress.fontSize = 14;
storeAddress.fontName = { family: "PingFang SC", style: "Regular" };
storeAddress.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
storeInfo.appendChild(storeAddress);

// 统计数据
const storeStats = figma.createFrame();
storeStats.fills = [];
storeStats.layoutMode = 'HORIZONTAL';
storeStats.itemSpacing = 16;
storeInfo.appendChild(storeStats);

const visitCount = figma.createText();
visitCount.characters = "12次 到访";
visitCount.fontSize = 12;
visitCount.fontName = { family: "PingFang SC", style: "Regular" };
visitCount.fills = [{ type: 'SOLID', color: { r: 0.067, g: 0.6, b: 0.557 } }];
storeStats.appendChild(visitCount);

const recordCount = figma.createText();
recordCount.characters = "8条 记录";
recordCount.fontSize = 12;
recordCount.fontName = { family: "PingFang SC", style: "Regular" };
recordCount.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
storeStats.appendChild(recordCount);

// ==================== 统计卡片 ====================
const statsCard = figma.createFrame();
statsCard.name = "统计卡片";
statsCard.resize(pageWidth - 40, 80);
statsCard.x = 20;
statsCard.y = safeAreaTop + 200;
statsCard.cornerRadius = 20;
statsCard.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
statsCard.effects = [{ type: 'DROP_SHADOW', color: { r: 0.067, g: 0.6, b: 0.557, a: 0.08 }, offset: { x: 0, y: 4 }, blur: 20, spread: 0 }];
statsCard.layoutMode = 'HORIZONTAL';
statsCard.primaryAxisSizingMode = 'SPACE_BETWEEN';
statsCard.paddingLeft = 24;
statsCard.paddingRight = 24;
statsCard.paddingTop = 16;
statsCard.paddingBottom = 16;
page.appendChild(statsCard);

const statsItems = [
  { value: "8", label: "饮品记录" },
  { value: "12", label: "到访次数" },
  { value: "¥320", label: "消费金额" }
];

statsItems.forEach((item, index) => {
  const statItem = figma.createFrame();
  statItem.fills = [];
  statItem.layoutMode = 'VERTICAL';
  statItem.counterAxisSizingMode = 'CENTER';
  statItem.itemSpacing = 4;

  const value = figma.createText();
  value.characters = item.value;
  value.fontSize = 20;
  value.fontName = { family: "PingFang SC", style: "Bold" };
  value.fills = [{ type: 'GRADIENT_LINEAR', gradientHandlePositions: [0, 0, 0, 1], gradientStops: [{ position: 0, color: { r: 0.067, g: 0.6, b: 0.557 } }, { position: 1, color: { r: 0.22, g: 0.937, b: 0.49 } }] }];
  statItem.appendChild(value);

  const label = figma.createText();
  label.characters = item.label;
  label.fontSize = 12;
  label.fontName = { family: "PingFang SC", style: "Regular" };
  label.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
  statItem.appendChild(label);

  statsCard.appendChild(statItem);

  if (index < statsItems.length - 1) {
    const divider = figma.createRectangle();
    divider.resize(1, 40);
    divider.fills = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
    statsCard.addChild(divider);
  }
});

// ==================== 记录列表标题 ====================
const listTitle = figma.createText();
listTitle.characters = "饮品记录";
listTitle.x = 20;
listTitle.y = safeAreaTop + 300;
listTitle.fontSize = 16;
listTitle.fontName = { family: "PingFang SC", style: "Semibold" };
listTitle.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
page.appendChild(listTitle);

// ==================== 饮品记录列表 ====================
const recordList = figma.createFrame();
recordList.name = "记录列表";
recordList.resize(pageWidth - 40, 280);
recordList.x = 20;
recordList.y = safeAreaTop + 336;
recordList.fills = [];
recordList.layoutMode = 'VERTICAL';
recordList.itemSpacing = 12;
page.appendChild(recordList);

// 记录项
const records = [
  { name: "美式咖啡", date: "2024年6月20日", time: "10:30" },
  { name: "拿铁", date: "2024年6月18日", time: "14:20" },
  { name: "卡布奇诺", date: "2024年6月15日", time: "09:45" },
  { name: "摩卡", date: "2024年6月12日", time: "16:00" }
];

records.forEach((record, index) => {
  const recordItem = figma.createFrame();
  recordItem.name = record.name;
  recordItem.resize(pageWidth - 40, 64);
  recordItem.cornerRadius = 16;
  recordItem.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  recordItem.effects = [{ type: 'DROP_SHADOW', color: { r: 0.067, g: 0.6, b: 0.557, a: 0.08 }, offset: { x: 0, y: 4 }, blur: 20, spread: 0 }];
  recordItem.layoutMode = 'HORIZONTAL';
  recordItem.counterAxisSizingMode = 'CENTER';
  recordItem.paddingLeft = 16;
  recordItem.paddingRight = 16;
  recordItem.itemSpacing = 12;
  recordList.appendChild(recordItem);

  // 图标
  const recordIcon = figma.createFrame();
  recordIcon.resize(44, 44);
  recordIcon.cornerRadius = 12;
  recordIcon.fills = [{ type: 'SOLID', color: { r: 0.92, g: 0.96, b: 0.95 } }];
  recordIcon.layoutMode = 'VERTICAL';
  recordIcon.counterAxisSizingMode = 'CENTER';
  recordIcon.primaryAxisSizingMode = 'CENTER';
  recordItem.appendChild(recordIcon);

  const iconEmoji = figma.createText();
  iconEmoji.characters = "☕";
  iconEmoji.fontSize = 20;
  recordIcon.addChild(iconEmoji);

  // 信息
  const recordInfo = figma.createFrame();
  recordInfo.fills = [];
  recordInfo.layoutMode = 'VERTICAL';
  recordInfo.counterAxisSizingMode = 'CENTER';
  recordInfo.itemSpacing = 4;
  recordItem.appendChild(recordInfo);

  const recordName = figma.createText();
  recordName.characters = record.name;
  recordName.fontSize = 15;
  recordName.fontName = { family: "PingFang SC", style: "Semibold" };
  recordName.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
  recordInfo.appendChild(recordName);

  const recordDate = figma.createText();
  recordDate.characters = `${record.date} ${record.time}`;
  recordDate.fontSize = 12;
  recordDate.fontName = { family: "PingFang SC", style: "Regular" };
  recordDate.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
  recordInfo.appendChild(recordDate);

  // 箭头
  const arrow = figma.createVector();
  arrow.vectorPaths = [{ windingRule: 'EVENODD', data: 'M 8.59 16.59 L 13.17 12 L 8.59 7.41 L 10 6 L 16 12 L 10 18 L 8.59 16.59 Z' }];
  arrow.strokeWeight = 0;
  arrow.fills = [{ type: 'SOLID', color: { r: 0.6, g: 0.6, b: 0.6 } }];
  recordItem.appendChild(arrow);
});

// ==================== 底部导航栏 ====================
const bottomNav = figma.createFrame();
bottomNav.name = "底部导航栏";
bottomNav.resize(pageWidth, safeAreaBottom + 64);
bottomNav.y = pageHeight - safeAreaBottom - 64;
bottomNav.fills = [{ type: 'SOLID', color: { r: 250/255, g: 250/255, b: 250/255, a: 0.8 } }];
bottomNav.effects = [{ type: 'DROP_SHADOW', color: { r: 0.067, g: 0.6, b: 0.557, a: 0.04 }, offset: { x: 0, y: -2 }, blur: 16, spread: 0 }];
bottomNav.layoutMode = 'HORIZONTAL';
bottomNav.primaryAxisSizingMode = 'SPACE_BETWEEN';
bottomNav.paddingLeft = 48;
bottomNav.paddingRight = 48;
bottomNav.paddingTop = 16;
bottomNav.paddingBottom = safeAreaBottom + 16;
page.appendChild(bottomNav);

// 日历按钮
const calendarBtn = figma.createFrame();
calendarBtn.name = "日历";
calendarBtn.fills = [];
calendarBtn.layoutMode = 'VERTICAL';
calendarBtn.counterAxisSizingMode = 'CENTER';
calendarBtn.itemSpacing = 4;
bottomNav.appendChild(calendarBtn);

const calendarIcon = figma.createVector();
calendarIcon.vectorPaths = [{ windingRule: 'EVENODD', data: 'M 19 4 L 5 4 C 3.9 4 3 4.9 3 6 L 3 20 C 3 21.1 3.9 22 5 22 L 19 22 C 20.1 22 21 21.1 21 20 L 21 6 C 21 4.9 20.1 4 19 4 Z M 19 20 L 5 20 L 5 9 L 19 9 L 19 20 Z' }];
calendarIcon.strokeWeight = 0;
calendarIcon.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
calendarBtn.appendChild(calendarIcon);

const calendarLabel = figma.createText();
calendarLabel.characters = "日历";
calendarLabel.fontSize = 10;
calendarLabel.fontName = { family: "PingFang SC", style: "Regular" };
calendarLabel.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
calendarBtn.appendChild(calendarLabel);

// FAB
const fabBtn = figma.createEllipse();
fabBtn.name = "FAB";
fabBtn.resize(56, 56);
fabBtn.y = -20;
fabBtn.fills = [{ type: 'GRADIENT_LINEAR', gradientHandlePositions: [0, 0, 0, 1], gradientStops: [{ position: 0, color: { r: 0.067, g: 0.6, b: 0.557 } }, { position: 1, color: { r: 0.22, g: 0.937, b: 0.49 } }] }];
fabBtn.effects = [{ type: 'DROP_SHADOW', color: { r: 0.067, g: 0.6, b: 0.557, a: 0.3 }, offset: { x: 0, y: 8 }, blur: 24, spread: 0 }];
bottomNav.appendChild(fabBtn);

const plusIcon = figma.createText();
plusIcon.characters = "+";
plusIcon.fontSize = 28;
plusIcon.fontName = { family: "PingFang SC", style: "Regular" };
plusIcon.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
fabBtn.addChild(plusIcon);

// 我的按钮
const profileBtn = figma.createFrame();
profileBtn.name = "个人中心";
profileBtn.fills = [];
profileBtn.layoutMode = 'VERTICAL';
profileBtn.counterAxisSizingMode = 'CENTER';
profileBtn.itemSpacing = 4;
bottomNav.appendChild(profileBtn);

const profileIcon = figma.createVector();
profileIcon.vectorPaths = [{ windingRule: 'EVENODD', data: 'M 12 12 C 14.21 12 16 10.21 16 8 C 16 5.79 14.21 4 12 4 C 9.79 4 8 5.79 8 8 C 8 10.21 9.79 12 12 12 Z M 12 14 C 9.33 14 4 15.34 4 18 L 4 20 L 20 20 L 20 18 C 20 15.34 14.67 14 12 14 Z' }];
profileIcon.strokeWeight = 0;
profileIcon.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
profileBtn.appendChild(profileIcon);

const profileLabel = figma.createText();
profileLabel.characters = "我的";
profileLabel.fontSize = 10;
profileLabel.fontName = { family: "PingFang SC", style: "Regular" };
profileLabel.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
profileBtn.appendChild(profileLabel);

figma.currentPage = page;
figma.notify("店铺页设计创建完成！包含店铺信息、统计卡片和饮品记录列表");

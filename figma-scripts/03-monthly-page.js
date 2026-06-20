/**
 * Figma Plugin Script: 创建月度页设计
 * 在 Figma 中运行: Plugins > Development > 运行此脚本
 */

const pageWidth = 375;
const pageHeight = 812;
const safeAreaTop = 44;
const safeAreaBottom = 34;

// 创建页面 frame
const page = figma.createFrame();
page.name = "月度页 - Monthly";
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
backBtn.name = "返回按钮";
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
title.characters = "本月详情";
title.fontSize = 18;
title.fontName = { family: "PingFang SC", style: "Semibold" };
title.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
header.appendChild(title);

// 头像
const avatarBtn = figma.createEllipse();
avatarBtn.resize(32, 32);
avatarBtn.fills = [{ type: 'GRADIENT_LINEAR', gradientHandlePositions: [0, 0, 0, 1], gradientStops: [{ position: 0, color: { r: 0.067, g: 0.6, b: 0.557 } }, { position: 1, color: { r: 0.22, g: 0.937, b: 0.49 } }] }];
header.appendChild(avatarBtn);

// ==================== 时间周期标题 ====================
const periodSection = figma.createFrame();
periodSection.name = "时间周期";
periodSection.resize(pageWidth - 40, 60);
periodSection.x = 20;
periodSection.y = safeAreaTop + 60;
periodSection.fills = [];
periodSection.layoutMode = 'HORIZONTAL';
periodSection.primaryAxisSizingMode = 'SPACE_BETWEEN';
periodSection.counterAxisSizingMode = 'CENTER';
page.appendChild(periodSection);

const periodTitle = figma.createText();
periodTitle.characters = "时间周期";
periodTitle.fontSize = 16;
periodTitle.fontName = { family: "PingFang SC", style: "Semibold" };
periodTitle.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
periodSection.appendChild(periodTitle);

const periodValue = figma.createText();
periodValue.characters = "2024年6月";
periodValue.fontSize = 14;
periodValue.fontName = { family: "PingFang SC", style: "Regular" };
periodValue.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
periodSection.appendChild(periodValue);

// ==================== 统计网格 (2列) ====================
const statsGrid = figma.createFrame();
statsGrid.name = "统计网格";
statsGrid.resize(pageWidth - 40, 120);
statsGrid.x = 20;
statsGrid.y = safeAreaTop + 140;
statsGrid.fills = [];
statsGrid.layoutMode = 'HORIZONTAL';
statsGrid.itemSpacing = 16;
page.appendChild(statsGrid);

// 本月记录卡片
const recordCard = figma.createFrame();
recordCard.name = "本月记录";
recordCard.resize((pageWidth - 56) / 2, 120);
recordCard.cornerRadius = 20;
recordCard.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
recordCard.effects = [{ type: 'DROP_SHADOW', color: { r: 0.067, g: 0.6, b: 0.557, a: 0.08 }, offset: { x: 0, y: 4 }, blur: 20, spread: 0 }];
recordCard.layoutMode = 'VERTICAL';
recordCard.counterAxisSizingMode = 'CENTER';
recordCard.primaryAxisSizingMode = 'CENTER';
recordCard.itemSpacing = 8;
statsGrid.appendChild(recordCard);

const recordLabel = figma.createText();
recordLabel.characters = "本月记录";
recordLabel.fontSize = 14;
recordLabel.fontName = { family: "PingFang SC", style: "Regular" };
recordLabel.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
recordCard.appendChild(recordLabel);

const recordNumContainer = figma.createFrame();
recordNumContainer.fills = [];
recordNumContainer.layoutMode = 'HORIZONTAL';
recordNumContainer.itemSpacing = 4;
recordCard.appendChild(recordNumContainer);

const recordNum = figma.createText();
recordNum.characters = "36";
recordNum.fontSize = 36;
recordNum.fontName = { family: "PingFang SC", style: "Bold" };
recordNum.fills = [{ type: 'GRADIENT_LINEAR', gradientHandlePositions: [0, 0, 0, 1], gradientStops: [{ position: 0, color: { r: 0.067, g: 0.6, b: 0.557 } }, { position: 1, color: { r: 0.22, g: 0.937, b: 0.49 } }] }];
recordNumContainer.appendChild(recordNum);

const recordUnit = figma.createText();
recordUnit.characters = "杯";
recordUnit.fontSize = 14;
recordUnit.fontName = { family: "PingFang SC", style: "Regular" };
recordUnit.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
recordNumContainer.appendChild(recordUnit);

// 探访店铺卡片
const shopCard = figma.createFrame();
shopCard.name = "探访店铺";
shopCard.resize((pageWidth - 56) / 2, 120);
shopCard.cornerRadius = 20;
shopCard.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
shopCard.effects = [{ type: 'DROP_SHADOW', color: { r: 0.067, g: 0.6, b: 0.557, a: 0.08 }, offset: { x: 0, y: 4 }, blur: 20, spread: 0 }];
shopCard.layoutMode = 'VERTICAL';
shopCard.counterAxisSizingMode = 'CENTER';
shopCard.primaryAxisSizingMode = 'CENTER';
shopCard.itemSpacing = 8;
statsGrid.appendChild(shopCard);

const shopLabel = figma.createText();
shopLabel.characters = "探访店铺";
shopLabel.fontSize = 14;
shopLabel.fontName = { family: "PingFang SC", style: "Regular" };
shopLabel.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
shopCard.appendChild(shopLabel);

const shopNumContainer = figma.createFrame();
shopNumContainer.fills = [];
shopNumContainer.layoutMode = 'HORIZONTAL';
shopNumContainer.itemSpacing = 4;
shopCard.appendChild(shopNumContainer);

const shopNum = figma.createText();
shopNum.characters = "5";
shopNum.fontSize = 36;
shopNum.fontName = { family: "PingFang SC", style: "Bold" };
shopNum.fills = [{ type: 'GRADIENT_LINEAR', gradientHandlePositions: [0, 0, 0, 1], gradientStops: [{ position: 0, color: { r: 0.067, g: 0.6, b: 0.557 } }, { position: 1, color: { r: 0.22, g: 0.937, b: 0.49 } }] }];
shopNumContainer.appendChild(shopNum);

const shopUnit = figma.createText();
shopUnit.characters = "家";
shopUnit.fontSize = 14;
shopUnit.fontName = { family: "PingFang SC", style: "Regular" };
shopUnit.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
shopNumContainer.appendChild(shopUnit);

// ==================== 饮品分布卡片 ====================
const drinkCard = figma.createFrame();
drinkCard.name = "饮品分布卡片";
drinkCard.resize(pageWidth - 40, 180);
drinkCard.x = 20;
drinkCard.y = safeAreaTop + 280;
drinkCard.cornerRadius = 24;
drinkCard.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
drinkCard.effects = [{ type: 'DROP_SHADOW', color: { r: 0.067, g: 0.6, b: 0.557, a: 0.08 }, offset: { x: 0, y: 4 }, blur: 20, spread: 0 }];
drinkCard.paddingLeft = 20;
drinkCard.paddingRight = 20;
drinkCard.paddingTop = 20;
drinkCard.paddingBottom = 20;
page.appendChild(drinkCard);

// 标题
const drinkTitle = figma.createText();
drinkTitle.characters = "饮品分布";
drinkTitle.fontSize = 16;
drinkTitle.fontName = { family: "PingFang SC", style: "Semibold" };
drinkTitle.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
drinkCard.appendChild(drinkTitle);

// 分隔线
const divider1 = figma.createRectangle();
divider1.resize(pageWidth - 80, 1);
divider1.y = 28;
divider1.fills = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
drinkCard.addChild(divider1);

// 饮品列表
const drinkList = figma.createFrame();
drinkList.name = "饮品列表";
drinkList.y = 36;
drinkList.fills = [];
drinkList.layoutMode = 'VERTICAL';
drinkList.itemSpacing = 16;
drinkCard.addChild(drinkList);

const drinkTypes = [
  { name: "咖啡", count: 20, percent: 55 },
  { name: "茶饮", count: 10, percent: 28 },
  { name: "果汁", count: 6, percent: 17 }
];

drinkTypes.forEach((drink, index) => {
  const item = figma.createFrame();
  item.name = drink.name;
  item.resize(pageWidth - 80, 36);
  item.fills = [];
  item.layoutMode = 'VERTICAL';
  item.itemSpacing = 8;
  drinkList.addChild(item);

  // 顶行：名称、数量、百分比
  const topRow = figma.createFrame();
  topRow.resize(pageWidth - 80, 20);
  topRow.fills = [];
  topRow.layoutMode = 'HORIZONTAL';
  topRow.primaryAxisSizingMode = 'SPACE_BETWEEN';
  item.addChild(topRow);

  const nameLabel = figma.createText();
  nameLabel.characters = drink.name;
  nameLabel.fontSize = 14;
  nameLabel.fontName = { family: "PingFang SC", style: "Regular" };
  nameLabel.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
  topRow.addChild(nameLabel);

  const countLabel = figma.createText();
  countLabel.characters = `${drink.count}杯`;
  countLabel.fontSize = 12;
  countLabel.fontName = { family: "PingFang SC", style: "Regular" };
  countLabel.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
  topRow.addChild(countLabel);

  // 进度条
  const progressBg = figma.createFrame();
  progressBg.name = "进度条背景";
  progressBg.resize(pageWidth - 80, 8);
  progressBg.cornerRadius = 4;
  progressBg.fills = [{ type: 'SOLID', color: { r: 0.95, g: 0.95, b: 0.95 } }];
  item.addChild(progressBg);

  const progressBar = figma.createFrame();
  progressBar.name = "进度条";
  progressBar.resize((pageWidth - 80) * drink.percent / 100, 8);
  progressBar.cornerRadius = 4;
  progressBar.fills = [{ type: 'GRADIENT_LINEAR', gradientHandlePositions: [0, 0, 1, 0], gradientStops: [{ position: 0, color: { r: 0.067, g: 0.6, b: 0.557 } }, { position: 1, color: { r: 0.22, g: 0.937, b: 0.49 } }] }];
  progressBg.addChild(progressBar);
});

// ==================== 最常探访列表 ====================
const visitCard = figma.createFrame();
visitCard.name = "最常探访列表";
visitCard.resize(pageWidth - 40, 200);
visitCard.x = 20;
visitCard.y = safeAreaTop + 480;
visitCard.cornerRadius = 24;
visitCard.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
visitCard.effects = [{ type: 'DROP_SHADOW', color: { r: 0.067, g: 0.6, b: 0.557, a: 0.08 }, offset: { x: 0, y: 4 }, blur: 20, spread: 0 }];
visitCard.paddingLeft = 20;
visitCard.paddingRight = 20;
visitCard.paddingTop = 20;
visitCard.paddingBottom = 20;
page.appendChild(visitCard);

// 标题
const visitTitle = figma.createText();
visitTitle.characters = "最常探访";
visitTitle.fontSize = 16;
visitTitle.fontName = { family: "PingFang SC", style: "Semibold" };
visitTitle.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
visitCard.appendChild(visitTitle);

// 店铺列表
const shopList = figma.createFrame();
shopList.name = "店铺列表";
shopList.y = 32;
shopList.fills = [];
shopList.layoutMode = 'VERTICAL';
shopList.itemSpacing = 12;
visitCard.addChild(shopList);

const shops = [
  { name: "星巴克咖啡", count: 12 },
  { name: "瑞幸咖啡", count: 8 },
  { name: "喜茶", count: 5 }
];

shops.forEach((shop, index) => {
  const item = figma.createFrame();
  item.name = shop.name;
  item.resize(pageWidth - 80, 44);
  item.cornerRadius = 12;
  item.fills = [{ type: 'SOLID', color: { r: 0.98, g: 0.98, b: 0.98 } }];
  item.layoutMode = 'HORIZONTAL';
  item.counterAxisSizingMode = 'CENTER';
  item.paddingLeft = 12;
  item.paddingRight = 12;
  item.itemSpacing = 12;
  shopList.addChild(item);

  // 图标
  const icon = figma.createEllipse();
  icon.resize(28, 28);
  icon.cornerRadius = 14;
  icon.fills = [{ type: 'GRADIENT_LINEAR', gradientHandlePositions: [0, 0, 0, 1], gradientStops: [{ position: 0, color: { r: 0.067, g: 0.6, b: 0.557 } }, { position: 1, color: { r: 0.22, g: 0.937, b: 0.49 } }] }];
  item.addChild(icon);

  // 名称
  const nameLabel = figma.createText();
  nameLabel.characters = shop.name;
  nameLabel.fontSize = 14;
  nameLabel.fontName = { family: "PingFang SC", style: "Regular" };
  nameLabel.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
  item.addChild(nameLabel);

  // 次数标签
  const countLabel = figma.createText();
  countLabel.characters = `${shop.count}次 探访`;
  countLabel.fontSize = 12;
  countLabel.fontName = { family: "PingFang SC", style: "Regular" };
  countLabel.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
  item.addChild(countLabel);
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

// 复用首页的底部导航组件
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
figma.notify("月度页设计创建完成！包含统计网格、饮品分布和最常探访列表");

/**
 * Figma Plugin Script: 创建首页设计
 * 在 Figma 中运行: Plugins > Development > 运行此脚本
 *
 * 前置条件: 先运行 01-create-design-system.js 创建设计系统
 */

// 获取页面尺寸
const pageWidth = 375;
const pageHeight = 812;
const safeAreaTop = 44;
const safeAreaBottom = 34;

// 创建页面 frame
const page = figma.createFrame();
page.name = "首页 - Index";
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

// 菜单按钮
const menuBtn = figma.createComponent();
menuBtn.name = "Menu Button";
menuBtn.resize(40, 40);
menuBtn.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0 }];
const menuIcon = figma.createVector();
menuIcon.vectorPaths = [
  { windingRule: 'EVENODD', data: 'M 4 6 L 20 6 L 20 8 L 4 8 Z M 4 11 L 20 11 L 20 13 L 4 13 Z M 4 16 L 20 16 L 20 18 L 4 18 Z' }
];
menuIcon.strokeWeight = 0;
menuIcon.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
menuBtn.addChild(menuIcon);
header.appendChild(menuBtn.createInstance());

// 标题
const title = figma.createText();
title.characters = "百淘云";
title.fontSize = 18;
title.fontName = { family: "PingFang SC", style: "Semibold" };
title.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
header.appendChild(title);

// 头像按钮
const avatarBtn = figma.createEllipse();
avatarBtn.resize(32, 32);
avatarBtn.fills = [{ type: 'GRADIENT_LINEAR', gradientHandlePositions: [0, 0, 0, 1], gradientStops: [{ position: 0, color: { r: 0.067, g: 0.6, b: 0.557 } }, { position: 1, color: { r: 0.22, g: 0.937, b: 0.49 } }] }];
header.appendChild(avatarBtn);

// ==================== 日期标题区域 ====================
const dateSection = figma.createFrame();
dateSection.name = "日期标题";
dateSection.resize(pageWidth - 40, 80);
dateSection.x = 20;
dateSection.y = safeAreaTop + 60;
dateSection.fills = [];
dateSection.layoutMode = 'VERTICAL';
dateSection.counterAxisSizingMode = 'CENTER';
dateSection.itemSpacing = 4;
page.appendChild(dateSection);

const dateTitle = figma.createText();
dateTitle.characters = "今天";
dateTitle.fontSize = 28;
dateTitle.fontName = { family: "PingFang SC", style: "Semibold" };
dateTitle.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
dateSection.appendChild(dateTitle);

const dateSubtitle = figma.createText();
dateSubtitle.characters = "2024年6月20日 星期四";
dateSubtitle.fontSize = 14;
dateSubtitle.fontName = { family: "PingFang SC", style: "Regular" };
dateSubtitle.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
dateSection.appendChild(dateSubtitle);

// ==================== 日历卡片 ====================
const calendarCard = figma.createFrame();
calendarCard.name = "日历卡片";
calendarCard.resize(pageWidth - 40, 280);
calendarCard.x = 20;
calendarCard.y = safeAreaTop + 150;
calendarCard.cornerRadius = 28;
calendarCard.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
calendarCard.effects = [{ type: 'DROP_SHADOW', color: { r: 0.067, g: 0.6, b: 0.557, a: 0.08 }, offset: { x: 0, y: 4 }, blur: 20, spread: 0 }];
calendarCard.paddingLeft = 16;
calendarCard.paddingRight = 16;
calendarCard.paddingTop = 16;
calendarCard.paddingBottom = 16;
page.appendChild(calendarCard);

// 星期标题行
const weekHeader = figma.createFrame();
weekHeader.name = "星期标题";
weekHeader.resize(pageWidth - 72, 24);
weekHeader.fills = [];
weekHeader.layoutMode = 'HORIZONTAL';
weekHeader.primaryAxisSizingMode = 'SPACE_BETWEEN';
calendarCard.addChild(weekHeader);

const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
weekDays.forEach(day => {
  const dayText = figma.createText();
  dayText.characters = day;
  dayText.fontSize = 12;
  dayText.fontName = { family: "PingFang SC", style: "Regular" };
  dayText.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
  weekHeader.addChild(dayText);
});

// 日期网格
const dateGrid = figma.createFrame();
dateGrid.name = "日期网格";
dateGrid.resize(pageWidth - 72, 200);
dateGrid.y = 36;
dateGrid.fills = [];
dateGrid.layoutMode = 'VERTICAL';
dateGrid.itemSpacing = 8;
calendarCard.addChild(dateGrid);

// 生成5行日期
for (let week = 0; week < 5; week++) {
  const weekRow = figma.createFrame();
  weekRow.name = `第${week + 1}周`;
  weekRow.resize(pageWidth - 72, 32);
  weekRow.fills = [];
  weekRow.layoutMode = 'HORIZONTAL';
  weekRow.primaryAxisSizingMode = 'SPACE_BETWEEN';

  for (let day = 0; day < 7; day++) {
    const dayNum = week * 7 + day;
    const dateNum = figma.createFrame();
    dateNum.resize(32, 32);
    dateNum.cornerRadius = 16;

    // 今天（假设是20号）
    if (dayNum === 20 + 6 - 4) { // 周四是20号
      dateNum.fills = [{ type: 'GRADIENT_LINEAR', gradientHandlePositions: [0, 0, 0, 1], gradientStops: [{ position: 0, color: { r: 0.067, g: 0.6, b: 0.557 } }, { position: 1, color: { r: 0.22, g: 0.937, b: 0.49 } }] }];
      const numText = figma.createText();
      numText.characters = "20";
      numText.fontSize = 14;
      numText.fontName = { family: "PingFang SC", style: "Semibold" };
      numText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
      dateNum.addChild(numText);
    } else {
      dateNum.fills = [];
      const numText = figma.createText();
      const displayNum = dayNum - 6 + 20; // 简化计算
      numText.characters = displayNum > 0 && displayNum <= 30 ? String(displayNum) : "";
      numText.fontSize = 14;
      numText.fontName = { family: "PingFang SC", style: "Regular" };
      numText.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
      dateNum.addChild(numText);
    }

    weekRow.addChild(dateNum);
  }

  dateGrid.addChild(weekRow);
}

// ==================== 月度统计卡片 ====================
const statsCard = figma.createFrame();
statsCard.name = "月度统计卡片";
statsCard.resize(pageWidth - 40, 100);
statsCard.x = 20;
statsCard.y = safeAreaTop + 450;
statsCard.cornerRadius = 24;
statsCard.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
statsCard.effects = [{ type: 'DROP_SHADOW', color: { r: 0.067, g: 0.6, b: 0.557, a: 0.08 }, offset: { x: 0, y: 4 }, blur: 20, spread: 0 }];
statsCard.paddingLeft = 20;
statsCard.paddingRight = 20;
statsCard.paddingTop = 16;
statsCard.paddingBottom = 16;
statsCard.layoutMode = 'HORIZONTAL';
statsCard.primaryAxisSizingMode = 'SPACE_BETWEEN';
page.appendChild(statsCard);

// 统计信息
const statsInfo = figma.createFrame();
statsInfo.name = "统计信息";
statsInfo.fills = [];
statsInfo.layoutMode = 'VERTICAL';
statsInfo.counterAxisSizingMode = 'CENTER';
statsInfo.itemSpacing = 8;
statsCard.appendChild(statsInfo);

const statsTitle = figma.createText();
statsTitle.characters = "本月记录";
statsTitle.fontSize = 14;
statsTitle.fontName = { family: "PingFang SC", style: "Regular" };
statsTitle.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
statsInfo.appendChild(statsTitle);

const statsNumber = figma.createText();
statsNumber.characters = "36 杯";
statsNumber.fontSize = 24;
statsNumber.fontName = { family: "PingFang SC", style: "Semibold" };
statsNumber.fills = [{ type: 'GRADIENT_LINEAR', gradientHandlePositions: [0, 0, 0, 1], gradientStops: [{ position: 0, color: { r: 0.067, g: 0.6, b: 0.557 } }, { position: 1, color: { r: 0.22, g: 0.937, b: 0.49 } }] }];
statsInfo.appendChild(statsNumber);

// 饮品图标堆叠
const drinkStack = figma.createFrame();
drinkStack.name = "饮品图标堆叠";
drinkStack.fills = [];
drinkStack.layoutMode = 'HORIZONTAL';
drinkStack.counterAxisSizingMode = 'CENTER';
drinkStack.itemSpacing = -12;
statsCard.appendChild(drinkStack);

for (let i = 0; i < 3; i++) {
  const drinkIcon = figma.createEllipse();
  drinkIcon.resize(48, 48);
  drinkIcon.cornerRadius = 24;
  drinkIcon.fills = [{ type: 'SOLID', color: { r: 0.9, g: 0.95, b: 0.95 } }];
  drinkIcon.strokes = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  drinkIcon.strokeWeight = 2;
  drinkStack.addChild(drinkIcon);
}

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
calendarIcon.fills = [{ type: 'SOLID', color: { r: 0.067, g: 0.6, b: 0.557 } }];
calendarBtn.appendChild(calendarIcon);

const calendarLabel = figma.createText();
calendarLabel.characters = "日历";
calendarLabel.fontSize = 10;
calendarLabel.fontName = { family: "PingFang SC", style: "Regular" };
calendarLabel.fills = [{ type: 'SOLID', color: { r: 0.067, g: 0.6, b: 0.557 } }];
calendarBtn.appendChild(calendarLabel);

// FAB 按钮
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

// 个人中心按钮
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

// 选中页面
figma.currentPage = page;

// 输出完成信息
figma.notify("首页设计创建完成！包含导航栏、日历卡片、统计卡片和底部导航");

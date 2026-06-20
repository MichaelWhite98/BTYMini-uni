/**
 * Figma Plugin Script: 创建详情页设计
 * 在 Figma 中运行: Plugins > Development > 运行此脚本
 */

const pageWidth = 375;
const pageHeight = 812;
const safeAreaTop = 44;
const safeAreaBottom = 34;

// 创建页面 frame
const page = figma.createFrame();
page.name = "详情页 - Detail";
page.resize(pageWidth, pageHeight);
page.fills = [{ type: 'SOLID', color: { r: 250/255, g: 250/255, b: 250/255 } }];

// ==================== 顶部导航栏 (毛玻璃效果) ====================
const header = figma.createFrame();
header.name = "顶部导航栏";
header.resize(pageWidth, safeAreaTop + 44);
header.fills = [{ type: 'SOLID', color: { r: 250/255, g: 250/255, b: 250/255, a: 0.8 } }];
header.effects = [{ type: 'LAYER_BLUR', radius: 12 }];
header.layoutMode = 'HORIZONTAL';
header.primaryAxisSizingMode = 'SPACE_BETWEEN';
header.counterAxisSizingMode = 'CENTER';
header.paddingLeft = 20;
header.paddingRight = 20;
header.paddingTop = safeAreaTop;
page.appendChild(header);

// 关闭按钮
const closeBtn = figma.createFrame();
closeBtn.name = "关闭";
closeBtn.resize(40, 40);
closeBtn.fills = [];
const closeIcon = figma.createVector();
closeIcon.vectorPaths = [{ windingRule: 'EVENODD', data: 'M 19 6.41 L 17.59 5 L 12 10.59 L 6.41 5 L 5 6.41 L 10.59 12 L 5 17.59 L 6.41 19 L 12 13.41 L 17.59 19 L 19 17.59 L 13.41 12 L 19 6.41 Z' }];
closeIcon.strokeWeight = 0;
closeIcon.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
closeBtn.addChild(closeIcon);
header.appendChild(closeBtn);

// 标题
const title = figma.createText();
title.characters = "饮品详情";
title.fontSize = 18;
title.fontName = { family: "PingFang SC", style: "Semibold" };
title.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
header.appendChild(title);

// 保存按钮
const saveBtn = figma.createText();
saveBtn.characters = "保存";
saveBtn.fontSize = 16;
saveBtn.fontName = { family: "PingFang SC", style: "Semibold" };
saveBtn.fills = [{ type: 'SOLID', color: { r: 0.067, g: 0.6, b: 0.557 } }];
header.appendChild(saveBtn);

// ==================== 饮品图片展示区 ====================
const imageContainer = figma.createFrame();
imageContainer.name = "图片容器";
imageContainer.resize(256, 256);
imageContainer.x = (pageWidth - 256) / 2;
imageContainer.y = safeAreaTop + 70;
imageContainer.cornerRadius = 20;
imageContainer.fills = [{ type: 'SOLID', color: { r: 0.95, g: 0.97, b: 0.96 } }];
imageContainer.effects = [
  // 光晕效果
  { type: 'DROP_SHADOW', color: { r: 0.067, g: 0.6, b: 0.557, a: 0.2 }, offset: { x: 0, y: 8 }, blur: 32, spread: 8 },
  { type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.1 }, offset: { x: 0, y: 4 }, blur: 16, spread: 0 }
];
// 旋转角度
imageContainer.rotation = -3;
page.appendChild(imageContainer);

// 图片占位
const imagePlaceholder = figma.createText();
imagePlaceholder.characters = "📷";
imagePlaceholder.fontSize = 64;
imagePlaceholder.fontName = { family: "PingFang SC", style: "Regular" };
imageContainer.appendChild(imagePlaceholder);

// ==================== 主体抠图结果卡片 ====================
const subjectCard = figma.createFrame();
subjectCard.name = "主体抠图卡片";
subjectCard.resize(pageWidth - 40, 100);
subjectCard.x = 20;
subjectCard.y = safeAreaTop + 350;
subjectCard.cornerRadius = 20;
subjectCard.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
subjectCard.effects = [{ type: 'DROP_SHADOW', color: { r: 0.067, g: 0.6, b: 0.557, a: 0.08 }, offset: { x: 0, y: 4 }, blur: 20, spread: 0 }];
subjectCard.paddingLeft = 16;
subjectCard.paddingRight = 16;
subjectCard.paddingTop = 16;
subjectCard.paddingBottom = 16;
subjectCard.layoutMode = 'HORIZONTAL';
subjectCard.itemSpacing = 12;
page.appendChild(subjectCard);

// 缩略图
const thumbNail = figma.createFrame();
thumbNail.resize(64, 64);
thumbNail.cornerRadius = 12;
thumbNail.fills = [{ type: 'SOLID', color: { r: 0.92, g: 0.96, b: 0.95 } }];
subjectCard.appendChild(thumbNail);

// 信息
const subjectInfo = figma.createFrame();
subjectInfo.fills = [];
subjectInfo.layoutMode = 'VERTICAL';
subjectInfo.counterAxisSizingMode = 'CENTER';
subjectInfo.itemSpacing = 4;
subjectCard.appendChild(subjectInfo);

const subjectTitle = figma.createText();
subjectTitle.characters = "主体抠图";
subjectTitle.fontSize = 14;
subjectTitle.fontName = { family: "PingFang SC", style: "Semibold" };
subjectTitle.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
subjectInfo.appendChild(subjectTitle);

const subjectLabel = figma.createText();
subjectLabel.characters = "主体 1";
subjectLabel.fontSize = 12;
subjectLabel.fontName = { family: "PingFang SC", style: "Regular" };
subjectLabel.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
subjectInfo.appendChild(subjectLabel);

const subjectDesc = figma.createText();
subjectDesc.characters = "已应用主体抠图，将优先保留此主体";
subjectDesc.fontSize = 11;
subjectDesc.fontName = { family: "PingFang SC", style: "Regular" };
subjectDesc.fills = [{ type: 'SOLID', color: { r: 0.6, g: 0.6, b: 0.6 } }];
subjectInfo.appendChild(subjectDesc);

// 状态标签
const statusTag = figma.createFrame();
statusTag.cornerRadius = 8;
statusTag.fills = [{ type: 'SOLID', color: { r: 0.92, g: 0.96, b: 0.95 } }];
statusTag.paddingLeft = 8;
statusTag.paddingRight = 8;
statusTag.paddingTop = 4;
statusTag.paddingBottom = 4;
statusTag.layoutMode = 'VERTICAL';
statusTag.counterAxisSizingMode = 'CENTER';
subjectCard.appendChild(statusTag);

const statusLabel = figma.createText();
statusLabel.characters = "主体稳定度";
statusLabel.fontSize = 10;
statusLabel.fontName = { family: "PingFang SC", style: "Regular" };
statusLabel.fills = [{ type: 'SOLID', color: { r: 0.067, g: 0.6, b: 0.557 } }];
statusTag.appendChild(statusLabel);

// ==================== 信息卡片列表 ====================
function createInfoCard(icon, label, value, hasArrow, y) {
  const card = figma.createFrame();
  card.name = label;
  card.resize(pageWidth - 40, 56);
  card.x = 20;
  card.y = y;
  card.cornerRadius = 20;
  card.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  card.effects = [{ type: 'DROP_SHADOW', color: { r: 0.067, g: 0.6, b: 0.557, a: 0.08 }, offset: { x: 0, y: 4 }, blur: 20, spread: 0 }];
  card.layoutMode = 'HORIZONTAL';
  card.counterAxisSizingMode = 'CENTER';
  card.paddingLeft = 16;
  card.paddingRight = 16;
  card.itemSpacing = 12;
  page.appendChild(card);

  // 图标
  const iconFrame = figma.createFrame();
  iconFrame.resize(32, 32);
  iconFrame.cornerRadius = 16;
  iconFrame.fills = [{ type: 'SOLID', color: { r: 0.92, g: 0.96, b: 0.95 } }];
  iconFrame.layoutMode = 'VERTICAL';
  iconFrame.counterAxisSizingMode = 'CENTER';
  iconFrame.primaryAxisSizingMode = 'CENTER';
  card.appendChild(iconFrame);

  const iconText = figma.createText();
  iconText.characters = icon;
  iconText.fontSize = 16;
  iconFrame.addChild(iconText);

  // 标签
  const labelText = figma.createText();
  labelText.characters = label;
  labelText.fontSize = 14;
  labelText.fontName = { family: "PingFang SC", style: "Regular" };
  labelText.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
  card.appendChild(labelText);

  // 值或输入框
  const valueText = figma.createText();
  valueText.characters = value;
  valueText.fontSize = 14;
  valueText.fontName = { family: "PingFang SC", style: "Regular" };
  valueText.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
  card.appendChild(valueText);

  // 箭头
  if (hasArrow) {
    const arrow = figma.createVector();
    arrow.vectorPaths = [{ windingRule: 'EVENODD', data: 'M 8.59 16.59 L 13.17 12 L 8.59 7.41 L 10 6 L 16 12 L 10 18 L 8.59 16.59 Z' }];
    arrow.strokeWeight = 0;
    arrow.fills = [{ type: 'SOLID', color: { r: 0.6, g: 0.6, b: 0.6 } }];
    card.appendChild(arrow);
  }

  return card;
}

createInfoCard("📅", "日期", "2024年6月20日 10:30", true, safeAreaTop + 470);
createInfoCard("🏪", "店铺", "星巴克咖啡", true, safeAreaTop + 534);
createInfoCard("📍", "位置", "北京市朝阳区", false, safeAreaTop + 598);

// 饮品名称输入卡片
const nameCard = figma.createFrame();
nameCard.name = "饮品名称";
nameCard.resize(pageWidth - 40, 56);
nameCard.x = 20;
nameCard.y = safeAreaTop + 662;
nameCard.cornerRadius = 20;
nameCard.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
nameCard.effects = [{ type: 'DROP_SHADOW', color: { r: 0.067, g: 0.6, b: 0.557, a: 0.08 }, offset: { x: 0, y: 4 }, blur: 20, spread: 0 }];
nameCard.layoutMode = 'HORIZONTAL';
nameCard.counterAxisSizingMode = 'CENTER';
nameCard.paddingLeft = 16;
nameCard.paddingRight = 16;
nameCard.itemSpacing = 12;
page.appendChild(nameCard);

const nameIcon = figma.createFrame();
nameIcon.resize(32, 32);
nameIcon.cornerRadius = 16;
nameIcon.fills = [{ type: 'SOLID', color: { r: 0.92, g: 0.96, b: 0.95 } }];
nameIcon.layoutMode = 'VERTICAL';
nameIcon.counterAxisSizingMode = 'CENTER';
nameIcon.primaryAxisSizingMode = 'CENTER';
nameCard.appendChild(nameIcon);

const nameIconText = figma.createText();
nameIconText.characters = "☕";
nameIconText.fontSize = 16;
nameIcon.addChild(nameIconText);

const nameLabel = figma.createText();
nameLabel.characters = "饮品名称";
nameLabel.fontSize = 14;
nameLabel.fontName = { family: "PingFang SC", style: "Regular" };
nameLabel.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
nameCard.appendChild(nameLabel);

// 收藏按钮
const favBtn = figma.createText();
favBtn.characters = "☆";
favBtn.fontSize = 24;
favBtn.fills = [{ type: 'SOLID', color: { r: 0.961, g: 0.486, b: 0 } }]; // 警告色
nameCard.appendChild(favBtn);

// ==================== 删除记录按钮 ====================
const deleteBtn = figma.createText();
deleteBtn.characters = "删除记录";
deleteBtn.x = (pageWidth - 80) / 2;
deleteBtn.y = pageHeight - safeAreaBottom - 100;
deleteBtn.fontSize = 14;
deleteBtn.fontName = { family: "PingFang SC", style: "Regular" };
deleteBtn.fills = [{ type: 'SOLID', color: { r: 0.898, g: 0.224, b: 0.208 } }];
page.appendChild(deleteBtn);

figma.currentPage = page;
figma.notify("详情页设计创建完成！包含饮品图片、主体抠图卡片和信息卡片列表");

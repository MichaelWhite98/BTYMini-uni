/**
 * Figma Plugin Script: 创建分析页设计
 * 在 Figma 中运行: Plugins > Development > 运行此脚本
 */

const pageWidth = 375;
const pageHeight = 812;
const safeAreaTop = 44;
const safeAreaBottom = 34;

// 创建页面 frame
const page = figma.createFrame();
page.name = "分析页 - Analyze";
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
title.characters = "主体抠图";
title.fontSize = 18;
title.fontName = { family: "PingFang SC", style: "Semibold" };
title.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
header.appendChild(title);

// 跳过按钮
const skipBtn = figma.createText();
skipBtn.characters = "跳过";
skipBtn.fontSize = 16;
skipBtn.fontName = { family: "PingFang SC", style: "Regular" };
skipBtn.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
header.appendChild(skipBtn);

// ==================== 图片预览面板 ====================
const imagePanel = figma.createFrame();
imagePanel.name = "图片预览面板";
imagePanel.resize(pageWidth - 40, 320);
imagePanel.x = 20;
imagePanel.y = safeAreaTop + 60;
imagePanel.cornerRadius = 28;
imagePanel.fills = [{ type: 'SOLID', color: { r: 0.95, g: 0.97, b: 0.96 } }];
// 渐变遮罩效果
imagePanel.effects = [
  { type: 'DROP_SHADOW', color: { r: 0.067, g: 0.6, b: 0.557, a: 0.08 }, offset: { x: 0, y: 4 }, blur: 20, spread: 0 }
];
imagePanel.paddingLeft = 20;
imagePanel.paddingRight = 20;
imagePanel.paddingTop = 20;
imagePanel.paddingBottom = 20;
page.appendChild(imagePanel);

// 图片占位
const imagePlaceholder = figma.createFrame();
imagePlaceholder.resize(pageWidth - 80, 200);
imagePlaceholder.cornerRadius = 16;
imagePlaceholder.fills = [{ type: 'SOLID', color: { r: 0.9, g: 0.94, b: 0.93 } }];
imagePanel.appendChild(imagePlaceholder);

// 状态标签
const statusBadge = figma.createFrame();
statusBadge.name = "状态标签";
statusBadge.y = 220;
statusBadge.cornerRadius = 12;
statusBadge.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1, a: 0.9 } }];
statusBadge.paddingLeft = 12;
statusBadge.paddingRight = 12;
statusBadge.paddingTop = 6;
statusBadge.paddingBottom = 6;
statusBadge.layoutMode = 'VERTICAL';
statusBadge.counterAxisSizingMode = 'CENTER';
statusBadge.itemSpacing = 4;
imagePanel.appendChild(statusBadge);

const statusTitle = figma.createText();
statusTitle.characters = "分析完成";
statusTitle.fontSize = 16;
statusTitle.fontName = { family: "PingFang SC", style: "Semibold" };
statusTitle.fills = [{ type: 'SOLID', color: { r: 0.067, g: 0.6, b: 0.557 } }];
statusBadge.appendChild(statusTitle);

const statusSubtitle = figma.createText();
statusSubtitle.characters = "检测到 2 个主体";
statusSubtitle.fontSize = 12;
statusSubtitle.fontName = { family: "PingFang SC", style: "Regular" };
statusSubtitle.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
statusBadge.appendChild(statusSubtitle);

// ==================== 抠图候选列表 ====================
const candidateList = figma.createFrame();
candidateList.name = "候选列表";
candidateList.resize(pageWidth - 40, 200);
candidateList.x = 20;
candidateList.y = safeAreaTop + 400;
candidateList.fills = [];
candidateList.layoutMode = 'VERTICAL';
candidateList.itemSpacing = 12;
page.appendChild(candidateList);

// 主体1 - 推荐
const subject1 = figma.createFrame();
subject1.name = "主体1-推荐";
subject1.resize(pageWidth - 40, 92);
subject1.cornerRadius = 20;
subject1.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
subject1.strokes = [{ type: 'SOLID', color: { r: 0.067, g: 0.6, b: 0.557 } }]; // 选中状态边框
subject1.strokeWeight = 2;
subject1.effects = [{ type: 'DROP_SHADOW', color: { r: 0.067, g: 0.6, b: 0.557, a: 0.08 }, offset: { x: 0, y: 4 }, blur: 20, spread: 0 }];
subject1.layoutMode = 'HORIZONTAL';
subject1.counterAxisSizingMode = 'CENTER';
subject1.paddingLeft = 16;
subject1.paddingRight = 16;
subject1.itemSpacing = 12;
candidateList.appendChild(subject1);

// 缩略图
const thumb1 = figma.createFrame();
thumb1.resize(60, 60);
thumb1.cornerRadius = 12;
thumb1.fills = [{ type: 'SOLID', color: { r: 0.92, g: 0.96, b: 0.95 } }];
subject1.appendChild(thumb1);

// 信息
const info1 = figma.createFrame();
info1.fills = [];
info1.layoutMode = 'VERTICAL';
info1.counterAxisSizingMode = 'CENTER';
info1.itemSpacing = 4;
subject1.appendChild(info1);

const name1 = figma.createText();
name1.characters = "主体 1";
name1.fontSize = 14;
name1.fontName = { family: "PingFang SC", style: "Semibold" };
name1.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
info1.appendChild(name1);

const desc1 = figma.createText();
desc1.characters = "将优先保留这个主体进行抠图处理";
desc1.fontSize = 12;
desc1.fontName = { family: "PingFang SC", style: "Regular" };
desc1.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
info1.appendChild(desc1);

// 推荐标签
const recommendTag = figma.createFrame();
recommendTag.cornerRadius = 8;
recommendTag.fills = [{ type: 'GRADIENT_LINEAR', gradientHandlePositions: [0, 0, 0, 1], gradientStops: [{ position: 0, color: { r: 0.067, g: 0.6, b: 0.557 } }, { position: 1, color: { r: 0.22, g: 0.937, b: 0.49 } }] }];
recommendTag.paddingLeft = 10;
recommendTag.paddingRight = 10;
recommendTag.paddingTop = 4;
recommendTag.paddingBottom = 4;
recommendTag.layoutMode = 'VERTICAL';
recommendTag.counterAxisSizingMode = 'CENTER';
subject1.appendChild(recommendTag);

const recommendText = figma.createText();
recommendText.characters = "推荐";
recommendText.fontSize = 12;
recommendText.fontName = { family: "PingFang SC", style: "Semibold" };
recommendText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
recommendTag.appendChild(recommendText);

// 主体2 - 候选
const subject2 = figma.createFrame();
subject2.name = "主体2-候选";
subject2.resize(pageWidth - 40, 92);
subject2.cornerRadius = 20;
subject2.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
subject2.effects = [{ type: 'DROP_SHADOW', color: { r: 0.067, g: 0.6, b: 0.557, a: 0.08 }, offset: { x: 0, y: 4 }, blur: 20, spread: 0 }];
subject2.layoutMode = 'HORIZONTAL';
subject2.counterAxisSizingMode = 'CENTER';
subject2.paddingLeft = 16;
subject2.paddingRight = 16;
subject2.itemSpacing = 12;
candidateList.appendChild(subject2);

// 缩略图
const thumb2 = figma.createFrame();
thumb2.resize(60, 60);
thumb2.cornerRadius = 12;
thumb2.fills = [{ type: 'SOLID', color: { r: 0.95, g: 0.95, b: 0.95 } }];
subject2.appendChild(thumb2);

// 信息
const info2 = figma.createFrame();
info2.fills = [];
info2.layoutMode = 'VERTICAL';
info2.counterAxisSizingMode = 'CENTER';
info2.itemSpacing = 4;
subject2.appendChild(info2);

const name2 = figma.createText();
name2.characters = "主体 2";
name2.fontSize = 14;
name2.fontName = { family: "PingFang SC", style: "Semibold" };
name2.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
info2.appendChild(name2);

const desc2 = figma.createText();
desc2.characters = "可切换为这个主体";
desc2.fontSize = 12;
desc2.fontName = { family: "PingFang SC", style: "Regular" };
desc2.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
info2.appendChild(desc2);

// 候选标签
const candidateTag = figma.createFrame();
candidateTag.cornerRadius = 8;
candidateTag.fills = [{ type: 'SOLID', color: { r: 0.95, g: 0.95, b: 0.95 } }];
candidateTag.paddingLeft = 10;
candidateTag.paddingRight = 10;
candidateTag.paddingTop = 4;
candidateTag.paddingBottom = 4;
candidateTag.layoutMode = 'VERTICAL';
candidateTag.counterAxisSizingMode = 'CENTER';
subject2.appendChild(candidateTag);

const candidateText = figma.createText();
candidateText.characters = "候选";
candidateText.fontSize = 12;
candidateText.fontName = { family: "PingFang SC", style: "Semibold" };
candidateText.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
candidateTag.appendChild(candidateText);

// ==================== 底部操作栏 ====================
const actionBar = figma.createFrame();
actionBar.name = "底部操作栏";
actionBar.resize(pageWidth, safeAreaBottom + 72);
actionBar.y = pageHeight - safeAreaBottom - 72;
actionBar.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
actionBar.effects = [{ type: 'DROP_SHADOW', color: { r: 0.067, g: 0.6, b: 0.557, a: 0.04 }, offset: { x: 0, y: -2 }, blur: 16, spread: 0 }];
actionBar.layoutMode = 'HORIZONTAL';
actionBar.paddingLeft = 20;
actionBar.paddingRight = 20;
actionBar.paddingTop = 16;
actionBar.paddingBottom = safeAreaBottom + 16;
actionBar.itemSpacing = 12;
page.appendChild(actionBar);

// 跳过抠图按钮（次要）
const skipBtnBottom = figma.createFrame();
skipBtnBottom.name = "跳过抠图";
skipBtnBottom.resize((pageWidth - 52) / 2, 48);
skipBtnBottom.cornerRadius = 16;
skipBtnBottom.fills = [{ type: 'SOLID', color: { r: 0.95, g: 0.95, b: 0.95 } }];
skipBtnBottom.layoutMode = 'VERTICAL';
skipBtnBottom.counterAxisSizingMode = 'CENTER';
skipBtnBottom.primaryAxisSizingMode = 'CENTER';
actionBar.appendChild(skipBtnBottom);

const skipBtnText = figma.createText();
skipBtnText.characters = "跳过抠图";
skipBtnText.fontSize = 16;
skipBtnText.fontName = { family: "PingFang SC", style: "Semibold" };
skipBtnText.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
skipBtnBottom.appendChild(skipBtnText);

// 使用当前按钮（主要）
const useBtn = figma.createFrame();
useBtn.name = "使用当前";
useBtn.resize((pageWidth - 52) / 2, 48);
useBtn.cornerRadius = 16;
useBtn.fills = [{ type: 'GRADIENT_LINEAR', gradientHandlePositions: [0, 0, 0, 1], gradientStops: [{ position: 0, color: { r: 0.067, g: 0.6, b: 0.557 } }, { position: 1, color: { r: 0.22, g: 0.937, b: 0.49 } }] }];
useBtn.effects = [{ type: 'DROP_SHADOW', color: { r: 0.067, g: 0.6, b: 0.557, a: 0.3 }, offset: { x: 0, y: 4 }, blur: 12, spread: 0 }];
useBtn.layoutMode = 'VERTICAL';
useBtn.counterAxisSizingMode = 'CENTER';
useBtn.primaryAxisSizingMode = 'CENTER';
actionBar.appendChild(useBtn);

const useBtnText = figma.createText();
useBtnText.characters = "使用当前";
useBtnText.fontSize = 16;
useBtnText.fontName = { family: "PingFang SC", style: "Semibold" };
useBtnText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
useBtn.appendChild(useBtnText);

figma.currentPage = page;
figma.notify("分析页设计创建完成！包含图片预览面板、抠图候选列表和底部操作栏");

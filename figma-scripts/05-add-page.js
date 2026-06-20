/**
 * Figma Plugin Script: 创建添加页设计
 * 在 Figma 中运行: Plugins > Development > 运行此脚本
 */

const pageWidth = 375;
const pageHeight = 812;
const safeAreaTop = 44;
const safeAreaBottom = 34;

// 创建页面 frame
const page = figma.createFrame();
page.name = "添加页 - Add";
page.resize(pageWidth, pageHeight);
page.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1, a: 0.5 } }]; // 半透明遮罩

// ==================== 背景遮罩（可点击关闭） ====================
const backdrop = figma.createFrame();
backdrop.name = "背景遮罩";
backdrop.resize(pageWidth, pageHeight);
backdrop.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1, a: 0.2 } }];
backdrop.effects = [{ type: 'LAYER_BLUR', radius: 8 }];
page.appendChild(backdrop);

// ==================== 底部弹出操作面板 ====================
const panel = figma.createFrame();
panel.name = "操作面板";
panel.resize(pageWidth, safeAreaBottom + 200);
panel.y = pageHeight - safeAreaBottom - 200;
panel.cornerRadiusTopLeft = 24;
panel.cornerRadiusTopRight = 24;
panel.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
panel.effects = [
  { type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.1 }, offset: { x: 0, y: -4 }, blur: 20, spread: 0 }
];
panel.paddingLeft = 20;
panel.paddingRight = 20;
panel.paddingTop = 24;
panel.paddingBottom = safeAreaBottom + 24;
panel.layoutMode = 'VERTICAL';
panel.itemSpacing = 16;
page.appendChild(panel);

// ==================== 拍照选项 ====================
const cameraOption = figma.createFrame();
cameraOption.name = "拍照";
cameraOption.resize(pageWidth - 40, 64);
cameraOption.cornerRadius = 16;
cameraOption.fills = [{ type: 'SOLID', color: { r: 0.98, g: 0.98, b: 0.98 } }];
cameraOption.layoutMode = 'HORIZONTAL';
cameraOption.counterAxisSizingMode = 'CENTER';
cameraOption.paddingLeft = 16;
cameraOption.paddingRight = 16;
cameraOption.itemSpacing = 16;
panel.appendChild(cameraOption);

// 图标
const cameraIcon = figma.createFrame();
cameraIcon.resize(56, 56);
cameraIcon.cornerRadius = 28;
cameraIcon.fills = [{ type: 'SOLID', color: { r: 0.92, g: 0.96, b: 0.95 } }];
cameraIcon.layoutMode = 'VERTICAL';
cameraIcon.counterAxisSizingMode = 'CENTER';
cameraIcon.primaryAxisSizingMode = 'CENTER';
cameraOption.appendChild(cameraIcon);

const cameraSvg = figma.createVector();
cameraSvg.vectorPaths = [{ windingRule: 'EVENODD', data: 'M 12 15.2 C 13.767 15.2 15.2 13.767 15.2 12 C 15.2 10.233 13.767 8.8 12 8.8 C 10.233 8.8 8.8 10.233 8.8 12 C 8.8 13.767 10.233 15.2 12 15.2 Z M 20 6 H 16.83 L 15 4 H 9 L 7.17 6 H 4 C 2.9 6 2 6.9 2 8 V 20 C 2 21.1 2.9 22 4 22 H 20 C 21.1 22 22 21.1 22 20 V 8 C 22 6.9 21.1 6 20 6 Z M 12 18 C 9.24 18 7 15.76 7 13 C 7 10.24 9.24 8 12 8 C 14.76 8 17 10.24 17 13 C 17 15.76 14.76 18 12 18 Z' }];
cameraSvg.strokeWeight = 0;
cameraSvg.fills = [{ type: 'SOLID', color: { r: 0.067, g: 0.6, b: 0.557 } }];
cameraSvg.resize(24, 24);
cameraIcon.appendChild(cameraSvg);

// 文字
const cameraLabel = figma.createText();
cameraLabel.characters = "拍照";
cameraLabel.fontSize = 16;
cameraLabel.fontName = { family: "PingFang SC", style: "Semibold" };
cameraLabel.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
cameraOption.appendChild(cameraLabel);

// 箭头
const cameraArrow = figma.createVector();
cameraArrow.vectorPaths = [{ windingRule: 'EVENODD', data: 'M 8.59 16.59 L 13.17 12 L 8.59 7.41 L 10 6 L 16 12 L 10 18 L 8.59 16.59 Z' }];
cameraArrow.strokeWeight = 0;
cameraArrow.fills = [{ type: 'SOLID', color: { r: 0.6, g: 0.6, b: 0.6 } }];
cameraOption.appendChild(cameraArrow);

// ==================== 从相册上传选项 ====================
const galleryOption = figma.createFrame();
galleryOption.name = "从相册上传";
galleryOption.resize(pageWidth - 40, 64);
galleryOption.cornerRadius = 16;
galleryOption.fills = [{ type: 'SOLID', color: { r: 0.98, g: 0.98, b: 0.98 } }];
galleryOption.layoutMode = 'HORIZONTAL';
galleryOption.counterAxisSizingMode = 'CENTER';
galleryOption.paddingLeft = 16;
galleryOption.paddingRight = 16;
galleryOption.itemSpacing = 16;
panel.appendChild(galleryOption);

// 图标
const galleryIcon = figma.createFrame();
galleryIcon.resize(56, 56);
galleryIcon.cornerRadius = 28;
galleryIcon.fills = [{ type: 'SOLID', color: { r: 0.95, g: 0.97, b: 0.95 } }];
galleryIcon.layoutMode = 'VERTICAL';
galleryIcon.counterAxisSizingMode = 'CENTER';
galleryIcon.primaryAxisSizingMode = 'CENTER';
galleryOption.appendChild(galleryIcon);

const gallerySvg = figma.createVector();
gallerySvg.vectorPaths = [{ windingRule: 'EVENODD', data: 'M 19 3 L 5 3 C 3.9 3 3 3.9 3 5 L 3 19 C 3 20.1 3.9 21 5 21 L 19 21 C 20.1 21 21 20.1 21 19 L 21 5 C 21 3.9 20.1 3 19 3 Z M 19 19 L 5 19 L 5 5 L 19 5 L 19 19 Z M 13.5 12.5 L 10.5 16.51 L 8.5 14.01 L 5.5 18 L 18.5 18 L 13.5 12.5 Z' }];
gallerySvg.strokeWeight = 0;
gallerySvg.fills = [{ type: 'SOLID', color: { r: 0.22, g: 0.937, b: 0.49 } }];
gallerySvg.resize(24, 24);
galleryIcon.appendChild(gallerySvg);

// 文字
const galleryLabel = figma.createText();
galleryLabel.characters = "从相册上传";
galleryLabel.fontSize = 16;
galleryLabel.fontName = { family: "PingFang SC", style: "Semibold" };
galleryLabel.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
galleryOption.appendChild(galleryLabel);

// 箭头
const galleryArrow = figma.createVector();
galleryArrow.vectorPaths = [{ windingRule: 'EVENODD', data: 'M 8.59 16.59 L 13.17 12 L 8.59 7.41 L 10 6 L 16 12 L 10 18 L 8.59 16.59 Z' }];
galleryArrow.strokeWeight = 0;
galleryArrow.fills = [{ type: 'SOLID', color: { r: 0.6, g: 0.6, b: 0.6 } }];
galleryOption.appendChild(galleryArrow);

// ==================== 关闭按钮 ====================
const closeBtn = figma.createFrame();
closeBtn.name = "关闭按钮";
closeBtn.resize(64, 64);
closeBtn.x = (pageWidth - 64) / 2;
closeBtn.y = safeAreaBottom + 130;
closeBtn.cornerRadius = 32;
closeBtn.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
closeBtn.effects = [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.15 }, offset: { x: 0, y: 2 }, blur: 8, spread: 0 }];
closeBtn.layoutMode = 'VERTICAL';
closeBtn.counterAxisSizingMode = 'CENTER';
closeBtn.primaryAxisSizingMode = 'CENTER';
panel.appendChild(closeBtn);

const closeIcon = figma.createVector();
closeIcon.vectorPaths = [{ windingRule: 'EVENODD', data: 'M 19 6.41 L 17.59 5 L 12 10.59 L 6.41 5 L 5 6.41 L 10.59 12 L 5 17.59 L 6.41 19 L 12 13.41 L 17.59 19 L 19 17.59 L 13.41 12 L 19 6.41 Z' }];
closeIcon.strokeWeight = 0;
closeIcon.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
closeIcon.resize(28, 28);
closeBtn.addChild(closeIcon);

figma.currentPage = page;
figma.notify("添加页设计创建完成！包含底部弹出操作面板和关闭按钮");

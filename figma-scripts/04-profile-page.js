/**
 * Figma Plugin Script: 创建个人中心页设计
 * 在 Figma 中运行: Plugins > Development > 运行此脚本
 */

const pageWidth = 375;
const pageHeight = 812;
const safeAreaTop = 44;
const safeAreaBottom = 34;

// 创建页面 frame
const page = figma.createFrame();
page.name = "个人中心 - Profile";
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
const menuBtn = figma.createFrame();
menuBtn.name = "菜单";
menuBtn.resize(40, 40);
menuBtn.fills = [];
const menuIcon = figma.createVector();
menuIcon.vectorPaths = [{ windingRule: 'EVENODD', data: 'M 4 6 L 20 6 L 20 8 L 4 8 Z M 4 11 L 20 11 L 20 13 L 4 13 Z M 4 16 L 20 16 L 20 18 L 4 18 Z' }];
menuIcon.strokeWeight = 0;
menuIcon.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
menuBtn.addChild(menuIcon);
header.appendChild(menuBtn);

// 标题（渐变文字效果）
const title = figma.createText();
title.characters = "百淘云";
title.fontSize = 18;
title.fontName = { family: "PingFang SC", style: "Semibold" };
title.fills = [{ type: 'GRADIENT_LINEAR', gradientHandlePositions: [0, 0, 1, 0], gradientStops: [{ position: 0, color: { r: 0.067, g: 0.6, b: 0.557 } }, { position: 1, color: { r: 0.22, g: 0.937, b: 0.49 } }] }];
header.appendChild(title);

// 头像
const avatarBtn = figma.createEllipse();
avatarBtn.resize(32, 32);
avatarBtn.fills = [{ type: 'GRADIENT_LINEAR', gradientHandlePositions: [0, 0, 0, 1], gradientStops: [{ position: 0, color: { r: 0.067, g: 0.6, b: 0.557 } }, { position: 1, color: { r: 0.22, g: 0.937, b: 0.49 } }] }];
header.appendChild(avatarBtn);

// ==================== 个人资料头部 ====================
const profileHeader = figma.createFrame();
profileHeader.name = "个人资料头部";
profileHeader.resize(pageWidth, 160);
profileHeader.y = safeAreaTop + 56;
profileHeader.fills = [];
profileHeader.layoutMode = 'VERTICAL';
profileHeader.counterAxisSizingMode = 'CENTER';
profileHeader.itemSpacing = 12;
page.appendChild(profileHeader);

// 大头像
const bigAvatar = figma.createEllipse();
bigAvatar.resize(96, 96);
bigAvatar.fills = [{ type: 'GRADIENT_LINEAR', gradientHandlePositions: [0, 0, 0, 1], gradientStops: [{ position: 0, color: { r: 0.067, g: 0.6, b: 0.557 } }, { position: 1, color: { r: 0.22, g: 0.937, b: 0.49 } }] }];
bigAvatar.effects = [{ type: 'DROP_SHADOW', color: { r: 0.067, g: 0.6, b: 0.557, a: 0.2 }, offset: { x: 0, y: 4 }, blur: 16, spread: 0 }];
profileHeader.appendChild(bigAvatar);

// 昵称
const nickname = figma.createText();
nickname.characters = "小明";
nickname.fontSize = 20;
nickname.fontName = { family: "PingFang SC", style: "Semibold" };
nickname.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
profileHeader.appendChild(nickname);

// 简介
const bio = figma.createText();
bio.characters = "热爱咖啡的极简主义者";
bio.fontSize = 14;
bio.fontName = { family: "PingFang SC", style: "Regular" };
bio.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
profileHeader.appendChild(bio);

// ==================== 统计数据行 ====================
const statsRow = figma.createFrame();
statsRow.name = "统计数据";
statsRow.resize(pageWidth - 40, 80);
statsRow.x = 20;
statsRow.y = safeAreaTop + 220;
statsRow.cornerRadius = 20;
statsRow.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
statsRow.effects = [{ type: 'DROP_SHADOW', color: { r: 0.067, g: 0.6, b: 0.557, a: 0.08 }, offset: { x: 0, y: 4 }, blur: 20, spread: 0 }];
statsRow.layoutMode = 'HORIZONTAL';
statsRow.primaryAxisSizingMode = 'SPACE_BETWEEN';
statsRow.paddingLeft = 24;
statsRow.paddingRight = 24;
statsRow.paddingTop = 16;
statsRow.paddingBottom = 16;
page.appendChild(statsRow);

const stats = [
  { value: "36", label: "记录" },
  { value: "5", label: "店铺" },
  { value: "3", label: "收藏" }
];

stats.forEach((stat, index) => {
  const statItem = figma.createFrame();
  statItem.name = stat.label;
  statItem.fills = [];
  statItem.layoutMode = 'VERTICAL';
  statItem.counterAxisSizingMode = 'CENTER';
  statItem.itemSpacing = 4;

  const value = figma.createText();
  value.characters = stat.value;
  value.fontSize = 24;
  value.fontName = { family: "PingFang SC", style: "Bold" };
  value.fills = [{ type: 'GRADIENT_LINEAR', gradientHandlePositions: [0, 0, 0, 1], gradientStops: [{ position: 0, color: { r: 0.067, g: 0.6, b: 0.557 } }, { position: 1, color: { r: 0.22, g: 0.937, b: 0.49 } }] }];
  statItem.appendChild(value);

  const label = figma.createText();
  label.characters = stat.label;
  label.fontSize = 12;
  label.fontName = { family: "PingFang SC", style: "Regular" };
  label.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
  statItem.appendChild(label);

  statsRow.appendChild(statItem);

  // 分隔线
  if (index < stats.length - 1) {
    const divider = figma.createRectangle();
    divider.resize(1, 40);
    divider.fills = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
    statsRow.addChild(divider);
  }
});

// ==================== 设置分组函数 ====================
function createSettingGroup(title, items, yOffset) {
  const group = figma.createFrame();
  group.name = title;
  group.resize(pageWidth - 40, items.length * 52 + 40);
  group.x = 20;
  group.y = yOffset;
  group.cornerRadius = 20;
  group.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  group.effects = [{ type: 'DROP_SHADOW', color: { r: 0.067, g: 0.6, b: 0.557, a: 0.08 }, offset: { x: 0, y: 4 }, blur: 20, spread: 0 }];
  group.paddingLeft = 16;
  group.paddingRight = 16;
  group.paddingTop = 12;
  group.paddingBottom = 12;
  group.layoutMode = 'VERTICAL';
  group.itemSpacing = 0;
  page.appendChild(group);

  // 分组标题
  const groupTitle = figma.createText();
  groupTitle.characters = title;
  groupTitle.fontSize = 12;
  groupTitle.fontName = { family: "PingFang SC", style: "Regular" };
  groupTitle.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
  groupTitle.x = 20;
  groupTitle.y = yOffset - 20;
  page.appendChild(groupTitle);

  items.forEach((item, index) => {
    const row = figma.createFrame();
    row.name = item.label;
    row.resize(pageWidth - 72, 52);
    row.fills = [];
    row.layoutMode = 'HORIZONTAL';
    row.primaryAxisSizingMode = 'SPACE_BETWEEN';
    row.counterAxisSizingMode = 'CENTER';

    // 图标
    const icon = figma.createEllipse();
    icon.resize(32, 32);
    icon.cornerRadius = 16;
    icon.fills = [{ type: 'SOLID', color: { r: 0.92, g: 0.96, b: 0.95 } }];
    row.addChild(icon);

    // 标签
    const label = figma.createText();
    label.characters = item.label;
    label.fontSize = 15;
    label.fontName = { family: "PingFang SC", style: "Regular" };
    label.fills = [{ type: 'SOLID', color: item.danger ? { r: 0.898, g: 0.224, b: 0.208 } : { r: 0.1, g: 0.1, b: 0.1 } }];
    row.addChild(label);

    // 右侧内容
    const rightContent = figma.createFrame();
    rightContent.fills = [];
    rightContent.layoutMode = 'HORIZONTAL';
    rightContent.itemSpacing = 8;
    row.addChild(rightContent);

    if (item.value) {
      const valueText = figma.createText();
      valueText.characters = item.value;
      valueText.fontSize = 14;
      valueText.fontName = { family: "PingFang SC", style: "Regular" };
      valueText.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
      rightContent.appendChild(valueText);
    }

    if (item.hasSwitch) {
      const switchBg = figma.createFrame();
      switchBg.resize(44, 24);
      switchBg.cornerRadius = 12;
      switchBg.fills = [{ type: 'SOLID', color: { r: 1, g: 0.79, b: 0.6 } }]; // 橙色开关
      rightContent.appendChild(switchBg);

      const switchKnob = figma.createEllipse();
      switchKnob.resize(20, 20);
      switchKnob.x = 22;
      switchKnob.y = 2;
      switchKnob.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
      switchBg.addChild(switchKnob);
    }

    if (item.hasArrow) {
      const arrow = figma.createVector();
      arrow.vectorPaths = [{ windingRule: 'EVENODD', data: 'M 8.59 16.59 L 13.17 12 L 8.59 7.41 L 10 6 L 16 12 L 10 18 L 8.59 16.59 Z' }];
      arrow.strokeWeight = 0;
      arrow.fills = [{ type: 'SOLID', color: { r: 0.6, g: 0.6, b: 0.6 } }];
      rightContent.appendChild(arrow);
    }

    group.addChild(row);

    // 分隔线
    if (index < items.length - 1) {
      const divider = figma.createRectangle();
      divider.resize(pageWidth - 72, 1);
      divider.fills = [{ type: 'SOLID', color: { r: 0.95, g: 0.95, b: 0.95 } }];
      group.addChild(divider);
    }
  });

  return group;
}

// ==================== 账号设置分组 ====================
createSettingGroup("账号设置", [
  { label: "个人资料", hasArrow: true },
  { label: "账号安全", hasArrow: true }
], safeAreaTop + 336);

// ==================== 应用偏好分组 ====================
createSettingGroup("应用偏好", [
  { label: "语言设置", value: "简体中文", hasArrow: true },
  { label: "通知提醒", hasSwitch: true },
  { label: "深色模式", hasSwitch: false }
], safeAreaTop + 456);

// ==================== 帮助与支持分组 ====================
createSettingGroup("帮助与支持", [
  { label: "关于我们", hasArrow: true },
  { label: "清理缓存", value: "124 MB" },
  { label: "退出登录", danger: true }
], safeAreaTop + 640);

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

// 我的按钮（选中状态）
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
profileIcon.fills = [{ type: 'SOLID', color: { r: 0.067, g: 0.6, b: 0.557 } }];
profileBtn.appendChild(profileIcon);

const profileLabel = figma.createText();
profileLabel.characters = "我的";
profileLabel.fontSize = 10;
profileLabel.fontName = { family: "PingFang SC", style: "Regular" };
profileLabel.fills = [{ type: 'SOLID', color: { r: 0.067, g: 0.6, b: 0.557 } }];
profileBtn.appendChild(profileLabel);

figma.currentPage = page;
figma.notify("个人中心页设计创建完成！包含个人资料、统计数据和设置分组");

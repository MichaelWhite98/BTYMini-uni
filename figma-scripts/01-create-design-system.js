/**
 * 百淘云小程序设计系统 - 完整创建脚本
 *
 * 使用方法：
 * 1. 在 Figma 中打开一个新文件
 * 2. 按 Cmd+/ (Mac) 或 Ctrl+/ (Windows)
 * 3. 输入 "Run" 并选择 "Run plugin" → "Development" → "New Plugin..."
 * 4. 选择 "Figma Design" 和 "Run once"
 * 5. 将此脚本粘贴到编辑器中
 * 6. 点击 "Run" 按钮
 */

// ==================== 第一步：创建变量集合 ====================

async function createVariables() {
  // 创建颜色变量集合
  const colorCollection = figma.variables.createVariableCollection('Colors/百淘云');
  const colorModeId = colorCollection.modes[0].modeId;

  // 定义颜色变量
  const colors = [
    { name: 'primary', value: { r: 0.067, g: 0.6, b: 0.557 } },           // #11998e
    { name: 'primary-light', value: { r: 0.22, g: 0.937, b: 0.49 } },     // #38ef7d
    { name: 'primary-container', value: { r: 0.91, g: 0.961, b: 0.953 } }, // #e8f5f3
    { name: 'on-primary', value: { r: 1, g: 1, b: 1 } },                   // #ffffff
    { name: 'secondary', value: { r: 0.961, g: 0.486, b: 0 } },           // #f57c00
    { name: 'secondary-container', value: { r: 1, g: 0.953, b: 0.882 } },  // #fff3e0
    { name: 'background', value: { r: 0.98, g: 0.98, b: 0.98 } },          // #fafafa
    { name: 'surface', value: { r: 1, g: 1, b: 1 } },                      // #ffffff
    { name: 'surface-container', value: { r: 0.961, g: 0.961, b: 0.961 } }, // #f5f5f5
    { name: 'surface-container-high', value: { r: 0.941, g: 0.941, b: 0.941 } }, // #f0f0f0
    { name: 'on-surface', value: { r: 0.102, g: 0.102, b: 0.102 } },       // #1a1a1a
    { name: 'on-surface-variant', value: { r: 0.4, g: 0.4, b: 0.4 } },     // #666666
    { name: 'outline', value: { r: 0.878, g: 0.878, b: 0.878 } },          // #e0e0e0
    { name: 'outline-variant', value: { r: 0.941, g: 0.941, b: 0.941 } },  // #f0f0f0
    { name: 'error', value: { r: 0.898, g: 0.224, b: 0.208 } },            // #e53935
    { name: 'error-container', value: { r: 1, g: 0.922, b: 0.933 } },       // #ffebee
    { name: 'success', value: { r: 0.22, g: 0.937, b: 0.49 } },            // #38ef7d
    { name: 'warning', value: { r: 0.961, g: 0.486, b: 0 } },              // #f57c00
  ];

  for (const color of colors) {
    const variable = figma.variables.createVariable(color.name, colorCollection, 'COLOR');
    variable.setValueForMode(colorModeId, color.value);
    variable.scopes = ['FRAME_FILL', 'SHAPE_FILL', 'TEXT_FILL'];
  }

  // 创建间距变量集合
  const spacingCollection = figma.variables.createVariableCollection('Spacing/百淘云');
  const spacingModeId = spacingCollection.modes[0].modeId;

  const spacings = [
    { name: 'xs', value: 4 },
    { name: 'sm', value: 8 },
    { name: 'md', value: 16 },
    { name: 'lg', value: 24 },
    { name: 'xl', value: 32 },
    { name: 'xxl', value: 48 },
    { name: 'container-padding', value: 20 },
  ];

  for (const spacing of spacings) {
    const variable = figma.variables.createVariable(spacing.name, spacingCollection, 'FLOAT');
    variable.setValueForMode(spacingModeId, spacing.value);
    variable.scopes = ['GAP', 'WIDTH', 'HEIGHT', 'LEFT_RIGHT', 'TOP_BOTTOM'];
  }

  // 创建圆角变量集合
  const radiusCollection = figma.variables.createVariableCollection('Radius/百淘云');
  const radiusModeId = radiusCollection.modes[0].modeId;

  const radii = [
    { name: 'sm', value: 8 },
    { name: 'default', value: 12 },
    { name: 'md', value: 16 },
    { name: 'lg', value: 20 },
    { name: 'xl', value: 24 },
    { name: '2xl', value: 28 },
    { name: 'full', value: 9999 },
  ];

  for (const radius of radii) {
    const variable = figma.variables.createVariable(radius.name, radiusCollection, 'FLOAT');
    variable.setValueForMode(radiusModeId, radius.value);
    variable.scopes = ['CORNER_RADIUS'];
  }

  return {
    colorCollectionId: colorCollection.id,
    spacingCollectionId: spacingCollection.id,
    radiusCollectionId: radiusCollection.id
  };
}

// ==================== 第二步：创建文字样式 ====================

async function createTextStyles() {
  const textStyles = [
    { name: 'Display/LG', fontSize: 36, lineHeight: 44, fontWeight: 700 },
    { name: 'Headline/LG', fontSize: 28, lineHeight: 36, fontWeight: 700 },
    { name: 'Title/MD', fontSize: 18, lineHeight: 24, fontWeight: 600 },
    { name: 'Body/LG', fontSize: 16, lineHeight: 24, fontWeight: 400 },
    { name: 'Body/SM', fontSize: 14, lineHeight: 20, fontWeight: 400 },
    { name: 'Label/Caps', fontSize: 12, lineHeight: 16, fontWeight: 700 },
  ];

  for (const style of textStyles) {
    const textStyle = figma.createTextStyle();
    textStyle.name = style.name;

    // 加载字体
    await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
    if (style.fontWeight >= 600) {
      await figma.loadFontAsync({ family: 'Inter', style: 'Semi Bold' });
    }
    if (style.fontWeight >= 700) {
      await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });
    }

    textStyle.fontSize = style.fontSize;
    textStyle.lineHeight = { value: style.lineHeight, unit: 'PIXELS' };
    textStyle.fontWeight = style.fontWeight;
  }

  return textStyles.length;
}

// ==================== 第三步：创建效果样式 ====================

async function createEffectStyles() {
  const effectStyles = [
    {
      name: 'Shadow/XS',
      effects: [{ type: 'DROP_SHADOW', color: { r: 0.067, g: 0.6, b: 0.557, a: 0.04 }, offset: { x: 0, y: 2 }, radius: 8, visible: true }]
    },
    {
      name: 'Shadow/SM',
      effects: [{ type: 'DROP_SHADOW', color: { r: 0.067, g: 0.6, b: 0.557, a: 0.06 }, offset: { x: 0, y: 4 }, radius: 12, visible: true }]
    },
    {
      name: 'Shadow/Card',
      effects: [{ type: 'DROP_SHADOW', color: { r: 0.067, g: 0.6, b: 0.557, a: 0.08 }, offset: { x: 0, y: 4 }, radius: 20, visible: true }]
    },
    {
      name: 'Shadow/LG',
      effects: [{ type: 'DROP_SHADOW', color: { r: 0.067, g: 0.6, b: 0.557, a: 0.12 }, offset: { x: 0, y: 8 }, radius: 24, visible: true }]
    },
    {
      name: 'Shadow/FAB',
      effects: [{ type: 'DROP_SHADOW', color: { r: 0.067, g: 0.6, b: 0.557, a: 0.3 }, offset: { x: 0, y: 8 }, radius: 24, visible: true }]
    },
  ];

  for (const style of effectStyles) {
    const effectStyle = figma.createEffectStyle();
    effectStyle.name = style.name;
    effectStyle.effects = style.effects;
  }

  return effectStyles.length;
}

// ==================== 第四步：创建基础组件 ====================

async function createComponents() {
  const components = [];

  // 获取变量
  const colorCollection = figma.variables.getVariableCollectionById(
    (await figma.variables.getLocalVariableCollectionsAsync()).find(c => c.name === 'Colors/百淘云')?.id
  );
  const primaryVar = colorCollection?.variables.find(v => v.name === 'primary');
  const primaryContainerVar = colorCollection?.variables.find(v => v.name === 'primary-container');
  const onSurfaceVar = colorCollection?.variables.find(v => v.name === 'on-surface');
  const onSurfaceVariantVar = colorCollection?.variables.find(v => v.name === 'on-surface-variant');
  const surfaceVar = colorCollection?.variables.find(v => v.name === 'surface');

  // 加载字体
  await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Semi Bold' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });

  // 1. 创建按钮组件
  const buttonComponent = figma.createComponent();
  buttonComponent.name = 'Button/Primary';
  buttonComponent.resize(120, 40);
  buttonComponent.cornerRadius = 12;
  buttonComponent.fills = [{ type: 'SOLID', color: { r: 0.067, g: 0.6, b: 0.557 } }];

  const buttonText = figma.createText();
  buttonText.characters = 'Button';
  buttonText.fontSize = 14;
  buttonText.fontWeight = 600;
  buttonText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  buttonComponent.appendChild(buttonText);
  buttonText.x = 24;
  buttonText.y = 10;

  components.push({ name: 'Button/Primary', id: buttonComponent.id });

  // 2. 创建导航按钮组件
  const navButtonComponent = figma.createComponent();
  navButtonComponent.name = 'NavButton';
  navButtonComponent.resize(40, 40);
  navButtonComponent.cornerRadius = 20;
  navButtonComponent.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1, a: 0 } }];

  components.push({ name: 'NavButton', id: navButtonComponent.id });

  // 3. 创建 FAB 组件
  const fabComponent = figma.createComponent();
  fabComponent.name = 'FAB';
  fabComponent.resize(56, 56);
  fabComponent.cornerRadius = 28;
  fabComponent.fills = [{ type: 'GRADIENT_LINEAR', gradientHandlePositions: [0, 0.5, 1], gradientStops: [{ position: 0, color: { r: 0.067, g: 0.6, b: 0.557 } }, { position: 1, color: { r: 0.22, g: 0.937, b: 0.49 } }] }];

  components.push({ name: 'FAB', id: fabComponent.id });

  // 4. 创建卡片组件
  const cardComponent = figma.createComponent();
  cardComponent.name = 'Card';
  cardComponent.resize(335, 120);
  cardComponent.cornerRadius = 24;
  cardComponent.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  cardComponent.effects = [{ type: 'DROP_SHADOW', color: { r: 0.067, g: 0.6, b: 0.557, a: 0.08 }, offset: { x: 0, y: 4 }, radius: 20, visible: true }];

  components.push({ name: 'Card', id: cardComponent.id });

  // 5. 创建头像组件
  const avatarComponent = figma.createComponent();
  avatarComponent.name = 'Avatar/Medium';
  avatarComponent.resize(40, 40);
  avatarComponent.cornerRadius = 20;
  avatarComponent.fills = [{ type: 'SOLID', color: { r: 0.91, g: 0.961, b: 0.953 } }];
  avatarComponent.strokes = [{ type: 'SOLID', color: { r: 0.91, g: 0.961, b: 0.953 } }];
  avatarComponent.strokeWeight = 2;

  components.push({ name: 'Avatar/Medium', id: avatarComponent.id });

  return components;
}

// ==================== 主函数 ====================

async function main() {
  try {
    // 创建变量
    const variables = await createVariables();
    console.log('✅ 变量创建完成');

    // 创建文字样式
    const textStylesCount = await createTextStyles();
    console.log(`✅ 文字样式创建完成 (${textStylesCount} 个)`);

    // 创建效果样式
    const effectStylesCount = await createEffectStyles();
    console.log(`✅ 效果样式创建完成 (${effectStylesCount} 个)`);

    // 创建组件
    const components = await createComponents();
    console.log(`✅ 组件创建完成 (${components.length} 个)`);

    // 返回结果
    return {
      success: true,
      message: '设计系统创建完成！',
      variables: variables,
      textStyles: textStylesCount,
      effectStyles: effectStylesCount,
      components: components.length
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// 执行主函数
main();

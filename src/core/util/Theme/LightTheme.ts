import { AppTheme, ThemeMode } from './Theme';
import { Shade } from '../fonts/FontConfig';
import { LightColors } from './colors';

const hexToRgb = (hex: string) => {
  const clean = hex.replace('#', '').slice(0, 6);
  const bigint = parseInt(clean, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
};

const toRgba = (hex: string, alpha: number) => {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const LightTheme: AppTheme = {
  // overall neutrals
  light: LightColors.lightText,
  dark: LightColors.darkText,
  mode: ThemeMode.LIGHT,
  // Primary: bright brand blue used for CTA buttons in screenshots
  // Primary: use base color #005486 and provide light/dark variants
  primary01: (shade: Shade = 100) => {
    if (typeof shade === 'object' && 'custom' in shade) {
      // allow explicit custom alpha
      return toRgba(LightColors.primaryBase, shade.custom);
    }

    const baseHex = LightColors.primaryBase;

    switch (shade) {
      case 125:
        // slightly darker variant
        return LightColors.primaryDark;
      case 100:
        return LightColors.primaryBase; // base primary
      case 75:
        return toRgba(baseHex, 0.75);
      case 50:
        return toRgba(baseHex, 0.5);
      case 25:
        return toRgba(baseHex, 0.25);
      default:
        if (typeof shade === 'number') {
          const alpha = Math.max(0, Math.min(1, shade / 100));
          return toRgba(baseHex, alpha);
        }
        return toRgba(baseHex, 1);
    }
  },

  // Background tones: include a soft cream/top accent and white surfaces
  background01: (shade: Shade = 100) => {
    if (typeof shade === 'object' && 'custom' in shade) {
      return toRgba(LightColors.backgroundCream, shade.custom);
    }
    // Base surface color for background01
    const baseHex = LightColors.backgroundBase;

    switch (shade) {
      case 150:
        // keep explicit cream used for the top area in screenshots
        return LightColors.backgroundCream;
      case 100:
        return LightColors.backgroundMain;
      case 75:
        return LightColors.background75;
      case 50:
        return LightColors.background50;
      case 25:
        return LightColors.background25;
      default:
        // If a numeric shade is provided (e.g. 80), interpret it as a percentage and clamp to [0,1]
        if (typeof shade === 'number') {
          const alpha = Math.max(0, Math.min(1, shade / 100));
          return toRgba(baseHex, alpha);
        }
        return toRgba(baseHex, 1);
    }
  },

  background02: (shade: Shade = 100) => {
    if (typeof shade === 'object' && 'custom' in shade) {
      // allow explicit custom alpha
      return toRgba(LightColors.backgroundBase, shade.custom);
    }

    // Use the same base as background01: #E7EDF3
    const baseHex = LightColors.backgroundBase;

    switch (shade) {
      case 125:
        // slight variant — keep same as base for now
        return LightColors.backgroundBase;
      case 100:
        return LightColors.backgroundBase; // main background
      case 75:
        return toRgba(baseHex, 0.75);
      case 50:
        return toRgba(baseHex, 0.5);
      case 25:
        return toRgba(baseHex, 0.25);
      default:
        if (typeof shade === 'number') {
          const alpha = Math.max(0, Math.min(1, shade / 100));
          return toRgba(baseHex, alpha);
        }
        return toRgba(baseHex, 1);
    }
  },

  // Secondary: muted surface/secondary CTA colors (light gray chips / secondary buttons)
  secondary01: (shade: Shade = 100) => {
    if (typeof shade === 'object' && 'custom' in shade) {
      return toRgba(LightColors.secondary100, shade.custom);
    }
    switch (shade) {
      case 125:
        return LightColors.secondary125;
      case 100:
        return LightColors.secondary100; // default secondary surface
      case 75:
        return LightColors.secondary75;
      case 50:
        return LightColors.secondary50;
      case 25:
        return LightColors.secondary25;
      default:
        return toRgba(LightColors.secondary100, (shade as number) ?? 1);
    }
  },

  negative: (_shade: Shade = 100) => LightColors.negative,
  positive: (_shade: Shade = 100) => LightColors.positive,

  // Text tones tuned for light surfaces
  text01: (shade: Shade = 100) => {
    if (typeof shade === 'object' && 'custom' in shade) {
      return toRgba(LightColors.lightText, shade.custom);
    }
    switch (shade) {
      case 125:
        return LightColors.text125;
      case 100:
        return LightColors.text100;
      case 75:
        return LightColors.text75;
      case 50:
        return LightColors.text50;
      case 25:
        return LightColors.text25;
      default:
        return LightColors.darkText; // full white for 0-24
    }
  },

  text02: (shade: Shade = 100) => {
    if (typeof shade === 'object' && 'custom' in shade) {
      return toRgba(LightColors.lightText, shade.custom);
    }
    switch (shade) {
      case 125:
        return LightColors.text02_125;
      case 100:
        return LightColors.text02_100;
      case 75:
        return LightColors.text02_75;
      case 50:
        return LightColors.text02_50;
      case 25:
        return LightColors.text02_25;
      default:
        return toRgba(LightColors.lightText, (shade as number) ?? 1);
    }
  },

  button01: (_shade: Shade = 100) => {
    // Use the same white-surface base as background (but for button surface variants)
    if (typeof _shade === 'object' && 'custom' in _shade) {
      return toRgba(LightColors.button01Base, _shade.custom);
    }

    const baseHex = LightColors.button01Base;

    switch (_shade) {
      case 125:
        return LightColors.button01Base;
      case 100:
        return LightColors.button01Base;
      case 75:
        return toRgba(baseHex, 0.75);
      case 50:
        return toRgba(baseHex, 0.5);
      case 25:
        return toRgba(baseHex, 0.25);
      default:
        if (typeof _shade === 'number') {
          const alpha = Math.max(0, Math.min(1, _shade / 100));
          return toRgba(baseHex, alpha);
        }
        return toRgba(baseHex, 1);
    }
  },

  button02: (shade: Shade = 100) => {
    // Use new base color #1179D4 and provide variants for 125,100,75,50,25
    if (typeof shade === 'object' && 'custom' in shade) {
      return toRgba(LightColors.button02Base, shade.custom);
    }

    const baseHex = LightColors.button02Base;

    switch (shade) {
      case 125:
        // slightly darker variant
        return LightColors.button02Dark;
      case 100:
        return LightColors.button02Base;
      case 75:
        return toRgba(baseHex, 0.75);
      case 50:
        return toRgba(baseHex, 0.5);
      case 25:
        return toRgba(baseHex, 0.25);
      default:
        if (typeof shade === 'number') {
          const alpha = Math.max(0, Math.min(1, shade / 100));
          return toRgba(baseHex, alpha);
        }
        return toRgba(baseHex, 1);
    }
  },
};

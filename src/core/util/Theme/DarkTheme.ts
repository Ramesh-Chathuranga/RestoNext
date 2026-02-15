import { AppTheme, ThemeMode } from './Theme';
import { Shade } from '../fonts/FontConfig';
import { DarkColors } from './colors';

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

export const DarkTheme: AppTheme = {
  // dark-mode neutrals
  dark: DarkColors.darkBackground, // deep background
  light: DarkColors.lightText,
  mode: ThemeMode.DARK,
  // Primary: keep same bright brand blue for CTAs on dark background
  primary01: (shade: Shade = 100) => {
    if (typeof shade === 'object' && 'custom' in shade) {
      // allow explicit custom alpha
      return toRgba(DarkColors.primaryBase, shade.custom);
    }

    const baseHex = DarkColors.primaryBase;

    switch (shade) {
      case 125:
        // slightly darker variant
        return DarkColors.primaryDark;
      case 100:
        return DarkColors.primaryBaseAlpha; // base primary
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

  // Background variations for dark layout
  background01: (shade: Shade = 100) => {
    // Use base dark surface #232F48 and expose subtle variants
    if (typeof shade === 'object' && 'custom' in shade) {
      return toRgba(DarkColors.background01Base, shade.custom);
    }

    const baseHex = DarkColors.background01Base;

    switch (shade) {
      case 125:
        // slightly darker variant for depth
        return DarkColors.background01Dark;
      case 100:
        return DarkColors.background01Base; // base dark background
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

  background02: (shade: Shade = 100) => {
    // Base for background02 is #111722 (rgb(17,23,34)). Expose consistent rgba variants
    if (typeof shade === 'object' && 'custom' in shade) {
      return toRgba(DarkColors.background02Base, shade.custom);
    }

    const baseHex = DarkColors.background02Base;

    switch (shade) {
      case 125:
        // slightly darker variant for depth
        return DarkColors.background02Dark;
      case 100:
        return DarkColors.background02Base; // base background used in dark screens
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

  // Secondary: dark surfaces used for chips / secondary buttons
  // Base changed to #242F48 (rgb(36,47,72)) and provide consistent rgba variants
  secondary01: (shade: Shade = 100) => {
    if (typeof shade === 'object' && 'custom' in shade) {
      return toRgba(DarkColors.secondaryBase, shade.custom);
    }

    const baseHex = DarkColors.secondaryBase;

    switch (shade) {
      case 125:
        // slightly darker variant for depth
        return DarkColors.secondaryDark;
      case 100:
        return DarkColors.secondaryBase; // base dark surface for secondary CTA
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

  negative: (shade: Shade = 100) => {
    if (typeof shade === 'object' && 'custom' in shade) {
      return toRgba(DarkColors.negative100, shade.custom);
    }
    switch (shade) {
      case 125:
        return DarkColors.negative125;
      case 100:
        return DarkColors.negative100;
      case 75:
        return DarkColors.negative75;
      case 50:
        return DarkColors.negative50;
      case 25:
        return DarkColors.negative25;
      default:
        return toRgba(DarkColors.negative100, (shade as number) ?? 1);
    }
  },
  positive: (shade: Shade = 100) => {
    if (typeof shade === 'object' && 'custom' in shade) {
      return toRgba(DarkColors.positive100, shade.custom);
    }
    switch (shade) {
      case 125:
        return DarkColors.positive125;
      case 100:
        return DarkColors.positive100;
      case 75:
        return DarkColors.positive75;
      case 50:
        return DarkColors.positive50;
      case 25:
        return DarkColors.positive25;
      default:
        return toRgba(DarkColors.positive100, (shade as number) ?? 1);
    }
  },
  // Text tuned for dark surfaces
  text01: (shade: Shade = 100) => {
    if (typeof shade === 'object' && 'custom' in shade) {
      return toRgba(DarkColors.lightText, shade.custom);
    }
    switch (shade) {
      case 125:
        return DarkColors.text125;
      case 100:
        return DarkColors.text100;
      case 75:
        return DarkColors.text75;
      case 50:
        return DarkColors.text50;
      case 25:
        return DarkColors.text25;
      default:
        return DarkColors.textDefault;
    }
  },

  text02: (shade: Shade = 100) => {
    if (typeof shade === 'object' && 'custom' in shade) {
      return toRgba(DarkColors.primaryBase, shade.custom);
    }
    switch (shade) {
      case 125:
        return DarkColors.text02_125;
      case 100:
        return DarkColors.text02_100;
      case 75:
        return DarkColors.text02_75;
      case 50:
        return DarkColors.text02_50;
      case 25:
        return DarkColors.text02_25;
      default:
        return toRgba(DarkColors.primaryBase, (shade as number) ?? 1);
    }
  },

  button01: (shade: Shade = 100) => {
    // Use base color #223C48 for button01 in dark theme and expose variants
    if (typeof shade === 'object' && 'custom' in shade) {
      return toRgba(DarkColors.primaryBase, shade.custom);
    }

    const baseHex = DarkColors.primaryBase;

    switch (shade) {
      case 125:
        // slightly darker variant
        return DarkColors.button01Dark;
      case 100:
        return DarkColors.button01Base;
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

  button02: (shade: Shade = 100) => {
    // Use base color #0F89BD and provide variants for dark theme button02
    if (typeof shade === 'object' && 'custom' in shade) {
      return toRgba(DarkColors.button02Base, shade.custom);
    }

    const baseHex = DarkColors.button02Base;

    switch (shade) {
      case 125:
        // slightly darker variant
        return DarkColors.button02Dark;
      case 100:
        return DarkColors.button02Base;
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

# Inter Font Family

This directory contains the Inter font family in various weights and styles.

## Available Fonts

### Variable Fonts

- `Inter-VariableFont_opsz,wght.ttf` - Variable font with adjustable weight
- `Inter-Italic-VariableFont_opsz,wght.ttf` - Variable italic font

### 18pt Fonts

- Regular, Light, Medium, SemiBold, Bold, ExtraBold, Black
- All weights available in both regular and italic styles

### 24pt Fonts

- Regular, Light, Medium, SemiBold, Bold, ExtraBold, Black
- All weights available in both regular and italic styles

### 28pt Fonts

- Regular, Light, Medium, SemiBold, Bold, ExtraBold, Black
- All weights available in both regular and italic styles

## Usage in React Native

### Using with Text Component

```tsx
import { Text, StyleSheet } from 'react-native';

const MyComponent = () => {
  return <Text style={styles.text}>Hello World</Text>;
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Inter_18pt-Regular',
    fontSize: 16,
  },
});
```

### Font Weight Reference

```tsx
const styles = StyleSheet.create({
  thin: {
    fontFamily: 'Inter_18pt-Thin',
  },
  extraLight: {
    fontFamily: 'Inter_18pt-ExtraLight',
  },
  light: {
    fontFamily: 'Inter_18pt-Light',
  },
  regular: {
    fontFamily: 'Inter_18pt-Regular',
  },
  medium: {
    fontFamily: 'Inter_18pt-Medium',
  },
  semiBold: {
    fontFamily: 'Inter_18pt-SemiBold',
  },
  bold: {
    fontFamily: 'Inter_18pt-Bold',
  },
  extraBold: {
    fontFamily: 'Inter_18pt-ExtraBold',
  },
  black: {
    fontFamily: 'Inter_18pt-Black',
  },
});
```

### Italic Fonts

```tsx
const styles = StyleSheet.create({
  italic: {
    fontFamily: 'Inter_18pt-Italic',
  },
  boldItalic: {
    fontFamily: 'Inter_18pt-BoldItalic',
  },
});
```

## Font Sizes

Choose the appropriate point size based on your use case:

- **18pt** - Standard UI text, body text
- **24pt** - Headings, larger UI elements
- **28pt** - Hero text, large headings

## Notes

- Fonts are automatically linked to both iOS and Android via `react-native.config.js`
- After adding new fonts, run `npx react-native-asset` to link them
- For iOS, remember to run `cd ios && bundle exec pod install` after linking fonts
- Font names in code must match the exact file name (without `.ttf` extension)

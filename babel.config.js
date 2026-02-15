module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@module': './src/module',
          '@core': './src/core',
          '@component': './src/component',
          '@asset': './src/assets',
        },
      },
    ],
  ],
};

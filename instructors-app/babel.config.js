module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel", // Available for layout utilities, but Academy uses custom theme system
    ],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@shared': '../shared/src',
            '@academy/mobile-shared': '../shared/src',
          },
        },
      ],
      'react-native-reanimated/plugin', // Must be last
    ],
  };
};
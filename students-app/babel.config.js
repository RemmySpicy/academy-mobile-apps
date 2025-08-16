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
            '@academy/mobile-shared': '../shared/src',
            '@shared': '../shared/src',
          },
        },
      ],
      // Enable reanimated plugin for animations (must be last)
      'react-native-reanimated/plugin',
    ],
  };
};
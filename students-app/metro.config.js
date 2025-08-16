const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

// Minimal monorepo configuration
config.watchFolders = [workspaceRoot];

config.resolver.alias = {
  '@shared': path.resolve(workspaceRoot, 'shared/src'),
};

// React 19 + New Architecture compatibility fixes
config.resolver.unstable_enableSymlinks = false;
config.resolver.unstable_enablePackageExports = true;

// Ensure proper module resolution for React 19
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];
config.resolver.platforms = ['ios', 'android', 'web', 'native'];

// Force React resolution to specific version to prevent duplicates
config.resolver.alias = {
  ...config.resolver.alias,
  'react': path.resolve(__dirname, 'node_modules/react'),
  'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
};

module.exports = withNativeWind(config, { input: './global.css' });
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

// Monorepo configuration
config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// Add alias for shared package
config.resolver.alias = {
  '@academy/mobile-shared': path.resolve(workspaceRoot, 'shared/src'),
  '@shared': path.resolve(workspaceRoot, 'shared/src'),
};

module.exports = config;
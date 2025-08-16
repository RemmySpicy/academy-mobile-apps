#!/usr/bin/env node

/**
 * NativeWind 4.x Migration Assistant
 * Handles the upgrade from NativeWind 2.x to 4.x safely
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectRoot = path.resolve(__dirname, '../../..');

// NativeWind 4.x requirements and changes
const nativeWind4Config = {
  dependencies: {
    'nativewind': '^4.1.23',
    'react-native-reanimated': '~3.17.4',
    'react-native-safe-area-context': '>=5.4.0',
    'tailwindcss': '^3.4.17'
  },
  devDependencies: {
    'prettier-plugin-tailwindcss': '^0.5.11'
  },
  breakingChanges: [
    'styled() API has been removed',
    'New Metro configuration required',
    'Specificity algorithm changed',
    'Animation support is now built-in',
    'Group syntax support added'
  ],
  benefits: [
    '60% better performance',
    'Smaller bundle size',
    'Better tree shaking',
    'Built-in animation support',
    'Group and peer modifiers',
    'Better TypeScript support'
  ]
};

// Metro configuration for NativeWind 4
const metroConfig = `const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: './global.css' });
`;

// Global CSS for NativeWind 4
const globalCSS = `@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom base styles */
* {
  box-sizing: border-box;
}

/* React Native specific optimizations */
.text-base {
  font-size: 16px;
  line-height: 24px;
}

/* Custom component styles */
@layer components {
  .btn-primary {
    @apply bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded;
  }
  
  .card {
    @apply bg-white rounded-lg shadow-md p-4 m-2;
  }
}

/* Utilities for React Native */
@layer utilities {
  .safe-area-top {
    padding-top: env(safe-area-inset-top);
  }
  
  .safe-area-bottom {
    padding-bottom: env(safe-area-inset-bottom);
  }
}
`;

// Updated Tailwind config for NativeWind 4
const tailwindConfigV4 = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}", 
    "./src/**/*.{js,jsx,ts,tsx}",
    "../shared/src/**/*.{js,jsx,ts,tsx}" // Include shared components
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // Custom theme extensions
      colors: {
        'academy-primary': '#4F2EC9',
        'academy-secondary': '#7C3AED',
        'academy-accent': '#F59E0B',
      },
      fontFamily: {
        'academy': ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
`;

// App.tsx wrapper for NativeWind 4
const appWrapperCode = `// Add this to your App.tsx for NativeWind 4
import "./global.css";

// Rest of your App component...
`;

function checkCurrentSetup() {
  console.log('🔍 Checking current NativeWind setup...\n');
  
  const apps = ['instructors-app', 'students-app'];
  const setup = {};
  
  apps.forEach(app => {
    const appPath = path.join(projectRoot, app);
    const packageJsonPath = path.join(appPath, 'package.json');
    
    if (!fs.existsSync(packageJsonPath)) {
      setup[app] = { exists: false };
      return;
    }
    
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const currentNativeWind = pkg.dependencies?.nativewind || pkg.devDependencies?.nativewind;
    const hasMetroConfig = fs.existsSync(path.join(appPath, 'metro.config.js'));
    const hasTailwindConfig = fs.existsSync(path.join(appPath, 'tailwind.config.js'));
    const hasGlobalCSS = fs.existsSync(path.join(appPath, 'global.css'));
    
    setup[app] = {
      exists: true,
      currentNativeWind,
      hasMetroConfig,
      hasTailwindConfig,
      hasGlobalCSS,
      dependencies: pkg.dependencies,
      devDependencies: pkg.devDependencies
    };
  });
  
  return setup;
}

function checkCompatibility(setup) {
  console.log('📋 Compatibility Check:\n');
  
  const compatibility = {};
  
  Object.entries(setup).forEach(([app, config]) => {
    if (!config.exists) {
      compatibility[app] = { canUpgrade: false, reason: 'App not found' };
      return;
    }
    
    const issues = [];
    const requirements = [];
    
    // Check React Native version
    const rnVersion = config.dependencies?.['react-native'];
    if (rnVersion && !rnVersion.includes('0.79')) {
      issues.push('React Native 0.79+ required for optimal performance');
    }
    
    // Check Reanimated version
    const reanimatedVersion = config.dependencies?.['react-native-reanimated'];
    if (!reanimatedVersion || !reanimatedVersion.includes('3.17')) {
      requirements.push('react-native-reanimated ~3.17.4');
    }
    
    // Check safe area context
    const safeAreaVersion = config.dependencies?.['react-native-safe-area-context'];
    if (!safeAreaVersion || !safeAreaVersion.includes('5.')) {
      requirements.push('react-native-safe-area-context >=5.4.0');
    }
    
    // Check Tailwind version
    const tailwindVersion = config.devDependencies?.tailwindcss;
    if (!tailwindVersion || !tailwindVersion.includes('3.')) {
      requirements.push('tailwindcss ^3.4.17');
    }
    
    compatibility[app] = {
      canUpgrade: issues.length === 0,
      issues,
      requirements,
      currentVersion: config.currentNativeWind
    };
    
    console.log(`📱 ${app}:`);
    console.log(`   Current NativeWind: ${config.currentNativeWind || 'Not found'}`);
    console.log(`   Can upgrade: ${compatibility[app].canUpgrade ? '✅' : '⚠️'}`);
    
    if (issues.length > 0) {
      console.log(`   Issues:`);
      issues.forEach(issue => console.log(`     • ${issue}`));
    }
    
    if (requirements.length > 0) {
      console.log(`   Required updates:`);
      requirements.forEach(req => console.log(`     • ${req}`));
    }
    
    console.log('');
  });
  
  return compatibility;
}

function generateMigrationPlan(setup, compatibility) {
  console.log('📋 NativeWind 4.x Migration Plan:\n');
  
  const plan = {
    phase1: 'Prepare Dependencies',
    phase2: 'Update Configuration',
    phase3: 'Test & Verify',
    steps: []
  };
  
  // Phase 1: Dependencies
  console.log('🔨 PHASE 1: Prepare Dependencies');
  console.log('─'.repeat(30));
  
  Object.entries(compatibility).forEach(([app, compat]) => {
    if (!compat.canUpgrade) return;
    
    console.log(`\n📱 ${app}:`);
    
    if (compat.requirements.length > 0) {
      console.log('   Update required packages:');
      compat.requirements.forEach(req => {
        console.log(`     npm install ${req}`);
        plan.steps.push({ app, action: `npm install ${req}`, phase: 1 });
      });
    }
    
    console.log('   Install NativeWind 4:');
    console.log('     npm install nativewind@^4.1.23');
    console.log('     npm install --save-dev prettier-plugin-tailwindcss@^0.5.11');
    plan.steps.push({ app, action: 'npm install nativewind@^4.1.23', phase: 1 });
  });
  
  // Phase 2: Configuration
  console.log('\n\n🔧 PHASE 2: Update Configuration');
  console.log('─'.repeat(30));
  
  console.log('\n1. Update Metro configuration:');
  console.log('   • Replace metro.config.js with NativeWind 4 config');
  console.log('   • Add withNativeWind wrapper');
  
  console.log('\n2. Update Tailwind configuration:');
  console.log('   • Add nativewind/preset');
  console.log('   • Update content paths');
  console.log('   • Add custom theme extensions');
  
  console.log('\n3. Create global.css:');
  console.log('   • Add Tailwind directives');
  console.log('   • Include custom components');
  console.log('   • Add React Native optimizations');
  
  console.log('\n4. Update App.tsx:');
  console.log('   • Import global.css');
  console.log('   • Remove any styled() usage');
  
  // Phase 3: Testing
  console.log('\n\n🧪 PHASE 3: Test & Verify');
  console.log('─'.repeat(30));
  
  console.log('\n1. Development testing:');
  console.log('   • Start development server');
  console.log('   • Test className prop functionality');
  console.log('   • Verify animations work');
  console.log('   • Check group syntax');
  
  console.log('\n2. Platform testing:');
  console.log('   • Test on iOS simulator');
  console.log('   • Test on Android emulator');
  console.log('   • Test on web (if applicable)');
  
  console.log('\n3. Performance verification:');
  console.log('   • Check bundle size reduction');
  console.log('   • Verify animation performance');
  console.log('   • Test styling compilation speed');
  
  return plan;
}

function createMigrationFiles(app) {
  const appPath = path.join(projectRoot, app);
  
  console.log(`\n📁 Creating migration files for ${app}...`);
  
  // Backup existing files
  const filesToBackup = ['metro.config.js', 'tailwind.config.js'];
  filesToBackup.forEach(file => {
    const filePath = path.join(appPath, file);
    if (fs.existsSync(filePath)) {
      const backupPath = path.join(appPath, `${file}.backup`);
      fs.copyFileSync(filePath, backupPath);
      console.log(`   📋 Backed up ${file} to ${file}.backup`);
    }
  });
  
  // Create new Metro config
  fs.writeFileSync(path.join(appPath, 'metro.config.js'), metroConfig);
  console.log('   ✅ Created metro.config.js for NativeWind 4');
  
  // Create new Tailwind config
  fs.writeFileSync(path.join(appPath, 'tailwind.config.js'), tailwindConfigV4);
  console.log('   ✅ Created tailwind.config.js for NativeWind 4');
  
  // Create global.css
  fs.writeFileSync(path.join(appPath, 'global.css'), globalCSS);
  console.log('   ✅ Created global.css');
  
  // Create App.tsx note
  fs.writeFileSync(path.join(appPath, 'nativewind-4-integration.txt'), appWrapperCode);
  console.log('   📝 Created integration notes in nativewind-4-integration.txt');
}

function updateSharedPackageJson() {
  const sharedPackageJsonPath = path.join(projectRoot, 'shared', 'package.json');
  
  if (!fs.existsSync(sharedPackageJsonPath)) return;
  
  console.log('\n📦 Updating shared package.json...');
  
  const pkg = JSON.parse(fs.readFileSync(sharedPackageJsonPath, 'utf8'));
  
  // Update peer dependencies for NativeWind 4 compatibility
  if (pkg.peerDependencies) {
    pkg.peerDependencies['react-native-reanimated'] = '~3.17.4';
    pkg.peerDependencies['react-native-safe-area-context'] = '^5.6.0';
  }
  
  // Add NativeWind 4 compatibility note
  if (!pkg.keywords.includes('nativewind-4')) {
    pkg.keywords.push('nativewind-4');
  }
  
  fs.writeFileSync(sharedPackageJsonPath, JSON.stringify(pkg, null, 2));
  console.log('   ✅ Updated shared package.json for NativeWind 4 compatibility');
}

function main(args = []) {
  console.log('🚀 NativeWind 4.x Migration Assistant\n');
  console.log('═'.repeat(40));
  
  if (args.includes('--dry-run')) {
    console.log('🔍 DRY RUN MODE - No files will be modified\n');
  }
  
  // Check current setup
  const setup = checkCurrentSetup();
  
  // Check compatibility
  const compatibility = checkCompatibility(setup);
  
  // Generate migration plan
  const plan = generateMigrationPlan(setup, compatibility);
  
  // Create migration files if not dry run
  if (!args.includes('--dry-run')) {
    const appsToMigrate = Object.entries(compatibility)
      .filter(([app, compat]) => compat.canUpgrade)
      .map(([app]) => app);
    
    if (appsToMigrate.length > 0) {
      console.log('\n🔧 Creating migration files...');
      appsToMigrate.forEach(app => createMigrationFiles(app));
      updateSharedPackageJson();
    }
    
    console.log('\n✨ Migration files created!');
    console.log('\n📋 Next Steps:');
    console.log('1. Review the generated configuration files');
    console.log('2. Install the updated dependencies');
    console.log('3. Add the global.css import to your App.tsx');
    console.log('4. Test the setup in development');
    console.log('5. Run the modernization health check');
    
    console.log('\n🧪 Testing Commands:');
    console.log('npm run health:check    # Check for any issues');
    console.log('npm start              # Start development server');
    
  } else {
    console.log('\n💡 Run without --dry-run to create migration files');
  }
  
  console.log('\n📚 Resources:');
  console.log('• NativeWind 4 docs: https://nativewind.dev/v4/overview');
  console.log('• Migration guide: https://nativewind.dev/v4/migration-guide');
  console.log('• Performance tips: https://nativewind.dev/v4/performance');
}

if (require.main === module) {
  const args = process.argv.slice(2);
  main(args);
}

module.exports = {
  checkCurrentSetup,
  checkCompatibility,
  generateMigrationPlan,
  createMigrationFiles
};
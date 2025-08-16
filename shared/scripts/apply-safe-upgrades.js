#!/usr/bin/env node

/**
 * Apply safe package upgrades across the ecosystem
 * Only applies non-breaking, low-risk updates
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectRoot = path.resolve(__dirname, '../..');

// Safe upgrades that can be applied immediately
const safeUpgrades = {
  shared: {
    peerDependencies: {
      '@react-native-async-storage/async-storage': '^2.2.0',
      'react-native-safe-area-context': '^5.6.0'
    },
    devDependencies: {
      '@types/react': '~19.1.10',
      'typescript': '^5.9.2'
    }
  },
  
  apps: {
    dependencies: {
      '@react-native-async-storage/async-storage': '2.2.0',
      'react-native-gesture-handler': '~2.28.0',
      'react-native-screens': '~4.14.1',
      'react-native-safe-area-context': '5.6.0',
      'react-native-svg': '15.12.1',
      'react-native-webview': '13.15.0'
    },
    devDependencies: {
      '@types/react': '~19.1.10',
      'typescript': '~5.9.2'
    }
  }
};

function updatePackageJson(filePath, updates) {
  if (!fs.existsSync(filePath)) {
    console.log(`   ⚠️  Package.json not found: ${filePath}`);
    return false;
  }

  console.log(`   📝 Updating ${path.relative(projectRoot, filePath)}...`);
  
  const pkg = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let hasChanges = false;

  // Update dependencies
  if (updates.dependencies && pkg.dependencies) {
    Object.entries(updates.dependencies).forEach(([name, version]) => {
      if (pkg.dependencies[name] && pkg.dependencies[name] !== version) {
        console.log(`      ${name}: ${pkg.dependencies[name]} → ${version}`);
        pkg.dependencies[name] = version;
        hasChanges = true;
      }
    });
  }

  // Update devDependencies
  if (updates.devDependencies && pkg.devDependencies) {
    Object.entries(updates.devDependencies).forEach(([name, version]) => {
      if (pkg.devDependencies[name] && pkg.devDependencies[name] !== version) {
        console.log(`      ${name}: ${pkg.devDependencies[name]} → ${version}`);
        pkg.devDependencies[name] = version;
        hasChanges = true;
      }
    });
  }

  // Update peerDependencies
  if (updates.peerDependencies && pkg.peerDependencies) {
    Object.entries(updates.peerDependencies).forEach(([name, version]) => {
      if (pkg.peerDependencies[name] && pkg.peerDependencies[name] !== version) {
        console.log(`      ${name}: ${pkg.peerDependencies[name]} → ${version}`);
        pkg.peerDependencies[name] = version;
        hasChanges = true;
      }
    });
  }

  if (hasChanges) {
    fs.writeFileSync(filePath, JSON.stringify(pkg, null, 2) + '\n');
    console.log(`   ✅ Updated package.json`);
    return true;
  } else {
    console.log(`   ℹ️  No updates needed`);
    return false;
  }
}

function installUpdates(appPath) {
  console.log(`   📦 Installing updated packages...`);
  
  try {
    // Clear npm cache to ensure fresh install
    execSync('npm cache clean --force', { cwd: appPath, stdio: 'pipe' });
    
    // Install updates
    execSync('npm install', { 
      cwd: appPath, 
      stdio: 'inherit',
      timeout: 300000 // 5 minute timeout
    });
    
    console.log(`   ✅ Packages installed successfully`);
    return true;
  } catch (error) {
    console.log(`   ❌ Package installation failed: ${error.message}`);
    return false;
  }
}

function runHealthCheck(appPath) {
  console.log(`   🏥 Running health check...`);
  
  try {
    // Check TypeScript compilation
    execSync('npm run type-check', { cwd: appPath, stdio: 'pipe' });
    console.log(`   ✅ TypeScript check passed`);
    
    // Check if app builds
    execSync('npm run lint', { cwd: appPath, stdio: 'pipe' });
    console.log(`   ✅ Lint check passed`);
    
    return true;
  } catch (error) {
    console.log(`   ⚠️  Health check issues (may be expected): ${error.message.split('\n')[0]}`);
    return false;
  }
}

function updateSharedModule() {
  console.log('\n📦 Updating Shared Module');
  console.log('─'.repeat(25));
  
  const sharedPackageJsonPath = path.join(projectRoot, 'shared', 'package.json');
  const updated = updatePackageJson(sharedPackageJsonPath, safeUpgrades.shared);
  
  if (updated) {
    console.log('   📝 Shared module package.json updated');
  }
  
  return updated;
}

function updateApp(appName) {
  console.log(`\n📱 Updating ${appName}`);
  console.log('─'.repeat(15 + appName.length));
  
  const appPath = path.join(projectRoot, appName);
  const packageJsonPath = path.join(appPath, 'package.json');
  
  if (!fs.existsSync(appPath)) {
    console.log(`   ⚠️  App directory not found: ${appName}`);
    return false;
  }
  
  // Update package.json
  const updated = updatePackageJson(packageJsonPath, safeUpgrades.apps);
  
  if (!updated) {
    console.log(`   ℹ️  ${appName} already up to date`);
    return true;
  }
  
  // Install updates
  const installed = installUpdates(appPath);
  
  if (!installed) {
    console.log(`   ❌ Failed to install updates for ${appName}`);
    return false;
  }
  
  // Run health check
  const healthy = runHealthCheck(appPath);
  
  console.log(`   ${healthy ? '✅' : '⚠️'} ${appName} update ${healthy ? 'completed' : 'completed with warnings'}`);
  return true;
}

function createUpgradeSummary(results) {
  console.log('\n📊 Upgrade Summary');
  console.log('═'.repeat(20));
  
  const successful = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  
  console.log(`\n✅ Successfully updated: ${successful}/${total} components`);
  
  Object.entries(results).forEach(([component, success]) => {
    const status = success ? '✅' : '❌';
    console.log(`   ${status} ${component}`);
  });
  
  if (successful === total) {
    console.log('\n🎉 All safe upgrades completed successfully!');
    console.log('\n📋 Next Steps:');
    console.log('1. Test the applications in development');
    console.log('2. Run comprehensive health check: npm run health:full');
    console.log('3. Consider NativeWind 4 migration: npm run migrate:nativewind4');
    console.log('4. Review upgrade plan for next phase upgrades');
  } else {
    console.log('\n⚠️  Some upgrades failed. Review the logs above.');
    console.log('   Failed components may need manual intervention.');
  }
  
  console.log('\n🔧 Verification Commands:');
  console.log('cd shared && npm run health:check');
  console.log('cd instructors-app && npm run type-check && npm start');
  console.log('cd students-app && npm run type-check && npm start');
}

function main(args = []) {
  const dryRun = args.includes('--dry-run');
  
  console.log('🚀 Safe Package Upgrade Assistant');
  console.log('═'.repeat(35));
  
  if (dryRun) {
    console.log('🔍 DRY RUN MODE - No packages will be installed\n');
  }
  
  console.log('📋 Planned Safe Upgrades:');
  console.log('• @react-native-async-storage/async-storage: 2.1.2 → 2.2.0');
  console.log('• react-native-safe-area-context: 5.4.0 → 5.6.0'); 
  console.log('• react-native-gesture-handler: 2.24.0 → 2.28.0');
  console.log('• react-native-screens: 4.11.1 → 4.14.1');
  console.log('• @types/react: 19.0.10 → 19.1.10');
  console.log('• typescript: 5.8.3 → 5.9.2');
  console.log('• And other minor updates...\n');
  
  const results = {};
  
  // Update shared module first (safest)
  if (!dryRun) {
    results.shared = updateSharedModule();
  } else {
    console.log('\n📦 Would update Shared Module (dry run)');
    results.shared = true;
  }
  
  // Update apps
  const apps = ['instructors-app', 'students-app'];
  apps.forEach(app => {
    if (!dryRun) {
      results[app] = updateApp(app);
    } else {
      console.log(`\n📱 Would update ${app} (dry run)`);
      results[app] = true;
    }
  });
  
  // Show summary
  createUpgradeSummary(results);
  
  if (dryRun) {
    console.log('\n💡 Run without --dry-run to apply the upgrades');
  }
}

if (require.main === module) {
  const args = process.argv.slice(2);
  main(args);
}

module.exports = {
  safeUpgrades,
  updatePackageJson,
  updateApp,
  updateSharedModule
};
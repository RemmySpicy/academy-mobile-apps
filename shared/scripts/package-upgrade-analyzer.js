#!/usr/bin/env node

/**
 * Intelligent package upgrade analyzer
 * Identifies safe upgrades and breaking changes for ecosystem packages
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectRoot = path.resolve(__dirname, '../../..');

// Major version upgrade strategies
const upgradeStrategies = {
  nativewind: {
    current: '^2.0.11',
    target: '^4.1.23',
    breaking: true,
    requirements: {
      'react-native': '>=0.79.0',
      'react-native-reanimated': '~3.17.4',
      'react-native-safe-area-context': '>=5.4.0',
      'tailwindcss': '^3.4.17'
    },
    breakingChanges: [
      'styled() API removed - use tw-classed or className directly',
      'Specificity algorithm changed - rem processing',
      'Animation support now built-in - no need for Animated.View',
      'Group syntax support added',
      'Metro configuration changes required'
    ],
    migrationSteps: [
      'Update dependencies to required versions',
      'Update Metro configuration for NativeWind 4',
      'Replace styled() usage with className',
      'Update Tailwind configuration',
      'Test animation transitions',
      'Verify group syntax works'
    ],
    impact: 'LOW', // Since minimal usage currently
    automatable: true
  },

  'react-native-reanimated': {
    current: '~3.17.4',
    target: '^4.0.2',
    breaking: true,
    requirements: {
      'react-native': '>=0.81.0' // RN 4.x requires newer RN
    },
    breakingChanges: [
      'New Architecture (Fabric) required',
      'Some deprecated APIs removed',
      'Performance improvements may change timing'
    ],
    blockers: ['Requires React Native 0.81+'],
    impact: 'HIGH',
    automatable: false
  },

  '@react-native-async-storage/async-storage': {
    current: '2.1.2',
    target: '2.2.0',
    breaking: false,
    requirements: {},
    changes: [
      'Bug fixes for Android data corruption',
      'Performance improvements',
      'TypeScript definitions updates'
    ],
    migrationSteps: [
      'Update package version',
      'Test storage operations',
      'Verify TypeScript types'
    ],
    impact: 'LOW',
    automatable: true
  },

  '@types/react': {
    current: '~19.0.10',
    target: '~19.1.10',
    breaking: false,
    requirements: {
      'react': '^19.1.0'
    },
    changes: [
      'Updated type definitions for React 19.1',
      'Better TypeScript inference',
      'New hook type definitions'
    ],
    migrationSteps: [
      'Update React to 19.1.x first',
      'Update @types/react',
      'Fix any TypeScript errors'
    ],
    impact: 'LOW',
    automatable: true
  },

  'react-native-gesture-handler': {
    current: '~2.24.0',
    target: '^2.28.0',
    breaking: false,
    requirements: {},
    changes: [
      'Performance improvements',
      'Bug fixes for gesture conflicts',
      'Better Web platform support'
    ],
    migrationSteps: [
      'Update package version',
      'Test gesture interactions',
      'Verify Web compatibility if using'
    ],
    impact: 'LOW',
    automatable: true
  },

  'react-native-screens': {
    current: '~4.11.1', 
    target: '^4.14.1',
    breaking: false,
    requirements: {},
    changes: [
      'iOS navigation improvements',
      'Android memory optimizations',
      'Better screen transition animations'
    ],
    migrationSteps: [
      'Update package version',
      'Test navigation flows',
      'Verify screen transitions'
    ],
    impact: 'MEDIUM',
    automatable: true
  },

  'react-native-safe-area-context': {
    current: '5.4.0',
    target: '^5.6.0',
    breaking: false,
    requirements: {},
    changes: [
      'Better notch support on Android',
      'Improved Web platform support',
      'Performance optimizations'
    ],
    migrationSteps: [
      'Update package version',
      'Test safe area on different devices',
      'Verify layout consistency'
    ],
    impact: 'LOW',
    automatable: true
  }
};

// Upgrade priority matrix
const priorityMatrix = {
  HIGH: ['security fixes', 'performance improvements', 'bug fixes'],
  MEDIUM: ['new features', 'developer experience'],
  LOW: ['cosmetic changes', 'documentation updates']
};

function analyzeCurrentVersions() {
  const apps = ['instructors-app', 'students-app'];
  const analysis = {};

  apps.forEach(app => {
    const packageJsonPath = path.join(projectRoot, app, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      analysis[app] = {
        dependencies: pkg.dependencies,
        devDependencies: pkg.devDependencies
      };
    }
  });

  // Shared module
  const sharedPackageJsonPath = path.join(projectRoot, 'shared', 'package.json');
  if (fs.existsSync(sharedPackageJsonPath)) {
    const pkg = JSON.parse(fs.readFileSync(sharedPackageJsonPath, 'utf8'));
    analysis.shared = {
      peerDependencies: pkg.peerDependencies,
      devDependencies: pkg.devDependencies
    };
  }

  return analysis;
}

function checkUpgradeCompatibility(packageName, strategy, currentVersions) {
  const compatibility = {
    canUpgrade: true,
    blockers: [],
    warnings: [],
    requirements: []
  };

  // Check version requirements
  if (strategy.requirements) {
    Object.entries(strategy.requirements).forEach(([reqPkg, reqVersion]) => {
      const currentVersion = findPackageVersion(reqPkg, currentVersions);
      
      if (!currentVersion) {
        compatibility.blockers.push(`Missing required package: ${reqPkg}@${reqVersion}`);
        compatibility.canUpgrade = false;
      } else if (!satisfiesVersion(currentVersion, reqVersion)) {
        compatibility.blockers.push(`${reqPkg} needs to be ${reqVersion}, currently ${currentVersion}`);
        compatibility.canUpgrade = false;
      }
    });
  }

  // Check for specific blockers
  if (strategy.blockers) {
    strategy.blockers.forEach(blocker => {
      compatibility.blockers.push(blocker);
      compatibility.canUpgrade = false;
    });
  }

  // Breaking change warnings
  if (strategy.breaking && strategy.breakingChanges) {
    compatibility.warnings.push('Breaking changes require manual testing');
    strategy.breakingChanges.forEach(change => {
      compatibility.warnings.push(`⚠️  ${change}`);
    });
  }

  return compatibility;
}

function findPackageVersion(packageName, versions) {
  for (const app of Object.values(versions)) {
    if (app.dependencies?.[packageName]) return app.dependencies[packageName];
    if (app.devDependencies?.[packageName]) return app.devDependencies[packageName];
    if (app.peerDependencies?.[packageName]) return app.peerDependencies[packageName];
  }
  return null;
}

function satisfiesVersion(current, required) {
  // Simplified version checking
  const cleanCurrent = current.replace(/[\^~>=<]/g, '');
  const cleanRequired = required.replace(/[\^~>=<]/g, '');
  
  const currentParts = cleanCurrent.split('.').map(Number);
  const requiredParts = cleanRequired.split('.').map(Number);
  
  for (let i = 0; i < Math.max(currentParts.length, requiredParts.length); i++) {
    const currentPart = currentParts[i] || 0;
    const requiredPart = requiredParts[i] || 0;
    
    if (currentPart > requiredPart) return true;
    if (currentPart < requiredPart) return false;
  }
  
  return true;
}

function createUpgradePlan(analysis) {
  const plan = {
    safe: [],
    risky: [],
    blocked: [],
    sequence: []
  };

  Object.entries(upgradeStrategies).forEach(([packageName, strategy]) => {
    const currentVersion = findPackageVersion(packageName, analysis);
    
    if (!currentVersion) {
      return; // Package not in use
    }

    const compatibility = checkUpgradeCompatibility(packageName, strategy, analysis);
    
    const upgrade = {
      package: packageName,
      current: currentVersion,
      target: strategy.target,
      strategy,
      compatibility,
      priority: getUpgradePriority(strategy)
    };

    if (!compatibility.canUpgrade) {
      plan.blocked.push(upgrade);
    } else if (strategy.breaking || strategy.impact === 'HIGH') {
      plan.risky.push(upgrade);
    } else {
      plan.safe.push(upgrade);
    }
  });

  // Create upgrade sequence
  plan.sequence = [
    ...plan.safe.sort((a, b) => getPriorityScore(a.priority) - getPriorityScore(b.priority)),
    ...plan.risky.sort((a, b) => getPriorityScore(a.priority) - getPriorityScore(b.priority))
  ];

  return plan;
}

function getUpgradePriority(strategy) {
  if (strategy.changes?.some(change => change.includes('security'))) return 'HIGH';
  if (strategy.impact === 'HIGH') return 'HIGH';
  if (strategy.impact === 'MEDIUM') return 'MEDIUM';
  return 'LOW';
}

function getPriorityScore(priority) {
  const scores = { HIGH: 1, MEDIUM: 2, LOW: 3 };
  return scores[priority] || 3;
}

function generateUpgradeReport(plan) {
  console.log('📦 Package Upgrade Analysis Report\n');
  console.log('═'.repeat(50));

  // Safe upgrades
  if (plan.safe.length > 0) {
    console.log('\n✅ SAFE UPGRADES (Recommended)');
    console.log('─'.repeat(30));
    plan.safe.forEach(upgrade => {
      console.log(`\n📦 ${upgrade.package}`);
      console.log(`   Current: ${upgrade.current}`);
      console.log(`   Target:  ${upgrade.target}`);
      console.log(`   Impact:  ${upgrade.strategy.impact}`);
      if (upgrade.strategy.changes) {
        console.log(`   Changes:`);
        upgrade.strategy.changes.forEach(change => {
          console.log(`     • ${change}`);
        });
      }
    });
  }

  // Risky upgrades
  if (plan.risky.length > 0) {
    console.log('\n⚠️  RISKY UPGRADES (Manual Review Required)');
    console.log('─'.repeat(40));
    plan.risky.forEach(upgrade => {
      console.log(`\n📦 ${upgrade.package}`);
      console.log(`   Current: ${upgrade.current}`);
      console.log(`   Target:  ${upgrade.target}`);
      console.log(`   Impact:  ${upgrade.strategy.impact}`);
      
      if (upgrade.strategy.breakingChanges) {
        console.log(`   Breaking Changes:`);
        upgrade.strategy.breakingChanges.forEach(change => {
          console.log(`     💥 ${change}`);
        });
      }
      
      if (upgrade.compatibility.warnings.length > 0) {
        console.log(`   Warnings:`);
        upgrade.compatibility.warnings.forEach(warning => {
          console.log(`     ⚠️  ${warning}`);
        });
      }
    });
  }

  // Blocked upgrades
  if (plan.blocked.length > 0) {
    console.log('\n❌ BLOCKED UPGRADES');
    console.log('─'.repeat(20));
    plan.blocked.forEach(upgrade => {
      console.log(`\n📦 ${upgrade.package}`);
      console.log(`   Current: ${upgrade.current}`);
      console.log(`   Target:  ${upgrade.target}`);
      console.log(`   Blockers:`);
      upgrade.compatibility.blockers.forEach(blocker => {
        console.log(`     🚫 ${blocker}`);
      });
    });
  }

  // Recommended sequence
  console.log('\n🎯 RECOMMENDED UPGRADE SEQUENCE');
  console.log('─'.repeat(30));
  plan.sequence.forEach((upgrade, index) => {
    const status = plan.safe.includes(upgrade) ? '✅' : '⚠️ ';
    console.log(`${index + 1}. ${status} ${upgrade.package} → ${upgrade.target}`);
  });

  console.log('\n💡 Next Steps:');
  console.log('1. 🔒 Apply safe upgrades first');
  console.log('2. 🧪 Test in development environment');
  console.log('3. ⚠️  Plan for risky upgrades separately');
  console.log('4. 🚫 Resolve blockers before major upgrades');
}

function main() {
  console.log('🔍 Analyzing package upgrade opportunities...\n');
  
  const analysis = analyzeCurrentVersions();
  const plan = createUpgradePlan(analysis);
  
  generateUpgradeReport(plan);
  
  return plan;
}

if (require.main === module) {
  main();
}

module.exports = {
  upgradeStrategies,
  analyzeCurrentVersions,
  createUpgradePlan,
  checkUpgradeCompatibility
};
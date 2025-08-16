#!/usr/bin/env node

/**
 * Comprehensive deprecation checker for React Native and Expo APIs
 * Scans codebase for deprecated patterns and suggests modern alternatives
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const sharedSrcPath = path.join(__dirname, '../src');

// Deprecation patterns to check for
const deprecationPatterns = {
  'TouchableOpacity usage': {
    pattern: /TouchableOpacity/g,
    replacement: 'Pressable',
    description: 'TouchableOpacity is deprecated in favor of Pressable',
    severity: 'warning'
  },
  
  'TouchableWithoutFeedback usage': {
    pattern: /TouchableWithoutFeedback/g,
    replacement: 'Pressable',
    description: 'TouchableWithoutFeedback is deprecated in favor of Pressable',
    severity: 'warning'
  },
  
  'TouchableHighlight usage': {
    pattern: /TouchableHighlight/g,
    replacement: 'Pressable',
    description: 'TouchableHighlight is deprecated in favor of Pressable',
    severity: 'warning'
  },
  
  'Dimensions.get() usage': {
    pattern: /Dimensions\.get\(/g,
    replacement: 'useWindowDimensions hook',
    description: 'Dimensions.get() is deprecated in favor of useWindowDimensions hook',
    severity: 'warning'
  },
  
  'Direct shadow properties': {
    pattern: /shadowColor\s*:|shadowOffset\s*:|shadowOpacity\s*:|shadowRadius\s*:/g,
    replacement: 'theme.elevation system',
    description: 'Direct shadow properties should use the elevation system',
    severity: 'info'
  },
  
  'Platform.select for shadows': {
    pattern: /Platform\.select\(\s*\{\s*ios:\s*\{[^}]*shadow[^}]*\}/g,
    replacement: 'theme.elevation',
    description: 'Platform.select for shadows should use theme.elevation',
    severity: 'info'
  },
  
  'AsyncStorage direct import': {
    pattern: /from\s+['"]react-native['"][^;]*AsyncStorage/g,
    replacement: '@react-native-async-storage/async-storage',
    description: 'AsyncStorage should be imported from @react-native-async-storage/async-storage',
    severity: 'error'
  },
  
  'Old StatusBar import': {
    pattern: /import\s*\{[^}]*StatusBar[^}]*\}\s*from\s*['"]react-native['"];/g,
    replacement: 'expo-status-bar',
    description: 'StatusBar should be imported from expo-status-bar in Expo apps',
    severity: 'warning'
  },
  
  'Deprecated Alert usage': {
    pattern: /Alert\.alert\(/g,
    replacement: 'Custom alert component',
    description: 'Consider using custom alert components for better UX',
    severity: 'info'
  },
  
  'WebView from react-native': {
    pattern: /import\s*\{[^}]*WebView[^}]*\}\s*from\s*['"]react-native['"];/g,
    replacement: 'react-native-webview',
    description: 'WebView should be imported from react-native-webview',
    severity: 'error'
  },
  
  'DeviceInfo from react-native': {
    pattern: /import\s*\{[^}]*DeviceInfo[^}]*\}\s*from\s*['"]react-native['"];/g,
    replacement: 'react-native-device-info',
    description: 'DeviceInfo should be imported from react-native-device-info',
    severity: 'error'
  },
  
  'Hardcoded colors': {
    pattern: /#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}/g,
    replacement: 'theme.colors system',
    description: 'Hardcoded colors should use the theme system',
    severity: 'info'
  }
};

// React Native version-specific deprecations
const versionSpecificDeprecations = {
  '0.70+': {
    'ScrollView.scrollTo': {
      pattern: /ScrollView\.scrollTo/g,
      replacement: 'ref.current?.scrollTo',
      description: 'Use ref.current?.scrollTo instead of ScrollView.scrollTo',
      severity: 'warning'
    }
  },
  
  '0.72+': {
    'Keyboard API changes': {
      pattern: /Keyboard\.addListener\s*\(\s*['"]keyboardWillShow['"]|Keyboard\.addListener\s*\(\s*['"]keyboardWillHide['"]/g,
      replacement: 'useKeyboard hook or modern keyboard handling',
      description: 'Keyboard API has changed, consider using modern alternatives',
      severity: 'info'
    }
  }
};

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.js') || file.endsWith('.jsx')) {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

function checkFileForDeprecations(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(sharedSrcPath, filePath);
    const issues = [];

    // Check each deprecation pattern
    Object.entries(deprecationPatterns).forEach(([name, config]) => {
      const matches = content.match(config.pattern);
      if (matches) {
        // Get line numbers for each match
        const lines = content.split('\n');
        const matchLines = [];
        
        lines.forEach((line, index) => {
          if (config.pattern.test(line)) {
            matchLines.push({
              lineNumber: index + 1,
              content: line.trim()
            });
          }
        });

        issues.push({
          name,
          ...config,
          count: matches.length,
          lines: matchLines
        });
      }
    });

    return { filePath: relativePath, issues };
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return { filePath, issues: [] };
  }
}

function formatSeverity(severity) {
  switch (severity) {
    case 'error': return chalk.red('ERROR');
    case 'warning': return chalk.yellow('WARNING');
    case 'info': return chalk.blue('INFO');
    default: return severity;
  }
}

function generateReport(results) {
  const totalIssues = results.reduce((sum, file) => sum + file.issues.length, 0);
  const filesWithIssues = results.filter(file => file.issues.length > 0);

  console.log(chalk.bold('\n🔍 Deprecation Check Report\n'));
  console.log(`📊 Scanned ${results.length} files`);
  console.log(`⚠️  Found issues in ${filesWithIssues.length} files`);
  console.log(`🐛 Total deprecation patterns: ${totalIssues}\n`);

  if (filesWithIssues.length === 0) {
    console.log(chalk.green('✨ No deprecation patterns found! Your codebase is modern! 🎉'));
    return;
  }

  // Group issues by severity
  const issuesBySeverity = {
    error: [],
    warning: [],
    info: []
  };

  filesWithIssues.forEach(file => {
    file.issues.forEach(issue => {
      issuesBySeverity[issue.severity].push({ ...issue, file: file.filePath });
    });
  });

  // Display by severity
  ['error', 'warning', 'info'].forEach(severity => {
    const issues = issuesBySeverity[severity];
    if (issues.length === 0) return;

    console.log(chalk.bold(`\n${formatSeverity(severity)} (${issues.length} issues):`));
    console.log('─'.repeat(50));

    issues.forEach(issue => {
      console.log(`\n📁 ${chalk.cyan(issue.file)}`);
      console.log(`   ${chalk.bold(issue.name)} (${issue.count} occurrences)`);
      console.log(`   💡 ${issue.description}`);
      console.log(`   🔧 Suggested: ${chalk.green(issue.replacement)}`);
      
      if (issue.lines.length <= 3) {
        issue.lines.forEach(line => {
          console.log(`   📍 Line ${line.lineNumber}: ${chalk.gray(line.content)}`);
        });
      } else {
        console.log(`   📍 Found on ${issue.lines.length} lines`);
      }
    });
  });

  // Summary
  console.log(chalk.bold('\n📋 Summary:'));
  console.log(`🔴 Errors: ${issuesBySeverity.error.length}`);
  console.log(`🟡 Warnings: ${issuesBySeverity.warning.length}`);
  console.log(`🔵 Info: ${issuesBySeverity.info.length}`);

  console.log(chalk.bold('\n🚀 Next Steps:'));
  console.log('1. Address errors first (blocking issues)');
  console.log('2. Update warnings for better compatibility');
  console.log('3. Consider info suggestions for improved code quality');
  console.log('4. Run automated modernization scripts where available');
}

function main() {
  console.log(chalk.bold('🔍 Starting comprehensive deprecation check...\n'));

  const files = getAllFiles(sharedSrcPath);
  const results = files.map(checkFileForDeprecations);

  generateReport(results);
}

if (require.main === module) {
  main();
}

module.exports = {
  deprecationPatterns,
  checkFileForDeprecations,
  generateReport
};
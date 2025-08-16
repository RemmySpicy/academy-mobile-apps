#!/usr/bin/env node

/**
 * Comprehensive Modernization Suite
 * Consolidates all modernization tools into one unified interface
 */

const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '../..');

// Import deprecation checker
const { deprecationPatterns, checkFileForDeprecations } = require('./deprecation-checker');

// Modernization functions
function modernizeTouchableOpacity(content) {
  let updated = content;
  
  // Replace TouchableOpacity imports
  updated = updated.replace(
    /import\s*{\s*([^}]*),?\s*TouchableOpacity\s*,?\s*([^}]*)\s*}\s*from\s*['"]react-native['"]/g,
    (match, before, after) => {
      const parts = [before, 'Pressable', after].filter(p => p && p.trim());
      return `import { ${parts.join(', ')} } from 'react-native'`;
    }
  );
  
  // Replace TouchableOpacity usage
  updated = updated.replace(/TouchableOpacity/g, 'Pressable');
  
  // Update onPress handlers for proper Pressable behavior
  updated = updated.replace(
    /(\s+)onPress=\{([^}]+)\}/g,
    '$1onPress={$2}'
  );
  
  return updated;
}

function modernizeShadowProps(content) {
  let updated = content;
  
  // Replace shadow props with elevation
  const shadowPatterns = [
    { old: /shadowColor:\s*['"][^'"]*['"]/, new: '// shadowColor replaced with elevation' },
    { old: /shadowOffset:\s*\{[^}]*\}/, new: '// shadowOffset replaced with elevation' },
    { old: /shadowOpacity:\s*[\d.]+/, new: '// shadowOpacity replaced with elevation' },
    { old: /shadowRadius:\s*[\d.]+/, new: '// shadowRadius replaced with elevation' },
    { old: /elevation:\s*\d+/, new: 'elevation: 4' }
  ];
  
  shadowPatterns.forEach(({ old, new: replacement }) => {
    updated = updated.replace(old, replacement);
  });
  
  // Add elevation if shadow props were found but no elevation exists
  if (content.includes('shadow') && !content.includes('elevation:')) {
    updated = updated.replace(
      /(style=\{\{[^}]*)(shadowColor|shadowOffset|shadowOpacity|shadowRadius)([^}]*)\}\}/g,
      '$1elevation: 4$3}}'
    );
  }
  
  return updated;
}

function modernizeDimensions(content) {
  let updated = content;
  
  // Replace Dimensions import
  updated = updated.replace(
    /import\s*{\s*([^}]*),?\s*Dimensions\s*,?\s*([^}]*)\s*}\s*from\s*['"]react-native['"]/g,
    (match, before, after) => {
      const parts = [before, 'useWindowDimensions', after].filter(p => p && p.trim());
      return `import { ${parts.join(', ')} } from 'react-native'`;
    }
  );
  
  // Replace Dimensions.get() with useWindowDimensions hook
  updated = updated.replace(
    /const\s+{\s*width\s*,\s*height\s*}\s*=\s*Dimensions\.get\(['"]window['"]\)/g,
    'const { width, height } = useWindowDimensions()'
  );
  
  updated = updated.replace(
    /Dimensions\.get\(['"]window['"]\)\.width/g,
    'useWindowDimensions().width'
  );
  
  updated = updated.replace(
    /Dimensions\.get\(['"]window['"]\)\.height/g,
    'useWindowDimensions().height'
  );
  
  return updated;
}

class ModernizationSuite {
  constructor() {
    this.results = {
      touchables: { processed: 0, modified: 0 },
      shadows: { processed: 0, modified: 0 },
      dimensions: { processed: 0, modified: 0 },
      deprecations: { files: 0, issues: 0 }
    };
  }

  async runAll(options = {}) {
    const { dryRun = false, verbose = false } = options;
    
    console.log('🚀 Comprehensive Modernization Suite');
    console.log('═'.repeat(40));
    
    if (dryRun) {
      console.log('🔍 DRY RUN MODE - No files will be modified\n');
    }

    const files = this.getAllFiles();
    console.log(`📁 Found ${files.length} files to analyze\n`);

    // Run all modernizations
    await this.modernizeTouchables(files, dryRun, verbose);
    await this.modernizeShadows(files, dryRun, verbose);
    await this.modernizeDimensions(files, dryRun, verbose);
    await this.checkDeprecations(files, verbose);

    this.showSummary();
  }

  async runSpecific(type, options = {}) {
    const { dryRun = false, verbose = false } = options;
    const files = this.getAllFiles();

    console.log(`🔧 Running ${type} modernization...\n`);

    switch (type) {
      case 'touchables':
        await this.modernizeTouchables(files, dryRun, verbose);
        break;
      case 'shadows':
        await this.modernizeShadows(files, dryRun, verbose);
        break;
      case 'dimensions':
        await this.modernizeDimensions(files, dryRun, verbose);
        break;
      case 'deprecations':
        await this.checkDeprecations(files, verbose);
        break;
      default:
        console.log(`❌ Unknown modernization type: ${type}`);
        return;
    }

    this.showSummary();
  }

  getAllFiles() {
    const files = [];
    const searchPaths = [
      path.join(projectRoot, 'shared/src'),
      path.join(projectRoot, 'instructors-app/src'),
      path.join(projectRoot, 'students-app/src')
    ];

    searchPaths.forEach(searchPath => {
      if (fs.existsSync(searchPath)) {
        this.getAllFilesRecursive(searchPath, files);
      }
    });

    return files.filter(file => file.match(/\.(tsx?|jsx?)$/));
  }

  getAllFilesRecursive(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath);

    files.forEach((file) => {
      const fullPath = path.join(dirPath, file);
      
      if (fs.statSync(fullPath).isDirectory()) {
        if (!['node_modules', '.expo', 'dist', 'build'].includes(file)) {
          this.getAllFilesRecursive(fullPath, arrayOfFiles);
        }
      } else {
        arrayOfFiles.push(fullPath);
      }
    });

    return arrayOfFiles;
  }

  async modernizeTouchables(files, dryRun, verbose) {
    console.log('🔄 Modernizing TouchableOpacity → Pressable...');
    
    let processed = 0;
    let modified = 0;

    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        
        if (content.includes('TouchableOpacity') || content.includes('TouchableWithoutFeedback')) {
          processed++;
          
          if (!dryRun) {
            const modernized = modernizeTouchableOpacity(content);
            if (modernized !== content) {
              fs.writeFileSync(file, modernized);
              modified++;
              if (verbose) {
                console.log(`   ✅ ${path.relative(projectRoot, file)}`);
              }
            }
          } else {
            modified++;
            if (verbose) {
              console.log(`   🔍 Would modernize: ${path.relative(projectRoot, file)}`);
            }
          }
        }
      } catch (error) {
        if (verbose) {
          console.log(`   ❌ Error processing ${file}: ${error.message}`);
        }
      }
    }

    this.results.touchables = { processed, modified };
    console.log(`   📊 Processed: ${processed}, Modified: ${modified}\n`);
  }

  async modernizeShadows(files, dryRun, verbose) {
    console.log('🌟 Modernizing shadow props → elevation...');
    
    let processed = 0;
    let modified = 0;

    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        
        if (content.includes('shadowColor') || content.includes('shadowOffset')) {
          processed++;
          
          if (!dryRun) {
            const modernized = modernizeShadowProps(content);
            if (modernized !== content) {
              fs.writeFileSync(file, modernized);
              modified++;
              if (verbose) {
                console.log(`   ✅ ${path.relative(projectRoot, file)}`);
              }
            }
          } else {
            modified++;
            if (verbose) {
              console.log(`   🔍 Would modernize: ${path.relative(projectRoot, file)}`);
            }
          }
        }
      } catch (error) {
        if (verbose) {
          console.log(`   ❌ Error processing ${file}: ${error.message}`);
        }
      }
    }

    this.results.shadows = { processed, modified };
    console.log(`   📊 Processed: ${processed}, Modified: ${modified}\n`);
  }

  async modernizeDimensions(files, dryRun, verbose) {
    console.log('📐 Modernizing Dimensions.get() → useWindowDimensions...');
    
    let processed = 0;
    let modified = 0;

    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        
        if (content.includes('Dimensions.get')) {
          processed++;
          
          if (!dryRun) {
            const modernized = modernizeDimensions(content);
            if (modernized !== content) {
              fs.writeFileSync(file, modernized);
              modified++;
              if (verbose) {
                console.log(`   ✅ ${path.relative(projectRoot, file)}`);
              }
            }
          } else {
            modified++;
            if (verbose) {
              console.log(`   🔍 Would modernize: ${path.relative(projectRoot, file)}`);
            }
          }
        }
      } catch (error) {
        if (verbose) {
          console.log(`   ❌ Error processing ${file}: ${error.message}`);
        }
      }
    }

    this.results.dimensions = { processed, modified };
    console.log(`   📊 Processed: ${processed}, Modified: ${modified}\n`);
  }

  async checkDeprecations(files, verbose) {
    console.log('🔍 Checking for deprecation patterns...');
    
    let filesWithIssues = 0;
    let totalIssues = 0;

    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        const result = checkFileForDeprecations(file, content);
        
        if (result.issues.length > 0) {
          filesWithIssues++;
          totalIssues += result.issues.length;
          
          if (verbose) {
            console.log(`   ⚠️  ${path.relative(projectRoot, file)}: ${result.issues.length} issues`);
            result.issues.forEach(issue => {
              console.log(`      • ${issue.name}: ${issue.description}`);
            });
          }
        }
      } catch (error) {
        if (verbose) {
          console.log(`   ❌ Error checking ${file}: ${error.message}`);
        }
      }
    }

    this.results.deprecations = { files: filesWithIssues, issues: totalIssues };
    console.log(`   📊 Files with issues: ${filesWithIssues}, Total issues: ${totalIssues}\n`);
  }

  showSummary() {
    console.log('📊 Modernization Summary');
    console.log('═'.repeat(25));
    
    const { touchables, shadows, dimensions, deprecations } = this.results;
    
    console.log(`🔄 TouchableOpacity: ${touchables.modified}/${touchables.processed} files modernized`);
    console.log(`🌟 Shadow Props: ${shadows.modified}/${shadows.processed} files modernized`);
    console.log(`📐 Dimensions: ${dimensions.modified}/${dimensions.processed} files modernized`);
    console.log(`🔍 Deprecations: ${deprecations.issues} issues in ${deprecations.files} files`);
    
    const totalModified = touchables.modified + shadows.modified + dimensions.modified;
    const totalProcessed = touchables.processed + shadows.processed + dimensions.processed;
    
    console.log(`\n✨ Total: ${totalModified}/${totalProcessed} files modernized`);
    
    if (deprecations.issues > 0) {
      console.log(`\n⚠️  ${deprecations.issues} deprecation warnings need attention`);
      console.log('   Run with --verbose to see details');
    }
    
    if (totalModified > 0) {
      console.log('\n🎉 Modernization completed successfully!');
      console.log('\n📝 Next steps:');
      console.log('1. Test your applications');
      console.log('2. Run health check: npm run health:check');
      console.log('3. Consider package upgrades: npm run upgrade:safe');
    }
  }
}

// CLI Interface
function main() {
  const args = process.argv.slice(2);
  const suite = new ModernizationSuite();
  
  const dryRun = args.includes('--dry-run');
  const verbose = args.includes('--verbose');
  const type = args.find(arg => !arg.startsWith('--'));
  
  const options = { dryRun, verbose };
  
  if (type && ['touchables', 'shadows', 'dimensions', 'deprecations'].includes(type)) {
    suite.runSpecific(type, options);
  } else if (type) {
    console.log(`❌ Unknown command: ${type}`);
    console.log('Available commands: touchables, shadows, dimensions, deprecations');
    process.exit(1);
  } else {
    suite.runAll(options);
  }
}

if (require.main === module) {
  main();
}

module.exports = { ModernizationSuite };
#!/bin/bash

# Script to check Academy Theme System compliance
echo "🎨 Academy Theme System - Compliance Checker"
echo "============================================="
echo ""

echo "1. Files with mixed className and Academy theme usage:"
echo "===================================================="
grep -r "className=" --include="*.tsx" --include="*.jsx" shared/ instructors-app/ students-app/ | grep -l "useTheme\|createThemedStyles" | head -10

echo ""
echo "2. Components with conflicting theme imports:"
echo "==========================================="
grep -r "import.*theme.*from.*theme" --include="*.tsx" --include="*.jsx" shared/ instructors-app/ students-app/ | head -10

echo ""
echo "3. Files using both style and className (not recommended):"
echo "========================================================"
grep -r "style=" --include="*.tsx" --include="*.jsx" shared/ instructors-app/ students-app/ | grep "className=" | head -10

echo ""
echo "4. Components that should use Academy theme system:"
echo "================================================="
grep -r "className=" --include="*.tsx" --include="*.jsx" instructors-app/src/ students-app/src/ | grep -v node_modules | head -10

echo ""
echo "5. Hardcoded Academy colors (should use theme tokens):"
echo "===================================================="
grep -r "#4F2EC9\|#52E2BB\|#121212\|#FEAE24" --include="*.tsx" --include="*.jsx" shared/ instructors-app/ students-app/ | grep -v "theme" | head -5

echo ""
echo "🎯 Academy Theme Best Practices:"
echo "✅ Use: import { useTheme, createThemedStyles } from '@academy/mobile-shared'"
echo "✅ Use: theme.colors.interactive.primary (Academy purple)"
echo "✅ Use: theme.colors.interactive.teal (Academy teal)"
echo "✅ Use: style prop with StyleSheet"
echo "❌ Avoid: className on Academy components"
echo "❌ Avoid: Hardcoded colors (#4F2EC9, #52E2BB)"
echo "❌ Avoid: Mixed style and className"
echo ""
echo "🔧 Quick fixes:"
echo "- Convert className to StyleSheet + theme tokens"
echo "- Replace hardcoded colors with theme.colors.*"
echo "- Clear Metro cache: npx expo start --clear"
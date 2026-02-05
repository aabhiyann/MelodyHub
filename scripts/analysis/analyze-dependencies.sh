#!/bin/bash
# analyze-dependencies.sh
# Checks for unused dependencies in package.json

echo "================================================"
echo "Dependency Usage Analysis"
echo "================================================"
echo ""

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

BACKEND_DIR="backend"
OUTPUT_FILE="scripts/analysis/reports/dependencies-report.txt"

mkdir -p scripts/analysis/reports

echo "Analyzing dependencies in $BACKEND_DIR..."
echo ""

{
    echo "================================================"
    echo "Dependency Usage Analysis Report"
    echo "Generated: $(date)"
    echo "================================================"
    echo ""
    
    cd "$BACKEND_DIR" || exit 1
    
    echo "INSTALLED DEPENDENCIES"
    echo "----------------------"
    
    # Extract dependencies from package.json
    if [ -f "package.json" ]; then
        echo "Dependencies from package.json:"
        echo ""
        
        # Use node to parse JSON properly
        node -e "
            const pkg = require('./package.json');
            const deps = pkg.dependencies || {};
            const devDeps = pkg.devDependencies || {};
            
            console.log('Production Dependencies:');
            Object.keys(deps).forEach(dep => {
                console.log('  -', dep, ':', deps[dep]);
            });
            
            console.log('');
            console.log('Dev Dependencies:');
            Object.keys(devDeps).forEach(dep => {
                console.log('  -', dep, ':', devDeps[dep]);
            });
        "
    else
        echo "⚠️  package.json not found"
    fi
    
    echo ""
    echo "USAGE CHECK"
    echo "-----------"
    echo "Checking if dependencies are imported in code..."
    echo ""
    
    # Check common dependencies
    DEPS=("express" "mongoose" "dotenv" "cors" "socket.io" "bcryptjs" "jsonwebtoken" "cloudinary" "cookie-parser")
    
    for dep in "${DEPS[@]}"; do
        COUNT=$(grep -r "from ['\"]$dep['\"]\\|require(['\"]$dep['\"])" src --include="*.ts" --include="*.js" 2>/dev/null | wc -l | tr -d ' ')
        if [ "$COUNT" -eq 0 ]; then
            echo "⚠️  $dep - NOT FOUND in imports (potentially unused)"
        else
            echo "✓ $dep - Used ($COUNT imports)"
        fi
    done
    
    echo ""
    echo "RECOMMENDATIONS"
    echo "---------------"
    echo "1. Review packages marked as 'potentially unused'"
    echo "2. Consider using 'npx depcheck' for comprehensive analysis"
    echo "3. Remove truly unused dependencies to reduce bundle size"
    echo "4. Update outdated dependencies"
    echo ""
    echo "Run this for detailed analysis:"
    echo "  cd backend && npx depcheck"
    
} > "$OUTPUT_FILE"

echo -e "${GREEN}Report saved to: $OUTPUT_FILE${NC}"
echo ""
cat "$OUTPUT_FILE"

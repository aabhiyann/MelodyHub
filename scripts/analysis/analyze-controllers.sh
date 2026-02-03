#!/bin/bash
# analyze-controllers.sh
# Analyzes controller patterns and detects inconsistencies

echo "================================================"
echo "Controller Pattern Analysis"
echo "================================================"
echo ""

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

CONTROLLERS_DIR="backend/src/controllers"
OUTPUT_FILE="scripts/analysis/reports/controller-patterns-report.txt"

mkdir -p scripts/analysis/reports

echo "Analyzing controllers in $CONTROLLERS_DIR..."
echo ""

{
    echo "================================================"
    echo "Controller Pattern Analysis Report"
    echo "Generated: $(date)"
    echo "================================================"
    echo ""
    
    echo "CONTROLLER FILES"
    echo "----------------"
    find "$CONTROLLERS_DIR" -name "*.ts" -type f | while read file; do
        echo "✓ $file"
    done
    
    echo ""
    echo "PATTERN 1: Class-based vs Function-based"
    echo "-----------------------------------------"
    echo ""
    echo "Class-based controllers:"
    grep -l "export class.*Controller" "$CONTROLLERS_DIR"/*.ts 2>/dev/null || echo "  None found"
    
    echo ""
    echo "Function-based controllers:"
    grep -L "export class.*Controller" "$CONTROLLERS_DIR"/*.ts 2>/dev/null || echo "  All are class-based"
    
    echo ""
    echo "PATTERN 2: Error Handling"
    echo "-------------------------"
    echo ""
    echo "Controllers using try-catch:"
    grep -l "try {" "$CONTROLLERS_DIR"/*.ts | wc -l | xargs echo "  Count:"
    
    echo ""
    echo "Controllers with custom error handling:"
    grep -l "catch.*error" "$CONTROLLERS_DIR"/*.ts | wc -l | xargs echo "  Count:"
    
    echo ""
    echo "PATTERN 3: Response Methods"
    echo "---------------------------"
    echo ""
    echo "Using handleSuccess():"
    grep -c "handleSuccess" "$CONTROLLERS_DIR"/*.ts | grep -v ":0$" || echo "  None"
    
    echo ""
    echo "Using handleError():"
    grep -c "handleError" "$CONTROLLERS_DIR"/*.ts | grep -v ":0$" || echo "  None"
    
    echo ""
    echo "Direct res.status() calls:"
    grep -c "res\.status" "$CONTROLLERS_DIR"/*.ts | grep -v ":0$" || echo "  None"
    
    echo ""
    echo "PATTERN 4: Validation"
    echo "---------------------"
    echo ""
    echo "Using validation libraries:"
    grep -l "validate\|schema\|joi\|yup" "$CONTROLLERS_DIR"/*.ts 2>/dev/null || echo "  None found"
    
    echo ""
    echo "Manual validation (if statements):"
    grep -c "if.*!.*req\.\(body\|params\|query\)" "$CONTROLLERS_DIR"/*.ts | grep -v ":0$" || echo "  None"
    
    echo ""
    echo "PATTERN 5: Async/Await Usage"
    echo "----------------------------"
    echo ""
    echo "Async methods per file:"
    for file in "$CONTROLLERS_DIR"/*.ts; do
        count=$(grep -c "async " "$file")
        echo "  $(basename $file): $count async methods"
    done
    
    echo ""
    echo "RECOMMENDATIONS"
    echo "---------------"
    echo "1. Standardize on class-based or function-based controllers"
    echo "2. Use consistent error handling pattern (handleError helper)"
    echo "3. Use consistent response pattern (handleSuccess helper)"
    echo "4. Implement validation middleware"
    echo "5. Document the chosen patterns"
    
} > "$OUTPUT_FILE"

echo -e "${GREEN}Report saved to: $OUTPUT_FILE${NC}"
echo ""
cat "$OUTPUT_FILE"

#!/bin/bash
# analyze-services.sh
# Maps service layer patterns and structure

echo "================================================"
echo "Service Layer Pattern Analysis"
echo "================================================"
echo ""

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

SERVICES_DIR="backend/src/services"
OUTPUT_FILE="scripts/analysis/reports/service-patterns-report.txt"

mkdir -p scripts/analysis/reports

echo "Analyzing services in $SERVICES_DIR..."
echo ""

{
    echo "================================================"
    echo "Service Layer Pattern Analysis Report"
    echo "Generated: $(date)"
    echo "================================================"
    echo ""
    
    # Check if services directory exists
    if [ ! -d "$SERVICES_DIR" ]; then
        echo "⚠️  WARNING: Services directory not found at $SERVICES_DIR"
        echo ""
        echo "RECOMMENDATION:"
        echo "Create a services directory to separate business logic from controllers"
        exit 0
    fi
    
    echo "SERVICE FILES"
    echo "-------------"
    SERVICE_COUNT=$(find "$SERVICES_DIR" -name "*.ts" -type f | wc -l | tr -d ' ')
    echo "Total service files: $SERVICE_COUNT"
    echo ""
    find "$SERVICES_DIR" -name "*.ts" -type f | while read file; do
        echo "✓ $(basename $file)"
    done
    
    echo ""
    echo "SERVICE PATTERNS"
    echo "----------------"
    echo ""
    echo "Class-based services:"
    grep -l "export class.*Service" "$SERVICES_DIR"/*.ts 2>/dev/null | wc -l | xargs echo "  Count:"
    
    echo ""
    echo "Function-based services:"
    grep -l "export const.*service" "$SERVICES_DIR"/*.ts 2>/dev/null | wc -l | xargs echo "  Count:"
    
    echo ""
    echo "BUSINESS LOGIC IN CONTROLLERS"
    echo "------------------------------"
    echo "Controllers with database queries:"
    grep -r "await.*findOne\|await.*find\|await.*create\|await.*update\|await.*delete" "backend/src/controllers" --include="*.ts" -l | wc -l | xargs echo "  Count:"
    
    echo ""
    echo "Files with DB queries in controllers:"
    grep -r "await.*findOne\|await.*find\|await.*create\|await.*update\|await.*delete" "backend/src/controllers" --include="*.ts" -l || echo "  None (Good!)"
    
    echo ""
    echo "SERVICE METHOD SIGNATURES"
    echo "-------------------------"
    if [ -d "$SERVICES_DIR" ]; then
        for file in "$SERVICES_DIR"/*.ts; do
            if [ -f "$file" ]; then
                echo ""
                echo "$(basename $file):"
                grep -E "^\s*(async\s+)?[a-zA-Z_][a-zA-Z0-9_]*\s*\(" "$file" | head -10 || echo "  No methods found"
            fi
        done
    fi
    
    echo ""
    echo "RECOMMENDATIONS"
    echo "---------------"
    echo "1. Create service layer if not exists"
    echo "2. Move all business logic from controllers to services"
    echo "3. Controllers should only:"
    echo "   - Parse request"
    echo "   - Call service methods"
    echo "   - Return response"
    echo "4. Services should handle:"
    echo "   - Business logic"
    echo "   - Database queries"
    echo "   - Data transformation"
    echo "5. Standardize service method signatures"
    
} > "$OUTPUT_FILE"

echo -e "${GREEN}Report saved to: $OUTPUT_FILE${NC}"
echo ""
cat "$OUTPUT_FILE"

#!/bin/bash
# analyze-any-types.sh
# Finds all instances of TypeScript 'any' types in the codebase

echo "================================================"
echo "TypeScript 'any' Type Analysis"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Find all TypeScript files
BACKEND_DIR="backend/src"
OUTPUT_FILE="scripts/analysis/reports/any-types-report.txt"

# Create reports directory if it doesn't exist
mkdir -p scripts/analysis/reports

echo "Analyzing TypeScript files in $BACKEND_DIR..."
echo ""

# Count total occurrences
TOTAL_COUNT=$(grep -r ": any" "$BACKEND_DIR" --include="*.ts" | wc -l | tr -d ' ')

echo "Total 'any' type occurrences: $TOTAL_COUNT"
echo ""

# Generate detailed report
{
    echo "================================================"
    echo "TypeScript 'any' Type Analysis Report"
    echo "Generated: $(date)"
    echo "================================================"
    echo ""
    echo "SUMMARY"
    echo "-------"
    echo "Total occurrences: $TOTAL_COUNT"
    echo ""
    echo "BREAKDOWN BY FILE"
    echo "-----------------"
    
    # Group by file and count
    grep -r ": any" "$BACKEND_DIR" --include="*.ts" -n | \
        awk -F: '{print $1}' | \
        sort | uniq -c | \
        sort -rn | \
        while read count file; do
            echo "$count occurrences in $file"
        done
    
    echo ""
    echo "DETAILED OCCURRENCES"
    echo "--------------------"
    
    # Show each occurrence with context
    grep -r ": any" "$BACKEND_DIR" --include="*.ts" -n | \
        sed 's/:/ | Line /' | \
        sed 's/:/ | /'
        
} > "$OUTPUT_FILE"

echo -e "${GREEN}Report saved to: $OUTPUT_FILE${NC}"
echo ""

# Show top 5 files with most 'any' usage
echo "Top 5 files with most 'any' usage:"
grep -r ": any" "$BACKEND_DIR" --include="*.ts" -n | \
    awk -F: '{print $1}' | \
    sort | uniq -c | \
    sort -rn | \
    head -5 | \
    while read count file; do
        echo "  - $file: $count occurrences"
    done

echo ""
echo -e "${YELLOW}Action Items:${NC}"
echo "  1. Review $OUTPUT_FILE for details"
echo "  2. Prioritize files with highest 'any' count"
echo "  3. Create proper type definitions"
echo ""

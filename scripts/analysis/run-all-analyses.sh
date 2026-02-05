#!/bin/bash
# run-all-analyses.sh
# Master script to run all analysis scripts

echo "================================================"
echo "MelodyHub - Complete Codebase Analysis"
echo "================================================"
echo ""

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

SCRIPT_DIR="scripts/analysis"

# Make all scripts executable
chmod +x "$SCRIPT_DIR"/*.sh

echo -e "${BLUE}Running all analysis scripts...${NC}"
echo ""

# Run each analysis
echo "1/4 Running TypeScript 'any' analysis..."
bash "$SCRIPT_DIR/analyze-any-types.sh"
echo ""

echo "2/4 Running Controller patterns analysis..."
bash "$SCRIPT_DIR/analyze-controllers.sh"
echo ""

echo "3/4 Running Service layer analysis..."
bash "$SCRIPT_DIR/analyze-services.sh"
echo ""

echo "4/4 Running Dependencies analysis..."
bash "$SCRIPT_DIR/analyze-dependencies.sh"
echo ""

echo "================================================"
echo -e "${GREEN}All analyses complete!${NC}"
echo "================================================"
echo ""
echo "Reports generated in: $SCRIPT_DIR/reports/"
echo ""
echo "View reports:"
echo "  - TypeScript 'any' types: $SCRIPT_DIR/reports/any-types-report.txt"
echo "  - Controller patterns: $SCRIPT_DIR/reports/controller-patterns-report.txt"
echo "  - Service patterns: $SCRIPT_DIR/reports/service-patterns-report.txt"
echo "  - Dependencies: $SCRIPT_DIR/reports/dependencies-report.txt"
echo ""

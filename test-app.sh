#!/bin/bash
# Quick test script for FairPlay

echo "🔍 FairPlay System Diagnostic"
echo "==============================="
echo ""

echo "✅ Checking Node.js..."
node --version

echo "✅ Checking npm..."
npm --version

echo "✅ Checking project structure..."
echo "Main file exists:"
ls -lh src/FairPlayApp.jsx 2>/dev/null && echo "✓" || echo "✗ MISSING"

echo ""
echo "✅ Build status:"
npm run build 2>&1 | grep -E "built|error|Error"

echo ""
echo "✅ Ready to start dev server"
echo "Command: npm run dev"
echo "URL: http://localhost:3002/"
echo ""
echo "Demo accounts ready - see SETUP_QUICK_START.md for credentials"

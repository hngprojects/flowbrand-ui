#!/usr/bin/env sh
set -e

echo ""
echo "=== pre-commit-code-checks.sh ==="
echo ""
echo "Running lint-staged (Prettier + ESLint on staged files)..."
pnpm exec lint-staged

echo ""
echo "Running ESLint (full project)..."
pnpm lint

echo ""
echo "Running TypeScript..."
pnpm typecheck

echo ""
echo "Pre-commit checks passed."
echo ""

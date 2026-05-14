#!/usr/bin/env sh

echo ""
echo "🏗️ 👷 Running checks on your code before committing 🔍 🧐"
echo ""

# ── Prettier ──────────────────────────────────────────────
# With `set -e` (Husky), a bare failing command exits before `$?` is read.
# Use `if ! cmd` so failures are handled here instead.
echo "Styling your work 🎨 ✨"
echo ""

if ! pnpm check-format; then
  echo ""
  echo "🤢 🤮 🤢 🤮  It's so ugly!! — Your styling looks disgusting. 🤢 🤮 🤢 🤮"
  echo "            Prettier check failed. Running format..."
  echo ""
  pnpm format
  echo ""
  echo "✅ Fixed! Re-staging formatted files..."
  git add -u
  if ! pnpm check-format; then
    echo ""
    echo "❌ Prettier still reports issues after format. Fix manually and retry."
    exit 1
  fi
fi

# ── ESLint ────────────────────────────────────────────────
echo ""
echo "🔎 👀 Checking for lint errors... 🧹 🪣"
echo ""

if ! pnpm lint; then
  echo ""
  echo "💀 ☠️  Bro what is this code — Fix your lint errors!! 💀 ☠️"
  echo ""
  exit 1
fi

# ── TypeScript ────────────────────────────────────────────
echo ""
echo "🧠 💭 Checking types... there better be no errors?? 🤔 💀"
echo ""

if ! pnpm typecheck; then
  echo ""
  echo "🚨 🛑 TYPE ERRORS DETECTED — TypeScript is disappointed in you. 🚨 🛑"
  echo ""
  exit 1
fi

# ── Done ──────────────────────────────────────────────────
echo ""
echo "🚀 ✅  Looking good! Committing your masterpiece... 🎉"
echo ""
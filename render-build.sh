#!/usr/bin/env bash
set -e

echo "🧩 Installing TypeScript and required types..."
npm install --save-dev typescript @types/react @types/node

echo "📦 Installing project dependencies..."
npm install

echo "🚀 Running Next.js build..."
npm run build

#!/usr/bin/env bash
set -e

echo "🧩 Forcing full dependency install including devDependencies..."
npm ci --include=dev

echo "🚀 Running Next.js build..."
npm run build

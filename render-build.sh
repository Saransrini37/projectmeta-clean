#!/usr/bin/env bash
# Install TypeScript & type packages before build
npm install --save-dev typescript @types/react @types/node

# Run Next.js build
npm run build

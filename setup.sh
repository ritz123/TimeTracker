#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

echo "==> Installing dependencies..."
npm install

echo ""
echo "==> Setup complete!"
echo "    Run the app with:  npm start"
echo "    Or browser only:   npm run dev"

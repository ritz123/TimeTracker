#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

if [ ! -d node_modules ]; then
  echo "==> node_modules not found, running setup first..."
  bash setup.sh
fi

echo "==> Starting Weekly Work Tracker..."
npm start

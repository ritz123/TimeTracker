#!/usr/bin/env bash
set -euo pipefail

# ────────────────────────────────────────────────────────────
# release.sh — Create a tagged release for Time Tracker
#
# Usage:
#   ./release.sh <version>        # e.g. ./release.sh 1.2.0
#   ./release.sh patch            # auto-bump patch  1.0.0 → 1.0.1
#   ./release.sh minor            # auto-bump minor  1.0.0 → 1.1.0
#   ./release.sh major            # auto-bump major  1.0.0 → 2.0.0
# ────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# ── Helpers ─────────────────────────────────────────────────

red()   { printf "\033[31m%s\033[0m\n" "$*"; }
green() { printf "\033[32m%s\033[0m\n" "$*"; }
bold()  { printf "\033[1m%s\033[0m\n" "$*"; }

current_version() {
  node -p "require('./package.json').version"
}

bump_version() {
  local cur="$1" part="$2"
  IFS='.' read -r major minor patch <<< "$cur"
  case "$part" in
    major) echo "$((major + 1)).0.0" ;;
    minor) echo "${major}.$((minor + 1)).0" ;;
    patch) echo "${major}.${minor}.$((patch + 1))" ;;
    *)     echo "$part" ;;  # treat as explicit version
  esac
}

# ── Validate ────────────────────────────────────────────────

if [ $# -lt 1 ]; then
  echo "Usage: $0 <version|patch|minor|major>"
  echo ""
  echo "  Current version: $(current_version)"
  echo ""
  echo "Examples:"
  echo "  $0 patch          # $(current_version) → $(bump_version "$(current_version)" patch)"
  echo "  $0 minor          # $(current_version) → $(bump_version "$(current_version)" minor)"
  echo "  $0 major          # $(current_version) → $(bump_version "$(current_version)" major)"
  echo "  $0 2.0.0-beta.1   # explicit version"
  exit 1
fi

if [ -n "$(git status --porcelain)" ]; then
  red "Error: Working directory is not clean. Commit or stash changes first."
  git status --short
  exit 1
fi

OLD_VERSION="$(current_version)"
NEW_VERSION="$(bump_version "$OLD_VERSION" "$1")"

if ! [[ "$NEW_VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+ ]]; then
  red "Error: Invalid version '$NEW_VERSION'. Use semver (e.g. 1.2.3)."
  exit 1
fi

TAG="v${NEW_VERSION}"

if git rev-parse "$TAG" >/dev/null 2>&1; then
  red "Error: Tag $TAG already exists."
  exit 1
fi

bold "Releasing Time Tracker $OLD_VERSION → $NEW_VERSION ($TAG)"
echo ""

# ── Update version in source files ─────────────────────────

# package.json
node -e "
  const fs = require('fs');
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  pkg.version = '${NEW_VERSION}';
  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
"

# src/utils/appInfo.js
sed -i "s/export const APP_VERSION = '.*'/export const APP_VERSION = '${NEW_VERSION}'/" src/utils/appInfo.js

green "  Updated package.json and appInfo.js → ${NEW_VERSION}"

# ── Commit, tag, push ──────────────────────────────────────

git add package.json src/utils/appInfo.js
git commit -m "Release ${TAG}"
green "  Created commit: Release ${TAG}"

git tag -a "$TAG" -m "Time Tracker ${TAG}"
green "  Created tag: ${TAG}"

git push origin HEAD
git push origin "$TAG"
green "  Pushed commit and tag to origin"

# ── GitHub Release (optional, requires gh CLI) ─────────────

if command -v gh &>/dev/null; then
  echo ""
  bold "Creating GitHub release..."
  gh release create "$TAG" \
    --title "Time Tracker ${TAG}" \
    --generate-notes
  green "  GitHub release created: ${TAG}"
else
  echo ""
  echo "Tip: Install the GitHub CLI (gh) to auto-create releases:"
  echo "  gh release create ${TAG} --title 'Time Tracker ${TAG}' --generate-notes"
fi

echo ""
green "Done! Released Time Tracker ${TAG}"

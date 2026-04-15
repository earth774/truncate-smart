#!/usr/bin/env bash
set -euo pipefail

usage() {
  echo "Usage: bash ./release.sh <patch|minor|major>"
}

if [[ $# -ne 1 ]]; then
  usage
  exit 1
fi

BUMP_TYPE="$1"

case "$BUMP_TYPE" in
  patch|minor|major)
    ;;
  *)
    usage
    exit 1
    ;;
esac

if ! command -v git >/dev/null 2>&1; then
  echo "Error: git is required."
  exit 1
fi

if ! command -v pnpm >/dev/null 2>&1; then
  echo "Error: pnpm is required."
  exit 1
fi

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Error: this command must run inside a git repository."
  exit 1
fi

CURRENT_BRANCH="$(git branch --show-current)"
if [[ "$CURRENT_BRANCH" != "main" ]]; then
  echo "Error: release must run on main branch (current: $CURRENT_BRANCH)."
  exit 1
fi

if [[ -n "$(git status --porcelain)" ]]; then
  echo "Error: working tree is not clean."
  echo "Please commit or stash all changes before running release."
  exit 1
fi

if ! git remote get-url origin >/dev/null 2>&1; then
  echo "Error: git remote 'origin' is not configured."
  exit 1
fi

echo "Fetching origin/main..."
if ! git fetch origin main; then
  echo "Error: failed to fetch origin/main. Check network and remote access."
  exit 1
fi

if ! git rev-parse --verify origin/main >/dev/null 2>&1; then
  echo "Error: origin/main not found after fetch."
  exit 1
fi

LOCAL_SHA="$(git rev-parse HEAD)"
REMOTE_SHA="$(git rev-parse origin/main)"
if [[ "$LOCAL_SHA" != "$REMOTE_SHA" ]]; then
  echo "Error: local main is not in sync with origin/main."
  echo "  local:  $LOCAL_SHA ($(git rev-parse --short HEAD))"
  echo "  remote: $REMOTE_SHA ($(git rev-parse --short origin/main))"
  echo "Pull latest with: git pull --ff-only origin main"
  echo "If you have unpushed commits, push or integrate them before releasing."
  exit 1
fi

CURRENT_VERSION="$(node -p "require('./package.json').version")"
if [[ ! "$CURRENT_VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "Error: unsupported version format: $CURRENT_VERSION"
  echo "Expected format: MAJOR.MINOR.PATCH"
  exit 1
fi

tag_exists() {
  local candidate="$1"
  if git rev-parse "$candidate" >/dev/null 2>&1; then
    return 0
  fi
  if git ls-remote --exit-code --tags origin "refs/tags/$candidate" >/dev/null 2>&1; then
    return 0
  fi
  return 1
}

IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT_VERSION"
case "$BUMP_TYPE" in
  patch)
    PATCH=$((PATCH + 1))
    ;;
  minor)
    MINOR=$((MINOR + 1))
    PATCH=0
    ;;
  major)
    MAJOR=$((MAJOR + 1))
    MINOR=0
    PATCH=0
    ;;
esac

NEW_VERSION="${MAJOR}.${MINOR}.${PATCH}"
TAG="v${NEW_VERSION}"
ORIGINAL_TAG="$TAG"
while tag_exists "$TAG"; do
  PATCH=$((PATCH + 1))
  NEW_VERSION="${MAJOR}.${MINOR}.${PATCH}"
  TAG="v${NEW_VERSION}"
done

if [[ "$TAG" != "$ORIGINAL_TAG" ]]; then
  echo "Info: $ORIGINAL_TAG already exists, using next available tag $TAG."
fi

echo "Running checks..."
pnpm typecheck
pnpm test
pnpm lint
pnpm build

echo "Bumping version to ${NEW_VERSION}..."
npm version "$NEW_VERSION" --no-git-tag-version >/dev/null

echo "Creating release commit and tag..."
git add package.json
git commit -m "chore: release $TAG"
git tag "$TAG"

echo "Pushing branch and tag..."
git push origin main "$TAG"

echo "Release prepared and pushed: $TAG"

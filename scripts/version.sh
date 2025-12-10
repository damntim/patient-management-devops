#!/bin/bash
# scripts/version.sh
# Semantic Versioning Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get current version from package.json
CURRENT_VERSION=$(node -p "require('./backend/package.json').version")

echo -e "${GREEN}Current version: ${CURRENT_VERSION}${NC}"
echo ""

# Function to bump version
bump_version() {
    local version=$1
    local bump_type=$2
    
    IFS='.' read -r -a version_parts <<< "$version"
    major="${version_parts[0]}"
    minor="${version_parts[1]}"
    patch="${version_parts[2]}"
    
    case $bump_type in
        major)
            major=$((major + 1))
            minor=0
            patch=0
            ;;
        minor)
            minor=$((minor + 1))
            patch=0
            ;;
        patch)
            patch=$((patch + 1))
            ;;
        *)
            echo -e "${RED}Invalid bump type. Use: major, minor, or patch${NC}"
            exit 1
            ;;
    esac
    
    echo "${major}.${minor}.${patch}"
}

# Get bump type from argument
BUMP_TYPE=${1:-patch}

# Calculate new version
NEW_VERSION=$(bump_version $CURRENT_VERSION $BUMP_TYPE)

echo -e "${YELLOW}Bumping ${BUMP_TYPE} version...${NC}"
echo -e "${GREEN}New version: ${NEW_VERSION}${NC}"
echo ""

# Update package.json version
cd backend
npm version $NEW_VERSION --no-git-tag-version
cd ..

# Update version in other files if needed
echo -e "${GREEN}✓ Updated package.json${NC}"

# Create git tag
echo ""
echo -e "${YELLOW}Creating git tag v${NEW_VERSION}...${NC}"

git add backend/package.json
git commit -m "chore(release): bump version to ${NEW_VERSION}

Release version ${NEW_VERSION}

Changes:
- Updated package.json version
- Ready for deployment"

git tag -a "v${NEW_VERSION}" -m "Release v${NEW_VERSION}"

echo -e "${GREEN}✓ Created git tag v${NEW_VERSION}${NC}"
echo ""
echo -e "${YELLOW}To push this release, run:${NC}"
echo -e "  git push origin develop"
echo -e "  git push origin v${NEW_VERSION}"
echo ""
echo -e "${GREEN}Release v${NEW_VERSION} ready!${NC}"
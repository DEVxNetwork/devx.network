#!/usr/bin/env bash
# Deploy to CapRover via tarball upload.
#
# Packages the project source + captain-definition into a tar and deploys
# using `caprover deploy -t`. CapRover builds the Docker image on the server —
# no container registry or GitHub Actions required. Useful for fast local
# iteration: no CI round-trip, just build-on-server and check the URL.
#
# Usage:
#   ./scripts/deploy-tar.sh              # deploy using .env.local
#   ./scripts/deploy-tar.sh --dry-run    # print what would happen without doing it
#   ./scripts/deploy-tar.sh --env=.env.staging
#
# Requires:
#   - caprover CLI installed and logged in (run `caprover login` first)
#   - CAPROVER_URL and CAPROVER_APP set in .env.local

set -euo pipefail

ENV_FILE=".env.local"
DRY_RUN=false
TAR_FILE="./deploy.tar"

for arg in "$@"; do
  case $arg in
    --dry-run) DRY_RUN=true ;;
    --env=*) ENV_FILE="${arg#--env=}" ;;
  esac
done

# --- Parse env file ---
declare -A ENV
while IFS= read -r line; do
  [[ "$line" =~ ^[[:space:]]*# ]] && continue
  [[ -z "${line// }" ]] && continue
  if [[ "$line" =~ ^([A-Za-z_][A-Za-z0-9_]*)=(.*)$ ]]; then
    key="${BASH_REMATCH[1]}"
    val="${BASH_REMATCH[2]}"
    val="${val#\"}" ; val="${val%\"}"
    val="${val#\'}" ; val="${val%\'}"
    ENV["$key"]="$val"
  fi
done < "$ENV_FILE"

get() { echo "${ENV[$1]:-}"; }

CAPROVER_URL="$(get CAPROVER_URL)"
APP_NAME="$(get CAPROVER_APP)"

for var in CAPROVER_URL CAPROVER_APP; do
  if [[ -z "${ENV[$var]:-}" ]]; then
    echo "Error: $var not set in $ENV_FILE" >&2; exit 1
  fi
done

# --- Find the caprover machine name matching CAPROVER_URL ---
echo "==> Finding caprover CLI session for $CAPROVER_URL..."
CAPROVER_NAME=$(caprover ls 2>/dev/null \
  | awk -v url="$CAPROVER_URL" '$0 ~ url { print $2 }')

if [[ -z "$CAPROVER_NAME" ]]; then
  echo "Error: no caprover CLI session found for $CAPROVER_URL" >&2
  echo "       Run: caprover login" >&2
  exit 1
fi
echo "    using machine '$CAPROVER_NAME'"

if $DRY_RUN; then
  echo ""
  echo "[dry-run] Would create $TAR_FILE from project source"
  echo "[dry-run] caprover deploy -t $TAR_FILE -n $CAPROVER_NAME -a $APP_NAME"
  exit 0
fi

# --- Build tar ---
# Excludes match .dockerignore, plus the tar itself.
echo ""
echo "==> Creating $TAR_FILE..."

tar -cf "$TAR_FILE" \
  --exclude='./node_modules' \
  --exclude='./.next' \
  --exclude='./out' \
  --exclude='./.env*' \
  --exclude='./.git' \
  --exclude="$TAR_FILE" \
  .

echo "    $(du -sh "$TAR_FILE" | cut -f1) — $(tar -tf "$TAR_FILE" | wc -l | tr -d ' ') files"

# --- Deploy ---
echo ""
echo "==> Deploying '$APP_NAME' to '$CAPROVER_NAME'..."
echo "    CapRover will build the Docker image on the server."
echo "    Build logs will stream below — this takes a few minutes."
echo ""

caprover deploy \
  --tarFile "$TAR_FILE" \
  --caproverName "$CAPROVER_NAME" \
  --caproverApp "$APP_NAME"

# --- Cleanup ---
rm -f "$TAR_FILE"
echo ""
echo "Deploy complete."

#!/usr/bin/env bash
# One-time setup of the app on CapRover.
# Safe to re-run — create calls no-op if the resource already exists.
#
# Usage:
#   ./scripts/scaffold.sh              # full setup
#   ./scripts/scaffold.sh --dry-run    # print API calls without executing
#
# Requires: caprover CLI (already logged in), jq, values set in .env.local
#   Required in .env.local: CAPROVER_URL, CAPROVER_APP
#   Optional in .env.local: CAPROVER_APP_DOMAIN

set -euo pipefail

ENV_FILE=".env.local"
DRY_RUN=false

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
APP_DOMAIN="$(get CAPROVER_APP_DOMAIN)"

for var in CAPROVER_URL CAPROVER_APP; do
  if [[ -z "${ENV[$var]:-}" ]]; then
    echo "Error: $var not set in $ENV_FILE" >&2; exit 1
  fi
done

CUSTOM_DOMAIN="${APP_NAME}.${APP_DOMAIN}"

# ============================================================
# Authenticate directly against the CapRover REST API.
#
# NOTE: `caprover api` (the CLI's generic-API subcommand) throws
# `ERR_USE_AFTER_CLOSE` from inquirer/readline whenever stdin isn't a real
# TTY (i.e. always, from a script). Calling the REST API with curl directly
# is what CapRover's own CI examples do and is what preview.yml/deploy.yml
# use too — sidesteps the bug entirely.
# ============================================================
CAPROVER_PASSWORD="$(get CAPROVER_PASSWORD)"
if [[ -z "$CAPROVER_PASSWORD" ]]; then
  echo "Error: CAPROVER_PASSWORD not set in $ENV_FILE" >&2; exit 1
fi

echo "==> Authenticating with $CAPROVER_URL..."
if ! $DRY_RUN; then
  LOGIN_BODY=$(jq -n --arg pass "$CAPROVER_PASSWORD" '{password:$pass}')
  ADMIN_TOKEN=$(curl -sf -X POST "$CAPROVER_URL/api/v2/login" \
    -H "Content-Type: application/json" \
    -d "$LOGIN_BODY" | jq -r '.data.token')
  if [[ -z "$ADMIN_TOKEN" || "$ADMIN_TOKEN" == "null" ]]; then
    echo "Error: login failed — check CAPROVER_URL/CAPROVER_PASSWORD" >&2; exit 1
  fi
fi

cap_api() {
  local method="$1" path="$2" body="${3:-}"
  if $DRY_RUN; then
    echo "  [dry-run] $method $CAPROVER_URL$path"
    [[ -n "$body" ]] && echo "            $body"
    return
  fi
  curl -sf -X "$method" "$CAPROVER_URL$path" \
    -H "Content-Type: application/json" \
    -H "x-captain-auth: $ADMIN_TOKEN" \
    ${body:+-d "$body"}
}

# ============================================================
# 1. Create the app (no-ops if already exists)
# ============================================================
echo ""
echo "==> Creating app '$APP_NAME'..."
if $DRY_RUN; then
  cap_api POST /api/v2/user/apps/appDefinitions/register \
    "{\"appName\": \"$APP_NAME\", \"hasPersistentData\": false}"
elif cap_api POST /api/v2/user/apps/appDefinitions/register \
  "{\"appName\": \"$APP_NAME\", \"hasPersistentData\": false}" &>/dev/null; then
  echo "    created"
else
  echo "    already exists, continuing"
fi

# ============================================================
# 2. Configure app: instance count, container port
# ============================================================
echo "==> Configuring app..."

APP_CONFIG=$(jq -n \
  --arg app "$APP_NAME" \
  '{
    "appName": $app,
    "instanceCount": 1,
    "containerHttpPort": 80,
    "ports": [],
    "notExposeAsWebApp": false
  }')

cap_api POST /api/v2/user/apps/appDefinitions/update "$APP_CONFIG"

# ============================================================
# 3. Enable HTTPS on default CapRover subdomain
# ============================================================
echo ""
echo "==> Enabling HTTPS on default subdomain for '$APP_NAME'..."
cap_api POST /api/v2/user/apps/appDefinitions/enablebasedomainssl \
  "{\"appName\": \"$APP_NAME\"}" || \
  echo "  Warning: SSL on default subdomain failed — DNS may not be propagated yet"

# ============================================================
echo ""
echo "Scaffolding complete."
echo ""
if [[ -n "$APP_DOMAIN" ]]; then
  echo "App URL: https://$CUSTOM_DOMAIN"
  echo "(CAPROVER_APP_DOMAIN is only used here to print this URL — it's assumed"
  echo " to be the CapRover root domain itself, so \$appName.\$rootDomain is the"
  echo " free auto-SSL subdomain enabled above, not a separate custom domain."
  echo " To point a genuinely different domain at this app, do that by hand in"
  echo " the CapRover dashboard: Apps > $APP_NAME > HTTP Settings.)"
fi
echo ""
echo "Next steps:"
echo "  1. Verify the app in CapRover dashboard: $CAPROVER_URL"
echo "  2. Deploy: ./scripts/deploy-tar.sh"

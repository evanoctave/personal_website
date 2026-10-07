#!/usr/bin/env bash
# deploy.sh: test, build, and put the site live on evanoctave.dev.
#
# evoserver runs the `evanoctave` container: stock nginx:alpine with two bind mounts
#   /home/evanoctav3/evanoctave/dist        -> /usr/share/nginx/html   (the site)
#   /home/evanoctav3/evanoctave/nginx.conf  -> /etc/nginx/conf.d/default.conf
# so deploying is just copying a fresh dist/ into that folder. nginx serves the new files right
# away; no restart, no image rebuild. Cloudflare sits in front, so purge its cache if a change
# doesn't show up.
#
# usage: ./deploy.sh   (asks for the evoserver password once)
set -euo pipefail
cd "$(dirname "$0")"

# KNOB: where the site lives
HOST=evoserver
DEST=/home/evanoctav3/evanoctave/dist

echo "› tests"
npx vitest run --reporter=dot
echo "› build"
npm run build

# one shared ssh connection for every copy below, so the password is typed once
SOCK="$(mktemp -u "${TMPDIR:-/tmp}/eo-deploy.XXXXXX")"
SSH="ssh -o ControlMaster=auto -o ControlPath=$SOCK -o ControlPersist=60"
trap '$SSH -O exit "$HOST" 2>/dev/null || true' EXIT
echo "› connecting to $HOST"
$SSH -fN "$HOST"

# --chmod: whatever the permissions are on this Mac, the server copies must be readable by nginx
# (a few photo exports came out owner-only and 403'd on the live site)
PERMS="--chmod=D755,F644"

# order matters, so nobody gets a page whose files aren't there yet:
# 1) the new hashed assets and media, 2) index.html, which switches visitors to them,
# 3) then clear out files the new build no longer has
echo "› uploading"
rsync -az $PERMS -e "$SSH" --exclude index.html dist/ "$HOST:$DEST/"
rsync -az $PERMS -e "$SSH" dist/index.html "$HOST:$DEST/index.html"
rsync -az $PERMS --delete -e "$SSH" dist/ "$HOST:$DEST/"

echo "› live: https://evanoctave.dev"

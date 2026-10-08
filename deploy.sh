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
echo "YEEAAAAH HERE WE GOOOOOOOOOOO"
set -euo pipefail
cd "$(dirname "$0")"

# KNOB: where the site lives
HOST=evoserver
DEST=/home/evanoctav3/evanoctave/dist

npx vitest run --reporter=dot
echo "all that junk above me better be green"
npm run build
# nginx on the server must be able to read every file. a few photo exports came out owner-only (0600)
# on this Mac, rsync copied that over, and nginx answered 403 for them. (macOS's openrsync ignores
# --chmod, so fix the permissions on disk instead)
chmod -R a+rX dist

# one shared ssh connection for every copy below, so the password is typed once
SOCK="$(mktemp -u "${TMPDIR:-/tmp}/eo-deploy.XXXXXX")"
SSH="ssh -o ControlMaster=auto -o ControlPath=$SOCK -o ControlPersist=60"
trap '$SSH -O exit "$HOST" 2>/dev/null || true' EXIT
echo "twin lemme connect to $HOST real quick run me that password u feel me"
$SSH -fN "$HOST"

# order matters, so nobody gets a page whose files aren't there yet:
# 1) the new hashed assets and media, 2) index.html, which switches visitors to them,
# 3) then clear out files the new build no longer has
echo "gotta upload some files n shii ok sit tight brotha, uploading rn"
rsync -az -e "$SSH" --exclude index.html dist/ "$HOST:$DEST/"
rsync -az -e "$SSH" dist/index.html "$HOST:$DEST/index.html"
rsync -az --delete -e "$SSH" dist/ "$HOST:$DEST/"
# and on the server too, in case anything already there is unreadable
$SSH "$HOST" "chmod -R a+rX '$DEST'"
echo "all good, hope everything looks fabulous n shii"

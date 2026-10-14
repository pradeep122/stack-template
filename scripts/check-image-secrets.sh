#!/usr/bin/env bash
# Usage: scripts/check-image-secrets.sh <image> [canary-string]
# Fails if the image leaks env files or secret-looking values in its history, config or filesystem.
set -euo pipefail

image="${1:?usage: $0 <image> [canary-string]}"
canary="${2:-}"
fail=0
pattern='secret|token|password|deploy_key|access_key|api_key|private_key|sk_(live|test)_|bw://|infisical'

report() { echo "FAIL: $1"; fail=1; }

history="$(docker history --no-trunc --format '{{.CreatedBy}}' "$image")"
if grep -Eiq "$pattern" <<<"$history"; then
  report "docker history mentions secret-looking text:"
  grep -Ei "$pattern" <<<"$history" | cut -c1-200
fi

config_env="$(docker inspect --format '{{range .Config.Env}}{{println .}}{{end}}' "$image")"
if grep -Eiq "$pattern" <<<"$config_env"; then
  report "image Config.Env contains secret-looking variables"
fi

env_files="$(docker run --rm --entrypoint sh "$image" -c \
  "find / -xdev \( -name '.env' -o -name '.env.*' -o -name '.infisical.json' -o -name '.mcp.json' \) -not -path '/proc/*' -not -path '*/node_modules/*' 2>/dev/null || true")"
if [ -n "$env_files" ]; then
  report "env/credential files found in image filesystem:"
  echo "$env_files"
fi

keys="$(docker run --rm --entrypoint sh "$image" -c "grep -rIl 'BEGIN [A-Z ]*PRIVATE KEY' /app 2>/dev/null || true")"
if [ -n "$keys" ]; then
  report "private key material found under /app:"
  echo "$keys"
fi

if [ -n "$canary" ]; then
  if docker run --rm --entrypoint sh "$image" -c "grep -rIl -F -s -- '$canary' /app /etc /home /root /opt /srv /usr/share /usr/local /var /tmp 2>/dev/null || true" | grep -q .; then
    report "canary string found in image filesystem"
  fi
  if grep -Fq -- "$canary" <<<"$history"; then
    report "canary string found in docker history"
  fi
fi

[ "$fail" -eq 0 ] && echo "OK: no secrets found in $image"
exit "$fail"

#!/usr/bin/env bash
set -euo pipefail

# Check that the current shell is using the project's .venv
# Exit code 0 if ok, non-zero otherwise.
# Usage: ./scripts/check_env.sh || echo "Not activated"

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
EXPECTED_VENV="$ROOT_DIR/.venv"

if [ -z "${VIRTUAL_ENV-}" ]; then
  echo "[lmapp][ERROR] No virtual environment is active. Expected: $EXPECTED_VENV"
  echo "Run: source $EXPECTED_VENV/bin/activate or ./scripts/bootstrap_dev_env.sh"
  exit 2
fi

if [ "$(realpath "$VIRTUAL_ENV")" != "$(realpath "$EXPECTED_VENV")" ]; then
  echo "[lmapp][ERROR] Active virtualenv ($VIRTUAL_ENV) does not match project .venv ($EXPECTED_VENV)"
  echo "Activate the project venv with: source $EXPECTED_VENV/bin/activate"
  exit 3
fi

echo "[lmapp] Virtualenv active: $VIRTUAL_ENV"
exit 0

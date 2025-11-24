#!/usr/bin/env bash
set -euo pipefail

# Bootstrap development virtualenv and install dev dependencies.
# Usage:
#   ./scripts/bootstrap_dev_env.sh      # creates .venv if missing and installs deps
#   source .venv/bin/activate && ./scripts/bootstrap_dev_env.sh  # to run inside venv

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VENV_DIR="$ROOT_DIR/.venv"

echo "[lmapp] Project root: $ROOT_DIR"

if [ ! -d "$VENV_DIR" ]; then
  echo "[lmapp] Creating virtualenv in .venv..."
  python3 -m venv "$VENV_DIR"
fi

echo "[lmapp] Activating virtualenv and installing dev dependencies..."
# Activate in a subshell to avoid leaking into caller if not desired
(
  # shellcheck disable=SC1091
  source "$VENV_DIR/bin/activate"
  python -m pip install --upgrade pip setuptools wheel
  pip install -e '.[dev]'
)

echo "[lmapp] Bootstrap complete. To use the venv: run 'source .venv/bin/activate'"

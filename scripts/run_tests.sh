#!/usr/bin/env bash
set -euo pipefail

# Wrapper that checks the environment and runs pytest in the project venv.
# Usage: ./scripts/run_tests.sh

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VENV_DIR="$ROOT_DIR/.venv"

if [ ! -d "$VENV_DIR" ]; then
  echo "[lmapp] .venv not found; bootstrapping virtualenv..."
  "$ROOT_DIR/scripts/bootstrap_dev_env.sh"
fi

# Prefer running in an activated venv; if not activated, run under the .venv python
if [ -z "${VIRTUAL_ENV-}" ] || [ "$(realpath "$VIRTUAL_ENV")" != "$(realpath "$VENV_DIR")" ]; then
  echo "[lmapp] Running tests using .venv python (no activation required): $VENV_DIR/bin/python"
  "$VENV_DIR/bin/python" -m pip install --upgrade pip setuptools wheel
  "$VENV_DIR/bin/python" -m pip install -e '.[dev]'
  exec "$VENV_DIR/bin/python" -m pytest tests/ -q
else
  echo "[lmapp] Virtualenv already active: $VIRTUAL_ENV — running pytest"
  python -m pytest tests/ -q
fi

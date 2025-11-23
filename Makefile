.PHONY: help install dev test lint format clean coverage docs version hooks quick-start check doctor

help:
	@echo "lmapp Development Commands"
	@echo "=========================="
	@echo ""
	@echo "Setup:"
	@echo "  make install      Install lmapp package"
	@echo "  make dev          Install with dev dependencies"
	@echo "  make hooks        Install pre-commit hooks"
	@echo ""
	@echo "Quick Commands:"
	@echo "  make quick-start  Run lmapp demo/quick start"
	@echo "  make check        Run lint, format check, type check"
	@echo "  make doctor       Diagnose environment setup"
	@echo ""
	@echo "Testing & Quality:"
	@echo "  make test         Run all tests"
	@echo "  make lint         Check code style (flake8)"
	@echo "  make format       Format code with black"
	@echo "  make coverage     Generate coverage report"
	@echo ""
	@echo "Versioning:"
	@echo "  make version      Show current version"
	@echo "  make version-set  Sync VERSION to all files"
	@echo ""
	@echo "Maintenance:"
	@echo "  make clean        Remove build artifacts and cache"
	@echo "  make rebuild      Clean and rebuild package"
	@echo ""

install:
	pip install -e .

dev:
	pip install -e ".[dev]"

hooks:
	pre-commit install
	@echo "✅ Pre-commit hooks installed!"

test:
	pytest tests/ -v

lint:
	flake8 src/ --count --exit-zero --max-complexity=10
	black --check src/ tests/

format:
	black src/ tests/

coverage:
	pytest tests/ --cov=lmapp --cov-report=html --cov-report=term
	@echo "Coverage report generated in htmlcov/index.html"

version:
	@echo "Current version: $$(cat VERSION)"

version-set:
	bash scripts/version-sync.sh

quick-start:
	@echo "🚀 Starting lmapp quick demo..."
	@python -m lmapp.cli 2>/dev/null || (echo "Run 'make dev' first to install dependencies" && false)

check:
	@echo "🔍 Running pre-commit checks..."
	@python -m black --check src/ tests/ 2>/dev/null || true
	@python -m flake8 src/ --max-complexity=10 2>/dev/null || true
	@python -m mypy src/lmapp/ --ignore-missing-imports 2>/dev/null || true
	@echo "✅ Check complete!"

doctor:
	@echo "🏥 Diagnosing lmapp environment..."
	@echo ""
	@echo "Python: $$(python --version)"
	@echo "Python path: $$(which python)"
	@echo ""
	@echo "Required packages:"
	@python -c "import click; echo '  ✅ click installed'" 2>/dev/null || echo "  ❌ click missing"
	@python -c "import rich; echo '  ✅ rich installed'" 2>/dev/null || echo "  ❌ rich missing"
	@python -c "import pydantic; echo '  ✅ pydantic installed'" 2>/dev/null || echo "  ❌ pydantic missing"
	@echo ""
	@echo "lmapp version: $$(cat VERSION)"
	@echo "Git status: $$(git rev-parse --short HEAD) ($$(git rev-parse --abbrev-ref HEAD))"
	@echo ""
	@echo "Run 'make dev' if dependencies are missing."
	bash scripts/cleanup.sh .

rebuild: clean install

all: clean dev lint test
	@echo "✅ All checks passed!"

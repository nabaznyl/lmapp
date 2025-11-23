.PHONY: help install dev test lint format clean coverage docs version hooks

help:
	@echo "lmapp Development Commands"
	@echo "=========================="
	@echo ""
	@echo "Setup:"
	@echo "  make install      Install lmapp package"
	@echo "  make dev          Install with dev dependencies"
	@echo "  make hooks        Install pre-commit hooks"
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

clean:
	bash scripts/cleanup.sh .

rebuild: clean install

all: clean dev lint test
	@echo "✅ All checks passed!"

# Contributing to lmapp

Thank you for your interest in contributing to lmapp!

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/lmapp.git
cd lmapp
```

2. Create a virtual environment:
```bash
python3 -m venv .venv
source .venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Install in development mode:
```bash
pip install -e .
```

## Code Style

- Follow PEP 8 Python style guidelines
- Use `black` for code formatting
- Use `flake8` for linting
- Use type hints where appropriate

Run formatters:
```bash
black src/
flake8 src/
```

## Testing

Run tests with pytest:
```bash
pytest tests/
```

With coverage:
```bash
pytest --cov=lmapp tests/
```

## Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help newcomers learn and grow
- Maintain professional communication

## Questions?

Open an issue or discussion on GitHub!

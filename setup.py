#!/usr/bin/env python3
"""
lmapp - Local LLM Made Simple
Setup configuration
"""

from setuptools import setup, find_packages
from pathlib import Path

# Read README for long description
readme_file = Path(__file__).parent / "README.md"
long_description = (
    readme_file.read_text(encoding="utf-8") if readme_file.exists() else ""
)

# Read requirements
requirements_file = Path(__file__).parent / "requirements.txt"
all_requirements = []
if requirements_file.exists():
    all_requirements = [
        line.strip()
        for line in requirements_file.read_text().splitlines()
        if line.strip() and not line.startswith("#")
    ]

# Separate runtime and dev requirements
dev_packages = {"pytest", "pytest-cov", "black", "flake8", "mypy"}
install_requires = [
    req
    for req in all_requirements
    if not any(req.startswith(pkg) for pkg in dev_packages)
]
extras_require = {
    "dev": [
        req
        for req in all_requirements
        if any(req.startswith(pkg) for pkg in dev_packages)
    ]
}

setup(
    name="lmapp",
    version="0.2.6-dev",
    description="Local LLM Made Simple - Consumer-friendly AI assistant",
    long_description=long_description,
    long_description_content_type="text/markdown",
    author="lmapp Contributors",
    author_email="dev@lmapp.dev",
    url="https://github.com/nabaznyl/lmapp",
    license="MIT",
    packages=find_packages(where="src"),
    package_dir={"": "src"},
    include_package_data=True,
    install_requires=install_requires,
    extras_require=extras_require,
    python_requires=">=3.8",
    entry_points={
        "console_scripts": [
            "lmapp=lmapp.cli:main",
        ],
    },
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: End Users/Desktop",
        "License :: OSI Approved :: MIT License",
        "Operating System :: POSIX :: Linux",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
        "Topic :: Scientific/Engineering :: Artificial Intelligence",
        "Topic :: Utilities",
    ],
    keywords="llm ai local privacy ollama llamafile chat assistant",
    project_urls={
        "Documentation": "https://github.com/nabaznyl/lmapp/docs",
        "Source": "https://github.com/nabaznyl/lmapp",
        "Tracker": "https://github.com/nabaznyl/lmapp/issues",
    },
)

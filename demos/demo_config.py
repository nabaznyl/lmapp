#!/usr/bin/env python3
"""
Demo: Configuration Management
===============================

This demo shows how to use lmapp's configuration system.
Perfect for: Understanding configuration options, customization.

Run: python demos/demo_config.py
"""

import sys
from pathlib import Path

# Add src to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from lmapp.core.config import Config


def show_config_option(key: str, value, description: str):
    """Display a configuration option."""
    print(f"\n  {key}:")
    print(f"    Current: {value}")
    print(f"    Purpose: {description}")


def main():
    """Demonstrate configuration management."""
    print("\n" + "=" * 70)
    print("lmapp Demo: Configuration Management")
    print("=" * 70 + "\n")

    # Load current config
    print("📋 Loading current configuration...")
    config = Config.load_or_default()
    print("   ✓ Configuration loaded\n")

    # Display current settings
    print("📖 Current Configuration Settings:\n")

    show_config_option("backend", config.backend, "LLM backend to use (auto, ollama, llamafile, mock)")

    show_config_option("model", config.model, "AI model to use (tinyllama, mistral, llama2, etc.)")

    show_config_option(
        "temperature",
        config.temperature,
        "Creativity level (0.0=deterministic, 1.0=creative)",
    )

    show_config_option("timeout", config.timeout, "Request timeout in seconds")

    show_config_option("debug", config.debug, "Enable debug logging (True/False)")

    # Show how to modify
    print("\n" + "-" * 70)
    print("🔧 How to Modify Configuration:\n")

    print("  Command line:")
    print("    lmapp config set temperature 0.3")
    print("    lmapp config set model mistral")
    print("    lmapp config set debug true")
    print("    lmapp config set backend ollama")

    print("\n  View all settings:")
    print("    lmapp config show")

    print("\n  Validate configuration:")
    print("    lmapp config validate")

    print("\n  Reset to defaults:")
    print("    lmapp config reset")

    # Show file location
    print("\n" + "-" * 70)
    print("💾 Configuration File:\n")
    config_path = Config.get_config_path()
    print(f"  Location: {config_path}")
    print(f"  Format: YAML")
    print(f"  Editable: Yes (both via CLI and direct file edit)")

    # Show validation
    print("\n" + "-" * 70)
    print("✅ Validation:\n")

    try:
        config.validate()
        print("  ✓ Current configuration is valid")
    except Exception as e:
        print(f"  ✗ Validation error: {e}")

    print("\n" + "=" * 70)
    print("✅ Configuration demo completed!")
    print("=" * 70 + "\n")
    print("Key takeaways:")
    print("  • Configuration is persistent (saved to file)")
    print("  • Easy CLI management (lmapp config ...)")
    print("  • Automatic validation when loading")
    print("  • Defaults provided for all options")
    print("  • Can edit YAML file directly if needed")
    print("\n")

    return 0


if __name__ == "__main__":
    sys.exit(main())

#!/usr/bin/env python3
"""
Demo: Multi-Backend Support
============================

This demo shows how lmapp automatically detects and switches between backends.
Perfect for: Understanding backend flexibility, multi-backend scenarios.

Run: python demos/demo_multi_backend.py
"""

import sys
from pathlib import Path

# Add src to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from lmapp.core.config import Config
from lmapp.backend.detector import detect_backend
from lmapp.backend.base import LLMBackend


def demonstrate_backend(backend_name: str) -> tuple:
    """Try to detect and demonstrate a specific backend."""
    print(f"\n  🔍 Attempting to detect: {backend_name}")

    try:
        # Create a config requesting specific backend
        config = Config.load_or_default()
        config.backend = backend_name

        # Try to detect it
        backend = detect_backend(backend_name)

        print(f"     ✓ {backend.__class__.__name__} detected!")
        print(f"     ✓ Available: Yes")

        # Check if it's healthy
        try:
            is_healthy = backend.check_health()
            status = "Healthy" if is_healthy else "Not healthy"
            print(f"     ✓ Status: {status}")
            return (backend_name, True, backend)
        except Exception as e:
            print(f"     ⚠ Status: Available but not responding ({str(e)[:40]}...)")
            return (backend_name, False, backend)

    except Exception as e:
        print(f"     ✗ Not available: {str(e)[:60]}...")
        return (backend_name, False, None)


def main():
    """Demonstrate backend detection and switching."""
    print("\n" + "=" * 70)
    print("lmapp Demo: Multi-Backend Support")
    print("=" * 70 + "\n")

    print("This demo shows lmapp's backend flexibility:\n")

    # Check different backends
    backends_to_check = ["ollama", "llamafile", "mock", "auto"]
    available_backends = []

    for backend_name in backends_to_check:
        name, available, backend_obj = demonstrate_backend(backend_name)
        if available and backend_obj is not None:
            available_backends.append((name, backend_obj))

    # Summary
    print("\n" + "-" * 70)
    print("Summary:")
    print(f"  Total backends found: {len(available_backends)}")

    if available_backends:
        print("\n  Available backends:")
        for backend_name, backend_obj in available_backends:
            print(f"    • {backend_name}: {backend_obj.__class__.__name__}")

        # Demonstrate automatic selection
        print("\n  🤖 Automatic Backend Selection:")
        config = Config.load_or_default()
        config.backend = "auto"

        best_backend = detect_backend("auto")
        print(f"    • Auto-selected: {best_backend.__class__.__name__}")
        print(f"    • This is lmapp's default smart selection!")
    else:
        print("\n  ℹ  No live backends detected (this is OK for demo)")
        print("    Installing Ollama or llamafile enables real backend usage")

    print("\n" + "=" * 70)
    print("✅ Backend demo completed!")
    print("=" * 70 + "\n")
    print("Key takeaways:")
    print("  • lmapp automatically detects available backends")
    print("  • Falls back gracefully if preferred backend unavailable")
    print("  • Mock backend always available for testing")
    print("  • Easy to switch backends: lmapp config set backend ollama")
    print("\n")

    return 0


if __name__ == "__main__":
    sys.exit(main())

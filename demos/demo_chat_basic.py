#!/usr/bin/env python3
"""
Demo: Basic Chat Usage
======================

This demo shows the simplest way to use lmapp chat.
Perfect for: First-time users, quick start.

Run: python demos/demo_chat_basic.py
"""

import sys
from pathlib import Path

# Add src to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from lmapp.core.chat import ChatSession
from lmapp.core.config import Config
from lmapp.backend.detector import detect_backend


def main():
    """Demonstrate basic chat session."""
    print("\n" + "=" * 70)
    print("lmapp Demo: Basic Chat Usage")
    print("=" * 70 + "\n")

    # Step 1: Load configuration
    print("📋 Step 1: Loading configuration...")
    config = Config.load_or_default()
    print(f"   ✓ Model: {config.model}")
    print(f"   ✓ Temperature: {config.temperature}")
    print(f"   ✓ Backend: {config.backend}")

    # Step 2: Detect backend
    print("\n🔍 Step 2: Detecting available backend...")
    backend = detect_backend(config.backend)
    print(f"   ✓ Using backend: {backend.__class__.__name__}")

    # Step 3: Create chat session
    print("\n💬 Step 3: Creating chat session...")
    session = ChatSession(config, backend)
    print("   ✓ Session created successfully")

    # Step 4: Send a message
    print("\n📤 Step 4: Sending message to AI...")
    user_message = "What is Python? (explain briefly)"
    print(f"   You: {user_message}")

    try:
        response = session.send_message(user_message)
        print(f"\n   AI: {response[:200]}...")  # Show first 200 chars
        print(f"\n   ✓ Response received ({len(response)} characters)")
    except Exception as e:
        print(f"   ✗ Error: {e}")
        return 1

    # Step 5: Show session stats
    print("\n📊 Step 5: Session statistics...")
    stats = session.get_stats()
    print(f"   ✓ Total messages: {stats['total_messages']}")
    print(f"   ✓ Current model: {stats['current_model']}")
    print(f"   ✓ Session duration: {stats['duration_seconds']:.1f}s")

    print("\n" + "=" * 70)
    print("✅ Demo completed successfully!")
    print("=" * 70 + "\n")
    print("Next steps:")
    print("  1. Try: lmapp chat")
    print("  2. Try commands: /stats, /help, /clear")
    print("  3. Configure: lmapp config set temperature 0.5")
    print("\n")

    return 0


if __name__ == "__main__":
    sys.exit(main())

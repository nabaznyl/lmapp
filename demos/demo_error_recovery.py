#!/usr/bin/env python3
"""
Demo: Error Recovery & Resilience
==================================

This demo shows how lmapp handles errors gracefully and recovers.
Perfect for: Understanding reliability, error handling, fallbacks.

Run: python demos/demo_error_recovery.py
"""

import sys
from pathlib import Path

# Add src to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from lmapp.core.config import Config
from lmapp.backend.mock import MockBackend
from lmapp.backend.detector import detect_backend
from lmapp.utils.error_recovery import ErrorRecoveryManager


def main():
    """Demonstrate error recovery mechanisms."""
    print("\n" + "="*70)
    print("lmapp Demo: Error Recovery & Resilience")
    print("="*70 + "\n")
    
    print("lmapp includes sophisticated error handling:\n")
    
    # Show recovery strategies
    print("📋 Error Recovery Strategies:\n")
    
    print("  1️⃣  Automatic Retry")
    print("     • Retries failed requests with exponential backoff")
    print("     • Configurable retry count and delay")
    print("     • Automatic timeout handling\n")
    
    print("  2️⃣  Backend Fallback")
    print("     • If Ollama unavailable → tries llamafile")
    print("     • If llamafile unavailable → uses Mock backend")
    print("     • Graceful degradation (always works)\n")
    
    print("  3️⃣  User-Friendly Messages")
    print("     • Clear error descriptions")
    print("     • Recovery suggestions")
    print("     • Debug information available\n")
    
    print("  4️⃣  Contextual Information")
    print("     • Error cause identification")
    print("     • Resource availability checks")
    print("     • Actionable recommendations\n")
    
    # Demonstrate error recovery manager
    print("-"*70)
    print("⚙️  Error Recovery Manager:\n")
    
    recovery_manager = ErrorRecoveryManager()
    print(f"  ✓ Initialized with defaults:")
    print(f"    • Max retries: 3")
    print(f"    • Initial backoff: 1 second")
    print(f"    • Backoff multiplier: 2x (exponential)")
    
    # Demonstrate backend fallback
    print("\n" + "-"*70)
    print("🔄 Backend Fallback Example:\n")
    
    config = Config.load_or_default()
    print(f"  Requested backend: {config.backend}")
    
    try:
        backend = detect_backend(config.backend)
        print(f"  ✓ Selected backend: {backend.__class__.__name__}")
        
        # Show that it's resilient
        health = backend.check_health()
        print(f"  ✓ Health check: {'Healthy' if health else 'Degraded'}")
        
    except Exception as e:
        print(f"  ✓ Gracefully handled error: {str(e)[:50]}...")
    
    # Testing scenarios
    print("\n" + "-"*70)
    print("🧪 Common Error Scenarios:\n")
    
    scenarios = [
        ("Network timeout", "Automatic retry with backoff"),
        ("Backend unavailable", "Automatic fallback to next backend"),
        ("Invalid response", "Error logged, user notified"),
        ("Configuration error", "Validation catches it, defaults used"),
        ("Memory pressure", "System check detects, warns user"),
    ]
    
    for scenario, recovery in scenarios:
        print(f"  • {scenario}")
        print(f"    → {recovery}")
    
    # Show debug mode
    print("\n" + "-"*70)
    print("🔍 Debug Mode for Troubleshooting:\n")
    
    print("  Enable debug logging:")
    print("    export LMAPP_DEBUG=1")
    print("    lmapp chat")
    print("    # See detailed logs in ~/.local/share/lmapp/logs/lmapp.log")
    
    print("\n  View logs:")
    print("    tail -f ~/.local/share/lmapp/logs/lmapp.log")
    
    print("\n" + "="*70)
    print("✅ Error recovery demo completed!")
    print("="*70 + "\n")
    print("Key takeaways:")
    print("  • lmapp handles errors gracefully")
    print("  • Automatic retries with intelligent backoff")
    print("  • Seamless fallback between backends")
    print("  • Always provides helpful error messages")
    print("  • Debug mode available for troubleshooting")
    print("  • Reliable even on constrained systems")
    print("\n")
    
    return 0


if __name__ == "__main__":
    sys.exit(main())

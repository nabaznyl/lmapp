import os
import sys
import pytest
from mock_backend import MockBackend
from lmapp.core.chat import ChatSession

# Ensure the repository root is on sys.path so `src` is an importable top-level
# package. Tests import modules as `src.lmapp...`, so the parent directory
# (project root) must be on sys.path.
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)
"""Pytest configuration and fixtures"""


@pytest.fixture
def mock_backend():
    """Provide a mock backend instance"""
    backend = MockBackend()
    backend.start()
    return backend


@pytest.fixture
def chat_session(mock_backend):
    """Provide a chat session with mock backend"""
    return ChatSession(mock_backend, model="mock-model")

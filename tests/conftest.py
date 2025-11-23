"""Pytest configuration and fixtures"""

import pytest
from lmapp.backend.mock import MockBackend
from lmapp.core.chat import ChatSession


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

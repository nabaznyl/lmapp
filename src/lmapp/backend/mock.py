#!/usr/bin/env python3
"""
Mock Backend for Testing
Simulates LLM responses without requiring actual Ollama or llamafile installation
"""

from typing import List
from .base import LLMBackend, BackendInfo, BackendStatus


class MockBackend(LLMBackend):
    """Mock backend that simulates LLM responses for testing"""

    def __init__(self):
        """Initialize mock backend"""
        self._running = False
        self._models = ["mock-model", "mock-7b", "mock-13b"]

    def backend_name(self) -> str:
        """Return backend name"""
        return "mock"

    def backend_display_name(self) -> str:
        """Return display name"""
        return "Mock (Testing)"

    def is_installed(self) -> bool:
        """Mock backend is always 'installed' for testing"""
        return True

    def get_version(self) -> str:
        """Return mock version"""
        return "1.0.0-mock"

    def get_info(self) -> BackendInfo:
        """Return backend information"""
        return BackendInfo(
            name="mock",
            display_name="Mock (Testing)",
            version="1.0.0-mock",
            status=BackendStatus.INSTALLED if self.is_installed() else BackendStatus.NOT_INSTALLED,
        )

    def is_running(self) -> bool:
        """Return mock running status"""
        return self._running

    def start(self) -> bool:
        """Mock start - just set flag"""
        self._running = True
        return True

    def stop(self) -> bool:
        """Mock stop - just set flag"""
        self._running = False
        return True

    def install(self) -> bool:
        """Mock install - always succeeds"""
        return True

    def list_models(self) -> List[str]:
        """Return list of mock models"""
        return self._models

    def download_model(self, model_name: str, progress_callback=None) -> bool:
        """Mock model download"""
        if progress_callback:
            progress_callback("Downloading mock model...")
            progress_callback("Model downloaded!")
        return True

    def remove_model(self, model_name: str) -> bool:
        """Mock model removal"""
        if model_name in self._models:
            self._models.remove(model_name)
            return True
        return False

    def chat(self, prompt: str, model: str = "mock-model", temperature: float = 0.7, **kwargs) -> str:
        """
        Return mock response based on prompt content

        Args:
            prompt: User prompt
            model: Model name (ignored for mock)
            temperature: Temperature setting (ignored for mock)

        Returns:
            Mock response
        """
        # Echo back the prompt in a mock way
        prompt_preview = prompt[:50].replace("\n", " ")
        return f"[Mock Response] You asked: {prompt_preview}... This is a simulated response for testing purposes."

    def supports_streaming(self) -> bool:
        """Mock backend doesn't support streaming"""
        return False

    def stream_chat(self, prompt: str, model: str = "mock-model", temperature: float = 0.7, **kwargs):
        """Mock streaming not implemented"""
        raise NotImplementedError("Mock backend does not support streaming")

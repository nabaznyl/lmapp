from typing import Any
from lmapp.backend.base import LLMBackend, BackendStatus, BackendInfo


class MockBackend(LLMBackend):
    """Mock backend for testing purposes only."""

    def __init__(self):
        self._running = False
        super().__init__()

    def backend_name(self) -> str:
        return "mock"

    def backend_display_name(self) -> str:
        return "Mock (Testing)"

    def is_installed(self) -> bool:
        return True

    def get_version(self) -> str:
        return "1.0.0-mock"

    def is_running(self) -> bool:
        return self._running

    def install(self) -> bool:
        return True

    def start(self) -> bool:
        self._running = True
        return True

    def stop(self) -> bool:
        self._running = False
        return True

    def list_models(self) -> list:
        return ["mock-model", "mock-7b", "mock-13b"]

    def download_model(self, model_name: str, callback=None) -> bool:
        return True

    def chat(
        self,
        prompt: str,
        model: str = "",
        temperature: float = 0.7,
        *args,
        **kwargs: Any,
    ) -> str:
        return f"Mock response. You asked: {prompt}"

    def get_status(self) -> BackendStatus:
        if self._running:
            return BackendStatus.RUNNING
        return BackendStatus.INSTALLED

    def get_info(self) -> BackendInfo:
        info = super().get_info()
        return info

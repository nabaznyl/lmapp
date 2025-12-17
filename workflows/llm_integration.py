"""
LLM Integration for Workflow Actions
Connects workflow action handlers to lmapp LLM backend
"""
import sys
from pathlib import Path
from typing import Optional

# Add src to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from lmapp.backend import BackendDetector


class WorkflowLLM:
    """LLM integration for workflow execution"""
    
    def __init__(self):
        self.backend = None
        self.model = None
        self._initialize_backend()
    
    def _initialize_backend(self):
        """Auto-detect and initialize available backend"""
        detector = BackendDetector()
        available = detector.detect_all()
        
        # Find first running backend
        for backend_info in available:
            if backend_info.status.value == "running":
                # Get actual backend instance
                if backend_info.name == "ollama":
                    from lmapp.backend.ollama import OllamaBackend
                    self.backend = OllamaBackend()
                elif backend_info.name == "llamafile":
                    from lmapp.backend.llamafile import LlamafileBackend
                    self.backend = LlamafileBackend()
                
                # Get first available model
                if self.backend:
                    models = self.backend.list_models()
                    if models:
                        self.model = models[0]
                    break
    
    def generate(self, prompt: str, system_prompt: Optional[str] = None) -> str:
        """
        Generate text using LLM
        
        Args:
            prompt: User prompt
            system_prompt: Optional system prompt for context
        
        Returns:
            Generated text from LLM
        """
        if not self.backend or not self.model:
            return f"[LLM not available] Would generate: {prompt[:100]}..."
        
        try:
            messages = []
            if system_prompt:
                messages.append({"role": "system", "content": system_prompt})
            messages.append({"role": "user", "content": prompt})
            
            response = self.backend.chat(
                prompt=prompt,
                model=self.model,
                system_prompt=system_prompt,
                temperature=0.7,
                stream=False
            )
            
            return response
        except Exception as e:
            return f"[LLM Error] {str(e)}"
    
    def is_available(self) -> bool:
        """Check if LLM backend is available"""
        return self.backend is not None and self.model is not None


# Global instance
_llm = None

def get_llm() -> WorkflowLLM:
    """Get or create global LLM instance"""
    global _llm
    if _llm is None:
        _llm = WorkflowLLM()
    return _llm

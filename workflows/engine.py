"""
Workflow Engine - Executes preset workflow templates
"""
import yaml
from pathlib import Path
from typing import Dict, List, Any, Optional
from dataclasses import dataclass

@dataclass
class WorkflowStep:
    """Single step in a workflow"""
    prompt: str
    action: str
    params: Dict[str, Any] = None
    
    def __post_init__(self):
        if self.params is None:
            self.params = {}

@dataclass
class Workflow:
    """Complete workflow definition"""
    name: str
    description: str
    steps: List[WorkflowStep]
    metadata: Dict[str, Any] = None
    
    def __post_init__(self):
        if self.metadata is None:
            self.metadata = {}

class WorkflowEngine:
    """Execute workflows step by step"""
    
    def __init__(self, action_registry):
        self.action_registry = action_registry
        self.variables = {}
    
    def load_workflow(self, path: Path) -> Workflow:
        """Load workflow from YAML file"""
        with open(path) as f:
            data = yaml.safe_load(f)
        
        steps = [
            WorkflowStep(
                prompt=step.get('prompt', ''),
                action=step.get('action', ''),
                params=step.get('params', {})
            )
            for step in data.get('steps', [])
        ]
        
        return Workflow(
            name=data.get('name', 'Untitled'),
            description=data.get('description', ''),
            steps=steps,
            metadata=data.get('metadata', {})
        )
    
    def execute_workflow(self, workflow: Workflow, context: Dict[str, Any] = None):
        """
        Execute workflow step by step
        
        Args:
            workflow: Workflow to execute
            context: Initial context/variables
        
        Yields:
            (step_index, step, result) for each step
        """
        if context:
            self.variables.update(context)
        
        for i, step in enumerate(workflow.steps):
            # Substitute variables in prompt
            prompt = self._substitute_variables(step.prompt)
            
            # Get action handler
            action_handler = self.action_registry.get(step.action)
            if not action_handler:
                raise ValueError(f"Unknown action: {step.action}")
            
            # Execute action
            result = action_handler(prompt, step.params, self.variables)
            
            # Update variables with result
            if isinstance(result, dict):
                self.variables.update(result)
            
            yield (i, step, result)
    
    def _substitute_variables(self, text: str) -> str:
        """Substitute {variable} placeholders in text"""
        for key, value in self.variables.items():
            text = text.replace(f"{{{key}}}", str(value))
        return text

def list_available_workflows(workflow_dir: Path = None) -> List[Dict[str, str]]:
    """List all available workflow templates"""
    if workflow_dir is None:
        workflow_dir = Path(__file__).parent / "templates"
    
    workflows = []
    for yaml_file in workflow_dir.glob("*.yaml"):
        with open(yaml_file) as f:
            data = yaml.safe_load(f)
            workflows.append({
                'name': data.get('name', yaml_file.stem),
                'description': data.get('description', ''),
                'path': str(yaml_file)
            })
    
    return workflows

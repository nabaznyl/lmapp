#!/usr/bin/env python3
"""
Workflow CLI - Execute workflow templates from command line
"""
import sys
import argparse
from pathlib import Path

# Add workflows directory to path
sys.path.insert(0, str(Path(__file__).parent))

from engine import WorkflowEngine, list_available_workflows
from actions import default_registry


def main():
    parser = argparse.ArgumentParser(description="Execute lmapp workflow templates")
    parser.add_argument("--list", action="store_true", help="List available workflows")
    parser.add_argument("workflow", nargs="?", help="Workflow name to execute")
    parser.add_argument("--verbose", action="store_true", help="Show detailed execution info")
    
    args = parser.parse_args()
    
    if args.list:
        print("\n📋 Available Workflows:\n")
        workflows = list_available_workflows()
        for wf in workflows:
            print(f"  • {wf['name']}")
            print(f"    {wf['description']}")
            print(f"    Path: {wf['path']}\n")
        return
    
    if not args.workflow:
        parser.print_help()
        return
    
    # Find workflow by name
    workflows = list_available_workflows()
    workflow_file = None
    for wf in workflows:
        if wf['name'].lower() == args.workflow.lower():
            workflow_file = Path(wf['path'])
            break
    
    if not workflow_file:
        print(f"❌ Workflow '{args.workflow}' not found")
        print("\nAvailable workflows:")
        for wf in workflows:
            print(f"  - {wf['name']}")
        return
    
    # Execute workflow
    print(f"\n🚀 Executing workflow: {args.workflow}\n")
    
    engine = WorkflowEngine(default_registry)
    workflow = engine.load_workflow(workflow_file)
    
    print(f"📝 {workflow.description}\n")
    
    for step_num, step, result in engine.execute_workflow(workflow):
        if args.verbose:
            print(f"\n--- Step {step_num + 1}: {step.action} ---")
            print(f"Prompt: {step.prompt}")
            print(f"Result: {result}\n")
        else:
            print(f"✓ Step {step_num + 1}/{len(workflow.steps)}: {step.action}")
    
    print(f"\n✅ Workflow '{workflow.name}' completed!")
    
    # Show final results
    if engine.variables:
        print("\n📊 Final Results:")
        for key, value in engine.variables.items():
            if isinstance(value, str) and len(value) > 200:
                print(f"  {key}: {value[:200]}...")
            else:
                print(f"  {key}: {value}")


if __name__ == "__main__":
    main()

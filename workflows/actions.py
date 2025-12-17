"""
Action handlers for workflow steps
"""
from typing import Dict, Any, Callable

class ActionRegistry:
    """Registry of available workflow actions"""
    
    def __init__(self):
        self._actions: Dict[str, Callable] = {}
    
    def register(self, name: str, handler: Callable):
        """Register an action handler"""
        self._actions[name] = handler
    
    def get(self, name: str) -> Callable:
        """Get action handler by name"""
        return self._actions.get(name)
    
    def list_actions(self) -> list:
        """List all registered actions"""
        return list(self._actions.keys())

# Default action handlers
def collect_input(prompt: str, params: Dict[str, Any], variables: Dict[str, Any]) -> Dict[str, str]:
    """Collect user input"""
    user_input = input(f"{prompt}: ")
    return {params.get('var_name', 'user_input'): user_input}

def generate_outline(prompt: str, params: Dict[str, Any], variables: Dict[str, Any]) -> Dict[str, str]:
    """Generate outline using AI"""
    from .llm_integration import get_llm
    
    llm = get_llm()
    topic = variables.get('topic', 'the given topic')
    
    system_prompt = "You are a helpful assistant that creates clear, structured outlines for academic papers."
    outline_prompt = f"Create a detailed outline for a paper about: {topic}"
    
    outline = llm.generate(outline_prompt, system_prompt)
    return {'outline': outline}

def write_section(prompt: str, params: Dict[str, Any], variables: Dict[str, Any]) -> Dict[str, str]:
    """Write a section using AI"""
    from .llm_integration import get_llm
    
    llm = get_llm()
    section_type = params.get('section_type', 'section')
    outline = variables.get('outline', '')
    topic = variables.get('topic', '')
    
    system_prompt = "You are a helpful assistant that writes clear, well-structured academic content."
    section_prompt = f"Write the {section_type} for a paper about '{topic}'.\n\nOutline:\n{outline}"
    
    section = llm.generate(section_prompt, system_prompt)
    return {'section': section, f'{section_type}_content': section}

def rag_search(prompt: str, params: Dict[str, Any], variables: Dict[str, Any]) -> Dict[str, Any]:
    """Search local files using RAG"""
    # TODO: Connect to RAG system
    query = variables.get('query', prompt)
    results = [
        {'file': 'document1.txt', 'excerpt': 'Relevant information...'},
        {'file': 'document2.pdf', 'excerpt': 'More relevant content...'}
    ]
    return {'search_results': results, 'num_results': len(results)}

def summarize(prompt: str, params: Dict[str, Any], variables: Dict[str, Any]) -> Dict[str, str]:
    """Summarize results"""
    from .llm_integration import get_llm
    
    llm = get_llm()
    
    # Get content to summarize
    search_results = variables.get('search_results', [])
    analysis = variables.get('analysis', '')
    help_content = variables.get('help_content', '')
    
    if search_results:
        content = f"Search results:\n" + "\n".join([f"- {r.get('file', 'file')}: {r.get('excerpt', '')}" for r in search_results])
    elif analysis:
        content = f"Analysis:\n{analysis}"
    elif help_content:
        content = f"Help content:\n{help_content}"
    else:
        content = str(variables)
    
    system_prompt = "You are a helpful assistant that creates clear, concise summaries."
    summary_prompt = f"Summarize the following information:\n\n{content}"
    
    summary = llm.generate(summary_prompt, system_prompt)
    return {'summary': summary}

def search_offline_db(prompt: str, params: Dict[str, Any], variables: Dict[str, Any]) -> Dict[str, Any]:
    """Search offline knowledge base"""
    # TODO: Implement offline DB search
    game = variables.get('game_name', 'Unknown Game')
    help_type = variables.get('help_type', 'tips')
    results = {
        'tips': f"Tips for {game}: Use stealth, collect items, save often.",
        'codes': f"Cheat codes for {game}: IDDQD, IDKFA",
        'walkthrough': f"Walkthrough for {game}: Complete level 1, then level 2..."
    }
    return {'help_content': results.get(help_type, 'No help available')}

def generate_email(prompt: str, params: Dict[str, Any], variables: Dict[str, Any]) -> Dict[str, str]:
    """Generate professional email"""
    from .llm_integration import get_llm
    
    llm = get_llm()
    email_type = variables.get('email_type', 'request')
    key_points = variables.get('key_points', '')
    
    system_prompt = "You are a professional email writer. Create clear, concise, professional emails."
    email_prompt = f"Write a professional {email_type} email that covers these points:\n{key_points}"
    
    email = llm.generate(email_prompt, system_prompt)
    return {'email': email}

def select_file(prompt: str, params: Dict[str, Any], variables: Dict[str, Any]) -> Dict[str, str]:
    """Select a file using dialog"""
    # TODO: Implement file dialog (GUI) or prompt for path (CLI)
    file_path = input(f"{prompt} (enter file path): ")
    return {'file_path': file_path}

def copy_to_clipboard(prompt: str, params: Dict[str, Any], variables: Dict[str, Any]) -> Dict[str, bool]:
    """Copy content to system clipboard"""
    try:
        import pyperclip
        content = variables.get('email', variables.get('summary', variables.get('report', '')))
        pyperclip.copy(content)
        return {'copied': True}
    except ImportError:
        print("Note: pyperclip not installed, content not copied")
        return {'copied': False}

def analyze_document(prompt: str, params: Dict[str, Any], variables: Dict[str, Any]) -> Dict[str, str]:
    """Analyze document"""
    from .llm_integration import get_llm
    
    llm = get_llm()
    analysis_type = variables.get('analysis_type', 'summary')
    file_path = variables.get('file_path', '')
    
    # Read file content
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()[:10000]  # Limit to first 10k chars
    except Exception as e:
        return {'analysis': f"Error reading file: {e}"}
    
    system_prompt = "You are a document analysis expert. Provide clear, actionable insights."
    analysis_prompt = f"Analyze this document for {analysis_type}:\n\n{content}"
    
    analysis = llm.generate(analysis_prompt, system_prompt)
    return {'analysis': analysis}

def format_report(prompt: str, params: Dict[str, Any], variables: Dict[str, Any]) -> Dict[str, str]:
    """Format analysis as report"""
    analysis = variables.get('analysis', 'No analysis available')
    report = f"# Document Analysis Report\n\n{analysis}"
    return {'report': report}

# Create default registry
default_registry = ActionRegistry()
default_registry.register('collect_input', collect_input)
default_registry.register('generate_outline', generate_outline)
default_registry.register('write_section', write_section)
default_registry.register('rag_search', rag_search)
default_registry.register('summarize', summarize)
default_registry.register('search_offline_db', search_offline_db)
default_registry.register('generate_email', generate_email)
default_registry.register('select_file', select_file)
default_registry.register('copy_to_clipboard', copy_to_clipboard)
default_registry.register('analyze_document', analyze_document)
default_registry.register('format_report', format_report)

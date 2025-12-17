import * as vscode from 'vscode';
import axios from 'axios';

interface QuickFix {
    id: string;
    title: string;
    explanation: string;
    auto_fixable: boolean;
    category: string;
}

/**
 * Code Actions Provider - Displays quick fix suggestions in the lightbulb menu
 */
export class LmappCodeActionProvider implements vscode.CodeActionProvider {
    public async provideCodeActions(
        document: vscode.TextDocument,
        range: vscode.Range | vscode.Selection,
        context: vscode.CodeActionContext,
        token: vscode.CancellationToken
    ): Promise<vscode.CodeAction[]> {
        const actions: vscode.CodeAction[] = [];
        
        // Only provide actions for Python files initially
        if (document.languageId !== 'python' && document.languageId !== 'javascript' && document.languageId !== 'typescript') {
            return actions;
        }
        
        // Get the line with the error/warning
        const line = document.lineAt(range.start.line);
        const lineText = line.text.trim();
        
        if (!lineText) {
            return actions;
        }
        
        try {
            const config = vscode.workspace.getConfiguration('lmapp');
            const serverUrl = config.get('serverUrl') as string;
            const language = getLanguageId(document.languageId);
            
            // Request quick fixes from the server
            const response = await axios.post(
                `${serverUrl}/v1/refactor/quick-fixes`,
                {
                    prompt: lineText,
                    language: language,
                },
                { timeout: 3000 }
            );
            
            if (response.data && response.data.fixes) {
                const fixes: QuickFix[] = response.data.fixes.filter((f: QuickFix) => f.auto_fixable);
                
                for (const fix of fixes) {
                    const action = new vscode.CodeAction(
                        `🔧 ${fix.title}`,
                        vscode.CodeActionKind.QuickFix
                    );
                    action.command = {
                        title: fix.title,
                        command: 'lmapp.applyQuickFix',
                        arguments: [document.uri, range.start.line, fix],
                    };
                    action.isPreferred = fix.category === 'syntax' || fix.category === 'style';
                    actions.push(action);
                }
            }
        } catch (error) {
            // Silently fail - don't show errors in code action provider
            console.log('Code action provider error:', error);
        }
        
        return actions;
    }
    
    public resolveCodeAction(
        codeAction: vscode.CodeAction,
        token: vscode.CancellationToken
    ): vscode.CodeAction | undefined {
        return codeAction;
    }
}

function getLanguageId(vscodeLanguageId: string): string {
    /**
     * Map VS Code language IDs to lmapp language names.
     */
    const languageMap: { [key: string]: string } = {
        'python': 'python',
        'javascript': 'javascript',
        'typescript': 'typescript',
        'java': 'java',
        'cpp': 'cpp',
        'c': 'c',
    };
    
    return languageMap[vscodeLanguageId] || 'generic';
}

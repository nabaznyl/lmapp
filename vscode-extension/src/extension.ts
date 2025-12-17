import * as vscode from 'vscode';
import axios from 'axios';
import { exec, ChildProcess } from 'child_process';
import { LmappCodeActionProvider } from './codeActionsProvider';

// Type definitions for refactoring features
interface QuickFix {
    id: string;
    title: string;
    explanation: string;
    auto_fixable: boolean;
    category: string;
}

interface RefactoringSuggestions {
    total_fixes: number;
    fixes_by_category: { [key: string]: number };
    suggestions: QuickFix[];
}

let statusBarItem: vscode.StatusBarItem;
let serverProcess: ChildProcess | undefined;

export function activate(context: vscode.ExtensionContext) {
    console.log('lmapp-vscode is now active!');

    // Status Bar
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'lmapp.toggleServer';
    context.subscriptions.push(statusBarItem);
    updateStatusBar('Ready');
    statusBarItem.show();

    // Commands
    context.subscriptions.push(
        vscode.commands.registerCommand('lmapp.startServer', startServer),
        vscode.commands.registerCommand('lmapp.stopServer', stopServer),
        vscode.commands.registerCommand('lmapp.toggleServer', toggleServer),
        vscode.commands.registerCommand('lmapp.refactorSelection', refactorSelection),
        vscode.commands.registerCommand('lmapp.quickFixOnFile', quickFixOnFile)
    );

    // Inline Completion Provider
    const provider = new LmappCompletionProvider();
    const selector = { pattern: '**' }; // Match all files
    
    context.subscriptions.push(
        vscode.languages.registerInlineCompletionItemProvider(selector, provider)
    );
    
    // Code Action Provider (Quick Fixes)
    const codeActionProvider = new LmappCodeActionProvider();
    context.subscriptions.push(
        vscode.languages.registerCodeActionsProvider({ pattern: '**' }, codeActionProvider)
    );

    // Configuration change listener
    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('lmapp')) {
                console.log('lmapp configuration changed');
                provider.clearCache(); // Clear cache when settings change
            }
        })
    );
}

interface CompletionCache {
    prompt: string;
    result: string;
    timestamp: number;
}

class LmappCompletionProvider implements vscode.InlineCompletionItemProvider {
    private lastRequestTime: number = 0;
    private cache: CompletionCache[] = [];
    private readonly MAX_CACHE_SIZE = 50;
    private readonly CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

    clearCache(): void {
        this.cache = [];
    }

    private getCachedCompletion(prompt: string): string | null {
        const cached = this.cache.find(c => c.prompt === prompt);
        if (cached) {
            // Check if still valid
            if (Date.now() - cached.timestamp < this.CACHE_TTL_MS) {
                return cached.result;
            } else {
                // Remove expired entry
                this.cache = this.cache.filter(c => c.prompt !== prompt);
            }
        }
        return null;
    }

    private setCachedCompletion(prompt: string, result: string): void {
        // Remove oldest entry if cache is full
        if (this.cache.length >= this.MAX_CACHE_SIZE) {
            this.cache.shift();
        }
        this.cache.push({
            prompt,
            result,
            timestamp: Date.now()
        });
    }

    async provideInlineCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        context: vscode.InlineCompletionContext,
        token: vscode.CancellationToken
    ): Promise<vscode.InlineCompletionItem[]> {
        
        const config = vscode.workspace.getConfiguration('lmapp');
        if (!config.get('enableInlineCompletion')) {
            return [];
        }

        const debounceMs = config.get('debounceMs') as number || 500;

        // Debounce: Don't request on every keystroke
        const now = Date.now();
        if (now - this.lastRequestTime < debounceMs) {
            await new Promise(resolve => setTimeout(resolve, debounceMs));
            if (token.isCancellationRequested) return [];
        }
        this.lastRequestTime = Date.now();

        const serverUrl = config.get('serverUrl') as string;
        const model = config.get('model') as string;
        const maxLines = config.get('contextLines') as number || 50;
        const requestTimeout = config.get('requestTimeout') as number || 2000;

        // Get context (prefix/suffix)
        const startLine = Math.max(0, position.line - maxLines);
        const range = new vscode.Range(new vscode.Position(startLine, 0), position);
        const prompt = document.getText(range);

        // Check cache first
        const cachedResult = this.getCachedCompletion(prompt);
        if (cachedResult) {
            return [new vscode.InlineCompletionItem(cachedResult, new vscode.Range(position, position))];
        }

        try {
            updateStatusBar('$(sync~spin) Generating...');
            
            const enableAnalysis = config.get('enableCodeAnalysis') as boolean || false;
            const analysisLanguage = config.get('analysisLanguage') as string || 'python';
            
            const response = await axios.post(`${serverUrl}/v1/completions`, {
                model: model,
                prompt: prompt,
                max_tokens: 50,
                temperature: 0.2,
                stop: ["\n\n"],
                include_analysis: enableAnalysis,
                language: analysisLanguage
            }, { timeout: requestTimeout }); 

            updateStatusBar('Ready');

            if (token.isCancellationRequested) return [];

            if (response.data && response.data.choices && response.data.choices.length > 0) {
                const choice = response.data.choices[0];
                const text = choice.text;
                
                if (text) {
                    // Cache the result
                    this.setCachedCompletion(prompt, text);
                    
                    // Show analysis results if available
                    if (choice.analysis && choice.analysis.issues && choice.analysis.issues.length > 0) {
                        this.showAnalysisResults(choice.analysis);
                    }
                    
                    return [new vscode.InlineCompletionItem(text, new vscode.Range(position, position))];
                }
            }
        } catch (error: any) {
            updateStatusBar('Ready');
            // Provide helpful error guidance silently
            const errorMessage = error?.message || 'Unknown error';
            if (errorMessage.includes('ECONNREFUSED')) {
                // Server not running - silent, user will see status bar
            } else if (errorMessage.includes('timeout')) {
                console.log('lmapp completion request timed out');
            } else {
                console.log(`lmapp completion error: ${errorMessage}`);
            }
        }
        
        return [];
    }
    
    private showAnalysisResults(analysis: any): void {
        /**
         * Display code analysis results in the status bar.
         * Shows summary of detected issues with severity breakdown.
         */
        const summary = analysis.summary;
        if (!summary) return;
        
        const critical = summary.by_severity?.critical || 0;
        const high = summary.by_severity?.high || 0;
        const medium = summary.by_severity?.medium || 0;
        const complexity = analysis.complexity || 0;
        
        let issueText = '';
        if (critical > 0) {
            issueText += `🔴 ${critical} critical`;
        }
        if (high > 0) {
            issueText += (issueText ? ' ' : '') + `🟠 ${high} high`;
        }
        if (medium > 0) {
            issueText += (issueText ? ' ' : '') + `🟡 ${medium} medium`;
        }
        if (complexity > 0) {
            issueText += (issueText ? ' ' : '') + `📊 Complexity: ${complexity}`;
        }
        
        if (issueText) {
            // Show issues in status bar for 4 seconds
            vscode.window.setStatusBarMessage(
                `Analysis: ${issueText}`,
                4000
            );
        }
    }
}

interface QuickFix {
    id: string;
    category: string;
    severity: string;
    title: string;
    description: string;
    before: string;
    after: string;
    line: number;
    auto_fixable: boolean;
    explanation: string;
}

class LmappCodeActionProvider implements vscode.CodeActionProvider {
    /**
     * Provide code actions (quick fixes) for the current selection or file.
     * Called when user invokes quick fix menu (Ctrl+.)
     */
    async provideCodeActions(
        document: vscode.TextDocument,
        range: vscode.Range | vscode.Selection,
        context: vscode.CodeActionContext,
        token: vscode.CancellationToken
    ): Promise<vscode.CodeAction[]> {
        const config = vscode.workspace.getConfiguration('lmapp');
        const serverUrl = config.get('serverUrl') as string;
        const language = this.getLanguageId(document.languageId);
        
        const codeActions: vscode.CodeAction[] = [];
        
        try {
            // Get quick fixes for the entire document
            const code = document.getText();
            const response = await axios.post(`${serverUrl}/v1/refactor/quick-fixes`, {
                prompt: code,
                language: language,
            }, { timeout: 5000 });
            
            if (response.data && response.data.fixes) {
                for (const fix of response.data.fixes) {
                    // Create a CodeAction for each fix
                    const action = new vscode.CodeAction(
                        fix.title,
                        vscode.CodeActionKind.QuickFix
                    );
                    action.command = {
                        title: fix.title,
                        command: 'lmapp.applyFix',
                        arguments: [document, fix],
                    };
                    action.diagnostics = [];
                    codeActions.push(action);
                }
            }
        } catch (error) {
            // Silently fail - code actions are optional
        }
        
        return codeActions;
    }
    
    private getLanguageId(vscodeLanguageId: string): string {
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
}

function updateStatusBar(text: string) {
    statusBarItem.text = `$(hubot) lmapp: ${text}`;
}

function toggleServer() {
    if (serverProcess) {
        stopServer();
    } else {
        startServer();
    }
}

function startServer() {
    if (serverProcess) {
        vscode.window.showInformationMessage('lmapp server is already running.');
        return;
    }

    vscode.window.showInformationMessage('Starting lmapp server...');
    updateStatusBar('$(sync~spin) Starting...');
    
    // Use 'lmapp server' command
    serverProcess = exec('lmapp server', (err, stdout, stderr) => {
        if (err && !serverProcess?.killed) {
            vscode.window.showErrorMessage(`Failed to start lmapp: ${err.message}`);
            serverProcess = undefined;
            updateStatusBar('$(error) Failed');
            return;
        }
    });

    // Give it a moment to start
    setTimeout(() => {
        if (serverProcess) {
             updateStatusBar('Running');
             vscode.window.showInformationMessage('lmapp server started!');
        }
    }, 2000);
}

function stopServer() {
    if (serverProcess) {
        serverProcess.kill();
        serverProcess = undefined;
        vscode.window.showInformationMessage('lmapp server stopped.');
        updateStatusBar('Stopped');
    } else {
        vscode.window.showInformationMessage('lmapp server is not running.');
    }
}

async function refactorSelection() {
    /**
     * Get refactoring suggestions for selected code.
     */
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor');
        return;
    }
    
    const selection = editor.selection;
    const selectedCode = editor.document.getText(selection);
    
    if (!selectedCode) {
        vscode.window.showErrorMessage('No code selected');
        return;
    }
    
    const config = vscode.workspace.getConfiguration('lmapp');
    const serverUrl = config.get('serverUrl') as string;
    const language = getLanguageId(editor.document.languageId);
    
    try {
        updateStatusBar('$(sync~spin) Refactoring...');
        
        const response = await axios.post(`${serverUrl}/v1/refactor/suggestions`, {
            prompt: selectedCode,
            language: language,
        }, { timeout: 5000 });
        
        updateStatusBar('Ready');
        
        if (response.data && response.data.suggestions) {
            const suggestions = response.data.suggestions;
            const message = `Found ${suggestions.total_fixes} refactoring suggestions`;
            vscode.window.showInformationMessage(message);
            
            // Show summary of fixes by category
            const categories = Object.entries(suggestions.fixes_by_category);
            if (categories.length > 0) {
                const categoryText = categories
                    .map(([cat, count]: any) => `${count} ${cat}`)
                    .join(', ');
                vscode.window.showInformationMessage(`Suggestions: ${categoryText}`);
            }
        }
    } catch (error: any) {
        updateStatusBar('Ready');
        const errorMsg = error?.message || 'Unknown error';
        vscode.window.showErrorMessage(`Refactoring failed: ${errorMsg}`);
    }
}

async function quickFixOnFile() {
    /**
     * Apply quick fixes to the current file.
     */
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor');
        return;
    }
    
    const code = editor.document.getText();
    const config = vscode.workspace.getConfiguration('lmapp');
    const serverUrl = config.get('serverUrl') as string;
    const language = getLanguageId(editor.document.languageId);
    
    try {
        updateStatusBar('$(sync~spin) Fixing...');
        
        const response = await axios.post(`${serverUrl}/v1/refactor/quick-fixes`, {
            prompt: code,
            language: language,
        }, { timeout: 5000 });
        
        updateStatusBar('Ready');
        
        if (response.data && response.data.total_fixes > 0) {
            const fixes = response.data.fixes.filter((f: QuickFix) => f.auto_fixable);
            if (fixes.length > 0) {
                const apply = await vscode.window.showQuickPick(
                    fixes.map((f: QuickFix) => ({
                        label: f.title,
                        description: f.explanation,
                        fix: f,
                    })),
                    { placeHolder: 'Select fix to apply' }
                );
                
                if (apply) {
                    // Apply the selected fix
                    const fixResponse = await axios.post(`${serverUrl}/v1/refactor/apply`, {
                        code: code,
                        fix_id: apply.fix.id,
                        language: language,
                    });
                    
                    if (fixResponse.data && fixResponse.data.success) {
                        // Replace document content
                        const range = new vscode.Range(
                            editor.document.lineAt(0).range.start,
                            editor.document.lineAt(editor.document.lineCount - 1).range.end
                        );
                        await editor.edit(edit => {
                            edit.replace(range, fixResponse.data.modified_code);
                        });
                        
                        vscode.window.showInformationMessage(`✅ Applied: ${apply.fix.title}`);
                    }
                }
            } else {
                vscode.window.showInformationMessage('No auto-fixable issues found');
            }
        } else {
            vscode.window.showInformationMessage('No issues found in file');
        }
    } catch (error: any) {
        updateStatusBar('Ready');
        const errorMsg = error?.message || 'Unknown error';
        vscode.window.showErrorMessage(`Quick fix failed: ${errorMsg}`);
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

export function deactivate() {
    if (serverProcess) {
        serverProcess.kill();
    }
}

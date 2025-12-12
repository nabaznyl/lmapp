import * as vscode from 'vscode';
import axios from 'axios';
import { exec, ChildProcess } from 'child_process';

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
        vscode.commands.registerCommand('lmapp.toggleServer', toggleServer)
    );

    // Inline Completion Provider
    const provider = new LmappCompletionProvider();
    const selector = { pattern: '**' }; // Match all files
    
    context.subscriptions.push(
        vscode.languages.registerInlineCompletionItemProvider(selector, provider)
    );
}

class LmappCompletionProvider implements vscode.InlineCompletionItemProvider {
    private lastRequestTime: number = 0;
    private debounceMs: number = 500; // Wait 500ms after typing stops

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

        // Debounce: Don't request on every keystroke
        const now = Date.now();
        if (now - this.lastRequestTime < this.debounceMs) {
            await new Promise(resolve => setTimeout(resolve, this.debounceMs));
            if (token.isCancellationRequested) return [];
        }
        this.lastRequestTime = Date.now();

        const serverUrl = config.get('serverUrl') as string;
        const model = config.get('model') as string;
        const maxLines = config.get('contextLines') as number || 50;

        // Get context (prefix/suffix)
        // Optimize: Only send relevant context window to reduce latency
        const startLine = Math.max(0, position.line - maxLines);
        const range = new vscode.Range(new vscode.Position(startLine, 0), position);
        const prompt = document.getText(range);

        try {
            updateStatusBar('$(sync~spin) Generating...');
            
            const response = await axios.post(`${serverUrl}/v1/completions`, {
                model: model,
                prompt: prompt,
                max_tokens: 50,
                temperature: 0.2,
                stop: ["\n\n"] 
            }, { timeout: 2000 }); 

            updateStatusBar('Ready');

            if (token.isCancellationRequested) return [];

            if (response.data && response.data.choices && response.data.choices.length > 0) {
                const text = response.data.choices[0].text;
                if (text) {
                    return [new vscode.InlineCompletionItem(text, new vscode.Range(position, position))];
                }
            }
        } catch (error) {
            updateStatusBar('$(error) Error');
            // Silent fail for completions to avoid annoying user
        }
        
        return [];
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

export function deactivate() {
    if (serverProcess) {
        serverProcess.kill();
    }
}

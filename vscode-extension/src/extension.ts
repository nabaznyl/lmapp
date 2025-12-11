import * as vscode from 'vscode';
import axios from 'axios';
import { exec } from 'child_process';

let statusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
    console.log('lmapp-vscode is now active!');

    // Status Bar
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'lmapp.startServer';
    context.subscriptions.push(statusBarItem);
    updateStatusBar('Ready');
    statusBarItem.show();

    // Commands
    context.subscriptions.push(
        vscode.commands.registerCommand('lmapp.startServer', startServer),
        vscode.commands.registerCommand('lmapp.stopServer', stopServer)
    );

    // Inline Completion Provider
    const provider = new LmappCompletionProvider();
    const selector = { pattern: '**' }; // Match all files
    
    context.subscriptions.push(
        vscode.languages.registerInlineCompletionItemProvider(selector, provider)
    );
}

class LmappCompletionProvider implements vscode.InlineCompletionItemProvider {
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

        // Debounce/Trigger logic could go here (e.g. wait for pause in typing)
        
        const serverUrl = config.get('serverUrl') as string;
        const model = config.get('model') as string;

        // Get context (prefix/suffix)
        // Simple implementation: just send the preceding lines
        const range = new vscode.Range(new vscode.Position(0, 0), position);
        const prompt = document.getText(range);

        try {
            updateStatusBar('$(sync~spin) Generating...');
            
            const response = await axios.post(`${serverUrl}/v1/completions`, {
                model: model,
                prompt: prompt,
                max_tokens: 50,
                temperature: 0.2,
                stop: ["\n\n"] // Stop at double newline to prevent run-on
            }, { timeout: 2000 }); // Fast timeout for UI responsiveness

            updateStatusBar('Ready');

            if (response.data && response.data.choices && response.data.choices.length > 0) {
                const text = response.data.choices[0].text;
                if (text) {
                    return [new vscode.InlineCompletionItem(text, new vscode.Range(position, position))];
                }
            }
        } catch (error) {
            updateStatusBar('$(error) Error');
            console.error('lmapp completion error:', error);
            // Silent fail for completions
        }
        
        return [];
    }
}

function updateStatusBar(text: string) {
    statusBarItem.text = `$(hubot) lmapp: ${text}`;
}

function startServer() {
    vscode.window.showInformationMessage('Starting lmapp server...');
    // This assumes lmapp is in the PATH. 
    // In a real extension, we might bundle the python env or config the path.
    exec('lmapp serve', (err, stdout, stderr) => {
        if (err) {
            vscode.window.showErrorMessage(`Failed to start lmapp: ${err.message}`);
            return;
        }
    });
}

function stopServer() {
    // Implementation depends on how we track the process
    vscode.window.showInformationMessage('Stopping server not implemented yet (kill process manually)');
}

export function deactivate() {}

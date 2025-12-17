"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
const axios_1 = require("axios");
const child_process_1 = require("child_process");
let statusBarItem;
let serverProcess;
function activate(context) {
    console.log('lmapp-vscode is now active!');
    // Status Bar
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'lmapp.toggleServer';
    context.subscriptions.push(statusBarItem);
    updateStatusBar('Ready');
    statusBarItem.show();
    // Commands
    context.subscriptions.push(vscode.commands.registerCommand('lmapp.startServer', startServer), vscode.commands.registerCommand('lmapp.stopServer', stopServer), vscode.commands.registerCommand('lmapp.toggleServer', toggleServer));
    // Inline Completion Provider
    const provider = new LmappCompletionProvider();
    const selector = { pattern: '**' }; // Match all files
    context.subscriptions.push(vscode.languages.registerInlineCompletionItemProvider(selector, provider));
    // Configuration change listener
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration('lmapp')) {
            console.log('lmapp configuration changed');
            provider.clearCache(); // Clear cache when settings change
        }
    }));
}
class LmappCompletionProvider {
    constructor() {
        this.lastRequestTime = 0;
        this.cache = [];
        this.MAX_CACHE_SIZE = 50;
        this.CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
    }
    clearCache() {
        this.cache = [];
    }
    getCachedCompletion(prompt) {
        const cached = this.cache.find(c => c.prompt === prompt);
        if (cached) {
            // Check if still valid
            if (Date.now() - cached.timestamp < this.CACHE_TTL_MS) {
                return cached.result;
            }
            else {
                // Remove expired entry
                this.cache = this.cache.filter(c => c.prompt !== prompt);
            }
        }
        return null;
    }
    setCachedCompletion(prompt, result) {
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
    async provideInlineCompletionItems(document, position, context, token) {
        const config = vscode.workspace.getConfiguration('lmapp');
        if (!config.get('enableInlineCompletion')) {
            return [];
        }
        const debounceMs = config.get('debounceMs') || 500;
        // Debounce: Don't request on every keystroke
        const now = Date.now();
        if (now - this.lastRequestTime < debounceMs) {
            await new Promise(resolve => setTimeout(resolve, debounceMs));
            if (token.isCancellationRequested)
                return [];
        }
        this.lastRequestTime = Date.now();
        const serverUrl = config.get('serverUrl');
        const model = config.get('model');
        const maxLines = config.get('contextLines') || 50;
        const requestTimeout = config.get('requestTimeout') || 2000;
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
            const enableAnalysis = config.get('enableCodeAnalysis') || false;
            const analysisLanguage = config.get('analysisLanguage') || 'python';
            const response = await axios_1.default.post(`${serverUrl}/v1/completions`, {
                model: model,
                prompt: prompt,
                max_tokens: 50,
                temperature: 0.2,
                stop: ["\n\n"],
                include_analysis: enableAnalysis,
                language: analysisLanguage
            }, { timeout: requestTimeout });
            updateStatusBar('Ready');
            if (token.isCancellationRequested)
                return [];
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
        }
        catch (error) {
            updateStatusBar('Ready');
            // Provide helpful error guidance silently
            const errorMessage = error?.message || 'Unknown error';
            if (errorMessage.includes('ECONNREFUSED')) {
                // Server not running - silent, user will see status bar
            }
            else if (errorMessage.includes('timeout')) {
                console.log('lmapp completion request timed out');
            }
            else {
                console.log(`lmapp completion error: ${errorMessage}`);
            }
        }
        return [];
    }
    showAnalysisResults(analysis) {
        /**
         * Display code analysis results in the status bar.
         * Shows summary of detected issues with severity breakdown.
         */
        const summary = analysis.summary;
        if (!summary)
            return;
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
            vscode.window.setStatusBarMessage(`Analysis: ${issueText}`, 4000);
        }
    }
}
function updateStatusBar(text) {
    statusBarItem.text = `$(hubot) lmapp: ${text}`;
}
function toggleServer() {
    if (serverProcess) {
        stopServer();
    }
    else {
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
    serverProcess = (0, child_process_1.exec)('lmapp server', (err, stdout, stderr) => {
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
    }
    else {
        vscode.window.showInformationMessage('lmapp server is not running.');
    }
}
function deactivate() {
    if (serverProcess) {
        serverProcess.kill();
    }
}
//# sourceMappingURL=extension.js.map
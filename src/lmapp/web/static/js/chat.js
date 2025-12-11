/**
 * LMAPP Web UI - Chat Module
 * Handles chat interactions, message history, and WebSocket communication.
 */

class ChatManager {
    constructor() {
        this.ws = null;
        this.chatHistory = [];
        this.isConnected = false;
        this.modelSelect = DOM.get('#model-select');
        this.chatInput = DOM.get('#chat-input');
        this.chatForm = DOM.get('#chat-form');
        this.chatHistoryEl = DOM.get('#chat-history');
        this.loadingEl = DOM.get('#loading');
        this.init();
    }

    init() {
        // Load saved chat history
        this.loadChatHistory();

        // Event listeners
        DOM.on(this.chatForm, 'submit', (e) => this.handleSubmit(e));
        DOM.on(this.chatInput, 'keydown', (e) => this.handleKeydown(e));

        // Connect WebSocket
        this.connectWebSocket();

        // Load chat history into UI
        this.renderChatHistory();
    }

    connectWebSocket() {
        this.ws = new WebSocketClient('/ws/chat');
        this.ws.connect()
            .then(() => {
                console.log('Chat WebSocket connected');
                this.isConnected = true;
                this.updateStatus('online');
                Notifier.success('Connected to chat server');
            })
            .catch((error) => {
                console.error('WebSocket connection failed:', error);
                this.isConnected = false;
                this.updateStatus('offline');
                Notifier.error('Failed to connect to chat server');
            });

        // Handle incoming messages
        this.ws.onMessage((data) => {
            this.handleWebSocketMessage(data);
        });
    }

    handleWebSocketMessage(data) {
        if (data.type === 'token') {
            // Stream token
            this.appendTokenToLastMessage(data.content);
        } else if (data.type === 'complete') {
            // Message complete
            this.hideLoading();
            this.saveChatHistory();
            this.scrollToBottom();
        } else if (data.error) {
            // Error
            this.hideLoading();
            Notifier.error(data.error);
        }
    }

    handleSubmit(e) {
        e.preventDefault();

        const message = DOM.val(this.chatInput).trim();
        if (!message) return;

        if (!this.isConnected) {
            Notifier.error('Not connected to server');
            return;
        }

        // Get selected model
        const model = DOM.val(this.modelSelect) || 'ollama-default';

        // Add user message to history
        this.addMessage('user', message);

        // Clear input
        DOM.setVal(this.chatInput, '');
        this.chatInput.style.height = 'auto';

        // Show loading indicator
        this.showLoading();

        // Send message via WebSocket
        const shouldStream = DOM.get('#stream-toggle')?.checked ?? true;
        this.ws.send({
            message,
            model,
            stream: shouldStream,
        });
    }

    handleKeydown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.chatForm.dispatchEvent(new Event('submit'));
        } else if (e.key === 'Enter' && e.shiftKey) {
            // Allow new line with Shift+Enter
            this.chatInput.style.height = 'auto';
            this.chatInput.style.height = Math.min(this.chatInput.scrollHeight, 150) + 'px';
        }
    }

    addMessage(role, content) {
        const message = {
            role,
            content,
            timestamp: Date.now(),
        };

        this.chatHistory.push(message);
        this.renderMessage(message);
        this.scrollToBottom();

        if (role === 'assistant') {
            this.saveChatHistory();
        }
    }

    appendTokenToLastMessage(token) {
        const messages = DOM.getAll('.chat-message');
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            const bubble = lastMessage.querySelector('.chat-bubble');
            if (bubble) {
                bubble.textContent += token;
                this.scrollToBottom();
            }
        }
    }

    renderMessage(message) {
        const { role, content } = message;
        
        const messageEl = DOM.create('div', `chat-message ${role}`);
        const bubble = DOM.create('div', 'chat-bubble');
        bubble.textContent = content;
        
        messageEl.appendChild(bubble);
        DOM.append(this.chatHistoryEl, messageEl);
    }

    renderChatHistory() {
        DOM.clear(this.chatHistoryEl);
        this.chatHistory.forEach(msg => this.renderMessage(msg));
        this.scrollToBottom();
    }

    showLoading() {
        DOM.show(this.loadingEl);
        this.scrollToBottom();
    }

    hideLoading() {
        DOM.hide(this.loadingEl);
    }

    scrollToBottom() {
        setTimeout(() => {
            this.chatHistoryEl.parentElement.scrollTop = this.chatHistoryEl.parentElement.scrollHeight;
        }, 0);
    }

    saveChatHistory() {
        if (DOM.get('#auto-save-toggle')?.checked ?? true) {
            Storage.set('chatHistory', this.chatHistory);
        }
    }

    loadChatHistory() {
        this.chatHistory = Storage.get('chatHistory', []);
    }

    clearChatHistory() {
        if (confirm('Are you sure you want to clear all chat history?')) {
            this.chatHistory = [];
            DOM.clear(this.chatHistoryEl);
            Storage.remove('chatHistory');
            Notifier.success('Chat history cleared');
        }
    }

    exportChat() {
        const exportData = {
            version: '0.2.6',
            exported: new Date().toISOString(),
            messages: this.chatHistory,
        };

        const json = JSON.stringify(exportData, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = DOM.create('a');
        DOM.attr(a, 'href', url);
        DOM.attr(a, 'download', `lmapp-chat-${Date.now()}.json`);
        a.click();
        URL.revokeObjectURL(url);
        Notifier.success('Chat exported');
    }

    updateStatus(status) {
        const statusEl = DOM.get('#status');
        const statusDot = DOM.get('.status-dot');
        
        if (statusEl) {
            DOM.setText(statusEl, status === 'online' ? 'Online' : 'Offline');
        }
        if (statusDot) {
            if (status === 'online') {
                DOM.addClass(statusDot, 'online');
            } else {
                DOM.removeClass(statusDot, 'online');
            }
        }
    }
}

// Initialize when DOM is ready
let chatManager;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        chatManager = new ChatManager();
    });
} else {
    chatManager = new ChatManager();
}

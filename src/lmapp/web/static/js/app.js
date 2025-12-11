/**
 * LMAPP Web UI - Main Application
 * Initializes the application, manages tabs, and coordinates modules.
 */

class LMAPPApp {
    constructor() {
        this.tabManager = new TabManager();
        this.initialized = false;
        this.init();
    }

    async init() {
        console.log('Initializing LMAPP Web UI v0.2.6...');

        try {
            // Register tabs
            this.registerTabs();

            // Setup navigation
            this.setupNavigation();

            // Setup settings
            this.setupSettings();

            // Load system status
            await this.loadSystemStatus();

            // Setup refresh button
            this.setupRefreshButton();

            this.initialized = true;
            console.log('LMAPP Web UI initialized successfully');
            Notifier.success('LMAPP initialized');
        } catch (error) {
            console.error('Failed to initialize LMAPP:', error);
            Notifier.error('Failed to initialize application');
        }
    }

    registerTabs() {
        // Register all tab content areas
        const tabSections = [
            'chat-tab',
            'documents-tab',
            'plugins-tab',
            'settings-tab',
        ];

        tabSections.forEach(tabName => {
            const element = DOM.get(`#${tabName}`);
            if (element) {
                this.tabManager.register(tabName.replace('-tab', ''), element);
            }
        });

        // Show chat tab by default
        this.tabManager.show('chat');
    }

    setupNavigation() {
        const navItems = DOM.getAll('.nav-item');
        navItems.forEach(item => {
            DOM.on(item, 'click', () => {
                const tabName = DOM.attr(item, 'data-tab');
                if (tabName) {
                    this.tabManager.show(tabName);
                }
            });
        });
    }

    setupSettings() {
        // Dark theme toggle
        const themeToggle = DOM.get('#theme-toggle');
        if (themeToggle) {
            DOM.on(themeToggle, 'change', () => {
                const isDark = themeToggle.checked;
                document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
                Storage.set('theme', isDark ? 'dark' : 'light');
            });

            // Load saved theme
            const savedTheme = Storage.get('theme', 'dark');
            themeToggle.checked = savedTheme === 'dark';
            document.documentElement.style.colorScheme = savedTheme;
        }

        // Clear history button
        const clearBtn = DOM.get('#btn-clear-history');
        if (clearBtn) {
            DOM.on(clearBtn, 'click', () => {
                if (chatManager) {
                    chatManager.clearChatHistory();
                }
            });
        }

        // Export chat button
        const exportBtn = DOM.get('#btn-export-chat');
        if (exportBtn) {
            DOM.on(exportBtn, 'click', () => {
                if (chatManager) {
                    chatManager.exportChat();
                }
            });
        }
    }

    async loadSystemStatus() {
        try {
            const status = await APIClient.get('/status');
            if (status.success) {
                // Update system info
                const messageCount = DOM.get('#message-count');
                const docCount = DOM.get('#document-count');
                
                if (messageCount) {
                    DOM.setText(messageCount, status.stats?.chat_messages || 0);
                }
                if (docCount) {
                    DOM.setText(docCount, status.stats?.documents || 0);
                }

                // Check features
                if (!status.features?.websocket) {
                    console.warn('WebSocket not available');
                }
            }
        } catch (error) {
            console.error('Failed to load system status:', error);
        }
    }

    setupRefreshButton() {
        const refreshBtn = DOM.get('#btn-refresh');
        if (refreshBtn) {
            DOM.on(refreshBtn, 'click', () => {
                this.refreshAll();
            });
        }
    }

    async refreshAll() {
        console.log('Refreshing all data...');
        Notifier.info('Refreshing...');

        try {
            if (pluginManager) {
                await pluginManager.loadPlugins();
            }
            if (documentManager) {
                await documentManager.loadDocuments();
            }
            await this.loadSystemStatus();
            Notifier.success('Refreshed');
        } catch (error) {
            console.error('Refresh failed:', error);
            Notifier.error('Refresh failed');
        }
    }
}

// Initialize application when DOM is ready
let app;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        app = new LMAPPApp();
    });
} else {
    app = new LMAPPApp();
}

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        console.log('Page is visible');
        if (app) {
            app.loadSystemStatus();
        }
    } else {
        console.log('Page is hidden');
    }
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    console.log('LMAPP shutting down');
    if (chatManager && chatManager.ws) {
        chatManager.ws.disconnect();
    }
});

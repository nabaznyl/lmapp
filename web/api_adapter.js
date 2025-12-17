/**
 * API Adapter for lmapp Web Interface
 * 
 * This script detects if the app is running in a standard web browser (vs Electron).
 * If in a browser, it mocks the 'window.electronAPI' object using REST API calls
 * to the FastAPI backend.
 */

(function() {
    // Check if we are in Electron
    const isElectron = window.electronAPI !== undefined;

    if (isElectron) {
        console.log("Environment: Electron (Native API available)");
        return;
    }

    console.log("Environment: Web Browser (Initializing API Adapter)");

    // Configuration
    const API_BASE = ""; // Relative path, assumes served from same origin
    
    // Mock the Electron API
    window.electronAPI = {
        /**
         * Send a chat message to the backend
         */
        sendMessage: async (message) => {
            try {
                const response = await fetch(`${API_BASE}/chat`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        message: message,
                        stream: false // TODO: Support streaming
                    })
                });
                
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                
                const data = await response.json();
                return data.response; // Adapt to match Electron return format
            } catch (error) {
                console.error("API Error:", error);
                return "Error: Could not connect to backend.";
            }
        },

        /**
         * Get available models
         */
        getModels: async () => {
            try {
                const response = await fetch(`${API_BASE}/health`);
                const data = await response.json();
                return data.models || [];
            } catch (error) {
                console.error("API Error:", error);
                return [];
            }
        },

        /**
         * Check if backend is running
         */
        checkBackend: async () => {
            try {
                const response = await fetch(`${API_BASE}/health`);
                return response.ok;
            } catch (error) {
                return false;
            }
        },

        /**
         * Get available workflows
         */
        getWorkflows: async () => {
            try {
                const response = await fetch(`${API_BASE}/v1/workflows`);
                const data = await response.json();
                return data.workflows || [];
            } catch (error) {
                console.error("API Error:", error);
                return [];
            }
        },

        /**
         * Execute a workflow step
         */
        executeWorkflowStep: async (stepData) => {
            try {
                const response = await fetch(`${API_BASE}/v1/workflows/execute`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(stepData)
                });
                return await response.json();
            } catch (error) {
                console.error("API Error:", error);
                return { error: error.message };
            }
        },

        /**
         * Get Settings (LocalStorage)
         */
        getSettings: async () => {
            const settings = localStorage.getItem('lmapp_settings');
            return settings ? JSON.parse(settings) : {};
        },

        /**
         * Save Settings (LocalStorage)
         */
        saveSettings: async (settings) => {
            localStorage.setItem('lmapp_settings', JSON.stringify(settings));
            return true;
        },

        /**
         * Open Settings (No-op in web)
         */
        openSettings: async () => {
            console.log("Settings opened (Web Mode)");
            // In web mode, we might show a modal instead of a new window
            // For now, just return true
            return true;
        },

        /**
         * Select File (Web Version)
         * Prompts user for a local path (since we can't browse server files from web)
         * and sends it to the backend to attach to context.
         */
        selectFile: async () => {
            const path = prompt("Enter the full path to the file on the server (e.g., /home/user/doc.txt):");
            if (!path) return [];

            try {
                // Send to backend to attach to context
                // Note: The backend endpoint might need adjustment to match this format
                // gui/main.js sends { paths: [...] }
                await fetch(`${API_BASE}/v1/files/add`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ paths: [path] })
                });
                
                return [path];
            } catch (error) {
                console.error("Failed to attach file:", error);
                alert("Failed to attach file to backend context.");
                return [];
            }
        }
    };

    console.log("API Adapter initialized successfully.");
})();

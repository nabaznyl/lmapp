/**
 * LMAPP Web UI - Plugins Module
 * Handles plugin discovery, installation, and management.
 */

class PluginManager {
    constructor() {
        this.plugins = [];
        this.init();
    }

    async init() {
        await this.loadPlugins();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const refreshBtn = DOM.get('#btn-refresh-plugins');
        if (refreshBtn) {
            DOM.on(refreshBtn, 'click', () => this.loadPlugins());
        }
    }

    async loadPlugins() {
        try {
            const data = await APIClient.get('/plugins');
            if (data.success) {
                this.plugins = data.plugins || [];
                this.renderPlugins();
            }
        } catch (error) {
            console.error('Failed to load plugins:', error);
            Notifier.error('Failed to load plugins');
        }
    }

    renderPlugins() {
        const pluginsList = DOM.get('#plugins-list');
        DOM.clear(pluginsList);

        if (this.plugins.length === 0) {
            DOM.setHTML(pluginsList, '<p class="empty-state">No plugins available</p>');
            return;
        }

        this.plugins.forEach(plugin => {
            const card = this.createPluginCard(plugin);
            DOM.append(pluginsList, card);
        });
    }

    createPluginCard(plugin) {
        const card = DOM.create('div', 'plugin-card');
        
        const header = DOM.create('div', 'plugin-header');
        const title = DOM.create('div');
        DOM.setHTML(title, `<h3 class="plugin-title">${plugin.name}</h3><p class="plugin-version">v${plugin.version}</p>`);
        DOM.append(header, title);

        const description = DOM.create('p', 'plugin-description');
        DOM.setText(description, plugin.description || 'No description');

        const tags = DOM.create('div', 'plugin-tags');
        if (plugin.tags && Array.isArray(plugin.tags)) {
            plugin.tags.forEach(tag => {
                const tagEl = DOM.create('span', 'plugin-tag');
                DOM.setText(tagEl, tag);
                DOM.append(tags, tagEl);
            });
        }

        const actions = DOM.create('div', 'plugin-actions');
        const actionBtn = DOM.create('button', 'btn-primary btn-small');
        
        if (plugin.installed) {
            DOM.setText(actionBtn, 'Uninstall');
            DOM.on(actionBtn, 'click', () => this.uninstallPlugin(plugin.name));
        } else {
            DOM.setText(actionBtn, 'Install');
            DOM.on(actionBtn, 'click', () => this.installPlugin(plugin.name));
        }

        DOM.append(actions, actionBtn);

        DOM.append(card, header);
        DOM.append(card, description);
        DOM.append(card, tags);
        DOM.append(card, actions);

        return card;
    }

    async installPlugin(name) {
        try {
            const data = await APIClient.post(`/plugins/${name}/install`, {});
            if (data.success) {
                Notifier.success(`Plugin ${name} installed`);
                await this.loadPlugins();
            } else {
                Notifier.error(data.error || 'Installation failed');
            }
        } catch (error) {
            console.error('Installation failed:', error);
            Notifier.error('Failed to install plugin');
        }
    }

    async uninstallPlugin(name) {
        if (!confirm(`Uninstall ${name}?`)) return;

        try {
            const data = await APIClient.post(`/plugins/${name}/uninstall`, {});
            if (data.success) {
                Notifier.success(`Plugin ${name} uninstalled`);
                await this.loadPlugins();
            }
        } catch (error) {
            console.error('Uninstall failed:', error);
            Notifier.error('Failed to uninstall plugin');
        }
    }
}

/**
 * Document Manager
 */
class DocumentManager {
    constructor() {
        this.documents = [];
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadDocuments();
    }

    setupEventListeners() {
        const uploadBtn = DOM.get('#btn-upload-doc');
        const uploadForm = DOM.get('#upload-form');
        const docForm = DOM.get('#document-form');
        const modalClose = DOM.get('.modal-close');
        const modalCancel = DOM.get('.modal-cancel');

        if (uploadBtn) {
            DOM.on(uploadBtn, 'click', () => DOM.show(uploadForm));
        }

        if (docForm) {
            DOM.on(docForm, 'submit', (e) => this.handleUpload(e));
        }

        if (modalClose) {
            DOM.on(modalClose, 'click', () => DOM.hide(uploadForm));
        }

        if (modalCancel) {
            DOM.on(modalCancel, 'click', () => DOM.hide(uploadForm));
        }

        // Close modal when clicking outside
        if (uploadForm) {
            DOM.on(uploadForm, 'click', (e) => {
                if (e.target === uploadForm) {
                    DOM.hide(uploadForm);
                }
            });
        }
    }

    async handleUpload(e) {
        e.preventDefault();

        const fileInput = DOM.get('#file-input');
        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            Notifier.error('Please select a file');
            return;
        }

        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            const data = await APIClient.postFile('/documents/upload', formData);
            if (data.success) {
                Notifier.success(`Document uploaded: ${file.name}`);
                DOM.setVal(fileInput, '');
                DOM.hide(DOM.get('#upload-form'));
                await this.loadDocuments();
            }
        } catch (error) {
            console.error('Upload failed:', error);
            Notifier.error('Failed to upload document');
        }
    }

    async loadDocuments() {
        try {
            const data = await APIClient.get('/documents');
            if (data.success) {
                this.documents = data.documents || [];
                this.renderDocuments();
            }
        } catch (error) {
            console.error('Failed to load documents:', error);
            Notifier.error('Failed to load documents');
        }
    }

    renderDocuments() {
        const docsList = DOM.get('#documents-list');
        DOM.clear(docsList);

        if (this.documents.length === 0) {
            DOM.setHTML(docsList, '<p class="empty-state">No documents uploaded yet. Upload a file to get started.</p>');
            return;
        }

        this.documents.forEach(doc => {
            const card = this.createDocumentCard(doc);
            DOM.append(docsList, card);
        });
    }

    createDocumentCard(doc) {
        const card = DOM.create('div', 'document-card');

        const icon = DOM.create('div', 'document-icon');
        DOM.setText(icon, '📄');

        const name = DOM.create('div', 'document-name');
        DOM.setText(name, doc.name);

        const meta = DOM.create('div', 'document-meta');
        DOM.setHTML(meta, `
            Size: ${Utils.formatFileSize(doc.size)} | 
            Chunks: ${doc.chunks}
        `);

        const actions = DOM.create('div', 'document-actions');
        
        const viewBtn = DOM.create('button', 'btn-secondary btn-small');
        DOM.setText(viewBtn, 'View');
        DOM.on(viewBtn, 'click', () => this.viewDocument(doc.id));

        const deleteBtn = DOM.create('button', 'btn-secondary btn-small');
        DOM.setText(deleteBtn, 'Delete');
        DOM.on(deleteBtn, 'click', () => this.deleteDocument(doc.id));

        DOM.append(actions, viewBtn);
        DOM.append(actions, deleteBtn);

        DOM.append(card, icon);
        DOM.append(card, name);
        DOM.append(card, meta);
        DOM.append(card, actions);

        return card;
    }

    viewDocument(docId) {
        Notifier.info(`Viewing document ${docId}`);
        // In a real implementation, would show document preview
    }

    async deleteDocument(docId) {
        if (!confirm('Delete this document?')) return;

        try {
            const data = await APIClient.delete(`/documents/${docId}`);
            if (data.success) {
                Notifier.success('Document deleted');
                await this.loadDocuments();
            }
        } catch (error) {
            console.error('Delete failed:', error);
            Notifier.error('Failed to delete document');
        }
    }
}

// Initialize when DOM is ready
let pluginManager;
let documentManager;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        pluginManager = new PluginManager();
        documentManager = new DocumentManager();
    });
} else {
    pluginManager = new PluginManager();
    documentManager = new DocumentManager();
}

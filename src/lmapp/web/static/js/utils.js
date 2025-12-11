/**
 * LMAPP Web UI - Utility Functions
 * Common utilities for API calls, DOM manipulation, and state management.
 */

// Configuration
const API_BASE_URL = '/api';
const WS_BASE_URL = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const WS_HOST = `${WS_BASE_URL}//${window.location.host}`;

/**
 * API Communication
 */
class APIClient {
    static async get(endpoint) {
        return this._request(endpoint, 'GET');
    }

    static async post(endpoint, data) {
        return this._request(endpoint, 'POST', data);
    }

    static async delete(endpoint) {
        return this._request(endpoint, 'DELETE');
    }

    static async postFile(endpoint, formData) {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        return response.json();
    }

    static async _request(endpoint, method, data = null) {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
            if (!response.ok) throw new Error(`API error: ${response.status}`);
            return response.json();
        } catch (error) {
            console.error(`API request failed: ${error.message}`);
            throw error;
        }
    }
}

/**
 * WebSocket Communication
 */
class WebSocketClient {
    constructor(endpoint) {
        this.endpoint = endpoint;
        this.ws = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000;
    }

    connect() {
        return new Promise((resolve, reject) => {
            try {
                this.ws = new WebSocket(`${WS_HOST}${this.endpoint}`);
                
                this.ws.onopen = () => {
                    console.log('WebSocket connected');
                    this.reconnectAttempts = 0;
                    resolve();
                };

                this.ws.onerror = (error) => {
                    console.error('WebSocket error:', error);
                    reject(error);
                };

                this.ws.onclose = () => {
                    this._attemptReconnect();
                };
            } catch (error) {
                reject(error);
            }
        });
    }

    send(message) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        }
    }

    on(eventType, callback) {
        if (this.ws) {
            this.ws[`on${eventType}`] = callback;
        }
    }

    onMessage(callback) {
        if (this.ws) {
            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    callback(data);
                } catch (error) {
                    console.error('WebSocket message parse error:', error);
                }
            };
        }
    }

    _attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
            setTimeout(() => this.connect().catch(console.error), this.reconnectDelay);
        }
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
}

/**
 * DOM Helpers
 */
const DOM = {
    get(selector) {
        return document.querySelector(selector);
    },

    getAll(selector) {
        return document.querySelectorAll(selector);
    },

    create(tagName, className = '', innerHTML = '') {
        const el = document.createElement(tagName);
        if (className) el.className = className;
        if (innerHTML) el.innerHTML = innerHTML;
        return el;
    },

    on(element, event, callback) {
        if (element) {
            element.addEventListener(event, callback);
        }
    },

    off(element, event, callback) {
        if (element) {
            element.removeEventListener(event, callback);
        }
    },

    show(element) {
        if (element) element.style.display = '';
    },

    hide(element) {
        if (element) element.style.display = 'none';
    },

    addClass(element, className) {
        if (element) element.classList.add(className);
    },

    removeClass(element, className) {
        if (element) element.classList.remove(className);
    },

    toggleClass(element, className) {
        if (element) element.classList.toggle(className);
    },

    hasClass(element, className) {
        return element ? element.classList.contains(className) : false;
    },

    setText(element, text) {
        if (element) element.textContent = text;
    },

    setHTML(element, html) {
        if (element) element.innerHTML = html;
    },

    attr(element, name, value) {
        if (element) {
            if (value === undefined) {
                return element.getAttribute(name);
            } else {
                element.setAttribute(name, value);
            }
        }
    },

    removeAttr(element, name) {
        if (element) element.removeAttribute(name);
    },

    val(element) {
        return element ? element.value : '';
    },

    setVal(element, value) {
        if (element) element.value = value;
    },

    clear(element) {
        if (element) element.innerHTML = '';
    },

    append(parent, child) {
        if (parent) {
            if (typeof child === 'string') {
                parent.innerHTML += child;
            } else {
                parent.appendChild(child);
            }
        }
    },

    prepend(parent, child) {
        if (parent) {
            if (typeof child === 'string') {
                parent.innerHTML = child + parent.innerHTML;
            } else {
                parent.insertBefore(child, parent.firstChild);
            }
        }
    },

    remove(element) {
        if (element) element.remove();
    },
};

/**
 * Tab Management
 */
class TabManager {
    constructor() {
        this.currentTab = 'chat';
        this.tabs = {};
    }

    register(name, element) {
        this.tabs[name] = element;
    }

    show(name) {
        // Hide all tabs
        Object.keys(this.tabs).forEach(tabName => {
            DOM.removeClass(this.tabs[tabName], 'active');
        });

        // Show selected tab
        if (this.tabs[name]) {
            DOM.addClass(this.tabs[name], 'active');
            this.currentTab = name;
        }

        // Update nav buttons
        DOM.getAll('.nav-item').forEach(btn => {
            if (DOM.attr(btn, 'data-tab') === name) {
                DOM.addClass(btn, 'active');
            } else {
                DOM.removeClass(btn, 'active');
            }
        });
    }
}

/**
 * Notification System
 */
class Notifier {
    static notify(message, type = 'info') {
        console.log(`[${type.toUpperCase()}] ${message}`);
        
        // Desktop notification if available and enabled
        if ('Notification' in window && 
            Notification.permission === 'granted' &&
            DOM.get('#notifications-toggle')?.checked) {
            new Notification('LMAPP', {
                body: message,
                icon: '/static/icon.png',
            });
        }
    }

    static info(message) {
        this.notify(message, 'info');
    }

    static success(message) {
        this.notify(message, 'success');
    }

    static error(message) {
        this.notify(message, 'error');
    }

    static warning(message) {
        this.notify(message, 'warning');
    }
}

/**
 * Storage Helpers
 */
class Storage {
    static set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Storage write failed:', error);
        }
    }

    static get(key, defaultValue = null) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : defaultValue;
        } catch (error) {
            console.error('Storage read failed:', error);
            return defaultValue;
        }
    }

    static remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Storage remove failed:', error);
        }
    }

    static clear() {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Storage clear failed:', error);
        }
    }
}

/**
 * Utility Functions
 */
const Utils = {
    /**
     * Format timestamp to readable time
     */
    formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    },

    /**
     * Format file size to readable format
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    },

    /**
     * Debounce function calls
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Throttle function calls
     */
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * Deep clone object
     */
    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    /**
     * Check if element is in viewport
     */
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    /**
     * Scroll element into view smoothly
     */
    scrollIntoView(element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    },
};

// Request notification permission on load
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        APIClient,
        WebSocketClient,
        DOM,
        TabManager,
        Notifier,
        Storage,
        Utils,
    };
}

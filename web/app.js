// Chat functionality
const chatContainer = document.getElementById('chat');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const attachFileBtn = document.getElementById('attach-file');
const modelSelect = document.getElementById('model-select');

let chatHistory = [];

// Load available models
async function loadModels() {
  const models = await window.api.getModels();
  modelSelect.innerHTML = '<option value="">Select a model...</option>';
  models.models.forEach(model => {
    const option = document.createElement('option');
    option.value = model;
    option.textContent = model;
    modelSelect.appendChild(option);
  });
}

// Add message to chat
function addMessage(text, sender) {
  const welcome = chatContainer.querySelector('.welcome');
  if (welcome) {
    welcome.remove();
  }
  
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}`;
  messageDiv.textContent = text;
  chatContainer.appendChild(messageDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Send message
async function sendMessage() {
  const text = messageInput.value.trim();
  if (!text) return;
  
  addMessage(text, 'user');
  messageInput.value = '';
  sendBtn.disabled = true;
  sendBtn.textContent = 'Sending...';
  
  try {
    const response = await window.api.sendMessage(text);
    if (response.error) {
      addMessage(`⚠️ ${response.error}`, 'assistant');
    } else {
      addMessage(response.response, 'assistant');
      chatHistory.push({ role: 'user', content: text });
      chatHistory.push({ role: 'assistant', content: response.response });
    }
  } catch (error) {
    addMessage('⚠️ Error: Could not connect to backend', 'assistant');
  } finally {
    sendBtn.disabled = false;
    sendBtn.textContent = 'Send';
    messageInput.focus();
  }
}

// Clear chat
function clearChat() {
  chatHistory = [];
  chatContainer.innerHTML = `
    <div class="welcome">
      <h2>Welcome to lmapp</h2>
      <p>Your local AI assistant. Start chatting below!</p>
      <div class="tips">
        <h3>Quick Tips:</h3>
        <ul>
          <li>💬 Type any question or request</li>
          <li>📎 Attach files for context</li>
          <li>⌨️ Press Enter to send (Shift+Enter for new line)</li>
        </ul>
      </div>
    </div>
  `;
}

// Update status indicator
function updateStatus(connected) {
  const indicator = document.getElementById('status-indicator');
  const text = document.getElementById('status-text');
  
  if (connected) {
    indicator.className = 'status-dot connected';
    text.textContent = 'Connected';
  } else {
    indicator.className = 'status-dot';
    text.textContent = 'Disconnected';
  }
}

// Event listeners
sendBtn.addEventListener('click', sendMessage);

messageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

attachFileBtn.addEventListener('click', async () => {
  const files = await window.api.selectFile();
  if (files && files.length > 0) {
    const fileNames = files.map(f => f.split('/').pop());
    addMessage(`📎 Attached ${files.length} file(s): ${fileNames.join(', ')}`, 'user');
  }
});

document.getElementById('clear-chat').addEventListener('click', () => {
  if (confirm('Clear all conversation history?')) {
    clearChat();
  }
});

document.getElementById('settings').addEventListener('click', () => {
  alert('Settings panel coming soon!');
});

// Initialize
async function init() {
  await loadModels();
  updateStatus(true);
}

init();

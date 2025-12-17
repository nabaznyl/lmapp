// Workflow Manager UI Component
class WorkflowManager {
  constructor() {
    this.workflows = [];
    this.currentWorkflow = null;
    this.workflowState = {};
  }

  async loadWorkflows() {
    try {
      const response = await window.electronAPI.getWorkflows();
      this.workflows = response.workflows;
      
      // Sort workflows: Recent → Favorites → Rest
      this.workflows = this.sortWorkflowsByPriority(this.workflows);
      
      this.renderWorkflowList();
    } catch (error) {
      console.error('Failed to load workflows:', error);
      this.showError('Failed to load workflows');
    }
  }
  
  sortWorkflowsByPriority(workflows) {
    const recent = this.getRecentWorkflows();
    const favorites = this.getFavorites();
    
    return workflows.sort((a, b) => {
      const aRecent = recent.includes(a.name) ? 0 : 1;
      const bRecent = recent.includes(b.name) ? 0 : 1;
      const aFavorite = favorites.includes(a.name) ? 0 : 1;
      const bFavorite = favorites.includes(b.name) ? 0 : 1;
      
      return (aRecent - bRecent) || (aFavorite - bFavorite);
    });
  }
  
  getRecentWorkflows() {
    const recent = localStorage.getItem('recent_workflows');
    return recent ? JSON.parse(recent) : [];
  }
  
  getFavorites() {
    const favorites = localStorage.getItem('favorite_workflows');
    return favorites ? JSON.parse(favorites) : [];
  }
  
  recordWorkflowRun(workflowName) {
    let recent = this.getRecentWorkflows();
    recent = [workflowName, ...recent.filter(n => n !== workflowName)].slice(0, 5);
    localStorage.setItem('recent_workflows', JSON.stringify(recent));
  }
  
  isFavorite(workflowName) {
    return this.getFavorites().includes(workflowName);
  }
  
  toggleFavorite(workflowName) {
    let favorites = this.getFavorites();
    if (favorites.includes(workflowName)) {
      favorites = favorites.filter(n => n !== workflowName);
    } else {
      favorites.push(workflowName);
    }
    localStorage.setItem('favorite_workflows', JSON.stringify(favorites));
    this.loadWorkflows();  // Refresh list
  }

  renderWorkflowList() {
    const container = document.getElementById('workflowList');
    if (!container) return;

    container.innerHTML = '';

    if (this.workflows.length === 0) {
      container.innerHTML = '<p class="empty-state">No workflows available</p>';
      return;
    }

    this.workflows.forEach(workflow => {
      const card = this.createWorkflowCard(workflow);
      container.appendChild(card);
    });
  }

  createWorkflowCard(workflow) {
    const isFavorite = this.isFavorite(workflow.name);
    const isRecent = this.getRecentWorkflows().includes(workflow.name);
    
    const card = document.createElement('div');
    card.className = 'workflow-card';
    if (isRecent) card.classList.add('recent');
    if (isFavorite) card.classList.add('favorite');
    
    card.innerHTML = `
      <div class="workflow-header">
        <h3>
          ${workflow.name}
          ${isRecent ? '<span class="badge recent-badge">Recent</span>' : ''}
        </h3>
        <div class="workflow-actions">
          <button class="favorite-btn ${isFavorite ? 'active' : ''}" 
                  data-workflow="${workflow.name}"
                  title="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}">
            ${isFavorite ? '⭐' : '☆'}
          </button>
          <span class="workflow-category">${workflow.category || 'General'}</span>
        </div>
      </div>
      <p class="workflow-description">${workflow.description}</p>
      <div class="workflow-meta">
        <span class="step-count">${workflow.steps.length} steps</span>
        <span class="estimated-time">${this.estimateTime(workflow)} min</span>
      </div>
      <button class="btn-primary workflow-run-btn" data-workflow="${workflow.name}">
        Run Workflow
      </button>
    `;

    const runBtn = card.querySelector('.workflow-run-btn');
    runBtn.addEventListener('click', () => this.runWorkflow(workflow));
    
    const favoriteBtn = card.querySelector('.favorite-btn');
    favoriteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleFavorite(workflow.name);
    });

    return card;
  }

  estimateTime(workflow) {
    // Rough estimate: 30 seconds per step
    return Math.ceil(workflow.steps.length * 0.5);
  }

  async runWorkflow(workflow) {
    this.currentWorkflow = workflow;
    this.workflowState = { step: 0, variables: {} };
    
    // Record this workflow as recently used
    this.recordWorkflowRun(workflow.name);

    // Show workflow execution panel
    this.showWorkflowPanel(workflow);

    // Start execution
    await this.executeNextStep();
  }

  showWorkflowPanel(workflow) {
    const panel = document.getElementById('workflowPanel');
    if (!panel) return;

    panel.style.display = 'flex';
    panel.innerHTML = `
      <div class="workflow-panel-header">
        <h2>${workflow.name}</h2>
        <button class="close-btn" id="closeWorkflowPanel">✕</button>
      </div>
      <div class="workflow-progress">
        <div class="progress-bar">
          <div class="progress-fill" id="workflowProgress"></div>
        </div>
        <span class="progress-text" id="workflowProgressText">Step 1 of ${workflow.steps.length}</span>
      </div>
      <div class="workflow-content" id="workflowContent">
        <!-- Steps render here -->
      </div>
      <div class="workflow-actions">
        <button class="btn-secondary" id="cancelWorkflow">Cancel</button>
      </div>
    `;

    document.getElementById('closeWorkflowPanel').addEventListener('click', () => this.closeWorkflowPanel());
    document.getElementById('cancelWorkflow').addEventListener('click', () => this.cancelWorkflow());
  }

  async executeNextStep() {
    if (!this.currentWorkflow || this.workflowState.step >= this.currentWorkflow.steps.length) {
      this.workflowComplete();
      return;
    }

    const step = this.currentWorkflow.steps[this.workflowState.step];
    await this.executeStep(step);
  }

  async executeStep(step) {
    const content = document.getElementById('workflowContent');
    if (!content) return;

    // Update progress
    this.updateProgress();

    // Render step based on action type
    switch (step.action) {
      case 'collect_input':
        this.renderInputStep(step);
        break;
      
      case 'generate_outline':
      case 'write_section':
      case 'summarize':
      case 'generate_email':
      case 'analyze_document':
        await this.renderLLMStep(step);
        break;
      
      case 'search_files':
      case 'select_file':
        this.renderFileStep(step);
        break;
      
      default:
        await this.renderGenericStep(step);
    }
  }

  renderInputStep(step) {
    const content = document.getElementById('workflowContent');
    content.innerHTML = `
      <div class="workflow-step">
        <h3>${step.prompt}</h3>
        <textarea 
          id="workflowInput" 
          placeholder="Enter your input here..."
          rows="4"
        ></textarea>
        <button class="btn-primary" id="submitWorkflowInput">Next</button>
      </div>
    `;

    document.getElementById('submitWorkflowInput').addEventListener('click', () => {
      const input = document.getElementById('workflowInput').value.trim();
      if (input) {
        // Extract variable name from prompt (e.g., "What is {topic}?" → "topic")
        const varMatch = step.prompt.match(/\{(\w+)\}/);
        if (varMatch) {
          this.workflowState.variables[varMatch[1]] = input;
        }
        this.workflowState.step++;
        this.executeNextStep();
      }
    });
  }

  async renderLLMStep(step) {
    const content = document.getElementById('workflowContent');
    content.innerHTML = `
      <div class="workflow-step">
        <h3>${this.interpolate(step.prompt)}</h3>
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Generating response...</p>
        </div>
        <div id="llmOutput" style="display: none;"></div>
        <button class="btn-primary" id="continueWorkflow" style="display: none;">Continue</button>
      </div>
    `;

    try {
      // Call backend to execute LLM step
      const response = await window.electronAPI.executeWorkflowStep({
        workflow: this.currentWorkflow.name,
        step: this.workflowState.step,
        action: step.action,
        prompt: this.interpolate(step.prompt),
        variables: this.workflowState.variables
      });

      // Store result
      const outputVar = step.save_as || step.action;
      this.workflowState.variables[outputVar] = response.result;

      // Display result
      document.querySelector('.loading-state').style.display = 'none';
      const output = document.getElementById('llmOutput');
      output.style.display = 'block';
      output.innerHTML = `<div class="llm-result">${this.formatResult(response.result)}</div>`;

      const continueBtn = document.getElementById('continueWorkflow');
      continueBtn.style.display = 'inline-block';
      continueBtn.addEventListener('click', () => {
        this.workflowState.step++;
        this.executeNextStep();
      });
    } catch (error) {
      console.error('LLM step failed:', error);
      this.showError(`Failed to execute step: ${error.message}`);
    }
  }

  renderFileStep(step) {
    const content = document.getElementById('workflowContent');
    content.innerHTML = `
      <div class="workflow-step">
        <h3>${step.prompt}</h3>
        <button class="btn-secondary" id="selectWorkflowFile">
          📁 Select File
        </button>
        <div id="selectedFile" style="display: none;">
          <p>Selected: <span id="fileName"></span></p>
          <button class="btn-primary" id="confirmFile">Continue</button>
        </div>
      </div>
    `;

    document.getElementById('selectWorkflowFile').addEventListener('click', async () => {
      const file = await window.electronAPI.selectFile();
      if (file) {
        this.workflowState.variables.selected_file = file;
        document.getElementById('fileName').textContent = file;
        document.getElementById('selectedFile').style.display = 'block';
      }
    });

    document.getElementById('confirmFile')?.addEventListener('click', () => {
      this.workflowState.step++;
      this.executeNextStep();
    });
  }

  async renderGenericStep(step) {
    const content = document.getElementById('workflowContent');
    content.innerHTML = `
      <div class="workflow-step">
        <h3>${this.interpolate(step.prompt)}</h3>
        <p>Executing: ${step.action}</p>
        <button class="btn-primary" id="continueWorkflow">Continue</button>
      </div>
    `;

    document.getElementById('continueWorkflow').addEventListener('click', () => {
      this.workflowState.step++;
      this.executeNextStep();
    });
  }

  interpolate(text) {
    return text.replace(/\{(\w+)\}/g, (match, key) => {
      return this.workflowState.variables[key] || match;
    });
  }

  formatResult(result) {
    if (typeof result === 'string') {
      return result.replace(/\n/g, '<br>');
    }
    return JSON.stringify(result, null, 2);
  }

  updateProgress() {
    const progress = ((this.workflowState.step + 1) / this.currentWorkflow.steps.length) * 100;
    const progressBar = document.getElementById('workflowProgress');
    const progressText = document.getElementById('workflowProgressText');
    
    if (progressBar) progressBar.style.width = `${progress}%`;
    if (progressText) {
      progressText.textContent = `Step ${this.workflowState.step + 1} of ${this.currentWorkflow.steps.length}`;
    }
  }

  workflowComplete() {
    const content = document.getElementById('workflowContent');
    content.innerHTML = `
      <div class="workflow-complete">
        <div class="success-icon">✓</div>
        <h2>Workflow Complete!</h2>
        <p>All steps have been executed successfully.</p>
        <button class="btn-primary" id="closeWorkflowComplete">Done</button>
      </div>
    `;

    document.getElementById('closeWorkflowComplete').addEventListener('click', () => {
      this.closeWorkflowPanel();
    });
  }

  closeWorkflowPanel() {
    const panel = document.getElementById('workflowPanel');
    if (panel) panel.style.display = 'none';
    this.currentWorkflow = null;
    this.workflowState = {};
  }

  cancelWorkflow() {
    if (confirm('Are you sure you want to cancel this workflow?')) {
      this.closeWorkflowPanel();
    }
  }

  showError(message) {
    const content = document.getElementById('workflowContent');
    if (content) {
      content.innerHTML = `
        <div class="error-state">
          <p class="error-message">${message}</p>
          <button class="btn-secondary" id="retryWorkflow">Retry</button>
          <button class="btn-secondary" id="cancelWorkflowError">Cancel</button>
        </div>
      `;

      document.getElementById('retryWorkflow')?.addEventListener('click', () => {
        this.executeNextStep();
      });

      document.getElementById('cancelWorkflowError')?.addEventListener('click', () => {
        this.closeWorkflowPanel();
      });
    }
  }
}

// Initialize workflow manager
window.workflowManager = new WorkflowManager();

// Load workflows on page load
document.addEventListener('DOMContentLoaded', () => {
  window.workflowManager.loadWorkflows();
});

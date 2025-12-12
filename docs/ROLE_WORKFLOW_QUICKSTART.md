# LMAPP Role & Workflow Quickstart

**Version:** 0.3.0-beta

LMAPP allows you to "calibrate" the AI's behavior to match your specific working style. This is done through **Workflow Calibrations**.

## What is Calibration?

Calibration defines:
1.  **Operating Rules:** How the AI should behave (e.g., "Ask before implementing", "Minimal changes only").
2.  **Tool Awareness:** What tools the AI knows you have (e.g., VS Code, GitKraken).
3.  **Role Definition:** The specific persona the AI adopts (e.g., "Architect", "Coder").

## Automatic Setup

On your first run of `lmapp` (or after an update), you may be prompted to calibrate your assistant:

```text
Would you like to calibrate your AI assistant's workflow? [y/N]
```

- **Yes:** Launches an interactive wizard to define your preferences.
- **No:** Uses safe defaults. You can choose to suppress this prompt forever.

## Manual Calibration

You can access the calibration settings at any time:

1.  Run `lmapp` to open the main menu.
2.  Select **"Calibrations"**.
3.  Choose **"Run Setup Wizard"** or **"Edit Rules Manually"**.

Alternatively, via CLI:
```bash
lmapp calibration setup
```

## Using Your Calibrated Role

Once set up, your preferences are saved as the **"custom"** role. You can use it by default, or specify it:

```bash
# Uses your calibrated settings if configured as default
lmapp chat

# Explicitly use the architect role (which includes your tool config)
lmapp chat --role architect
```

## Customizing Rules

You can edit your rules file directly at:
`~/.config/lmapp/workflow_rules.json`

Example structure:
```json
{
  "ask_first": true,
  "minimal_changes": true,
  "tools": ["vscode", "git", "python"],
  "custom_instructions": "Always explain the 'why' before the 'how'."
}
```

#!/usr/bin/env python3
"""
lmapp CLI - Main entry point
Provides the primary command-line interface for lmapp
"""

import sys
import click
from rich.console import Console
from rich.panel import Panel

from lmapp import __version__
from lmapp.ui.menu import MainMenu
from lmapp.ui.chat_ui import launch_chat
from lmapp.utils.system_check import SystemCheck
from lmapp.utils.logging import logger
from lmapp.backend.installer import BackendInstaller
from lmapp.backend.detector import BackendDetector
from lmapp.core.chat import ChatSession

console = Console()


@click.group(invoke_without_command=True)
@click.option('--version', is_flag=True, help='Show version and exit')
@click.option('--debug', is_flag=True, help='Enable debug logging')
@click.pass_context
def main(ctx, version, debug):
    """lmapp - Local LLM Made Simple
    
    Your personal AI assistant, running locally on your machine.
    """
    if debug:
        import os
        os.environ['LMAPP_DEBUG'] = '1'
        logger.enable_debug()
    
    logger.debug(f"lmapp CLI started, version={__version__}, debug={debug}")
    
    if version:
        console.print(f"[bold cyan]lmapp[/bold cyan] version [yellow]{__version__}[/yellow]")
        sys.exit(0)
    
    if ctx.invoked_subcommand is None:
        # No subcommand, show main menu
        show_welcome()
        menu = MainMenu()
        menu.run()


def show_welcome():
    """Display welcome message"""
    welcome_text = """
[bold cyan]Welcome to lmapp[/bold cyan] - Your Local AI Assistant

[dim]Privacy-first • Fully local • Easy to use[/dim]
    """
    console.print(Panel(welcome_text, border_style="cyan"))


@main.command()
@click.option('--model', default=None, help='Model to use for chat')
def chat(model):
    """Start a new chat session"""
    logger.debug(f"chat command started with model={model}")
    
    # Get detector to find best backend
    detector = BackendDetector()
    backend = None
    
    # Try to find a running backend
    for b in detector.detect_all():
        logger.debug(f"Checking backend: {b.backend_name()}")
        if b.is_running():
            logger.debug(f"Found running backend: {b.backend_name()}")
            backend = b
            break
    
    if not backend:
        # No running backend found
        available = detector.detect_all()
        logger.warning(f"No running backend found. Available: {[b.backend_name() for b in available]}")
        
        if not available:
            console.print("[red]✗ No LLM backends installed[/red]")
            console.print("\nTo install a backend, run:")
            console.print("  [bold]lmapp install[/bold]")
            sys.exit(1)
        
        # Backend installed but not running
        console.print(f"[yellow]⚠️  Backend '{available[0].backend_display_name()}' is not running[/yellow]")
        console.print("\nTo start it, run:")
        console.print("  [bold]lmapp install[/bold]")
        sys.exit(1)
    
    # Determine model to use
    chat_model = model or "tinyllama"
    
    # Check if model exists
    logger.debug(f"Checking for model: {chat_model}")
    models = backend.list_models()
    if chat_model not in models:
        logger.warning(f"Model '{chat_model}' not found. Available: {models}")
        console.print(f"[yellow]⚠️  Model '{chat_model}' not found[/yellow]")
        console.print(f"\nAvailable models:")
        for m in models:
            console.print(f"  - {m}")
        console.print(f"\nDownload a model with:")
        console.print("  [bold]lmapp install[/bold]")
        sys.exit(1)
    
    try:
        # Create and launch chat session
        logger.debug(f"Creating ChatSession with backend={backend.backend_name()}, model={chat_model}")
        session = ChatSession(backend, model=chat_model)
        logger.debug("ChatSession created, launching chat UI")
        launch_chat(session)
    except ValueError as e:
        logger.error(f"ValueError in chat: {str(e)}")
        console.print(f"[red]Error: {str(e)}[/red]")
        sys.exit(1)
    except KeyboardInterrupt:
        logger.debug("Chat interrupted by user")
        console.print("\n[yellow]Chat interrupted[/yellow]")
        sys.exit(0)
    except Exception as e:
        logger.error(f"Unexpected error in chat: {str(e)}", exc_info=True)
        console.print(f"[red]Unexpected error: {str(e)}[/red]")
        sys.exit(1)


@main.command()
def install():
    """Run the automated installation wizard"""
    logger.debug("install command started")
    console.print("[bold cyan]lmapp Installation Wizard[/bold cyan]\n")
    
    # Step 1: System check
    logger.debug("Running system checks")
    checker = SystemCheck()
    if checker.run_all_checks():
        console.print("\n[green]✓ System checks passed![/green]")
        logger.debug("System checks passed")
    else:
        logger.error("System checks failed")
        console.print("\n[red]✗ System checks failed. Please address issues above.[/red]")
        sys.exit(1)
    
    # Step 2: Backend installation (automated)
    logger.debug("Starting backend installation")
    installer = BackendInstaller()
    backend = installer.run_installation_wizard()
    
    if not backend:
        logger.warning("Backend installation cancelled or failed")
        console.print("\n[yellow]Installation cancelled or failed[/yellow]")
        sys.exit(1)
    
    # Step 3: Model installation (automated)
    logger.debug(f"Backend installed: {backend.backend_name()}")
    ram_gb = checker.results.get('ram_gb', 4)
    if installer.install_model(backend, ram_gb):
        logger.info("Installation complete and successful")
        console.print("\n[bold green]🎉 Installation complete![/bold green]")
        console.print("\n[cyan]Next steps:[/cyan]")
        console.print("  1. Run: [bold]lmapp chat[/bold]")
        console.print("  2. Or run: [bold]lmapp[/bold] to see the menu")
    else:
        logger.warning("Model installation skipped")
        console.print("\n[yellow]Backend installed but model download skipped[/yellow]")
        console.print("[dim]You can download models later with: lmapp config[/dim]")


@main.command()
def status():
    """Show system status and configuration"""
    logger.debug("status command started")
    console.print("[bold]System Status[/bold]\n")
    
    checker = SystemCheck()
    checker.run_all_checks()
    
    # Show backend status
    console.print("\n[bold]Backend Status[/bold]\n")
    detector = BackendDetector()
    detector.show_status_table()
    logger.debug("Status command completed")


@main.group()
def config():
    """Manage lmapp configuration settings"""
    logger.debug("config command group started")


@config.command(name='show')
def config_show():
    """Display current configuration"""
    logger.debug("config show command started")
    
    from lmapp.core.config import get_config_manager
    manager = get_config_manager()
    
    console.print(manager.show())
    console.print()
    console.print("[dim]Configuration location: ~/.config/lmapp/config.json[/dim]")
    console.print("[dim]Log location: ~/.local/share/lmapp/logs/lmapp.log[/dim]")


@config.command(name='set')
@click.argument('key')
@click.argument('value')
def config_set(key, value):
    """Set a configuration value
    
    Examples:
        lmapp config set model mistral
        lmapp config set temperature 0.5
        lmapp config set debug true
        lmapp config set backend ollama
    """
    logger.debug(f"config set command: {key}={value}")
    
    from lmapp.core.config import get_config_manager, LMAppConfig
    from pydantic import ValidationError
    
    manager = get_config_manager()
    
    # Parse value based on type
    parsed_value = value
    if value.lower() in ('true', 'false'):
        parsed_value = value.lower() == 'true'
    elif value.replace('.', '', 1).isdigit():
        # Try to parse as float or int
        try:
            if '.' in value:
                parsed_value = float(value)
            else:
                parsed_value = int(value)
        except ValueError:
            parsed_value = value
    
    # Validate key exists
    cfg = manager.get()
    if not hasattr(cfg, key):
        console.print(f"[red]✗ Unknown configuration key: {key}[/red]")
        console.print("\n[cyan]Valid keys:[/cyan]")
        for field_name in cfg.model_dump().keys():
            field_value = getattr(cfg, field_name)
            console.print(f"  [yellow]{field_name:15}[/yellow] (current: {field_value})")
        logger.warning(f"Invalid config key: {key}")
        return
    
    # Validate the value by creating a temporary config
    try:
        test_data = cfg.model_dump()
        test_data[key] = parsed_value
        LMAppConfig(**test_data)  # This will raise ValidationError if invalid
    except ValidationError as e:
        console.print(f"[red]✗ Failed to set {key}: Invalid value[/red]")
        # Extract the error message from validation error
        for error in e.errors():
            console.print(f"  [yellow]{error['msg']}[/yellow]")
        logger.warning(f"Validation failed for {key}={parsed_value}: {e}")
        # Validation errors are non-fatal for interactive CLI usage; return
        # so the command prints a helpful message but does not exit the process.
        return
    except Exception as e:
        console.print(f"[red]✗ Failed to set {key}: {str(e)}[/red]")
        logger.error(f"Unexpected error setting {key}: {str(e)}")
        return
    
    # Update config
    try:
        if manager.update(**{key: parsed_value}):
            console.print(f"[green]✓ Updated {key} = {parsed_value}[/green]")
            logger.info(f"Config updated: {key}={parsed_value}")
        else:
            console.print(f"[red]✗ Failed to save configuration[/red]")
            logger.error(f"Failed to save config after updating {key}")
    except Exception as e:
        console.print(f"[red]✗ Failed to set {key}: {str(e)}[/red]")
        logger.error(f"Exception while setting {key}: {str(e)}")


@config.command(name='reset')
@click.confirmation_option(prompt='This will reset all settings to defaults. Continue?')
def config_reset():
    """Reset all settings to defaults"""
    logger.debug("config reset command started")
    
    from lmapp.core.config import ConfigManager, LMAppConfig
    
    manager = ConfigManager()
    default_config = LMAppConfig()
    
    try:
        manager.save(default_config)
        console.print("[green]✓ Configuration reset to defaults[/green]")
        console.print(manager.show())
        logger.info("Config reset to defaults")
    except Exception as e:
        console.print(f"[red]✗ Failed to reset config: {str(e)}[/red]")
        logger.error(f"Failed to reset config: {str(e)}")


@config.command(name='validate')
def config_validate():
    """Validate current configuration"""
    logger.debug("config validate command started")
    
    from lmapp.core.config import get_config
    
    try:
        cfg = get_config()
        console.print("[green]✓ Configuration is valid[/green]")
        console.print(cfg.model_dump())
        logger.debug("Config validation passed")
    except Exception as e:
        console.print(f"[red]✗ Configuration is invalid: {str(e)}[/red]")
        logger.error(f"Config validation failed: {str(e)}")


if __name__ == "__main__":
    main()

# Backwards-compatible alias: some tests and external code import `cli`.
# Provide `cli` as an alias to the main click entrypoint.
cli = main

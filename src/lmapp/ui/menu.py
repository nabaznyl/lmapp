#!/usr/bin/env python3
"""
Main Menu System
Provides alphabetic multiple-choice menus for user interaction
"""

from typing import List, Callable, Optional

import inquirer
from rich.console import Console
from rich.panel import Panel

console = Console()


class MenuItem:
    """Represents a single menu item"""

    def __init__(
        self,
        key: str,
        label: str,
        action: Optional[Callable] = None,
        description: str = "",
    ):
        self.key = key.upper()
        self.label = label
        self.action = action
        self.description = description

    def execute(self):
        """Execute the menu item's action"""
        if self.action:
            return self.action()
        else:
            console.print(f"[yellow]'{self.label}' not yet implemented[/yellow]")


class MainMenu:
    """Main application menu"""

    def __init__(self):
        self.items = self._build_menu_items()
        self.running = True

    def _build_menu_items(self) -> List[MenuItem]:
        """Build the main menu structure"""
        return [
            MenuItem(
                "A",
                "Start new chat",
                self.start_chat,
                "Begin chatting with your local AI",
            ),
            MenuItem(
                "B",
                "Manage models",
                self.manage_models,
                "Download, update, or remove AI models",
            ),
            MenuItem(
                "C", "Configure settings", self.configure, "Adjust lmapp configuration"
            ),
            MenuItem(
                "D",
                "Shell customization",
                self.shell_customize,
                "Install bash-it or Oh My Zsh",
            ),
            MenuItem(
                "E",
                "Help & documentation",
                self.show_help,
                "View guides and troubleshooting",
            ),
            MenuItem("Q", "Quit", self.quit, "Exit lmapp"),
        ]

    def display(self):
        """Display the menu"""
        console.print("\n[bold cyan]lmapp - Main Menu[/bold cyan]\n")

        for item in self.items:
            if item.description:
                console.print(f"[bold]{item.key})[/bold] {item.label}")
                console.print(f"   [dim]{item.description}[/dim]")
            else:
                console.print(f"[bold]{item.key})[/bold] {item.label}")

        console.print()

    def get_choice(self) -> Optional[str]:
        """Get user's menu choice"""
        choices = [(f"{item.key}) {item.label}", item.key) for item in self.items]

        questions = [
            inquirer.List(
                "choice",
                message="Choose an option",
                choices=choices,
            ),
        ]

        try:
            answers = inquirer.prompt(questions)
            if answers:
                return answers["choice"]
            return None
        except KeyboardInterrupt:
            return "Q"

    def run(self):
        """Main menu loop"""
        while self.running:
            self.display()
            choice = self.get_choice()

            if choice:
                # Find and execute the menu item
                for item in self.items:
                    if item.key == choice.upper():
                        console.print()
                        item.execute()
                        break

                if choice.upper() == "Q":
                    break
            else:
                break

        console.print("\n[dim]Thanks for using lmapp![/dim]\n")

    # Menu action methods

    def start_chat(self):
        """Start a new chat session"""
        console.print("[bold cyan]Starting chat session...[/bold cyan]")
        console.print("[yellow]Chat functionality coming soon![/yellow]")
        console.print("[dim]Press Enter to return to menu[/dim]")
        input()

    def manage_models(self):
        """Model management interface"""
        console.print("[bold cyan]Model Management[/bold cyan]\n")
        console.print("[yellow]Model management coming soon![/yellow]")
        console.print("\n[dim]Features:[/dim]")
        console.print("  • List installed models")
        console.print("  • Download new models")
        console.print("  • Update existing models")
        console.print("  • Remove unused models")
        console.print("\n[dim]Press Enter to return to menu[/dim]")
        input()

    def configure(self):
        """Configuration interface"""
        console.print("[bold cyan]Configuration[/bold cyan]\n")
        console.print("[yellow]Configuration interface coming soon![/yellow]")
        console.print("\n[dim]Settings:[/dim]")
        console.print("  • Backend selection (Ollama/llamafile)")
        console.print("  • Default model")
        console.print("  • CLI tool preferences")
        console.print("  • API endpoints")
        console.print("\n[dim]Press Enter to return to menu[/dim]")
        input()

    def shell_customize(self):
        """Shell customization menu"""
        console.print("[bold cyan]Shell Customization[/bold cyan]\n")
        console.print("[yellow]Shell customization coming soon![/yellow]")
        console.print("\n[dim]Options:[/dim]")
        console.print("  • Install bash-it")
        console.print("  • Install Oh My Zsh")
        console.print("  • Configure shell themes")
        console.print("  • Add custom aliases")
        console.print("\n[dim]Press Enter to return to menu[/dim]")
        input()

    def show_help(self):
        """Display help information"""
        help_text = """
[bold]lmapp Help & Documentation[/bold]

[cyan]Quick Start:[/cyan]
1. Run installation: lmapp install
2. Start chatting: lmapp chat
3. Or use this menu to explore features

[cyan]Documentation:[/cyan]
• User Guide: docs/user-guide.md
• Installation: docs/installation.md
• Troubleshooting: docs/troubleshooting.md
• FAQ: docs/faq.md

[cyan]Support:[/cyan]
• GitHub Issues: github.com/yourusername/lmapp/issues
• Documentation: github.com/yourusername/lmapp/docs

[cyan]Version:[/cyan] 0.1.0-dev
        """
        console.print(Panel(help_text, border_style="cyan"))
        console.print("\n[dim]Press Enter to return to menu[/dim]")
        input()

    def quit(self):
        """Exit the application"""
        self.running = False


if __name__ == "__main__":
    menu = MainMenu()
    menu.run()

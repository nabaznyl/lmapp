"""Plugin template for community developers."""

from lmapp.plugins.base import Plugin, PluginMetadata


class Plugin(Plugin):
    """Example plugin template.

    To create a plugin:
    1. Copy this template to your plugin directory
    2. Replace MyPlugin with your plugin name
    3. Implement initialize(), execute(), and shutdown()
    4. Create setup.py or pyproject.toml with plugin metadata
    5. Submit to plugin registry
    """

    def __init__(self):
        """Initialize plugin metadata."""
        self.metadata = PluginMetadata(
            name="my-plugin",
            version="0.1.0",
            author="Your Name",
            description="Plugin description",
            dependencies=[],
            entry_point="my_plugin.Plugin",
            license="MIT",
            tags=["example"],
        )

    def initialize(self) -> None:
        """Initialize plugin on load.

        Called when plugin is loaded. Use for:
        - Loading configuration files
        - Initializing resources
        - Registering commands
        """
        print(f"Initializing {self.metadata.name}")

    def execute(self, command: str, args: dict) -> any:
        """Execute a command in this plugin.

        Args:
            command: Command name
            args: Command arguments

        Returns:
            Command result
        """
        if command == "hello":
            return f"Hello from {self.metadata.name}!"
        elif command == "echo":
            return args.get("message", "")
        else:
            raise ValueError(f"Unknown command: {command}")

    def shutdown(self) -> None:
        """Clean up on plugin unload.

        Called when plugin is uninstalled or lmapp exits.
        Use for:
        - Saving state
        - Closing connections
        - Cleanup operations
        """
        print(f"Shutting down {self.metadata.name}")


# Optional: Add CLI commands
try:
    import click

    @click.group()
    def my_commands():
        """My plugin commands."""
        pass

    @my_commands.command()
    @click.option("--name", default="World", help="Name to greet")
    def hello(name):
        """Say hello."""
        click.echo(f"Hello {name}!")

except ImportError:
    # click not available, skip CLI integration
    pass

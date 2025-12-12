import subprocess
import sys
import time
import requests
import os
from pathlib import Path

# Use the local venv python
PYTHON_EXE = sys.executable
CLI_MODULE = "lmapp.cli"


def run_command(args, description, expect_fail=False, timeout=30, input_str=None):
    print(f"Testing: {description}...", end=" ", flush=True)
    cmd = [PYTHON_EXE, "-m", CLI_MODULE] + args
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout, input=input_str)
        if result.returncode == 0 and not expect_fail:
            print("✅ PASS")
            return True, result.stdout
        elif result.returncode != 0 and expect_fail:
            print("✅ PASS (Expected Failure)")
            return True, result.stderr
        elif input_str and result.returncode != 0:  # Aborted by user input usually returns non-zero in click?
            # Click confirmation abort usually exits with 1
            if "Aborted" in result.stderr or "Aborted" in result.stdout:
                print("✅ PASS (Aborted as expected)")
                return True, result.stderr
            else:
                print("❌ FAIL")
                print(f"  Exit Code: {result.returncode}")
                print(f"  Stdout: {result.stdout[:200]}...")
                print(f"  Stderr: {result.stderr[:200]}...")
                return False, result.stderr
        else:
            print("❌ FAIL")
            print(f"  Exit Code: {result.returncode}")
            print(f"  Stdout: {result.stdout[:200]}...")
            print(f"  Stderr: {result.stderr[:200]}...")
            return False, result.stderr
    except subprocess.TimeoutExpired:
        print("❌ FAIL (Timeout)")
        return False, "Timeout"
    except Exception as e:
        print(f"❌ FAIL (Exception: {e})")
        return False, str(e)


def test_server():
    print("Testing: Server Lifecycle...", end=" ", flush=True)

    # 1. Kill any existing
    subprocess.run([PYTHON_EXE, "-m", CLI_MODULE, "-y", "server", "kill", "-a"], capture_output=True)

    # 2. Start Server
    server_proc = subprocess.Popen([PYTHON_EXE, "-m", CLI_MODULE, "server", "start"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    # Wait for startup
    time.sleep(3)

    # 3. Check Health
    try:
        r = requests.get("http://localhost:8000/health", timeout=2)
        if r.status_code == 200:
            print("✅ PASS (Health Check)")
        else:
            print(f"❌ FAIL (Health Check Status: {r.status_code})")
            server_proc.terminate()
            return False
    except Exception as e:
        print(f"❌ FAIL (Health Check Exception: {e})")
        server_proc.terminate()
        return False

    # 4. Stop Server via CLI
    run_command(["server", "stop"], "Server Stop Command")

    # Wait for shutdown
    time.sleep(2)
    if server_proc.poll() is None:
        server_proc.terminate()

    return True


def main():
    print("=== lmapp Enhanced Systematic Test Suite ===\n")

    failures = []

    # --- Core Commands ---
    ok, _ = run_command(["--version"], "Version Flag")
    if not ok:
        failures.append("version")

    ok, _ = run_command(["status"], "Status Command")
    if not ok:
        failures.append("status")

    ok, _ = run_command(["check"], "Check Command (Alias)")
    if not ok:
        failures.append("check")

    ok, _ = run_command(["config", "show"], "Config Show")
    if not ok:
        failures.append("config show")

    # Test Config Reset Abort
    ok, _ = run_command(["config", "reset"], "Config Reset (Abort)", input_str="n\n", expect_fail=True)
    if not ok:
        failures.append("config reset abort")

    ok, _ = run_command(["update"], "Update Command")
    if not ok:
        failures.append("update")

    ok, _ = run_command(["errors"], "Errors Command")
    if not ok:
        failures.append("errors")

    # --- Subcommand Groups ---
    ok, _ = run_command(["model"], "Model Group (Default)")
    if not ok:
        failures.append("model")

    ok, _ = run_command(["plugin", "list"], "Plugin List")
    if not ok:
        failures.append("plugin list")

    # --- Interactive Commands (Help Only) ---
    ok, _ = run_command(["chat", "--help"], "Chat Help")
    if not ok:
        failures.append("chat help")

    ok, _ = run_command(["install", "--help"], "Install Help")
    if not ok:
        failures.append("install help")

    ok, _ = run_command(["workflow", "setup", "--help"], "Workflow Setup Help")
    if not ok:
        failures.append("workflow setup help")

    # --- Dev Tool Wrappers ---
    # These wrap external tools (flake8, black, pytest, mypy).
    # We test if they can run or at least show help/version if no args provided.
    # Note: Some might fail if the underlying tool isn't installed or finds issues.
    # We'll check if the command itself executes.

    # 'src' runs flake8 on src/. It might find issues, so return code might be non-zero.
    # We just want to ensure it doesn't crash with ImportError or similar.
    # Let's try running it on a clean file or just check help if available?
    # The wrappers don't seem to have --help implemented in the wrapper itself, they pass args to the tool.
    # Let's try running 'src' and expect it might fail (exit code 1) but not crash.
    # Actually, let's just check if the command exists in CLI.

    # We can try running them with --version which most tools support
    ok, _ = run_command(["src", "--version"], "Src Command (flake8 version)")
    if not ok:
        failures.append("src")

    ok, _ = run_command(["lint", "--version"], "Lint Command (flake8 version)")
    if not ok:
        failures.append("lint")

    ok, _ = run_command(["format", "--version"], "Format Command (black version)")
    if not ok:
        failures.append("format")

    ok, _ = run_command(["tests", "--version"], "Tests Command (pytest version)")
    if not ok:
        failures.append("tests")

    ok, _ = run_command(["types", "--version"], "Types Command (mypy version)")
    if not ok:
        failures.append("types")

    # --- Server Tests ---
    if not test_server():
        failures.append("server lifecycle")

    print("\n=== Test Summary ===")
    if failures:
        print(f"❌ {len(failures)} Tests Failed: {', '.join(failures)}")
        sys.exit(1)
    else:
        print("✅ All Tests Passed")
        sys.exit(0)


if __name__ == "__main__":
    main()

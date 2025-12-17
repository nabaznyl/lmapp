import sys
import time
import subprocess
import requests
import os
import signal

def verify_system():
    print("--- Starting System Verification ---")
    
    # Define paths
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    src_path = os.path.join(project_root, "src")
    venv_python = os.path.join(project_root, ".venv", "bin", "python")
    
    # Environment variables
    env = os.environ.copy()
    env["PYTHONPATH"] = src_path
    
    # Start Server
    print(f"Starting server from {project_root}...")
    process = subprocess.Popen(
        [venv_python, "-m", "uvicorn", "lmapp.server.app:app", "--port", "8000"],
        cwd=project_root,
        env=env,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    
    try:
        # Wait for server to start
        print("Waiting for server to start...")
        server_up = False
        for _ in range(10):
            try:
                response = requests.get("http://localhost:8000/ui/index.html")
                if response.status_code == 200:
                    server_up = True
                    break
            except requests.ConnectionError:
                pass
            time.sleep(1)
            
        if not server_up:
            print("❌ Server failed to start within 10 seconds.")
            stdout, stderr = process.communicate(timeout=1)
            print("STDOUT:", stdout.decode())
            print("STDERR:", stderr.decode())
            sys.exit(1)
            
        print("✅ Server is up.")
        
        # Check Endpoints
        endpoints = [
            ("UI Index", "http://localhost:8000/ui/index.html"),
            ("API Adapter", "http://localhost:8000/ui/api_adapter.js")
        ]
        
        failed = False
        for name, url in endpoints:
            try:
                resp = requests.get(url)
                if resp.status_code == 200:
                    print(f"✅ {name} accessible ({resp.status_code})")
                else:
                    print(f"❌ {name} returned {resp.status_code}")
                    failed = True
            except Exception as e:
                print(f"❌ {name} failed: {e}")
                failed = True
                
        if failed:
            sys.exit(1)
            
        print("--- Verification Complete: SUCCESS ---")
        
    finally:
        print("Stopping server...")
        process.terminate()
        try:
            process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            process.kill()

if __name__ == "__main__":
    verify_system()

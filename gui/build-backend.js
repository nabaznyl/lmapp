#!/usr/bin/env node
/**
 * Build script to bundle lmapp Python backend with Electron GUI
 * Uses PyInstaller to create standalone executables
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PLATFORM = process.platform; // darwin, win32, linux
const BACKEND_DIR = path.join(__dirname, '..'); // lmapp root
const OUTPUT_DIR = path.join(__dirname, 'resources', 'backend');

console.log('🔨 Building lmapp backend bundle...');
console.log(`Platform: ${PLATFORM}`);
console.log(`Backend source: ${BACKEND_DIR}`);
console.log(`Output: ${OUTPUT_DIR}`);

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Determine PyInstaller path (prefer venv)
let pyinstallerPath = 'pyinstaller';
const venvPyInstaller = path.join(BACKEND_DIR, 'venv', 'bin', 'pyinstaller');
if (fs.existsSync(venvPyInstaller)) {
  pyinstallerPath = venvPyInstaller;
  console.log(`✅ Using venv PyInstaller: ${venvPyInstaller}`);
} else {
  console.log('Using system PyInstaller');
}

// Check PyInstaller is installed
try {
  execSync(`${pyinstallerPath} --version`, { stdio: 'pipe' });
  console.log('✅ PyInstaller found');
} catch (e) {
  console.error('❌ PyInstaller not found. Install with: pip install pyinstaller');
  process.exit(1);
}

// Determine lmapp path (prefer venv)
let lmappPath = 'lmapp';
const venvLmapp = path.join(BACKEND_DIR, 'venv', 'bin', 'lmapp');
if (fs.existsSync(venvLmapp)) {
  lmappPath = venvLmapp;
  console.log(`✅ Using venv lmapp: ${venvLmapp}`);
}

// Check lmapp is available
try {
  execSync(`${lmappPath} --version`, { stdio: 'pipe' });
  console.log('✅ lmapp CLI found');
} catch (e) {
  console.error('❌ lmapp not found. Install with: pip install -e ../');
  process.exit(1);
}

// Create PyInstaller spec file
// We use a dynamic spec file that uses PyInstaller's collect_all to find dependencies
// regardless of where they are installed (venv, system, CI/CD).
const specContent = `
# -*- mode: python ; coding: utf-8 -*-
from PyInstaller.utils.hooks import collect_all
import os
import sys

block_cipher = None

# Define root paths
backend_src = os.path.abspath(os.path.join('${BACKEND_DIR}', 'src'))

# Collect data/imports for dependencies that use metadata
datas = [
    (os.path.join(backend_src, 'lmapp'), 'lmapp'),
]
binaries = []
hiddenimports = [
    'lmapp',
    'lmapp.cli',
    'lmapp.server',
    'lmapp.rag',
    'lmapp.workflows',
    'lmapp.plugins',
    'uvicorn',
    'fastapi',
    'pydantic',
    'requests',
    'click',
    'rich',
    'inquirer',
    'readchar',
    'readchar.readchar_linux',
    'blessed',
]

# Automatically collect metadata for packages that need it
for pkg in ['readchar', 'inquirer', 'blessed', 'uvicorn']:
    try:
        tmp_ret = collect_all(pkg)
        datas += tmp_ret[0]
        binaries += tmp_ret[1]
        hiddenimports += tmp_ret[2]
    except Exception as e:
        print(f"Warning: Could not collect data for {pkg}: {e}")

a = Analysis(
    [os.path.join(backend_src, 'lmapp', 'cli.py')],
    pathex=[backend_src],
    binaries=binaries,
    datas=datas,
    hiddenimports=hiddenimports,
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name='lmapp',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=True,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)
`;

const specPath = path.join(__dirname, 'lmapp.spec');
fs.writeFileSync(specPath, specContent);
console.log('✅ Created PyInstaller spec file');

// Run PyInstaller
console.log('🔨 Running PyInstaller (this may take 2-5 minutes)...');
try {
  execSync(`${pyinstallerPath} --clean --distpath ${OUTPUT_DIR} ${specPath}`, {
    stdio: 'inherit',
    cwd: __dirname
  });
  console.log('✅ Backend bundle created successfully');
} catch (e) {
  console.error('❌ PyInstaller build failed');
  process.exit(1);
}

// Verify the executable exists
const exeName = PLATFORM === 'win32' ? 'lmapp.exe' : 'lmapp';
const exePath = path.join(OUTPUT_DIR, exeName);

if (fs.existsSync(exePath)) {
  const stats = fs.statSync(exePath);
  console.log(`✅ Executable created: ${exePath}`);
  console.log(`   Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
  
  // Make executable on Unix
  if (PLATFORM !== 'win32') {
    fs.chmodSync(exePath, '755');
    console.log('✅ Executable permissions set');
  }
} else {
  console.error(`❌ Expected executable not found: ${exePath}`);
  process.exit(1);
}

console.log('');
console.log('🎉 Backend bundling complete!');
console.log(`   Binary: ${exePath}`);
console.log('   Next: Run "npm run build" to create full distribution');

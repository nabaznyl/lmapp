
# -*- mode: python ; coding: utf-8 -*-

block_cipher = None

a = Analysis(
    ['/home/anonmaly/projects/lmapp/src/lmapp/cli.py'],
    pathex=['/home/anonmaly/projects/lmapp/src'],
    binaries=[],
    datas=[
        ('/home/anonmaly/projects/lmapp/src/lmapp', 'lmapp'),
        ('/home/anonmaly/projects/lmapp/venv/lib/python3.13/site-packages/readchar-4.2.1.dist-info', 'readchar-4.2.1.dist-info'),
        ('/home/anonmaly/projects/lmapp/venv/lib/python3.13/site-packages/inquirer-3.4.1.dist-info', 'inquirer-3.4.1.dist-info'),
        ('/home/anonmaly/projects/lmapp/venv/lib/python3.13/site-packages/blessed-1.25.0.dist-info', 'blessed-1.25.0.dist-info'),
    ],
    hiddenimports=[
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
    ],
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

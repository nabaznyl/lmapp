# lmapp Browser Terminal Demo

An interactive Python terminal in your browser - no backend needed, no account required!

## Features

✨ **Browser-Based** - Runs entirely in your browser using Pyodide (WebAssembly)  
🎯 **No Backend** - Zero server costs, scales infinitely  
📱 **Mobile Ready** - Works on phones, tablets, desktops  
⚡ **Fast Load** - Cached after first load (~60s first time, <2s cached)  
🔒 **Private** - All computation stays in your browser  

## Try Now

### Option 1: Open Directly (Easiest)
1. Open this folder on GitHub: [lmapp/demo/](https://github.com/nabaznyl/lmapp/tree/mother/demo)
2. Click `index.html`
3. Click "Raw" or "Open in new window"
4. Wait for Python environment to load (~30-60 seconds on first load)
5. Type commands: `lmapp chat`, `lmapp status`, `help`, `exit`

### Option 2: Local File
```bash
# Clone or download the repo
git clone https://github.com/nabaznyl/lmapp.git
cd lmapp/demo

# Open in browser
open index.html   # macOS
xdg-open index.html  # Linux
start index.html  # Windows

# Or use a simple HTTP server
python -m http.server 8000
# Then visit: http://localhost:8000
```

### Option 3: Deploy to Free Hosting

#### Netlify (Recommended - Easiest)
1. Fork/clone the repo on GitHub
2. Connect to [Netlify](https://app.netlify.com)
3. Select this repository, keep default settings
4. Deploy (takes 2 minutes)
5. Get a free URL like `https://lmapp-demo.netlify.app`

#### GitHub Pages
1. Go to repo Settings → Pages
2. Enable GitHub Pages from `mother` branch, `/demo` folder
3. Access at `https://username.github.io/lmapp/demo/`

#### Vercel (Free)
1. Visit [vercel.com](https://vercel.com)
2. Import the repository
3. Deploy (instant)

## Supported Commands

```
lmapp chat          - Interactive chat mode
lmapp status        - System status & environment
lmapp config show   - Display configuration
lmapp plugin list   - List available plugins
lmapp --version     - Version information

help                - Show this help
clear/cls           - Clear terminal
exit/quit           - Exit demo
```

## Performance

- **First Load:** 30-60 seconds (browser downloads & caches Pyodide WASM)
- **Subsequent Loads:** <2 seconds (cached locally)
- **Memory:** ~150-200MB (typical browser memory)
- **Storage:** ~70MB cache (WASM binary)

**Tip:** Use full screen for best terminal experience on mobile.

## Technical Details

**Stack:**
- **Pyodide v0.23.4** - Python 3.11 runtime in WebAssembly
- **xterm.js v4.18** - Terminal UI library
- **Vanilla JavaScript** - No framework dependencies

**Why This Approach:**
1. **Zero Backend** - No server costs, no maintenance
2. **Scale Infinitely** - CDN can handle millions of users
3. **Privacy** - Computation never leaves user's browser
4. **Offline** - Works offline after first load
5. **Easy Deploy** - Drop folder anywhere, it works

## Limitations

- File I/O is sandboxed (can't access real filesystem)
- Network requests limited by browser security
- lmapp commands simulated for demo (not connected to real Ollama)
- Some system commands not available

## Troubleshooting

**Terminal not appearing?**
- Wait 30-60 seconds for first load
- Try refreshing the page
- Check browser console (F12) for errors
- Ensure JavaScript is enabled

**Commands not working?**
- Type `help` to see all available commands
- Try `lmapp --version` to verify it's loaded
- Clear terminal with `clear` and try again

**Slow on mobile?**
- First load is slower (network + processing)
- Future visits are much faster (cached)
- Landscape mode gives more space
- Use landscape + full-screen for best UX

## Contributing

To modify the demo:
1. Edit `index.html` 
2. Update command responses in `processCommand()` function
3. Test locally with `python -m http.server 8000`
4. Push to GitHub for automatic deployment

## Resources

- **Pyodide Docs:** https://pyodide.org/
- **xterm.js:** https://xtermjs.org/
- **WebAssembly:** https://webassembly.org/

---

**Have fun exploring lmapp! 🚀**

Want to use it in production? Check out the [main README](../README.md) for installation instructions.

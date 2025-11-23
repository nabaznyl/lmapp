#!/usr/bin/env bash
# lmapp Bootstrap Installer (Failsafe)
# Provides bash-based installation when Python is unavailable

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "${CYAN}========================================${NC}"
    echo -e "${CYAN}  lmapp - Local LLM Made Simple${NC}"
    echo -e "${CYAN}  Bootstrap Installer${NC}"
    echo -e "${CYAN}========================================${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

check_os() {
    echo "Checking operating system..."
    
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if command -v apt-get &> /dev/null; then
            print_success "Debian-based Linux detected"
            return 0
        else
            print_warning "Non-Debian Linux detected"
            print_warning "Installation may work but is not officially supported"
            return 0
        fi
    else
        print_error "Unsupported OS: $OSTYPE"
        print_error "Currently only Debian-based Linux is supported"
        return 1
    fi
}

check_ram() {
    echo "Checking RAM..."
    
    if [[ -f /proc/meminfo ]]; then
        RAM_KB=$(awk '/MemTotal/ {print $2}' /proc/meminfo)
        RAM_GB=$((RAM_KB / 1024 / 1024))
        
        if [[ $RAM_GB -lt 4 ]]; then
            print_error "Insufficient RAM: ${RAM_GB}GB (minimum 4GB required)"
            return 1
        elif [[ $RAM_GB -lt 8 ]]; then
            print_warning "Low RAM: ${RAM_GB}GB (recommended 8GB+)"
            print_warning "Only small models will be available"
            return 0
        else
            print_success "RAM: ${RAM_GB}GB"
            return 0
        fi
    else
        print_warning "Could not determine RAM"
        return 0
    fi
}

check_storage() {
    echo "Checking storage..."
    
    FREE_GB=$(df -BG ~ | awk 'NR==2 {print $4}' | sed 's/G//')
    
    if [[ $FREE_GB -lt 5 ]]; then
        print_error "Insufficient storage: ${FREE_GB}GB free (minimum 5GB)"
        return 1
    elif [[ $FREE_GB -lt 10 ]]; then
        print_warning "Low storage: ${FREE_GB}GB free (recommended 10GB+)"
        return 0
    else
        print_success "Storage: ${FREE_GB}GB free"
        return 0
    fi
}

check_python() {
    echo "Checking Python..."
    
    if command -v python3 &> /dev/null; then
        VERSION=$(python3 --version | awk '{print $2}')
        print_success "Python $VERSION found"
        return 0
    else
        print_error "Python 3 not found"
        print_error "Install with: sudo apt install python3 python3-pip python3-venv"
        return 1
    fi
}

check_tools() {
    echo "Checking system tools..."
    
    MISSING=()
    
    for tool in curl wget git; do
        if command -v "$tool" &> /dev/null; then
            print_success "$tool found"
        else
            print_warning "$tool not found"
            MISSING+=("$tool")
        fi
    done
    
    if [[ ${#MISSING[@]} -gt 0 ]]; then
        print_warning "Missing tools: ${MISSING[*]}"
        echo "Install with: sudo apt install ${MISSING[*]}"
        return 0
    fi
    
    return 0
}

check_internet() {
    echo "Checking internet connection..."
    
    if ping -c 1 -W 2 8.8.8.8 &> /dev/null; then
        print_success "Internet connection available"
        return 0
    else
        print_warning "No internet connection detected"
        print_warning "Internet required for initial model download"
        return 0
    fi
}

run_checks() {
    echo -e "\n${CYAN}Running system checks...${NC}\n"
    
    check_os || exit 1
    check_ram || exit 1
    check_storage || exit 1
    check_python || exit 1
    check_tools
    check_internet
    
    echo -e "\n${GREEN}System checks complete!${NC}\n"
}

show_eula() {
    echo -e "\n${CYAN}End-User License Agreement${NC}\n"
    echo "By proceeding with this installation, you agree to:"
    echo ""
    echo "  • Use the software at your own risk"
    echo "  • No warranty is provided"
    echo "  • Comply with all third-party licenses"
    echo "  • Comply with AI model usage terms"
    echo "  • Understand system requirements and resource usage"
    echo ""
    echo "Full EULA: https://github.com/yourusername/lmapp/blob/main/templates/EULA.md"
    echo ""
    
    read -p "Do you accept these terms? (yes/no): " ACCEPT
    
    if [[ "$ACCEPT" != "yes" ]]; then
        print_error "Installation cancelled"
        exit 1
    fi
    
    print_success "Terms accepted"
}

install_lmapp() {
    echo -e "\n${CYAN}Installing lmapp...${NC}\n"
    
    # Create virtual environment
    echo "Creating virtual environment..."
    python3 -m venv .venv
    source .venv/bin/activate
    print_success "Virtual environment created"
    
    # Install dependencies
    echo "Installing Python dependencies..."
    pip install -q --upgrade pip
    pip install -q -r requirements.txt
    print_success "Dependencies installed"
    
    # Install lmapp
    echo "Installing lmapp..."
    pip install -q -e .
    print_success "lmapp installed"
    
    echo -e "\n${GREEN}Installation complete!${NC}\n"
}

show_next_steps() {
    echo -e "${CYAN}Next Steps:${NC}\n"
    echo "1. Activate virtual environment:"
    echo "   ${GREEN}source .venv/bin/activate${NC}"
    echo ""
    echo "2. Run lmapp:"
    echo "   ${GREEN}lmapp${NC}"
    echo ""
    echo "3. Or run system check:"
    echo "   ${GREEN}lmapp status${NC}"
    echo ""
    echo "Documentation: docs/installation.md"
    echo "Support: https://github.com/yourusername/lmapp/issues"
    echo ""
}

# Main
main() {
    print_header
    run_checks
    show_eula
    install_lmapp
    show_next_steps
}

main

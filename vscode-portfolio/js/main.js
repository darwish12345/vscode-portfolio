// Tab switching functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get all elements
    const activityIcons = document.querySelectorAll('.activity-icon');
    const fileItems = document.querySelectorAll('.file-item');
    const tabs = document.querySelectorAll('.tab');
    const editorPanes = document.querySelectorAll('.editor-pane');
    const closeTerminalBtn = document.getElementById('close-terminal');
    const terminal = document.getElementById('terminal');
    const typingCommand = document.getElementById('typing-command');
    
    let typingTimeout;
    
    // Function to switch tabs
    function switchTab(tabId) {
        // Update active state for tabs header
        tabs.forEach(tab => {
            if (tab.dataset.tab === tabId) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        // Update active state for file explorer
        fileItems.forEach(file => {
            if (file.dataset.tab === tabId) {
                file.classList.add('active-file');
            } else {
                file.classList.remove('active-file');
            }
        });
        
        // Show the correct editor pane
        editorPanes.forEach(pane => {
            if (pane.id === `${tabId}-content`) {
                pane.classList.add('active');
            } else {
                pane.classList.remove('active');
            }
        });
    }
    
    // Handle file clicks from sidebar
    fileItems.forEach(file => {
        file.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            switchTab(tabId);
        });
    });
    
    // Handle tab clicks
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            switchTab(tabId);
        });
        
        // Handle close tab (with custom logic)
        const closeBtn = tab.querySelector('.close-tab');
        if (closeBtn) {
            closeBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const tabId = tab.dataset.tab;
                const activeTab = document.querySelector('.tab.active');
                
                // Remove the tab and its corresponding pane
                tab.remove();
                const pane = document.getElementById(`${tabId}-content`);
                if (pane) pane.remove();
                
                // If closed tab was active, activate first available tab
                if (activeTab === tab && tabs.length > 0) {
                    const firstTab = document.querySelector('.tab');
                    if (firstTab) {
                        switchTab(firstTab.dataset.tab);
                    }
                }
            });
        }
    });
    
    // Activity bar navigation (simulated different views)
    activityIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            activityIcons.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            const view = this.dataset.view;
            // For demo: explorer shows sidebar, others hide it
            const sidebar = document.querySelector('.sidebar');
            if (view === 'explorer') {
                sidebar.style.display = 'flex';
            } else if (view === 'search') {
                sidebar.style.display = 'flex';
                sidebar.querySelector('.sidebar-content').innerHTML = `
                    <div style="padding: 16px;">
                        <input type="text" placeholder="Search files..." style="width: 100%; padding: 8px; background: #3c3c3c; border: none; color: white; border-radius: 4px;">
                        <div style="margin-top: 16px; color: #6a9955;">🔍 Searching across files...</div>
                    </div>
                `;
            } else if (view === 'git') {
                sidebar.style.display = 'flex';
                sidebar.querySelector('.sidebar-content').innerHTML = `
                    <div style="padding: 16px;">
                        <div style="background: #0e639c; padding: 8px; border-radius: 4px; margin-bottom: 12px;">
                            ✓ Git initialized
                        </div>
                        <div>📝 Changes: 3 files</div>
                        <div>🌿 Branch: main</div>
                        <div style="margin-top: 16px;">
                            <button style="background: #0e639c; border: none; color: white; padding: 6px 12px; cursor: pointer;">Commit</button>
                        </div>
                    </div>
                `;
            } else if (view === 'settings') {
                sidebar.style.display = 'flex';
                sidebar.querySelector('.sidebar-content').innerHTML = `
                    <div style="padding: 16px;">
                        <div>⚙️ Theme: Dark+</div>
                        <div>🎨 Font Size: 14px</div>
                        <div>📁 Auto Save: On</div>
                    </div>
                `;
            }
        });
    });
    
    // Terminal typing animation
    const commands = [
        'git status',
        'ls -la',
        'npm start',
        'python --version',
        'echo "Hello World"',
        'cat README.md'
    ];
    
    let commandIndex = 0;
    
    function typeCommand() {
        if (typingTimeout) clearTimeout(typingTimeout);
        
        const command = commands[commandIndex % commands.length];
        let charIndex = 0;
        
        typingCommand.innerHTML = '';
        
        function type() {
            if (charIndex < command.length) {
                typingCommand.innerHTML += command[charIndex];
                charIndex++;
                setTimeout(type, 100);
            } else {
                setTimeout(() => {
                    const terminalOutput = document.createElement('div');
                    terminalOutput.className = 'terminal-output';
                    terminalOutput.innerHTML = `Executing: ${command}`;
                    document.querySelector('.panel-content').appendChild(terminalOutput);
                    
                    setTimeout(() => {
                        const newLine = document.createElement('div');
                        newLine.className = 'terminal-line';
                        newLine.innerHTML = '<span class="prompt">$</span> <span class="command typing" id="typing-command"></span><span class="cursor"></span>';
                        document.querySelector('.panel-content').appendChild(newLine);
                        
                        typingCommand = document.getElementById('typing-command');
                        commandIndex++;
                        typeCommand();
                    }, 1500);
                }, 500);
            }
        }
        
        type();
    }
    
    // Start typing animation
    typeCommand();
    
    // Close terminal functionality
    if (closeTerminalBtn) {
        closeTerminalBtn.addEventListener('click', function() {
            terminal.style.display = 'none';
        });
    }
    
    // Keyboard shortcuts (VS Code style)
    document.addEventListener('keydown', function(e) {
        // Ctrl+Shift+P (Command Palette simulation)
        if (e.ctrlKey && e.shiftKey && e.key === 'P') {
            e.preventDefault();
            alert('Command Palette: Type a command...\n> Open File\n> Run Task\n> Git: Commit');
        }
        
        // Ctrl+S (Save simulation)
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            const activeTab = document.querySelector('.tab.active');
            if (activeTab) {
                const filename = activeTab.querySelector('span').innerText;
                console.log(`Saved: ${filename}`);
                // Visual feedback
                const statusBar = document.querySelector('.status-left');
                const saveMsg = document.createElement('span');
                saveMsg.innerText = '✓ Saved';
                saveMsg.style.color = '#6a9955';
                statusBar.appendChild(saveMsg);
                setTimeout(() => saveMsg.remove(), 2000);
            }
        }
        
        // Ctrl+` (Toggle terminal)
        if (e.ctrlKey && e.key === '`') {
            e.preventDefault();
            if (terminal.style.display === 'none') {
                terminal.style.display = 'flex';
            } else {
                terminal.style.display = 'none';
            }
        }
        
        // Ctrl+Shift+E (Focus Explorer)
        if (e.ctrlKey && e.shiftKey && e.key === 'E') {
            e.preventDefault();
            document.querySelector('.sidebar').focus();
        }
    });
    
    // Add a custom welcome message
    console.log('%c🚀 VS Code Portfolio Loaded', 'color: #4ec9b0; font-size: 16px');
    console.log('%c💡 Tip: Try keyboard shortcuts!', 'color: #ce9178; font-size: 12px');
    
    // Dynamic status bar updates
    setInterval(() => {
        const time = new Date();
        const timeString = time.toLocaleTimeString();
        const statusRight = document.querySelector('.status-right');
        const existingTime = document.querySelector('.status-time');
        
        if (existingTime) existingTime.remove();
        
        const timeSpan = document.createElement('span');
        timeSpan.className = 'status-time';
        timeSpan.innerHTML = `<i class="far fa-clock"></i> ${timeString}`;
        statusRight.appendChild(timeSpan);
    }, 1000);
});

// Optional: Add smooth transitions and mouse tracking for terminal hover effects
document.querySelectorAll('.terminal-line').forEach(line => {
    line.addEventListener('mouseenter', function() {
        this.style.backgroundColor = '#2a2d2e';
    });
    line.addEventListener('mouseleave', function() {
        this.style.backgroundColor = 'transparent';
    });
});
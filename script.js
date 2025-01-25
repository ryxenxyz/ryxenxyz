let windows = {};  // A map to store windows by their ID

document.getElementById("taskbarBtn1").addEventListener("click", function() {
    openOrFocusWindow(1);
});

document.getElementById("taskbarBtn2").addEventListener("click", function() {
    openOrFocusWindow(2);
});

document.getElementById("taskbarBtn3").addEventListener("click", function() {
    openOrFocusWindow(3);
});

function openOrFocusWindow(id) {
    if (!windows[id]) {
        createWindow(id);
    } else {
        bringWindowToFront(id);
    }
}

function createWindow(id) {
    const newWindow = document.createElement("div");
    newWindow.classList.add("window");
    newWindow.dataset.windowId = id;

    if (id === 2) {
        newWindow.innerHTML = `
            <div class="window-header">
                <span class="window-title">Settings</span>
                <div class="window-buttons">
                    <button class="window-btn close-btn">X</button>
                </div>
            </div>
            <div class="window-content">
                <h3>Appearance</h3>
                <div class="setting">
                    <label for="themeSwitcher">Dark Mode:</label>
                    <input type="checkbox" id="themeSwitcher">
                </div>
    
                <h3>Notifications</h3>
                <div class="setting">
                    <label for="notificationsToggle">Enable Notifications:</label>
                    <input type="checkbox" id="notificationsToggle" checked>
                </div>
            </div>
        `;
    
        // Add event listeners for settings
        const themeSwitcher = newWindow.querySelector("#themeSwitcher");
        const notificationsToggle = newWindow.querySelector("#notificationsToggle");
    
        // Check stored theme preference and apply it
        if (localStorage.getItem("theme") === "dark") {
            document.body.classList.add("dark-mode");
            themeSwitcher.checked = true; // Ensure checkbox reflects saved state
        }
    
        // Handle dark mode toggle
        themeSwitcher.addEventListener("change", function () {
            if (themeSwitcher.checked) {
                document.body.classList.add("dark-mode");
                localStorage.setItem("theme", "dark");
            } else {
                document.body.classList.remove("dark-mode");
                localStorage.setItem("theme", "light");
            }
        });
    
        // Handle notifications toggle
        notificationsToggle.addEventListener("change", function () {
            if (notificationsToggle.checked) {
                alert("Notifications Enabled");
            } else {
                alert("Notifications Disabled");
            }
        });
    }
    
    else if (id === 1) {
        newWindow.innerHTML = `
            <div class="window-header">
                <span class="window-title">Firefox</span>
                <div class="window-buttons">
                    <button class="window-btn close-btn">X</button>
                </div>
            </div>
            <div class="window-content">
                <!-- Tabs -->
                <div class="tabs">
                    <button class="tab-button active" id="tab1">Home</button>
                    <button class="tab-button" id="tab2">About</button>
                    <button class="tab-button" id="tab3">Projects</button>
                </div>
    
                <!-- Tab Content -->
                <div class="tab-content">
                    <div class="tab-panel" id="content1">
                        <h2>Welcome to My Portfolio</h2>
                        <p>This is the homepage of my portfolio. Here you can find more about me and my work.</p>
                    </div>
                    <div class="tab-panel" id="content2" style="display:none;">
                        <h2>About Me</h2>
                        <p>This is the About section. Here you will find information about my background and skills.</p>
                    </div>
                    <div class="tab-panel" id="content3" style="display:none;">
                        <h2>Projects</h2>
                        <p>This is the Projects section. Here you can explore the various projects I've worked on.</p>
                    </div>
                </div>
            </div>
        `;
    } else if (id === 3) {
        newWindow.innerHTML = `
            <div class="window-header">
                <span class="window-title">Terminal</span>
                <div class="window-buttons">
                    <button class="window-btn close-btn">X</button>
                </div>
            </div>
            <div class="window-content">
                <div class="terminal">
                    <div class="output">
                        <p>Welcome to Ryxen OS terminal. Type help to get started!</p>
                    </div>
                    <textarea class="input" id="terminalInput" placeholder="Type a command..."></textarea>
                </div>
            </div>
        `;

        // Terminal Input Handler
        const terminalInput = newWindow.querySelector("#terminalInput");
        const terminalOutput = newWindow.querySelector(".output");

        terminalInput.addEventListener("keydown", function(e) {
            if (e.key === "Enter") {
                const command = terminalInput.value.trim();
                terminalInput.value = ""; // Clear the input

                // Handle commands
                if (command === "neofetch") {
                    terminalOutput.innerHTML += `<p><span style="color: #f5c2e7;">$ ${command}</span></p>`;
                    terminalOutput.innerHTML += "<p><span style='color: #f5c2e7;'>Ryxen OS v1.0</span></p>";
                    terminalOutput.innerHTML += "<p>Browser: " + navigator.userAgent + "</p>";
                    terminalOutput.innerHTML += "<p>Packages: 1200</p>";
                } else if (command === "clear") {
                    terminalOutput.innerHTML = ""; // Clear the terminal output
                } else if (command === "help") {
                    terminalOutput.innerHTML += `<p><span style="color: #f5c2e7;">$ ${command}</span></p>`;
                    terminalOutput.innerHTML += "<p><span style='color: #f5c2e7;'>clear</span> - Clears the terminal output.</p>";
                    terminalOutput.innerHTML += "<p><span style='color: #f5c2e7;'>neofetch</span> - Displays system information such as OS version, browser, and package count.</p>";
                } else {
                    terminalOutput.innerHTML += `<p><span style="color: #f5c2e7;">$ ${command}</span></p>`;
                    terminalOutput.innerHTML += "<p>Command not found. Type <span style='color: #f5c2e7;'>help</span> for a list of commands.</p>";
                }

                terminalOutput.scrollTop = terminalOutput.scrollHeight;  // Auto-scroll to the bottom
            }
        });
    } else {
        newWindow.innerHTML = `
            <div class="window-header">
                <span class="window-title">Window ${id}</span>
                <div class="window-buttons">
                    <button class="window-btn close-btn">X</button>
                </div>
            </div>
            <div class="window-content">
                <p>This is the content of Window ${id}</p>
            </div>
        `;
    }

    document.body.appendChild(newWindow);
    windows[id] = newWindow;

    // Enable dragging
    let isDragging = false;
    let offsetX, offsetY;

    newWindow.querySelector(".window-header").addEventListener("mousedown", function(e) {
        isDragging = true;
        offsetX = e.clientX - newWindow.offsetLeft;
        offsetY = e.clientY - newWindow.offsetTop;
        newWindow.style.transition = 'none';  // Disable transition during drag
        newWindow.style.zIndex = 100; // Bring the window to the front while dragging
    });

    window.addEventListener("mousemove", function(e) {
        if (isDragging) {
            newWindow.style.left = e.clientX - offsetX + "px";
            newWindow.style.top = e.clientY - offsetY + "px";
        }
    });

    window.addEventListener("mouseup", function() {
        isDragging = false;
        newWindow.style.transition = 'transform 0.2s ease'; // Re-enable transitions after drag
    });

    // Close button
    const closeButton = newWindow.querySelector(".close-btn");
    closeButton.addEventListener("click", function() {
        newWindow.classList.add("closing");
        setTimeout(() => {
            newWindow.remove();
            delete windows[id];
        }, 300);  // Remove window after animation
    });
}

function bringWindowToFront(id) {
    const windowToFocus = windows[id];
    if (windowToFocus) {
        windowToFocus.style.zIndex = 10; // Bring the focused window to the front
    }
}

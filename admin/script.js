const DB_URL = "https://kvdb.io/6M4Qu1GqwgV8Md14iJd9yj";

// Default Configuration
const defaultConfig = {
    envelopeText: "♡ Letter for You ♡",
    letterTitle: "Will you be my Valentine?",
    finalText: "<strong>Valentine Date:</strong> Meow Restaurant at 7pm. Dress fancy!"
};

// Elements
const loginContainer = document.getElementById('login-container');
const adminContainer = document.getElementById('admin-container');
const loginBtn = document.getElementById('login-btn');
const adminPassInput = document.getElementById('admin-pass');
const loginError = document.getElementById('login-error');

const historyTbody = document.getElementById('history-tbody');
const resetBtn = document.getElementById('reset-stats');

// Format ISO string to readable time
function formatTime(isoString) {
    if (!isoString) return "-";
    const date = new Date(isoString);
    return date.toLocaleString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

// Load and Display Stats
async function loadStats() {
    try {
        const res = await fetch(`${DB_URL}/stats`);
        let valStats = null;
        if (res.ok) {
            valStats = await res.json();
        }
        
        if (!valStats || typeof valStats !== "object") {
            valStats = {
                totalNoClicks: 0,
                totalYesClicks: 0,
                status: "Pending",
                history: []
            };
        }

        // Render history table
        historyTbody.innerHTML = '';
        if (valStats.history && valStats.history.length > 0) {
            // Reverse to show latest first
            const reversedHistory = [...valStats.history].reverse();
            reversedHistory.forEach((item, index) => {
                const tr = document.createElement('tr');
                
                // Index column
                const tdIndex = document.createElement('td');
                tdIndex.textContent = valStats.history.length - index;
                
                // Action column with badge
                const tdAction = document.createElement('td');
                const badge = document.createElement('span');
                badge.textContent = item.action;
                badge.className = item.action.includes('Yes') ? 'badge badge-yes' : 'badge badge-no';
                tdAction.appendChild(badge);
                
                // Time column
                const tdTime = document.createElement('td');
                tdTime.textContent = formatTime(item.time);
                
                tr.appendChild(tdIndex);
                tr.appendChild(tdAction);
                tr.appendChild(tdTime);
                historyTbody.appendChild(tr);
            });
        } else {
            historyTbody.innerHTML = '<tr><td colspan="3" style="text-align: center;">No history yet.</td></tr>';
        }

    } catch (e) {
        console.error("Failed to load stats", e);
        historyTbody.innerHTML = '<tr><td colspan="3" style="text-align: center; color: red;">Failed to load data.</td></tr>';
    }
}

// Reset stats
resetBtn.addEventListener('click', async () => {
    if(confirm("Are you sure you want to clear the history?")) {
        try {
            const defaultStats = {
                totalNoClicks: 0,
                totalYesClicks: 0,
                status: "Pending",
                history: []
            };
            await fetch(`${DB_URL}/stats`, {
                method: 'POST',
                body: JSON.stringify(defaultStats)
            });
            loadStats();
            alert("History cleared successfully!");
        } catch(e) {
            alert("Error clearing history");
        }
    }
});

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    // Check if already logged in this session
    if (sessionStorage.getItem('admin_logged_in')) {
        loginContainer.style.display = 'none';
        adminContainer.style.display = 'block';
        loadStats();
        setInterval(loadStats, 2000);
    }
});

// Login Logic
loginBtn.addEventListener('click', () => {
    if (adminPassInput.value === 'admin123') {
        sessionStorage.setItem('admin_logged_in', 'true');
        loginContainer.style.display = 'none';
        adminContainer.style.display = 'block';
        loginError.style.display = 'none';
        loadStats();
        setInterval(loadStats, 2000);
    } else {
        loginError.style.display = 'block';
    }
});

adminPassInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') loginBtn.click();
});

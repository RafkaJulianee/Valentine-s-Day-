const DB_URL = "https://kvdb.io/6M4Qu1GqwgV8Md14iJd9yj";

// Default Configuration
const defaultConfig = {
    envelopeText: "♡ Letter for You ♡",
    letterTitle: "Will you be my Valentine?",
    finalText: "<strong>Valentine Date:</strong> Meow Restaurant at 7pm. Dress fancy!"
};

// Elements
const statStatus = document.getElementById('stat-status');
const statNo = document.getElementById('stat-no');
const statYes = document.getElementById('stat-yes');
const resetBtn = document.getElementById('reset-stats');

const configForm = document.getElementById('config-form');
const envelopeTextInput = document.getElementById('envelopeText');
const letterTitleInput = document.getElementById('letterTitle');
const finalTextInput = document.getElementById('finalText');

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

        statStatus.textContent = valStats.status;
        statNo.textContent = valStats.totalNoClicks;
        statYes.textContent = valStats.totalYesClicks;

        // Add color logic for status
        if (valStats.status === "Accepted") {
            statStatus.className = "status-accepted";
        } else if (valStats.status === "Rejected") {
            statStatus.className = "status-rejected";
        } else {
            statStatus.className = "";
        }
    } catch (e) {
        console.error("Failed to load stats", e);
    }
}

// Load configurations into form
async function loadConfig() {
    try {
        const res = await fetch(`${DB_URL}/config`);
        let valConfig = defaultConfig;
        if (res.ok) {
            valConfig = await res.json();
        }
        
        envelopeTextInput.value = valConfig.envelopeText || defaultConfig.envelopeText;
        letterTitleInput.value = valConfig.letterTitle || defaultConfig.letterTitle;
        finalTextInput.value = valConfig.finalText || defaultConfig.finalText;
    } catch (e) {
        envelopeTextInput.value = defaultConfig.envelopeText;
        letterTitleInput.value = defaultConfig.letterTitle;
        finalTextInput.value = defaultConfig.finalText;
    }
}

// Reset stats
resetBtn.addEventListener('click', async () => {
    if(confirm("Are you sure you want to reset target statistics?")) {
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
            alert("Statistics reset successfully!");
        } catch(e) {
            alert("Error resetting stats");
        }
    }
});

// Save configurations
configForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const newConfig = {
        envelopeText: envelopeTextInput.value,
        letterTitle: letterTitleInput.value,
        finalText: finalTextInput.value
    };
    
    try {
        const pBtn = document.querySelector('.success-btn');
        pBtn.textContent = "Saving...";
        await fetch(`${DB_URL}/config`, {
            method: 'POST',
            body: JSON.stringify(newConfig)
        });
        pBtn.textContent = "Save Configurations";
        alert("Configurations saved! The user will see these new texts.");
    } catch (e) {
        alert("Error saving configurations");
    }
});

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    loadStats();
    loadConfig();
    
    // Auto-refresh stats every 2 seconds to see live updates
    setInterval(loadStats, 2000);
});

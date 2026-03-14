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
function loadStats() {
    const valStats = JSON.parse(localStorage.getItem('val_stats')) || {
        totalNoClicks: 0,
        totalYesClicks: 0,
        status: "Pending",
        history: []
    };

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
}

// Load configurations into form
function loadConfig() {
    const valConfig = JSON.parse(localStorage.getItem('val_config')) || defaultConfig;
    
    envelopeTextInput.value = valConfig.envelopeText;
    letterTitleInput.value = valConfig.letterTitle;
    finalTextInput.value = valConfig.finalText;
}

// Reset stats
resetBtn.addEventListener('click', () => {
    if(confirm("Are you sure you want to reset target statistics?")) {
        localStorage.removeItem('val_stats');
        loadStats();
        alert("Statistics reset successfully!");
    }
});

// Save configurations
configForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newConfig = {
        envelopeText: envelopeTextInput.value,
        letterTitle: letterTitleInput.value,
        finalText: finalTextInput.value
    };
    
    localStorage.setItem('val_config', JSON.stringify(newConfig));
    alert("Configurations saved! The user will see these new texts.");
});

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    loadStats();
    loadConfig();
    
    // Auto-refresh stats every 2 seconds to see live updates
    setInterval(loadStats, 2000);
});

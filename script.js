// Elements
const envelopeContainer = document.getElementById("envelope-container");
const envelopeTextEl = document.getElementById("envelope-text");
const letter = document.getElementById("letter-container");
const noBtn = document.querySelector(".no-btn");
const yesBtn = document.querySelector(".btn[alt='Yes']");

const title = document.getElementById("letter-title");
const catImg = document.getElementById("letter-cat");
const buttons = document.getElementById("letter-buttons");
const finalText = document.getElementById("final-text");

// Init configuration from localStorage
const defaultConfig = {
    envelopeText: "♡ Letter for You ♡",
    letterTitle: "Will you be my Valentine?",
    finalText: "<strong>Valentine Date:</strong> Meow Restaurant at 7pm. Dress fancy!"
};

const valConfig = JSON.parse(localStorage.getItem('val_config')) || defaultConfig;

// Apply config
envelopeTextEl.innerHTML = valConfig.envelopeText;
title.innerHTML = valConfig.letterTitle;
finalText.innerHTML = valConfig.finalText;

// Stats tracking
let sessionNoClicks = 0;
let valStats = JSON.parse(localStorage.getItem('val_stats')) || {
    totalNoClicks: 0,
    totalYesClicks: 0,
    status: "Pending", // Pending, Accepted, Rejected
    history: []
};

// Save stats helper
function saveStats() {
    localStorage.setItem('val_stats', JSON.stringify(valStats));
}

// Click Envelope

const bgMusic = document.getElementById("bg-music");

envelopeContainer.addEventListener("click", () => {
    bgMusic.play();
    envelopeContainer.style.display = "none";
    letter.style.display = "flex";

    setTimeout( () => {
        document.querySelector(".letter-window").classList.add("open");
    },50);
});

// Logic to move the NO btn

noBtn.addEventListener("click", () => {
    // Get the container
    const container = document.querySelector(".letter-window");

    // Move button to letter-window so it's positioned relative to it
    if (noBtn.parentElement !== container) {
        container.appendChild(noBtn);
        noBtn.style.position = "absolute";
    }

    // Calculate available space
    const maxX = container.clientWidth - noBtn.offsetWidth;
    const maxY = container.clientHeight - noBtn.offsetHeight;

    // Generate random positions
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    // Apply new position with animation
    noBtn.style.transition = "all 0.3s ease";
    noBtn.style.left = randomX + "px";
    noBtn.style.top = randomY + "px";
    
    // Clear transform since we are using top/left now
    noBtn.style.transform = "none";

    // Track logic
    sessionNoClicks++;
    valStats.totalNoClicks++;
    valStats.history.push({ action: "Clicked No", time: new Date().toISOString() });
    
    if (sessionNoClicks >= 3) {
        valStats.status = "Rejected";
        saveStats();
        // Redirect to admin
        window.location.href = "admin/index.html";
        return;
    }
    
    saveStats();
});

// Logic to make YES btn to grow

// let yesScale = 1;

// yesBtn.style.position = "relative"
// yesBtn.style.transformOrigin = "center center";
// yesBtn.style.transition = "transform 0.3s ease";

// noBtn.addEventListener("click", () => {
//     yesScale += 2;

//     if (yesBtn.style.position !== "fixed") {
//         yesBtn.style.position = "fixed";
//         yesBtn.style.top = "50%";
//         yesBtn.style.left = "50%";
//         yesBtn.style.transform = `translate(-50%, -50%) scale(${yesScale})`;
//     }else{
//         yesBtn.style.transform = `translate(-50%, -50%) scale(${yesScale})`;
//     }
// });

// YES is clicked

yesBtn.addEventListener("click", () => {
    title.textContent = "Yippeeee!";

    valStats.totalYesClicks++;
    valStats.status = "Accepted";
    valStats.history.push({ action: "Clicked Yes", time: new Date().toISOString() });
    saveStats();

    catImg.src = "cat_dance.gif";

    document.querySelector(".letter-window").classList.add("final");

    buttons.style.display = "none";
    noBtn.style.display = "none";

    finalText.style.display = "block";
});

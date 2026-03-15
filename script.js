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

const DB_URL = "https://kvdb.io/6M4Qu1GqwgV8Md14iJd9yj";

// Init configuration
const defaultConfig = {
    envelopeText: "♡ Letter for You ♡",
    letterTitle: "Will you be my Valentine?",
    finalText: "<strong>Valentine Date:</strong> Meow Restaurant at 7pm. Dress fancy!"
};

let valStats = {
    totalNoClicks: 0,
    totalYesClicks: 0,
    status: "Pending", // Pending, Accepted, Rejected
    history: []
};

let sessionNoClicks = 0;

async function initData() {
    try {
        const configRes = await fetch(`${DB_URL}/config`);
        if (configRes.ok) {
            const valConfig = await configRes.json();
            envelopeTextEl.innerHTML = valConfig.envelopeText || defaultConfig.envelopeText;
            title.innerHTML = valConfig.letterTitle || defaultConfig.letterTitle;
            finalText.innerHTML = valConfig.finalText || defaultConfig.finalText;
        } else {
            throw new Error("No config");
        }
    } catch (e) {
        envelopeTextEl.innerHTML = defaultConfig.envelopeText;
        title.innerHTML = defaultConfig.letterTitle;
        finalText.innerHTML = defaultConfig.finalText;
    }

    try {
        const statsRes = await fetch(`${DB_URL}/stats`);
        if (statsRes.ok) {
            const fetchedStats = await statsRes.json();
            if (fetchedStats && typeof fetchedStats === "object") {
                valStats = fetchedStats;
                if (!valStats.history) valStats.history = [];
            }
        }
    } catch (e) {
        // use default
    }
}

initData();

// Save stats helper
async function saveStats() {
    try {
        await fetch(`${DB_URL}/stats`, {
            method: 'POST',
            body: JSON.stringify(valStats)
        });
    } catch (e) {
        console.error("Failed to save", e);
    }
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
    
    // As requested, the very first click counts as a choice (if not already "Accepted")
    if (valStats.status === "Pending") {
        valStats.status = "Rejected";
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

    catImg.src = "img/cat_dance.gif";

    document.querySelector(".letter-window").classList.add("final");

    buttons.style.display = "none";
    noBtn.style.display = "none";

    finalText.style.display = "block";
});

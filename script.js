window.onload = () => {
    setTimeout(() => {
        document.body.classList.remove("not-loaded");
        typeMessage();
        createBackgroundFlowers();
        createTulips();
        createFireflies();
    }, 1000);
};

// ==========================
// TYPEWRITER EFFECT
// ==========================
function typeMessage() {
    const text = "";
    const title = document.getElementById("title");
    let i = 0;
    function type() {
        if (i < text.length) {
            title.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, 140);
        }
    }
    type();
}

// ==========================
// SCATTER SOFT BACKGROUND FLOWERS (DEPTH)
// ==========================
function createBackgroundFlowers() {
    const garden = document.querySelector(".garden");
    // Spread across the full width, tucked behind and between the
    // three main plants, at random small scales and heights.
    const spots = [30, 230, 340, 560, 680, 850];

    spots.forEach(left => {
        const scale = 0.3 + Math.random() * 0.16;
        const bottom = 50 + Math.random() * 35;

        // A static, unanimated wrapper handles placement + scale, so it
        // never fights with the plant's own grow/sway animation on
        // `transform` (the same trap that broke bell sizing earlier).
        const wrap = document.createElement("div");
        wrap.className = "bg-wrap";
        wrap.style.left = left + "px";
        wrap.style.bottom = bottom + "px";
        wrap.style.setProperty("--bg-scale", scale.toFixed(2));

        const midX = 75 + Math.random() * 35;
        const midY = 125 + Math.random() * 45;
        const endX = 25 + Math.random() * 25;

        wrap.innerHTML = `
            <div class="plant bg-plant">
                <div class="leaf leaf-a"></div>
                <div class="leaf leaf-b"></div>
                <svg class="stem" viewBox="0 0 140 300" preserveAspectRatio="none">
                    <path class="stem-path" d="M 30 300 Q ${midX.toFixed(0)} ${midY.toFixed(0)} ${endX.toFixed(0)} 15" />
                </svg>
                <div class="bells"></div>
            </div>
        `;

        garden.insertBefore(wrap, garden.firstChild);
    });
}

// ==========================
// CREATE A REALISTIC PURPLE TULIP AT THE TIP OF EACH STEM
// ==========================
function createTulips() {
    document.querySelectorAll(".plant").forEach((plant, idx) => {

        const path = plant.querySelector(".stem-path");
        const container = plant.querySelector(".bells");
        const length = path.getTotalLength();

        // Anchor the flower near the very top of the curve, and sample
        // a point a little further back to read the curve's direction
        // so the bloom tilts naturally with its own stem instead of
        // sitting perfectly upright on every plant.
        const tip = path.getPointAtLength(length * 0.985);
        const before = path.getPointAtLength(length * 0.82);
        const rawAngle = Math.atan2(tip.y - before.y, tip.x - before.x) * (180 / Math.PI);
        const tilt = Math.max(-16, Math.min(16, (rawAngle + 90) * 0.55));

        const wrap = document.createElement("div");
        wrap.className = "tulip-wrap";
        wrap.style.left = tip.x + "px";
        wrap.style.top = tip.y + "px";
        wrap.style.setProperty("--tilt", tilt.toFixed(1) + "deg");
        wrap.style.setProperty("--tulip-scale", (0.9 + Math.random() * 0.22).toFixed(2));
        wrap.style.animationDelay = (0.7 + idx * 0.18) + "s";

        // A small per-flower hue drift keeps a row of tulips from
        // looking like identical stamped copies.
        const hue = (Math.random() * 14 - 7).toFixed(1);
        wrap.innerHTML = tulipSVG(hue);

        container.appendChild(wrap);
    });
}

function tulipSVG(hueDeg) {
    const uid = Math.random().toString(36).slice(2, 9);

    return `
    <svg class="tulip" viewBox="0 0 100 112" style="filter:hue-rotate(${hueDeg}deg)">
        <defs>
            <linearGradient id="tOuter-${uid}" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%"  stop-color="#28103f"/>
                <stop offset="55%" stop-color="#5a2680"/>
                <stop offset="100%" stop-color="#9169b8"/>
            </linearGradient>
            <linearGradient id="tInner-${uid}" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%"  stop-color="#3d1657"/>
                <stop offset="45%" stop-color="#7a3aa3"/>
                <stop offset="100%" stop-color="#cba3df"/>
            </linearGradient>
            <radialGradient id="tBase-${uid}" cx="50%" cy="100%" r="70%">
                <stop offset="0%" stop-color="#160522"/>
                <stop offset="100%" stop-color="#160522" stop-opacity="0"/>
            </radialGradient>
        </defs>

        <!-- calyx / sepal where the flower meets the stem -->
        <path class="calyx" d="M 44 102 Q 50 94 56 102 Q 53 108 50 110 Q 47 108 44 102 Z"/>

        <!-- three outer (back) tepals, in shadow -->
        <g class="petal-outer" fill="url(#tOuter-${uid})">
            <path d="M 50 100 C 30 94 16 70 20 42 C 23 22 36 8 50 2 C 50 36 50 68 50 100 Z"
                  transform="translate(-5,0) rotate(-16 50 100)"/>
            <path d="M 50 100 C 70 94 84 70 80 42 C 77 22 64 8 50 2 C 50 36 50 68 50 100 Z"
                  transform="translate(5,0) rotate(16 50 100)"/>
            <path d="M 50 100 C 38 92 30 64 34 36 C 37 16 44 4 50 -2 C 56 4 63 16 66 36 C 70 64 62 92 50 100 Z"
                  transform="translate(0,3)"/>
        </g>

        <!-- soft cast shadow at the base where petals overlap -->
        <ellipse cx="50" cy="96" rx="22" ry="10" fill="url(#tBase-${uid})"/>

        <!-- three inner (front) tepals, catching the moonlight -->
        <g class="petal-inner" fill="url(#tInner-${uid})">
            <path d="M 50 102 C 34 96 24 72 28 46 C 31 26 40 12 50 6 C 50 38 50 70 50 102 Z"
                  transform="translate(-2,0) rotate(-7 50 102)"/>
            <path d="M 50 102 C 66 96 76 72 72 46 C 69 26 60 12 50 6 C 50 38 50 70 50 102 Z"
                  transform="translate(2,0) rotate(7 50 102)"/>
            <path d="M 50 102 C 41 94 35 68 38 42 C 40 22 45 10 50 4 C 55 10 60 22 62 42 C 65 68 59 94 50 102 Z"/>
        </g>

        <!-- satin sheen catching moonlight along the front petal -->
        <path class="sheen" d="M 46 90 C 42 72 43 48 47 22" opacity=".8"/>
        <path class="sheen" d="M 58 86 C 61 68 60 44 57 20" opacity=".4"/>

        <!-- faint veins for texture -->
        <path class="vein" d="M 50 98 C 50 68 50 38 50 8"/>
        <path class="vein" d="M 42 92 C 40 66 42 38 47 14"/>
        <path class="vein" d="M 58 92 C 60 66 58 38 53 14"/>
    </svg>`;
}

// ==========================
// CREATE FIREFLIES
// ==========================
function createFireflies() {
    const container = document.querySelector(".fireflies");
    for (let i = 0; i < 30; i++) {
        const fly = document.createElement("span");
        fly.className = "firefly";
        fly.style.left = Math.random() * 100 + "vw";
        fly.style.top = Math.random() * 100 + "vh";
        fly.style.animationDuration = (6 + Math.random() * 7) + "s";
        fly.style.animationDelay = Math.random() * 5 + "s";
        container.appendChild(fly);
    }
}

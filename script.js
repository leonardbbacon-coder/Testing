window.onload = () => {
    setTimeout(() => {
        document.body.classList.remove("not-loaded");
        typeMessage();
        createBackgroundFlowers();
        createBells();
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
// CREATE BELLS ALONG THE STEM CURVE
// ==========================
function createBells() {
    document.querySelectorAll(".plant").forEach(plant => {

        const path = plant.querySelector(".stem-path");
        const container = plant.querySelector(".bells");
        const length = path.getTotalLength();

        // Flowers sit along the upper, curved two-thirds of the stem —
        // real lily-of-the-valley leaves the lower stem bare.
        const count = 8;
        const startFrac = 0.42;
        const endFrac = 0.97;

        for (let i = 0; i < count; i++) {

            const frac = startFrac + (endFrac - startFrac) * (i / (count - 1));
            const jitter = (Math.random() - 0.5) * 0.02;
            const pt = path.getPointAtLength(length * (frac + jitter));

            const group = document.createElement("div");
            group.className = "bell-group";

            // Alternate a few px either side of the stem, like flowers
            // attaching at alternating nodes along a real raceme.
            const side = i % 2 === 0 ? 1 : -1;
            const sideOffset = side * (2 + Math.random() * 3);

            group.style.left = (pt.x + sideOffset) + "px";
            group.style.top = pt.y + "px";
            group.style.animationDelay = (0.8 + i * 0.12) + "s";

            const pedicel = document.createElement("div");
            pedicel.className = "pedicel";
            // Pedicels hang basically straight down under gravity,
            // just a little jitter so they don't look mechanical.
            const pedicelHeight = 13 + Math.random() * 6;
            pedicel.style.height = pedicelHeight + "px";
            pedicel.style.transform = `rotate(${side * (4 + Math.random() * 6)}deg)`;

            const bell = document.createElement("div");
            bell.className = "bell";
            bell.style.top = pedicelHeight + "px";
            bell.style.animationDelay = (1 + i * 0.15) + "s";

            const scale = 0.85 + Math.random() * 0.35;
            bell.style.setProperty("--scale", scale.toFixed(2));
            bell.style.transform = `scale(${scale.toFixed(2)})`;

            const dome = document.createElement("div");
            dome.className = "dome";
            bell.appendChild(dome);

            // Six small recurved lobes fanned around the bell's mouth —
            // this is what makes it read as a bell rather than a ball.
            const cx = 7, cy = 15, rx = 6.5, ry = 4;
            for (let l = 0; l < 6; l++) {
                const theta = (20 + l * 28) * (Math.PI / 180);
                const lx = cx + rx * Math.cos(theta) - 2;
                const ly = cy - 2 + ry * Math.sin(theta) - 2.5;

                const lobe = document.createElement("div");
                lobe.className = "lobe";
                lobe.style.left = lx + "px";
                lobe.style.top = ly + "px";
                lobe.style.transform = `rotate(${theta * (180 / Math.PI) - 90}deg)`;
                bell.appendChild(lobe);
            }

            // A subset of bells catch the moonlight as a tiny dewdrop.
            if (Math.random() < 0.4) {
                const dew = document.createElement("div");
                dew.className = "dew";
                dew.style.left = (3 + Math.random() * 4) + "px";
                dew.style.top = (2 + Math.random() * 4) + "px";
                dew.style.animationDelay = Math.random() * 3 + "s";
                dome.appendChild(dew);
            }

            pedicel.appendChild(bell);
            group.appendChild(pedicel);
            container.appendChild(group);
        }
    });
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

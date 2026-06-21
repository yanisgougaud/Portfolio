const projects = document.querySelectorAll(".project");

projects.forEach(project => {

    /* =========================
       CONFIGURATION
    ========================== */
    const REQUIRED_SCORE = 2;
    const DECRYPT_WORD = project.dataset.word.toUpperCase();

    /* =========================
       ELEMENTS
    ========================== */
    const btn = project.querySelector(".btn-decrypt");
    const bar = project.querySelector(".progress-fill");
    const status = project.querySelector(".status");
    const gameArea = project.querySelector(".game-area");
    const link = project.dataset.link;

    let score = 0;
    let gameActive = true;

    /* =========================
       MOT EN FOND
    ========================== */
    const wordOverlay = document.createElement("div");
    wordOverlay.className = "word-overlay";
    wordOverlay.textContent = DECRYPT_WORD;
    project.appendChild(wordOverlay);

    /* =========================
       HEX RANDOM
    ========================== */
    function randomHex() {
        return "0x" + Math.floor(Math.random() * 6554)
            .toString(16)
            .toUpperCase();
    }

    /* =========================
       UI UPDATE
    ========================== */
    function updateUI() {
        status.textContent = `Score : ${score} / ${REQUIRED_SCORE}`;
        bar.style.width = (score / REQUIRED_SCORE) * 100 + "%";
    }

    updateUI();

    /* =========================
       SPAWN PACKETS
    ========================== */
    const spawnInterval = setInterval(() => {
        if (!gameActive) return;

        const packet = document.createElement("div");
        packet.className = "packet";
        packet.textContent = randomHex();

        packet.style.left =
            Math.random() * (gameArea.clientWidth - 55) + "px";
        packet.style.top = "-70px";

        gameArea.appendChild(packet);

        let pos = -70;
        const speed = 2 + Math.random() * 1.2;

        const fall = setInterval(() => {
            pos += speed;
            packet.style.top = pos + "px";

            if (pos > gameArea.clientHeight) {
                clearInterval(fall);
                packet.remove();

                if (gameActive) {
                    score = 0;
                    updateUI();
                }
            }
        }, 30);

        /* =========================
           CLICK PACKET
        ========================== */
        packet.addEventListener("click", () => {
            if (!gameActive) return;

            clearInterval(fall);
            packet.style.pointerEvents = "none";
            packet.classList.add("explode");

            setTimeout(() => packet.remove(), 200);

            score++;
            updateUI();

            if (score >= REQUIRED_SCORE) {
                gameActive = false;
                status.textContent = "FIREWALL PROTÉGÉ ✔";
                btn.disabled = false;

                gameArea
                    .querySelectorAll(".packet")
                    .forEach(p => p.remove());

                wordOverlay.style.display = "flex";
            }
        });

    }, 700);

    /* =========================
       BOUTON DECRYPT
    ========================== */
    btn.addEventListener("click", () => {
        const typed = prompt("Tape le mot de décryptage :");

        if (!typed || typed.toUpperCase() !== DECRYPT_WORD) {
            alert("❌ Mot incorrect");
            return;
        }

        btn.disabled = true;
        status.textContent = "DÉCRYPTAGE...";

        let progress = 0;

        const decryptAnim = setInterval(() => {
            progress += 10;
            bar.style.width = progress + "%";

            if (progress >= 100) {
                clearInterval(decryptAnim);
                status.textContent = "DÉCRYPTÉ ✔";

                setTimeout(() => {
                    window.location.href = link;
                }, 600);
            }
        }, 120);
    });
});

/* =========================================================
   Jeu de décryptage des projets (version d'origine améliorée)
   - score requis propre à chaque projet (data-score)
   - saisie du mot dans la page (plus de prompt / alert)
   - un paquet raté fait perdre 1 point (au lieu de tout remettre à 0)
   - à chaque ouverture de la page, il faut rejouer pour débloquer
   ========================================================= */

/* Les projets ne restent PAS débloqués : à chaque ouverture il faut rejouer.
   (on efface aussi l'ancienne sauvegarde éventuelle) */
try { localStorage.removeItem("portfolio-projets-decryptes"); } catch (e) {}

const games = [];

document.querySelectorAll(".project").forEach(project => {

    /* ---------- Configuration ---------- */
    const ID = project.dataset.id;
    const REQUIRED_SCORE = parseInt(project.dataset.score, 10);
    const DECRYPT_WORD = project.dataset.word.toUpperCase();

    /* ---------- Éléments ---------- */
    const locked = project.querySelector(".locked");
    const unlocked = project.querySelector(".unlocked");
    const status = project.querySelector(".status");
    const bar = project.querySelector(".progress-fill");
    const gameArea = project.querySelector(".game-area");
    const hint = project.querySelector(".game-hint");
    const form = project.querySelector(".decrypt-form");
    const input = form.querySelector("input");
    const btn = form.querySelector(".btn-decrypt");
    const msg = project.querySelector(".decrypt-msg");

    let score = 0;
    let gameActive = true;
    let spawnTimer = null;

    /* ---------- Mot en fond ---------- */
    const wordOverlay = document.createElement("div");
    wordOverlay.className = "word-overlay";
    wordOverlay.textContent = DECRYPT_WORD;
    gameArea.appendChild(wordOverlay);

    function randomHex() {
        return "0x" + Math.floor(Math.random() * 0xffff).toString(16).toUpperCase().padStart(4, "0");
    }

    function updateUI() {
        status.textContent = `Score : ${score} / ${REQUIRED_SCORE}`;
        bar.style.width = (score / REQUIRED_SCORE) * 100 + "%";
    }

    /* ---------- Fin du jeu : firewall protégé ---------- */
    function firewallProtected() {
        gameActive = false;
        clearInterval(spawnTimer);
        gameArea.querySelectorAll(".packet").forEach(p => p.remove());
        status.textContent = "FIREWALL PROTÉGÉ ✔";
        wordOverlay.style.display = "flex";
        input.disabled = false;
        btn.disabled = false;
        msg.style.color = "var(--muted)";
        msg.textContent = "Le mot de décryptage est apparu dans la zone ci-dessus.";
        input.focus({ preventScroll: true });
    }

    /* ---------- Projet débloqué ---------- */
    function showUnlocked(animate) {
        gameActive = false;
        clearInterval(spawnTimer);
        project.classList.add("done");
        status.textContent = "DÉCRYPTÉ ✔";
        locked.hidden = true;
        unlocked.hidden = false;
        if (!animate) unlocked.style.animation = "none";
    }

    function decrypt() {
        input.disabled = true;
        btn.disabled = true;
        msg.textContent = "";
        status.textContent = "DÉCRYPTAGE...";
        let progress = 0;
        bar.style.width = "0%";
        const anim = setInterval(() => {
            progress += 10;
            bar.style.width = progress + "%";
            if (progress >= 100) {
                clearInterval(anim);
                setTimeout(() => showUnlocked(true), 250);
            }
        }, 90);
    }

    /* ---------- Paquets ---------- */
    function spawnPacket() {
        if (!gameActive || document.hidden) return;
        if (hint) hint.style.display = "none";

        const packet = document.createElement("div");
        packet.className = "packet";
        packet.textContent = randomHex();
        packet.style.left = Math.random() * Math.max(0, gameArea.clientWidth - 62) + "px";
        packet.style.top = "-60px";
        gameArea.appendChild(packet);

        let pos = -60;
        const speed = 1.8 + Math.random() * 1.2;

        const fall = setInterval(() => {
            pos += speed;
            packet.style.top = pos + "px";

            if (pos > gameArea.clientHeight) {
                clearInterval(fall);
                packet.remove();
                if (gameActive && score > 0) {
                    score--;
                    updateUI();
                    project.classList.add("hit");
                    setTimeout(() => project.classList.remove("hit"), 250);
                }
            }
        }, 30);

        packet.addEventListener("pointerdown", () => {
            if (!gameActive) return;
            clearInterval(fall);
            packet.style.pointerEvents = "none";
            packet.classList.add("explode");
            setTimeout(() => packet.remove(), 200);
            score++;
            updateUI();
            if (score >= REQUIRED_SCORE) firewallProtected();
        });
    }

    /* ---------- Saisie du mot ---------- */
    form.addEventListener("submit", e => {
        e.preventDefault();
        if (input.value.trim().toUpperCase() === DECRYPT_WORD) {
            decrypt();
        } else {
            msg.style.color = "#ff6b6b";
            msg.textContent = "❌ Mot incorrect — regarde le mot affiché en fond.";
            form.classList.remove("shake");
            void form.offsetWidth;
            form.classList.add("shake");
            input.select();
        }
    });

    /* ---------- Démarrage ---------- */
    updateUI();
    spawnTimer = setInterval(spawnPacket, 750);

    games.push({ unlock: () => showUnlocked(true) });
});

/* Bouton « tout décrypter » pour les visiteurs pressés */
document.getElementById("skip")?.addEventListener("click", e => {
    const btn = e.currentTarget;
    if (btn.classList.contains("done")) return;
    games.forEach(g => g.unlock());
    btn.classList.add("done");
    btn.querySelector(".skip-cmd").textContent = "accès root accordé";
    btn.querySelector(".skip-note").textContent = "// 3 projets décryptés ✓";
});

/* Retour arrière du navigateur : on recharge pour repartir de zéro */
window.addEventListener("pageshow", e => { if (e.persisted) location.reload(); });

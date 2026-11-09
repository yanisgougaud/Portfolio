/* Terminal de compétences (version d'origine améliorée) :
   - effet machine à écrire conservé
   - commandes cliquables, historique avec ↑ / ↓, commandes all et clear
   - le texte tapé est protégé (pas d'injection HTML) */

function typeWriterEffect(element, html, speed = 5) {
    let i = 0;
    let tag = false;
    let text = "";

    function type() {
        text += html[i];
        element.innerHTML = text;

        if (html[i] === "<") tag = true;
        if (html[i] === ">") tag = false;

        i++;
        terminal.scrollTop = terminal.scrollHeight;

        if (i < html.length) {
            setTimeout(type, tag ? 0 : speed);
        }
    }

    type();
}

function escapeHtml(s) {
    return s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

const terminal = document.getElementById("terminal");
const history = [];
let hIndex = 0;

function newLine() {
    const line = document.createElement("div");
    line.classList.add("line");
    line.innerHTML = `<span class="prompt">$</span><input type="text" autocomplete="off" spellcheck="false" aria-label="Commande">`;
    terminal.appendChild(line);
    const input = line.querySelector("input");
    attachListener(input);
    input.focus();
    terminal.scrollTop = terminal.scrollHeight;
}

function run(raw, currentLine) {
    const cmd = raw.trim().toLowerCase();
    if (currentLine) currentLine.remove();

    if (cmd) { history.push(cmd); hIndex = history.length; }

    if (cmd === "clear") {
        terminal.innerHTML = "";
        newLine();
        return;
    }

    const printed = document.createElement("div");
    printed.classList.add("printed-command");
    printed.innerHTML = `$ ${escapeHtml(cmd)}`;
    terminal.appendChild(printed);

    const result = document.createElement("div");
    result.classList.add("output");
    terminal.appendChild(result);

    if (cmd === "all") {
        const all = Object.keys(skills).filter(k => k !== "help").map(k => skills[k]).join("");
        typeWriterEffect(result, all, 2);
    } else if (skills[cmd]) {
        typeWriterEffect(result, skills[cmd], 6);
    } else if (cmd) {
        result.innerHTML = `<p class="error">Commande inconnue : ${escapeHtml(cmd)} — tape help</p>`;
    }

    newLine();
}

function attachListener(input) {
    input.addEventListener("keydown", e => {
        if (e.key === "Enter") run(input.value, input.parentElement);
        if (e.key === "ArrowUp" && hIndex > 0) { hIndex--; input.value = history[hIndex]; e.preventDefault(); }
        if (e.key === "ArrowDown") { hIndex = Math.min(history.length, hIndex + 1); input.value = history[hIndex] || ""; }
    });
}

attachListener(document.getElementById("commandInput"));

/* Commandes cliquables */
document.querySelectorAll(".cmds .cmd").forEach(btn => {
    btn.addEventListener("click", () => {
        const line = terminal.querySelector(".line:last-child");
        run(btn.dataset.cmd, line);
    });
});

/* Cliquer dans le terminal remet le curseur dans la ligne de commande */
terminal.addEventListener("click", e => {
    if (e.target === terminal) terminal.querySelector(".line:last-child input")?.focus();
});

/* Visionneuse plein écran pour les images des projets (clic, flèches, Échap) */
(function () {
    const imgs = Array.from(document.querySelectorAll("[data-zoom]"));
    if (!imgs.length) return;

    const box = document.createElement("div");
    box.className = "lightbox";
    box.innerHTML = `
        <button class="lb-close" aria-label="Fermer">✕</button>
        <button class="lb-prev" aria-label="Image précédente">←</button>
        <img alt="">
        <button class="lb-next" aria-label="Image suivante">→</button>
        <span class="lb-count"></span>`;
    document.body.appendChild(box);

    const big = box.querySelector("img");
    const count = box.querySelector(".lb-count");
    let index = 0;

    function show(i) {
        index = (i + imgs.length) % imgs.length;
        big.src = imgs[index].src;
        big.alt = imgs[index].alt;
        count.textContent = `${index + 1} / ${imgs.length}`;
    }

    function open(i) { show(i); box.classList.add("open"); }
    function close() { box.classList.remove("open"); }

    imgs.forEach((img, i) => img.addEventListener("click", () => open(i)));
    box.querySelector(".lb-close").addEventListener("click", close);
    box.querySelector(".lb-prev").addEventListener("click", e => { e.stopPropagation(); show(index - 1); });
    box.querySelector(".lb-next").addEventListener("click", e => { e.stopPropagation(); show(index + 1); });
    box.addEventListener("click", e => { if (e.target === box) close(); });

    document.addEventListener("keydown", e => {
        if (!box.classList.contains("open")) return;
        if (e.key === "Escape") close();
        if (e.key === "ArrowLeft") show(index - 1);
        if (e.key === "ArrowRight") show(index + 1);
    });
})();

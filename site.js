/* Script commun à toutes les pages du portfolio */

(function () {
    /* Menu mobile */
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".nav");
    if (toggle && nav) {
        toggle.addEventListener("click", () => {
            const open = nav.classList.toggle("open");
            toggle.setAttribute("aria-expanded", open);
        });
    }

    /* Transition douce entre les pages internes */
    document.querySelectorAll("a[href]").forEach(link => {
        const href = link.getAttribute("href");
        const internal = href.endsWith(".html") && !link.target && !href.startsWith("http");
        if (!internal) return;
        link.addEventListener("click", e => {
            if (e.ctrlKey || e.metaKey || e.shiftKey) return;
            e.preventDefault();
            document.body.classList.add("leaving");
            setTimeout(() => (window.location.href = href), 220);
        });
    });

    /* Retour arrière navigateur : on ré-affiche la page */
    window.addEventListener("pageshow", () => document.body.classList.remove("leaving"));

    /* Apparition des blocs au scroll */
    const items = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        items.forEach((el, i) => {
            el.style.transitionDelay = Math.min(i % 6, 5) * 60 + "ms";
            io.observe(el);
        });
    } else {
        items.forEach(el => el.classList.add("visible"));
    }

    /* Année du footer */
    document.querySelectorAll("[data-year]").forEach(el => (el.textContent = new Date().getFullYear()));
})();

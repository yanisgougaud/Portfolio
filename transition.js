function transitionTo(page) {
    document.body.classList.add("fade-out");

    setTimeout(() => {
        window.location.href = page;
    }, 500);
}

document.getElementById("btn-presentation")?.addEventListener("click", () => {
    transitionTo("/Portfolio/presentation/presentation.html");
});

document.getElementById("btn-projets")?.addEventListener("click", () => {
    transitionTo("/Portfolio/projet/projets.html");
});

document.getElementById("btn-competences")?.addEventListener("click", () => {
    transitionTo("/Portfolio/competences/competences.html");
});

document.getElementById("btn-contact")?.addEventListener("click", () => {
    transitionTo("/Portfolio/contact/contact.html");
});
``

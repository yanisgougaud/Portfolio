function transitionTo(page) {
    document.body.classList.add("fade-out");

    setTimeout(() => {
        window.location.href = page;
    }, 500);
}

document.getElementById("btn-presentation")?.addEventListener("click", () => {
    transitionTo("/projetcomplet/presentation/presentation.html");
});

document.getElementById("btn-projets")?.addEventListener("click", () => {
    transitionTo("/projetcomplet/projet/projets.html");
});

document.getElementById("btn-competences")?.addEventListener("click", () => {
    transitionTo("/projetcomplet/competences/competences.html");
});

document.getElementById("btn-contact")?.addEventListener("click", () => {
    transitionTo("/projetcomplet/contact/contact.html");
});
``
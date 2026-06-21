function animateAndGo(animationName, targetPage) {
    document.body.classList.add(animationName);

    setTimeout(() => {
        window.location.href = targetPage;
    }, 500); // durée de l’animation
}

// Boutons
document.getElementById("btn-projets")?.addEventListener("click", () => {
    animateAndGo("fade-out", "projets.html");
});

document.getElementById("btn-competences")?.addEventListener("click", () => {
    animateAndGo("fade-out", "competences.html");
});

document.getElementById("btn-contact")?.addEventListener("click", () => {
    animateAndGo("fade-out", "contact.html");
});

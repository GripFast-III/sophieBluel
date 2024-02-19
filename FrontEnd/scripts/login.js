// Récupération des informations de connexion (email + mot de passe)
document
  .getElementById("loginForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault(); // Empêche la soumission par défaut du formulaire

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Envoi des données au serveur pour l'authentification
    const response = await fetch("http://localhost:5678/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      // L'utilisateur est connecté avec succès, redirigez-le vers une page appropriée
      window.location.href = "dashboard.html";
    } else {
      // Gérer les erreurs d'authentification, par exemple afficher un message d'erreur à l'utilisateur
      console.error("Erreur lors de la connexion:", response.statusText);
    }
  });

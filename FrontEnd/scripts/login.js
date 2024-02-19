// Récupération des informations de connexion (email + mot de passe)
document
  .getElementById("loginForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault(); // Empêche la soumission par défaut du formulaire

    const email = document.getElementById("email-login").value;
    const password = document.getElementById("password-login").value;

    // Envoi des données au serveur pour l'authentification
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      console.log("🚀 ~ .addEventListener ~ response:", response);
      let data = await response.json();
      localStorage.setItem("token", data.token);
      console.log("🚀 ~ .addEventListener ~ data:", data);
      // L'utilisateur est connecté avec succès, redirigez-le vers une page appropriée
      window.location.href = "index.html";
    } else {
      // Gérer les erreurs d'authentification, par exemple afficher un message d'erreur à l'utilisateur
      console.error("Erreur lors de la connexion:", response.statusText);
    }
  });

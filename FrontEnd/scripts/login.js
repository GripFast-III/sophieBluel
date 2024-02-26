// Récupération des informations de connexion (email + mot de passe)
document
  .getElementById("loginForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault(); // Empêche la soumission par défaut du formulaire

    const email = document.getElementById("email-login").value;
    const password = document.getElementById("password-login").value;

    try {
      console.log(
        "Tentative de connexion avec email:",
        email,
        "et mot de passe:",
        password
      ); // console.log à supprimer à la fin du projet et sa mise en ligne

      // Envoi des données au serveur pour l'authentification
      const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      console.log("Réponse du serveur:", response);

      if (response.ok) {
        // console.log("🚀 ~ .addEventListener ~ response:", response);
        console.log("Connexion réussie");
        let data = await response.json();
        localStorage.setItem("token", JSON.stringify(data));

        // L'utilisateur est connecté avec succès et est redirigé vers index.html
        window.location.href = "index.html";
        console.log("🚀 ~ .addEventListener ~ data:", data);
      } else {
        // Si le serveur renvoie une erreur, cela lance le message d'erreur
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      // Affichage du message d'erreur
      console.error("Erreur lors de la connexion :", error.message);
      // Modification du contenu de #error-message
      document.getElementById("error-message").innerText =
        "Erreur lors de la connexion : " + error.message;
      // Pourquoi cela n'affiche que "Erreur lors de la connexion : user not found" quand
      // l'utilisateur est mauvais mais pas quand le mot de passe l'est lui aussi ?
    }
  });

// Ancien code avant modifications
/*try {
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
        // L'utilisateur est connecté avec succès et est redirigé vers index.html
        window.location.href = "index.html";
      } else {
        // Si le serveur renvoie une erreur, cela lance le message d'erreur
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      // Affichage du message d'erreur
      console.error("Erreur lors de la connexion :", error.message);
      // Modification du contenu de #error-message
      document.getElementById("error-message").innerText =
        "Erreur lors de la connexion : " + error.message;

      // Pourquoi cela n'affiche que "Erreur lors de la connexion : user not found" quand
      // l'utilisateur est mauvais mais pas quand le mot de passe est mauvais lui aussi ?
    }
  });
*/

// Code non fonctionnel : s'attend à trouver un "try" à la place de "catch" ligne 113
/*
    try {
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
        if (localStorage.getItem("token")) {
          // Masque le formulaire de connexion
          document.getElementById("login").style.display = "none";
          // L'utilisateur est connecté avec succès et est redirigé vers index.html
          window.location.href = "index.html";
      } else {
        // Si le serveur renvoie une erreur, cela lance le message d'erreur
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    catch (error) {
      // Affichage du message d'erreur
      console.error("Erreur lors de la connexion :", error.message);
      // Modification du contenu de #error-message
      document.getElementById("error-message").innerText =
        "Erreur lors de la connexion : " + error.message;
    }
    }
  };
*/

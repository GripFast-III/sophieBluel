let allWorks = [];
let globalToken = null;

// Méthode check connexion
const isConnected = () => {
  const token = localStorage.getItem("token");
  if (token && token.length) {
    const objectToken = JSON.parse(token);
    console.log("🚀 ~ isConnected ~ objectToken:", objectToken);
    globalToken = objectToken.token;

    return true;
  } else {
    return false;
  }
};

const init = async () => {
  let finalResponseCat = await fetchCategories();
  let finalResponseWorks = await fetchWorks();

  finalResponseCat.unshift({
    id: 0,
    name: "Tous",
  }); // Ajoute un nouvel item dans le array
  console.log("🚀 ~ init ~ finalResponseCat:", finalResponseCat);
  console.log("🚀 ~ init ~ finalResponseWorks:", finalResponseWorks);

  displayWorks(finalResponseWorks);
  allWorks = finalResponseWorks;
  let iAmConnected = isConnected();
  console.log("🚀 ~ init ~ iAmConnected:", iAmConnected);
  if (iAmConnected) {
    // Appelle la fonction pour ajouter l'icône à côté du titre "Mes Projets"
    showBlackBar();
    //addEditModeIconAndText();
    updateLoginLink();
    // Ajout de l'événement de clic à la div parente
    document
      .querySelector(".modifier-clic")
      .addEventListener("click", function (event) {
        if (event.target && event.target.matches(".modifier-text")) {
          displayModal();
        }
      });
  } else {
    displayButtons(finalResponseCat);
  }
};

const addIconToTitle = () => {
  // Vérifie d'abord si des éléments "modifier" existent déjà
  const existingModifierText = document.querySelector(
    ".modifier-clic .modifier-text"
  );
  if (existingModifierText) {
    return; // Si oui, sort de la fonction si des éléments existent déjà et évite de créer un doublon
  }

  const parentDiv = document.querySelector(".modifier-clic");
  // Crée un élément <i> pour l'icône "modifier"
  const icon = document.createElement("i");
  // Ajoute la classe d'icône fa-regular fa-pen-to-square
  icon.classList.add("fa-solid", "fa-pen-to-square");

  // Crée un élément <span> pour le texte "modifier"
  const text = document.createElement("span");
  text.textContent = "modifier";
  // Ajoute une classe au <span>
  text.classList.add("modifier-text");

  // Ajoute l'icône et le texte à la div parente
  parentDiv.appendChild(icon);
  parentDiv.appendChild(text);
};

const showBlackBar = () => {
  // Crée une div pour le bandeau noir
  const blackBar = document.createElement("div");
  const modifierClicContainer = document.createElement("div");
  // Ajoute les styles CSS
  blackBar.classList.add("black-bar");
  modifierClicContainer.classList.add("modifier-clic");
  const template = `<div class="edit-mode-container"><i class="fa-solid fa-pen-to-square" aria-hidden="true"></i><span>Modifier</span></div>`;
  blackBar.innerHTML = template;
  modifierClicContainer.innerHTML = template;
  modifierClicContainer.addEventListener("click", () => displayModal());
  // Insérer le bandeau noir avant le body
  document.body.insertBefore(blackBar, document.body.firstChild);
  const targetTitle = document.querySelector("#project-and-icon");
  targetTitle.appendChild(modifierClicContainer);
};

const addEditModeIconAndText = () => {
  // Créer un élément <i> pour l'icône "Mode édition"
  const icon = document.createElement("i");
  // Ajouter les classes d'icône appropriées
  icon.classList.add("fa-solid", "fa-pen-to-square");

  // Créer un élément <span> pour le texte "Mode édition"
  const textSpan = document.createElement("span");
  textSpan.textContent = "Mode édition";

  // Créer un élément <div> pour contenir l'icône et le texte
  const editModeContainer = document.createElement("div");
  editModeContainer.classList.add("edit-mode-container");

  // Ajouter l'icône et le texte au conteneur
  editModeContainer.appendChild(icon);
  editModeContainer.appendChild(textSpan);

  // Ajouter le conteneur à la black bar
  const blackBar = document.querySelector(".black-bar");
  blackBar.appendChild(editModeContainer);
};

init();

// Etape 1 : Mettre en place les appels au back
// Méthode de récupération des travaux dans le back
async function fetchWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    console.log("🚀 ~ fetchWorks ~ response:", response);
    let worksData = null;
    if (response.ok) worksData = await response.json();
    else throw new Error("Pas de réponse de notre serveur");
    return worksData;
  } catch (error) {
    console.log("🚀 ~ fetchWorks ~ error:", error);
  }
}

// Méthode de récupération des catégories dans le back
async function fetchCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    const categoriesData = await response.json();
    return categoriesData;
  } catch (error) {
    console.log("🚀 ~ fetchCategories ~ error:", error);
    console.error("Erreur lors de la récupération des catégories :", error);
  }
}

// Étape 2 : Ajouter les méthodes display pour afficher les travaux
function displayWorks(works) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = ""; // Efface le contenu précédent de la galerie
  works.forEach((work) => {
    const figure = document.createElement("figure");
    figure.dataset.id = work.id;
    figure.innerHTML = `<img src="${work.imageUrl}" alt="${work.title}"/ ><figcaption>${work.title}</figcaption>`;
    gallery.appendChild(figure);
  });
}

// Étape 3 : Ajouter les méthodes display pour afficher les boutons
function displayButtons(categories) {
  const filters = document.querySelector(".buttons");
  filters.innerHTML = "";

  categories.forEach((category) => {
    const li = document.createElement("li"); // À changer par une creation d'élément avec createElement
    const button = document.createElement("button");
    const paragraph = document.createElement("p"); // Crée un élément <p>
    const buttonText = document.createTextNode(category.name); // Crée un nœud texte avec le nom de la catégorie
    if (category.id == 0) button.classList.add("active");
    button.dataset.idCategory = category.id;

    button.addEventListener("click", () => filterWorksByCategory(category.id));
    //button.textContent = category.name;
    paragraph.appendChild(buttonText); // Ajoute le texte dans l'élément <p>
    button.appendChild(paragraph); // Ajoute l'élément <p> à l'intérieur du "button"
    li.appendChild(button);
    filters.appendChild(li);
  });
}

const filterWorksByCategory = (id) => {
  console.log("id", id);
  console.log("allWorks", allWorks);
  if (id !== 0) {
    let filteredWorks = allWorks.filter((work) => work.categoryId === id);
    console.log("🚀 ~ filterWorksByCategory ~ filteredWorks:", filteredWorks);
    displayWorks(filteredWorks);
  } else {
    displayWorks(allWorks);
  }
};

const buttons = document.querySelectorAll("button");

buttons.forEach((button) => {
  button.addEventListener("click", function () {
    // Supprime la classe 'active' de tous les boutons
    buttons.forEach((btn) => {
      btn.classList.remove("active");
    });

    // Ajoute la classe 'active' au bouton cliqué
    this.classList.add("active");
  });
});

// Méthode du login
const updateLoginLink = () => {
  const loginLink = document.querySelector("nav ul li:nth-child(3) a");
  const modifierButton = document.querySelector(".modifier-clic");

  if (loginLink) {
    const token = localStorage.getItem("token");
    if (token && token.length) {
      loginLink.textContent = "logout";
      loginLink.href = "#";
      loginLink.addEventListener("click", handleLogout);
      modifierButton.style.display = "block"; // Affiche le bouton "modifier" si connecté
    } else {
      loginLink.textContent = "login"; // Change le texte du lien de connexion
      loginLink.href = "#login";
      modifierButton.style.display = "none"; // Cache le bouton "modifier" si déconnecté
    }
  }
};

// Méthode du logout
const handleLogout = () => {
  // Supprime le token du stockage local
  localStorage.removeItem("token");
  // Recharge la page pour revenir à l'état initial => page d'accueil normale
  location.reload();
};

// Gestion de la modale
// Affiche la modale
const displayModal = () => {
  const modal = document.getElementById("myModal");
  const modalBackground = document.getElementById("modalBackground");
  const gallery = document.querySelector(".gallery");
  const clonedGallery = gallery.cloneNode(true); // Clone la galerie avec toutes les <figure>

  // Vide la galerie de la modale
  const galleryModal = document.querySelector(".gallery-modal");
  galleryModal.innerHTML = "";

  // Insère la galerie clonée dans la galerie de la modale
  galleryModal.appendChild(clonedGallery);

  // Affiche la modale et le fond semi-transparent gris (vu en css)
  modal.style.display = "block";
  modalBackground.style.display = "block";

  // Sélectionne tous les éléments <figure> dans la modal
  const figures = document.querySelectorAll(".gallery-modal figure");

  // Création d'une <div class="trash-icon"> pour chaque image dans la modale
  figures.forEach((figure) => {
    // Vérifie si la figure contient déjà une icône de poubelle
    if (!figure.querySelector(".trash-icon")) {
      // Créé une <div class="trash-icon">
      const trashIconDiv = document.createElement("div");
      trashIconDiv.classList.add("trash-icon");
      // Créé une icône trashcan et ajoute la classe appropriée
      const trashIcon = document.createElement("i");
      trashIcon.classList.add("fa-solid", "fa-trash-can");
      trashIcon.dataset.id = figure.dataset.id;

      // Ajoute la <i class="fa-solid fa-trash-can"> à la <div class="trash-icon">
      trashIconDiv.appendChild(trashIcon);

      // Ajoute la <div class="trash-icon" aux <figure>
      figure.appendChild(trashIconDiv);
    }
  });

  // Sélectionne toutes les icônes de trash-icon dans la modal
  const trashIcons = document.querySelectorAll(".trash-icon");

  // Ajoute un gestionnaire d'événements de clic à chaque icône
  /*trashIcons.forEach((trashIcon) => {
    trashIcon.addEventListener("click", function () {
      const figure = this.closest("figure");

      // Supprime la <figure> de la modale
      figure.remove();
    });
  });*/

  // Suppression des médias depuis une route vers le Backend
  trashIcons.forEach((trashIcon) => {
    trashIcon.addEventListener("click", async function (e) {
      const workId = e.target.dataset.id; // Récupère l'ID du travail à supprimer
      const figures = document.querySelectorAll(`figure[data-id="${workId}"]`);

      console.log("🚀 ~ figures:", figures);
      try {
        const response = await fetch(
          `http://localhost:5678/api/works/${workId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${globalToken}`, // Ajoute le token d'authentification si nécessaire
            },
          }
        );

        if (response.ok) {
          // Supprime les éléments du DOM
          figures.forEach((figure) => {
            figure.remove();
          });
        } else {
          // Gère les erreurs de suppression
          console.error(
            "Erreur lors de la suppression du travail:",
            response.statusText
          );
        }
      } catch (error) {
        console.error("Erreur lors de la suppression du travail:", error);
      }
    });
  });

  // Ajoute un écouteur d'événements sur l'élément "modifier"
  const modifierTextElement = document.querySelector(".modifier-text");
  if (modifierTextElement) {
    modifierTextElement.addEventListener("click", displayModal);
  }

  // Masque la modale
  const closeModal = () => {
    const modal = document.getElementById("myModal");
    const modalBackground = document.getElementById("modalBackground");

    // Cache la modale et le fond semi-transparent
    modal.style.display = "none";
    modalBackground.style.display = "none";
  };

  // Empêche le rechargement de la page
  event.preventDefault();

  // Ajoute un événement de clic à la modale pour empêcher la propagation des clics aux éléments enfants
  modal.addEventListener("click", function (event) {
    event.stopPropagation();
  });

  // Ajoute un événement de clic à l'arrière-plan pour fermer la modale si on clique à côté
  document
    .getElementById("modalBackground")
    .addEventListener("click", function (event) {
      closeModal(); // Ferme la modale
    });

  // Ajoute un écouteur d'événements sur l'icône de fermeture de la modale
  document.querySelector(".close").addEventListener("click", closeModal);
};

// Ferme la modale
const closeModal = () => {
  const modal = document.getElementById("myModal");
  const modalBackground = document.getElementById("modalBackground");

  // Cache la modale et le fond semi-transparent
  modal.style.display = "none";
  modalBackground.style.display = "none";
};

// **** Changement du contenu de la modale pour pouvoir ajouter une photo ****

// Fonction pour changer le contenu de la modale lors du clic sur "Ajouter une photo"
const changeModalContent = () => {
  // Ajoute une classe à la galerie pour l'effet de transition
  const modal = document.querySelector(".modal");
  modal.classList.add("slide-left");

  // Supprime le contenu de la galerie après la fin de l'animation
  setTimeout(() => {
    modal.innerHTML = `
      <div class="modal-content add-photo-content">
        <div class="upper-part">
          <div class="return-arrow"></div>
          <h2>Ajout photo</h2>
          <span class="close">&times;</span>
        </div>
        <div class="middle-part">
          <div class="add-gallery">
            <div class="search-photo"><input type="file" id="fileInput" accept="image/*">
          </div>
          <div class="text-photo">
            <div class="title-photo-modal">
              <h3>Titre</h3>
              <input class="title-photo-modal"></input>
            </div>
          </div>
          <div class="category-photo-modal">
            <h3>Catégorie</h3>
            <select class="category-photo-modal">
              <option value="1"></option>
              <option value="2">Objet</option>
              <option value="3">Appartements</option>
              <option value="4">Hotel & restaurants</option>
            </select>
          </div>
        </div>
        </div>
        <div class="lower-part">
          <hr class="separator">
          <div class="submitted">
            <button class="btn-submit" id="return" type="submit" onclick="return closeModal()">Valider</button>
          </div>
        </div>
      </div>
    `;

    // Supprime la classe de transition pour afficher le nouveau contenu sans transition initiale
    modal.classList.remove("slide-left");
  }, 100);
};

// Ajoute un gestionnaire d'événements au bouton "Ajouter une photo" pour appeler la fonction changeModalContent
const addButton = document.getElementById("return");
addButton.addEventListener("click", changeModalContent);

/* *** Gestion de l'ajout d'une photo *** */

// Fonction qui gère le clic sur la zone de recherche de photo
const handleSearchPhotoClick = () => {
  document.getElementById("fileInput").click();
};

// Gestionnaire de changement de fichier sélectionné
document.getElementById("fileInput").addEventListener("change", (event) => {
  const file = event.target.files[0];
  // Avec ça, on peut utiliser le fichier sélectionné par l'utilisateur pour l'afficher ou l'envoyer au serveur
});

// Permet d'ajouter une catégorie au média
const categoryElement = document.querySelector(".category-photo-modal");
const category = categoryElement.value;

// Gestionnaire de clic sur le bouton "Valider"
document.querySelector(".btn-submit").addEventListener("click", async () => {
  // Récupère les valeurs saisies par l'utilisateur
  const title = document.querySelector(".title-photo-modal").value;
  const category = document.querySelector(".category-photo-modal").value; // Vous devez implémenter la logique pour récupérer la catégorie sélectionnée

  // Envoie des données au backend
  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${globalToken}`,
      },
      body: JSON.stringify({
        title: title,
        category: category,
      }),
    });

    if (response.ok) {
      // Réinitialise les champs du formulaire après avoir soumis avec succès les données
      document.querySelector(".title-photo-modal").value = "";
      document.querySelector(".category-photo-modal").value = "";
      // Réinitialise la sélection de l'image si nécessaire

      // Fermer la modale
      closeModal();
    } else {
      console.error("Erreur lors de la soumission des données.");
    }
  } catch (error) {
    console.error("Erreur lors de la soumission des données :", error);
  }
});

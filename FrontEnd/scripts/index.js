let allWorks = [];
let globalToken = null;

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
  if (iAmConnected) {
    // Appelle la fonction pour ajouter l'icône à côté du titre "Mes Projets"
    addIconToTitle();
    showBlackBar();
    addEditModeIconAndText();
    updateLoginLink();
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

// Appel de la fonction pour ajouter les éléments "modifier"
addIconToTitle();

// Ajout de l'événement de clic à la div parente
document
  .querySelector(".modifier-clic")
  .addEventListener("click", function (event) {
    if (event.target && event.target.matches(".modifier-text")) {
      displayModal();
    }
  });

const showBlackBar = () => {
  // Crée une div pour le bandeau noir
  const blackBar = document.createElement("div");
  // Ajoute les styles CSS
  blackBar.classList.add("black-bar");
  // Insérer le bandeau noir avant le body
  document.body.insertBefore(blackBar, document.body.firstChild);
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
    figure.setAttribute("data-categories", work.categoryId);
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

// Méthodes du login
const updateLoginLink = () => {
  const loginLink = document.querySelector("nav ul li:nth-child(3) a");
  if (loginLink) {
    loginLink.textContent = "logout";
    loginLink.href = "#"; // Remplacez '#' par l'URL de déconnexion si nécessaire
    loginLink.addEventListener("click", handleLogout);
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

      // Ajoute la <i class="fa-solid fa-trash-can"> à la <div class="trash-icon">
      trashIconDiv.appendChild(trashIcon);

      // Ajoute la <div class="trash-icon" aux <figure>
      figure.appendChild(trashIconDiv);
    }
  });

  // Sélectionne toutes les icônes de trash-icon dans la modal
  const trashIcons = document.querySelectorAll(".trash-icon");

  // Ajoute un gestionnaire d'événements de clic à chaque icône
  trashIcons.forEach((trashIcon) => {
    trashIcon.addEventListener("click", function () {
      const figure = this.closest("figure");

      // Supprime la <figure> de la modale
      figure.remove();
    });
  });

  // Suppression des éléments <figure> de la modale et donc de la page
  trashIcons.forEach((trashIcon) => {
    trashIcon.addEventListener("click", function () {
      // Récupération de l'élément parent de trash-icon
      const figure = this.closest("figure");

      // Récupére la valeur de data-categories de la <figure>
      const categoryValue = figure.dataset.categories;

      // Supprime la <figure> de la modale
      figure.remove();

      // Supprime également l'élément correspondant sur la page principale
      const mainPageFigures = document.querySelectorAll(
        `.gallery figure[data-categories="${categoryValue}"]`
      );
      if (mainPageFigures) {
        mainPageFigures.forEach((mainPageFigure) => {
          mainPageFigure.remove();
        });
      }
    });
  });

  // Masque la modale
  const closeModal = () => {
    const modal = document.getElementById("myModal");
    const modalBackground = document.getElementById("modalBackground");

    // Cache la modale et le fond semi-transparent
    modal.style.display = "none";
    modalBackground.style.display = "none";
  };

  // Récupére la référence de la modale
  //const modal = document.getElementById("myModal");

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

  // Ajoute un écouteur d'événements sur l'élément "modifier"
  document
    .querySelector(".modifier-text")
    .addEventListener("click", displayModal);

  // Ajoute un écouteur d'événements sur l'icône de fermeture de la modale
  document.querySelector(".close").addEventListener("click", closeModal);

  /*// Ajoute un écouteur d'événements sur le fond semi-transparent de la modale pour détecter les clics à l'extérieur de la modale et fermer la modale
  window.addEventListener("click", (event) => {
    const modal = document.getElementById("myModal");
    if (event.target === modal) {
      closeModal();
    }
  });*/
};

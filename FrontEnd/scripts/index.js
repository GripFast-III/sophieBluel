/*localStorage.setItem(
  "token",
  JSON.stringify(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcxMjU3NTYzMiwiZXhwIjoxNzEyNjYyMDMyfQ.JMUU3pdfTlPYkCjdVx2l0q5J1euB26hIzKKp69VJfO8"
  )
);*/

let allWorks = [];
let globalToken = null;

let errors = {
  fileInput: true,
  title: true,
  category: true,
};

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

  // Ajoute la classe "hide" à la div container-form
  const containerForm = document.querySelector(".container-form");
  containerForm.classList.add("hide");

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

// Étape 1 : Mettre en place les appels au back
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
  console.log("🚀 ~ displayWorks ~ works:", works);
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = ""; // Efface le contenu précédent de la galerie
  works.forEach((work) => {
    const figure = document.createElement("figure");
    figure.dataset.id = work.id;
    figure.innerHTML = `<img src="${work.imageUrl}" class="img-modal" alt="${work.title}"/ ><figcaption>${work.title}</figcaption>`;
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

  // Supprime la classe "hide" de la div container-form
  const containerForm = document.querySelector(".container-form");
  containerForm.classList.remove("hide");

  // Retire également la classe "show" de la div container-form
  containerForm.classList.remove("show");

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

    // Réinitialiser les champs du formulaire
    document.querySelector(".title-photo-modal").value = "";
    document.querySelector(".category-photo-modal").value = "";
    document.getElementById("fileInput").value = "";

    // Ajoute la classe "hide" à la div container-form
    const containerForm = document.querySelector(".container-form");
    containerForm.classList.add("hide");

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
  document
    .querySelector(".close")
    .addEventListener("click", closeModalAndReset);

  // Création d'un objet FormData pour collecter les données à envoyer lors de l'upload de l'image
  document.getElementById("submit-btn").addEventListener("click", function () {
    // Récupération de la valeur du titre
    const titleValue = document.querySelector(".title-photo").value;

    // Récupération de la valeur de la catégorie
    const categoryValue = document.querySelector(".category-photo").value;

    // Sélection du message d'erreur
    const submitErrorDiv = document.getElementById("submit-error");

    // Vérification des valeurs récupérées
    if (titleValue.trim() === "" || categoryValue.trim() === "") {
      // Affiche le message d'erreur si l'un des champs est vide
      submitErrorDiv.textContent = "Veuillez remplir tous les champs.";
      return;
    }

    // Création d'un objet FormData
    const formData = new FormData();

    // Ajout des valeurs du titre et de la catégorie à l'objet FormData
    formData.append("title", titleValue);
    formData.append("category", categoryValue);
  });
};

// Ajoute un gestionnaire d'événements à l'arrière-plan qui fait appel à closeModal()
// et qui réinitialise le visuel lorsque l'on ouvre à nouveau la modale
document
  .getElementById("modalBackground")
  .addEventListener("click", function (event) {
    closeModal();
  });

// **** Gestion de la flèche de retour dans la modale ****
// Sélection de l'icône de retour
const returnArrow = document.querySelector(".fa-arrow-left");

// Ajout d'un gestionnaire d'événements pour le clic sur l'icône de retour
returnArrow.addEventListener("click", function () {
  // Supprime la classe "show" de la div "container-form" et ajoute la classe "hide"
  const containerForm = document.querySelector(".container-form");
  containerForm.classList.remove("show");
  //containerForm.classList.add("hide");

  // Supprime la classe "hide" de la div "modal-content" et ajoute la classe "show"
  const modalContent = document.querySelector(".modal-content");
  modalContent.classList.remove("hide");
  //modalContent.classList.add("show");
});

// Fermeture de la modale
const closeModal = () => {
  const modal = document.getElementById("myModal");
  const modalBackground = document.getElementById("modalBackground");

  // Réinitialise l'image de la modal
  const initialImg = document.getElementById("initialImg");
  initialImg.src = "./assets/icons/add-photo.png";

  // Réinitialise les champs du formulaire
  document.querySelector(".title-photo").value = "";
  document.querySelector(".category-photo").value = "";
  document.getElementById("fileInput").value = "";

  // Supprime la classe "hide" de la div container-form
  const containerForm = document.querySelector(".container-form");
  containerForm.classList.remove("hide");

  // Supprime également la classe "hide" de la div modal-content
  const modalContent = document.querySelector(".modal-content");
  modalContent.classList.remove("hide");

  // Cache la modale et le fond semi-transparent
  modal.style.display = "none";
  modalBackground.style.display = "none";
};

// **** Changement du contenu de la modale pour pouvoir ajouter une photo ****
// Fonction pour changer le contenu de la modale lors du clic sur "Ajouter une photo"
const changeModalContent = () => {
  // Ajoute une classe à la galerie pour l'effet de transition
  const contentModal = document.querySelector(".modal-content");
  const form = document.querySelector(".container-form");
  contentModal.classList.add("hide"); // add/remove
  form.classList.add("show");

  // Gestion de la flèche de retour dans la modale
  // Sélection de l'icône de retour
  const returnArrow = document.querySelector(".fa-arrow-left");
  console.log("🚀 ~ returnArrow:", returnArrow);

  // Ajout d'un gestionnaire d'événements pour le clic sur l'icône de retour
  returnArrow.addEventListener("click", function () {
    console.log("🚀 ~ returnArrow:", returnArrow);
    resetModalFields();
  });
};

// Ajoute un gestionnaire d'événements au bouton "Ajouter une photo" pour appeler la fonction changeModalContent
const addButton = document.getElementById("add-pictures");
addButton.addEventListener("click", () => changeModalContent());
console.log("🚀 ~ addButton:", addButton);

// **** Gestion de l'ajout d'une photo ****
// Fonction qui gère le clic sur la zone de recherche de photo
const handleSearchPhotoClick = () => {
  document.getElementById("fileInput").click();
};

// Gestionnaire de changement de fichier sélectionné
document.getElementById("fileInput").addEventListener("change", (event) => {
  const file = event.target.files[0];
  console.log("🚀 ~ document.getElementById ~ file:", file);
  const limitMax = 4000000;
  const limitOk = file.size < limitMax;
  console.log("🚀 ~ document.getElementById ~ limitOk:", limitOk);
  const types = ["image/jpeg", "image/png"];
  console.log("🚀 ~ document.getElementById ~ types:", types);
  const extentionOk = types.includes(file.type);
  console.log("🚀 ~ document.getElementById ~ extentionOk:", extentionOk);
  const errorHtml = document.querySelector(".errorFile");
  if (!limitOk || !extentionOk) {
    console.log("ko");
    errors.fileInput = true;
    errorHtml.innerHTML =
      "La taille ou le format de votre image est incorrect.";
  } else {
    errorHtml.innerHTML = "";
    console.log("ok");
    errors.fileInput = false;
  }
  checkForm();
});

// Gestionnaire de changement de titre
document.querySelector(".title-photo").addEventListener("input", (event) => {
  let currentTitle = event.target.value;
  console.log("🚀 ~ document.querySelector ~ currentTitle:", currentTitle);
  const titleError = document.getElementById("title-error");
  if (currentTitle.length) {
    titleError.innerHTML = "";
    errors.title = false;
  } else {
    titleError.innerHTML = "Veuillez renseigner un titre";
    errors.title = true;
  }
  checkForm();
});

// Gestionnaire de changement de catégorie
document
  .querySelector(".category-photo")
  .addEventListener("change", (event) => {
    let currentCategory = event.target.value;
    console.log(
      "🚀 ~ document.querySelector ~ currentCategory:",
      currentCategory
    );
    const categoryError = document.getElementById("category-error");
    if (currentCategory !== "0") {
      categoryError.innerHTML = "";
      errors.category = false;
    } else {
      categoryError.innerHTML = "Veuillez sélectionner une catégorie";
      errors.category = true;
    }
    checkForm();
  });

const checkForm = () => {
  const submitButton = document.getElementById("submit-btn");

  // Vérifie si tous les champs requis sont remplis
  if (errors.fileInput || errors.title || errors.category) {
    submitButton.disabled = true;
  } else {
    submitButton.disabled = false;
    submitButton.classList.remove("disabled");
  }
};

// Permet d'ajouter une catégorie au média
const categoryElement = document.querySelector(".category-photo-modal");
const category = categoryElement.value;

// **** Gestion du clic sur le bouton "Valider" ****
const fileInput = document.querySelector("input[type=file]");
const titleInput = document.querySelector(".title-photo");
const categorySelect = document.querySelector(".category-photo");

// Gestion de l'apparition du message d'erreur du btn-submit et de la classe "disabled"
const validationButton = document.getElementById("submit-btn");
//const submitErrorDiv = document.querySelectorAll(".error-message");

validationButton.addEventListener("click", function () {
  console.log("click OK");
  //if (validationButton.classList.contains("disabled")) {
  //submitErrorDiv.innerText = "Veuillez remplir tous les champs.";
  // }
});

// Écouteur d'événement pour vérifier les champs lors de la saisie
fileInput.addEventListener("change", function () {
  // toggleSubmitButton();
  checkForm();
});
titleInput.addEventListener("input", function () {
  // toggleSubmitButton();
  checkForm();
});
categorySelect.addEventListener("change", function () {
  // toggleSubmitButton();
  checkForm();
});

const displayOneWork = (newWork) => {
  console.log("🚀 ~ displayOneWork ~ newWork:", newWork);
  const gallery = document.querySelector(".gallery");
  console.log("🚀 ~ displayOneWork ~ gallery:", gallery);
  const figure = document.createElement("figure");
  figure.dataset.id = newWork.id;
  figure.innerHTML = `<img src="${newWork.imageUrl}" class="img-modal" alt="${newWork.title}"/ ><figcaption>${newWork.title}</figcaption>`;
  gallery.appendChild(figure);
  console.log("🚀 ~ displayOneWork ~ figure:", figure);
};

document.getElementById("submit-btn").addEventListener("click", async () => {
  // Récupère le titre saisi par l'utilisateur
  const titleElement = document.querySelector(".title-photo");
  const category = document.querySelector(".category-photo").value;
  console.log("🚀 ~ document.getElementById ~ category:", category);
  const title = titleElement ? titleElement.value.trim() : "";
  console.log("🚀 ~ document.getElementById ~ title:", title);

  // Envoie des données au backend
  const file = fileInput.files[0];

  // Crée un objet FormData pour envoyer les données au backend
  const formData = new FormData();

  formData.append("title", title);
  formData.append("category", Number(category));
  formData.append("image", file);

  try {
    // Envoie les données au backend via une requête POST
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${globalToken}`,
      },
      body: formData,
    });

    if (response.ok) {
      // Si la requête est réussie, recharge la galerie pour afficher le nouveau média
      let newItem = await response.json();
      console.log("🚀 ~ document.getElementById ~ newItem:", newItem);
      //allWorks.push(newItem); // Intègre le nouvel item dans la liste de tous les travaux (médias)
      displayOneWork(newItem);
      //displayWorks(newWorks);
      closeModalAndReset(); // Ferme la modale et réinitialise les champs
    } else {
      console.error("Erreur lors de l'envoi des données au backend.");
    }
  } catch (error) {
    console.error("Erreur lors de l'envoi des données au backend :", error);
  }
});

// Fonction pour réinitialiser les champs titre et catégorie de la modale
function resetModalFields() {
  const form = document.getElementById("modal_form");
  form.reset(); // Reset l'ensemble des champs en même temps grace au <form< dans le html
}

// Fonction pour fermer la modale et réinitialiser les champs
function closeModalAndReset() {
  closeModal(); // Ferme la modale
  resetModalFields(); // Réinitialise les champs de la modale

  // Réinitialise la valeur de l'input du preview de l'image
  document.getElementById("fileInput").value = "";
}

// Gestionnaire de clic sur la croix "close" de la modale
document.querySelector(".close").addEventListener("click", closeModalAndReset);

/* **** Ajout de l'image téléchargée en mini dans la modal **** */
const input = document.querySelector("input[type=file]");

input.onchange = function () {
  let file = input.files[0];
  drawOnCanvas(file);
};

function drawOnCanvas(file) {
  let reader = new FileReader();
  reader.onload = function (e) {
    let dataURL = e.target.result,
      c = document.querySelector("#canvasTarget"),
      ctx = c.getContext("2d"),
      img = new Image();

    img.onload = function () {
      c.width = img.width;
      c.height = img.height;
      ctx.drawImage(img, 0, 0);
      if (img.width > 200) {
        c.style.maxWidth = "200px";
      }
    };

    img.src = dataURL;
    console.log("dataURL", dataURL);

    const initialImg = document.getElementById("initialImg");
    if (!initialImg) {
      console.error("L'élément initialImg n'a pas été trouvé.");
      return;
    }

    initialImg.src = dataURL;
  };

  reader.readAsDataURL(file);
  console.log("Image chargée dans le canvas avec succès !");
}

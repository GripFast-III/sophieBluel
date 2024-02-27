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
    console.log("créer le bouton modifier");
    showBlackBar();
    addEditModeIconAndText();
    console.log("insérer le bandeau noir en haut de l'écran");

    console.log("modifier le 'login' en 'logout'");

    console.log(
      "ajouter un événement au 'logout' pour réellement se logout => local storage => remove item du token + refresh la page pour retourner à la page normale"
    );
  } else {
    displayButtons(finalResponseCat);
  }
};

const addIconToTitle = () => {
  // Crée un élément <i> pour l'icône "modifier"
  const icon = document.createElement("i");
  // Ajoute la classe d'icône fa-regular fa-pen-to-square
  icon.classList.add("fa-solid", "fa-pen-to-square");

  // Crée un élément <span> pour le texte "modifier"
  const text = document.createElement("span");
  text.textContent = "modifier";
  // Ajoute une classe au <span>
  text.classList.add("modifier-text");

  // Sélectionne l'élément h2 contenant le titre "Mes Projets"
  const titleElement = document.getElementById("project-and-icon");

  // Ajoute l'icône à côté du titre "Mes Projets"
  titleElement.appendChild(icon);
  titleElement.appendChild(text);
};

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
  if (token.length) {
    const objectToken = JSON.parse(token);
    console.log("🚀 ~ isConnected ~ objectToken:", objectToken);
    globalToken = objectToken.token;

    return true;
  } else {
    return false;
  }
};

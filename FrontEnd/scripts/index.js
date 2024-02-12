const init = async () => {
  let finalResponse = await (
    await fetch("http://localhost:5678/api/categories")
  ).json();
  //let response = await fetch("http://localhost:5678/api/categories");
  //let finalResponse = await response.json();
  //Ces deux lignes sont représentées par la ligne 2

  finalResponse.unshift({
    id: 0,
    name: "Tous",
  }); // Ajoute un nouvel item dans le array
  console.log("🚀 ~ init ~ finalResponse:", finalResponse);
};

init();

// Etape 1 : Mettre en place les appels au back
async function fetchWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    const worksData = await response.json();
    return worksData;
  } catch (error) {
    console.log("🚀 ~ fetchWorks ~ error:", error);
    console.error("Erreur lors de la récupération des projets :", error);
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

// Etape 2 : Ajouter les méthodes display pour afficher les travaux
function displayWorks(works) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = ""; // Efface le contenu précédent de la galerie
  works.forEach((work) => {
    const figure = document.createElement("figure");
    figure.setAttribute("data-categories", work.categoryId);
    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;
    const figcaption = document.createElement("figcaption");
    figcaption.textContent = work.title;
    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
}

// Etape 3 : Ajouter les méthodes display pour afficher les boutons
function displayButtons(categories) {
  const nav = document.querySelector("nav ul");
  nav.innerHTML = ""; // Efface le contenu précédent de la navigation
  categories.forEach((category) => {
    const li = document.createElement("li");
    const button = document.createElement("button");
    button.textContent = category.name;
    button.addEventListener("click", () => filterWorksByCategory(category.id));
    li.appendChild(button);
    nav.appendChild(li);
  });
}

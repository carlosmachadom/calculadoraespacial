// Importando los objetos planeta para manejar los datos
import { solarSystem } from "./source/planets.js";
// Importando componente de tarjeta para cada respuesta
import planetCard from "./source/components/planet-card.js";
customElements.define("planet-card", planetCard);

/* Start program */
try {
  const formButton = document.querySelector(".form--button");
  formButton.addEventListener("click", (event) => {
    event.preventDefault();
    removingPrevAnswers();
    startProgram();
    document.querySelector(".calculator--form").reset();
  });

  const closeButton = document.querySelector(".button__close");
  closeButton.addEventListener("click", (event) => {
    event.preventDefault();
    removingPrevAnswers();
    hideAndShowComponents();
  });
} catch (e) {
  console.error(e);
}

// Obteniendo el los planetas deseados por el usuario
function getPlanetsInput() {
  let selectedPlanets = document.querySelectorAll("input[type=checkbox]");
  const planetsWarnText = document.querySelector("div.warn P.planets--warn");
  let selectedPlanetsArray = [...selectedPlanets];
  let realAnswers = [];

  selectedPlanetsArray.forEach((answer) => {
    if (answer.checked) {
      realAnswers.push(answer.value);
    }
  });

  if (realAnswers.length === 0) {
    planetsWarnText.textContent = `Please choose at least one planet`;
    planetsWarnText.style = `color: red; font-size: 1.2rem;`;
  } else {
    planetsWarnText.textContent = "";
    planetsWarnText.style = "";
    return realAnswers;
  }
}

// Get user input weight
function getUserWeight() {
  let userWeight = document.querySelector("#earth");
  let weightValue = parseInt(userWeight.value);
  const weightWarnText = document.querySelector("div.warn P.weight--warn");

  if (userWeight.value === "" || weightValue === 0) {
    weightWarnText.textContent = `Please write a valid number`;
    weightWarnText.style = `color: red; font-size: 1.2rem;`;
  } else {
    weightWarnText.textContent = "";
    weightWarnText.style = "";
    return weightValue;
  }
}

function getUserName() {
  let userName = document.getElementById("user-name");
  if (userName.value !== "") {
    return userName.value;
  }
}

// Calculate weight in other planets
function calculateMyWeight(userW, planetG) {
  const earthGravity = solarSystem[2].gravity;
  let myNewWeight = (userW * planetG) / earthGravity;
  return myNewWeight;
}

// Creating the answer by planet card
function answerListItem(planet, finalUW) {
  let pName = planet.name;
  let pGravity = planet.gravity;
  let pImage = planet.photo;
  let uWeight = finalUW;

  const answerContainer = document.createElement("li");
  answerContainer.classList.add("answer");

  const pCard = document.createElement("planet-card");
  pCard.dataset.name = pName;
  pCard.dataset.img = pImage;
  pCard.dataset.gravity = pGravity;
  pCard.dataset.userWeight = uWeight.toFixed(2);

  answerContainer.appendChild(pCard);

  return answerContainer;
}

// calculating and  pushing each answer to a container
function answersList(chosenPlanets, uWeight) {
  let totalAnswers = [];

  if (chosenPlanets && uWeight) {
    chosenPlanets.forEach((chosenPlanet) => {
      for (let index = 0; index < solarSystem.length; index++) {
        const planet = solarSystem[index];

        if (chosenPlanet === planet.name) {
          let finalUserWeight = calculateMyWeight(uWeight, planet.gravity);
          let answerPlanet = answerListItem(planet, finalUserWeight);
          totalAnswers.push(answerPlanet);
        }
      }
    });

    return totalAnswers;
  }
}

// removing prev answers
function removingPrevAnswers() {
  let answerList = document.querySelector(
    ".answer-container > ul.planets-list"
  );

  if (answerList.innerHTML !== "") {
    let prevAnswers = document.querySelectorAll(
      ".answer-container > ul.planets-list li.answer"
    );

    let answersToDelete = [...prevAnswers];

    answersToDelete.forEach((answer) => {
      answer.remove();
    });
  }
}

function hideAndShowComponents() {
  // Logica de intercambio de pantallas
  const answerSection = document.querySelector("section.answers-section");
  const calculator = document.querySelector("main.calculator");

  if (
    answerSection.classList.contains("hidden-element") &&
    !calculator.classList.contains("hidden-element")
  ) {
    answerSection.classList.remove("hidden-element");
    calculator.classList.add("hidden-element");
  } else {
    answerSection.classList.add("hidden-element");
    calculator.classList.remove("hidden-element");
  }
}

// Main function
function startProgram() {
  // Generando operaciones
  let chosenPlanets = getPlanetsInput();
  let userWeight = getUserWeight();
  let userName = getUserName();
  let finalAnswers = answersList(chosenPlanets, userWeight);

  if (finalAnswers) {
    // Imprimiendo resultados en pantalla
    if (userName) {
      const name = document.querySelector("h2.answer-title .user-name");
      name.textContent = userName;
    }

    const HTMLuserWeight = document.querySelector(
      ".answer-container > p > .user-weight"
    );

    HTMLuserWeight.textContent = `${userWeight}kg`;

    const answerContainer = document.querySelector(
      ".answer-container > ul.planets-list"
    );

    answerContainer.append(...finalAnswers);

    hideAndShowComponents();
  }
}

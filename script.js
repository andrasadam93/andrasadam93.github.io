// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDiJ4J2ePsG82_1kzLJ81VT46GPfYvryrA",
  authDomain: "kariaji-8ef80.firebaseapp.com",
  projectId: "kariaji-8ef80",
  storageBucket: "kariaji-8ef80.firebasestorage.app",
  messagingSenderId: "1043405521016",
  appId: "1:1043405521016:web:45bab0262023b490d5ed8d",
  measurementId: "G-8VGRV3LHGX",
  databaseURL:
    "https://kariaji-8ef80-default-rtdb.europe-west1.firebasedatabase.app",
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const homeScreen = document.getElementById("home-screen");
const gameScreen = document.getElementById("game-screen");
const endScreen = document.getElementById("end-screen");
const passwordPopup = document.getElementById("password-popup");
const passwordInput = document.getElementById("password-input");
const passwordError = document.getElementById("password-error");
const passwordSubmit = document.getElementById("password-submit");
const gameTitle = document.getElementById("game-title");
const leftPanel = document.getElementById("panel-left");
const rightPanel = document.getElementById("panel-right");

let selectedCharacter = "";
let currentStage = 0;
let jsonData = {};
const stages = ["food", "event", "treat"];

// Load data from Firebase
async function loadJsonData() {
  try {
    console.log("Loading data from Firebase...");
    const snapshot = await database.ref("/").once("value");
    jsonData = snapshot.val();
    console.log("Data loaded:", jsonData);
  } catch (error) {
    console.error("Failed to load data from Firebase:", error);
  }
}

const titleText = {
  food: "Válassz, mi legyen a menü?",
  event: "Mit csinálnál inkább szívesen?",
  treat: "Milyen nasit készítsünk?",
};

// Load the current stage's images
function loadStage() {
  const stage = stages[currentStage];
  if (jsonData[selectedCharacter] && jsonData[selectedCharacter][stage]) {
    leftPanel.style.backgroundImage = `url(${jsonData[selectedCharacter][stage]["image-left"]})`;
    rightPanel.style.backgroundImage = `url(${jsonData[selectedCharacter][stage]["image-right"]})`;
    gameTitle.innerHTML = titleText[stage];
    console.log(`Stage loaded: ${stage}`);
  } else {
    console.error("Failed to load stage images. Check database structure.");
  }
}

// Add event listeners to panels for stage progression
[leftPanel, rightPanel].forEach((panel) => {
  panel.addEventListener("click", async (event) => {
    const choice = event.target.id === "panel-left" ? "left" : "right";
    console.log(`User selected: ${choice}`);

    if (
      jsonData[selectedCharacter] &&
      jsonData[selectedCharacter][stages[currentStage]]
    ) {
      jsonData[selectedCharacter][stages[currentStage]].choice = choice;
      currentStage++;

      if (currentStage < stages.length) {
        loadStage(); // Load next stage
      } else {
        console.log("All stages completed. Saving data...");
        try {
          await database
            .ref(`/${selectedCharacter}`)
            .set(jsonData[selectedCharacter]);
          gameScreen.classList.add("hidden");
          document.getElementById("end-screen").classList.remove("hidden");
          console.log("Game completed and data saved.");
        } catch (error) {
          console.error("Failed to save game data to Firebase:", error);
        }
      }
    } else {
      console.error("Invalid stage or character data.");
    }
  });
});

// Handle box click with password validation
document.querySelectorAll(".box").forEach((box) => {
  box.addEventListener("click", async () => {
    selectedCharacter = box.id;
    try {
      const snapshot = await database
        .ref(`/${selectedCharacter}/password`)
        .once("value");
      const correctPassword = snapshot.val();

      passwordPopup.style.display = "flex";
      passwordError.classList.add("hidden");
      passwordInput.value = "";

      passwordSubmit.onclick = () => {
        const inputPassword = passwordInput.value;
        if (inputPassword === correctPassword) {
          console.log("Password correct, starting game...");
          passwordPopup.style.display = "none";
          homeScreen.classList.add("hidden");
          gameScreen.classList.remove("hidden");
          currentStage = 0;
          loadStage();
        } else {
          passwordError.classList.remove("hidden");
        }
      };
    } catch (error) {
      console.error("Error fetching password from Firebase:", error);
    }
  });
});

// Back to Home Button
document.getElementById("back-button").addEventListener("click", () => {
  gameScreen.classList.add("hidden");
  endScreen.classList.add("hidden");
  homeScreen.classList.remove("hidden");
});

document.getElementById("back-button2").addEventListener("click", () => {
  gameScreen.classList.add("hidden");
  endScreen.classList.add("hidden");
  homeScreen.classList.remove("hidden");
});
// Initialize data on page load
loadJsonData();

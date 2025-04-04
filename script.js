const pet = {
  name: "Fluffy",
  hunger: 70,
  happiness: 60,
  energy: 80,
  isSpinning: false,
  isSleeping: false,
  mood: "happy",
};

const inventory = {
  food: 5,
  toy: 3,
  medicine: 2,
};

const petImage = document.getElementById("pet-image");
const hungerBar = document.getElementById("hunger-bar");
const happinessBar = document.getElementById("happiness-bar");
const energyBar = document.getElementById("energy-bar");
const petNameElement = document.getElementById("pet-name");
const logMessages = document.getElementById("log-messages");
const spinBtn = document.getElementById("spin-btn");
const petMoodElement = document.getElementById("pet-mood");

document.getElementById("feed-btn").addEventListener("click", feedPet);
document.getElementById("play-btn").addEventListener("click", playWithPet);
document.getElementById("sleep-btn").addEventListener("click", toggleSleep);
document.getElementById("clean-btn").addEventListener("click", cleanPet);
spinBtn.addEventListener("click", spinPet);

document.querySelectorAll(".inventory-item").forEach((item) => {
  item.addEventListener("click", useItem);
});

petImage.addEventListener("click", () => {
  if (!pet.isSpinning && !pet.isSleeping) {
    pet.happiness = Math.min(100, pet.happiness + 5);
    updateStats();
    addLogMessage(`You petted ${pet.name}! ${pet.name} loves attention!`);
    updateMoodIndicator();
  }
});

function initPet() {
  updateStats();
  updateMoodIndicator();
  petNameElement.textContent = pet.name;
  setInterval(updatePetStats, 5000);
  addLogMessage(`Welcome to Virtual Pet Care! Take good care of ${pet.name}!`);
  setupTooltips();
  initTheme();
}

function updateStats() {
  hungerBar.style.width = `${pet.hunger}%`;
  happinessBar.style.width = `${pet.happiness}%`;
  energyBar.style.width = `${pet.energy}%`;

  hungerBar.style.backgroundColor = getStatColor(pet.hunger);
  happinessBar.style.backgroundColor = getStatColor(pet.happiness);
  energyBar.style.backgroundColor = getStatColor(pet.energy);

  updatePetMood();
  updateMoodIndicator();
}

function getStatColor(value) {
  if (value < 30) return "#EF476F";
  if (value < 70) return "#FFD166";
  return "#06D6A0";
}

function updatePetStats() {
  if (pet.isSleeping) {
    pet.energy = Math.min(100, pet.energy + 10);
    pet.hunger = Math.max(0, pet.hunger - 5);
    addLogMessage(`${pet.name} is sleeping and recovering energy.`);
  } else {
    pet.hunger = Math.max(0, pet.hunger - 5);
    pet.happiness = Math.max(0, pet.happiness - 3);
    pet.energy = Math.max(0, pet.energy - 2);
  }

  checkCriticalLevels();
  updateStats();
}

function checkCriticalLevels() {
  if (pet.hunger <= 10) {
    addLogMessage(`⚠️ ${pet.name} is VERY hungry! Please feed ${pet.name}!`);
    showToast(`${pet.name} is very hungry!`, "warning");
  }
  if (pet.happiness <= 10) {
    addLogMessage(`⚠️ ${pet.name} is VERY sad! Play with ${pet.name}!`);
    showToast(`${pet.name} is very sad!`, "warning");
  }
  if (pet.energy <= 10) {
    addLogMessage(`⚠️ ${pet.name} is VERY tired! Let ${pet.name} sleep!`);
    showToast(`${pet.name} is very tired!`, "warning");
  }
}

function updatePetMood() {
  const avgStat = (pet.hunger + pet.happiness + pet.energy) / 3;

  if (pet.isSleeping) {
    pet.mood = "sleeping";
  } else if (avgStat > 70) {
    pet.mood = "happy";
  } else if (avgStat > 40) {
    pet.mood = "neutral";
  } else {
    pet.mood = "sad";
  }
}

function updateMoodIndicator() {
  petMoodElement.className = "";
  petMoodElement.classList.add("mood-" + pet.mood);

  switch (pet.mood) {
    case "happy":
      petMoodElement.innerHTML = '<i class="fas fa-laugh-beam"></i>';
      break;
    case "neutral":
      petMoodElement.innerHTML = '<i class="fas fa-meh"></i>';
      break;
    case "sad":
      petMoodElement.innerHTML = '<i class="fas fa-sad-tear"></i>';
      break;
    case "sleeping":
      petMoodElement.innerHTML = '<i class="fas fa-moon"></i>';
      break;
    default:
      petMoodElement.innerHTML = '<i class="fas fa-question"></i>';
  }
}

function addLogMessage(message) {
  const messageElement = document.createElement("div");
  messageElement.className = "log-message";
  messageElement.innerHTML = `[${new Date().toLocaleTimeString()}] ${message}`;
  logMessages.prepend(messageElement);

  if (logMessages.children.length > 50) {
    logMessages.removeChild(logMessages.lastChild);
  }
}

function showToast(message, type = "", duration = 3000) {
  const toast = document.getElementById("toast");
  let icon = "";
  switch (type) {
    case "success":
      icon = '<i class="fas fa-check-circle"></i>';
      break;
    case "warning":
      icon = '<i class="fas fa-exclamation-triangle"></i>';
      break;
    case "error":
      icon = '<i class="fas fa-times-circle"></i>';
      break;
    default:
      icon = '<i class="fas fa-info-circle"></i>';
  }

  toast.innerHTML = `${icon} ${message}`;
  toast.className = "toast";
  if (type) toast.classList.add(type);
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, duration);
}

function feedPet() {
  if (pet.isSleeping) {
    showToast(`${pet.name} is sleeping and can't eat now`, "warning");
    return;
  }

  if (inventory.food > 0) {
    pet.hunger = Math.min(100, pet.hunger + 20);
    inventory.food--;
    updateItemCount("food");
    updateStats();
    showToast(`You fed ${pet.name}!`, "success");
    addLogMessage(`You fed ${pet.name}. ${pet.name} looks happy!`);
  } else {
    showToast("No food left in inventory!", "error");
    addLogMessage(`You don't have any food in your inventory!`);
  }
}

function playWithPet() {
  if (pet.isSleeping) {
    showToast(
      `${pet.name} is sleeping and doesn't want to play now`,
      "warning"
    );
    return;
  }

  if (pet.energy < 20) {
    showToast(`${pet.name} is too tired to play right now`, "warning");
    return;
  }

  if (inventory.toy > 0) {
    pet.happiness = Math.min(100, pet.happiness + 25);
    pet.energy = Math.max(0, pet.energy - 15);
    inventory.toy--;
    updateItemCount("toy");
    updateStats();
    showToast(`You played with ${pet.name}!`, "success");
    addLogMessage(`You played with ${pet.name}. ${pet.name} loved it!`);
  } else {
    showToast(`You don't have any toys in your inventory!`, "error");
  }
}

function toggleSleep() {
  pet.isSleeping = !pet.isSleeping;

  if (pet.isSleeping) {
    petImage.style.opacity = "0.7";
    showToast(`${pet.name} went to sleep`, "success");
    addLogMessage(`${pet.name} went to sleep. Zzz...`);
  } else {
    petImage.style.opacity = "1";
    showToast(`${pet.name} woke up!`, "success");
    addLogMessage(`${pet.name} woke up!`);
  }

  updatePetMood();
  updateMoodIndicator();
}

function cleanPet() {
  pet.happiness = Math.min(100, pet.happiness + 10);
  updateStats();
  showToast(`You cleaned ${pet.name}!`, "success");
  addLogMessage(`You cleaned ${pet.name}. ${pet.name} is fresh and clean now!`);
}

function spinPet() {
  if (pet.isSpinning) return;

  if (pet.energy < 10) {
    showToast(`${pet.name} is too tired to spin right now`, "warning");
    return;
  }

  pet.isSpinning = true;
  spinBtn.disabled = true;
  petImage.src = "assets/pet_spinning.gif";
  pet.energy = Math.max(0, pet.energy - 10);
  updateStats();
  showToast(`${pet.name} is spinning!`, "success");
  addLogMessage(`${pet.name} is spinning! So much fun!`);

  setTimeout(() => {
    pet.isSpinning = false;
    spinBtn.disabled = false;
    petImage.src = "assets/pet_normal.gif";
    addLogMessage(`${pet.name} stopped spinning. A little dizzy now!`);
  }, 3000);
}

function useItem(event) {
  const itemType = event.currentTarget.dataset.type;

  if (inventory[itemType] <= 0) {
    showToast(`You don't have any ${itemType} left!`, "error");
    return;
  }

  switch (itemType) {
    case "food":
      pet.hunger = Math.min(100, pet.hunger + 15);
      showToast("Used food", "success");
      break;
    case "toy":
      pet.happiness = Math.min(100, pet.happiness + 20);
      pet.energy = Math.max(0, pet.energy - 10);
      showToast("Used toy", "success");
      break;
    case "medicine":
      pet.hunger = Math.min(100, pet.hunger + 5);
      pet.happiness = Math.min(100, pet.happiness + 5);
      pet.energy = Math.min(100, pet.energy + 5);
      showToast("Used medicine", "success");
      break;
  }

  inventory[itemType]--;
  updateItemCount(itemType);
  updateStats();
}

function updateItemCount(itemType) {
  const itemElement = document.querySelector(
    `.inventory-item[data-type="${itemType}"] .item-count`
  );
  itemElement.textContent = inventory[itemType];
  itemElement.classList.add("count-update");
  setTimeout(() => {
    itemElement.classList.remove("count-update");
  }, 300);
}

function setupTooltips() {
  const items = document.querySelectorAll(".inventory-item");

  items.forEach((item) => {
    const type = item.dataset.type;
    let description = "";

    switch (type) {
      case "food":
        description = "Restores 15 hunger";
        break;
      case "toy":
        description = "Restores 20 happiness\nUses 10 energy";
        break;
      case "medicine":
        description = "Restores 5 to all stats";
        break;
    }

    item.setAttribute("title", description);
  });
}

function initTheme() {
  const themeLight = document.getElementById("theme-light");
  const themeDark = document.getElementById("theme-dark");
  const themeSystem = document.getElementById("theme-system");

  const savedTheme = localStorage.getItem("theme") || "system";
  setTheme(savedTheme);

  themeLight.addEventListener("click", () => setTheme("light"));
  themeDark.addEventListener("click", () => setTheme("dark"));
  themeSystem.addEventListener("click", () => setTheme("system"));
}

function setTheme(theme) {
  localStorage.setItem("theme", theme);

  if (theme === "system") {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    document.documentElement.setAttribute(
      "data-theme",
      prefersDark ? "dark" : ""
    );
  } else {
    document.documentElement.setAttribute(
      "data-theme",
      theme === "dark" ? "dark" : ""
    );
  }
}

window.onload = initPet;

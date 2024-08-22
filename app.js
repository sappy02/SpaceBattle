class Player {
  constructor(name, hull, firepower, accuracy, image) {
    this.name = name;
    this.hull = hull;
    this.firepower = firepower;
    this.accuracy = accuracy;
    this.image = image;
  }

  attack(target) {
    if (Math.random() < this.accuracy) {
      target.takeDamage(this.firepower);
      console.log(`${this.name} hits ${target.name} for ${this.firepower} damage!`);
      return true; // Hit
    } else {
      console.log(`${this.name} missed!`);
      return false; // Miss
    }
  }
  takeDamage(damage) {
    this.hull -= damage;
    if (this.hull <= 0) {
      console.log(`${this.name} has been destroyed!`);
    }
  }
  isDestroyed() {
    return this.hull <= 0;
  }
}

let ussAssembly = new Player("USS_Assembly", 20, 5, 0.7, 'https://icon2.cleanpng.com/20180329/kww/avcqjcpzl.webp');
let currentRound = 1;
let isPlayerTurn = true;
let alienHorde = [];
let currentAlienIndex = 0;

const alienImages = [
  'https://icon2.cleanpng.com/lnd/20240702/vqv/a7ug7qr72.webp',
  'https://icon2.cleanpng.com/20230613/htx/transparent-spaceship-1711120358210.webp',
  'https://icon2.cleanpng.com/20190722/pfg/kisspng-helicopter-rotor-firearm-vertical-flight-society-g-5d35de1569cf40.9674545915638113494334.jpg',
  'https://icon2.cleanpng.com/20190712/xfh/kisspng-halo-4-halo-3-halo-5-guardians-master-chief-halo-5d2822a5ece5a3.9989408215629113979703.jpg',
  'https://icon2.cleanpng.com/20180702/vgt/aaxgajkw3.webp',
  'https://icon2.cleanpng.com/20180427/fbw/avty1mgd8.webp'
];
const generateAlien = (index) => {
  return new Player(
    `Alien_${Math.floor(Math.random() * 1000)}`, // Unique name
    generateRandomNumber(3, 6), // hull
    generateRandomNumber(2, 4), // firepower
    Math.random() * (0.8 - 0.6) + 0.6, // accuracy
    alienImages[index] // image
  );
};
const generateRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const updateScoreboard = () => {
  document.querySelector('.rndCnt').textContent = currentRound;
  document.querySelector('.playerHealth').style.width = `${(ussAssembly.hull / 20) * 100}%`;
  document.querySelector('.alienHealth').style.width = `${(alienHorde.reduce((total, alien) => total + alien.hull, 0) / (alienHorde.length * 6)) * 100}%`;
};
const displayPlayer = () => {
  document.querySelector('.hero').innerHTML = `
    <img src="${ussAssembly.image}" alt="${ussAssembly.name}" />
    <div class="player-stats">
      <h2>USS Assembly</h2>
      <p>Hull: <span class="player-hull">${ussAssembly.hull}</span></p>
      <p>Firepower: <span class="player-firepower">${ussAssembly.firepower}</span></p>
      <p>Accuracy: <span class="player-accuracy">${ussAssembly.accuracy}</span></p>
    </div>
  `;
  document.querySelector(`.turn`).textContent = isPlayerTurn ? 'Player' : 'Alien';
};

const displayAliens = () => {
  const aliensContainer = document.querySelector('.p1');
  aliensContainer.innerHTML = '';
  alienHorde.forEach((alien, index) => {
    const alienElement = document.createElement('div');
    alienElement.classList.add('alien');
    alienElement.innerHTML = `
      <img src="${alien.image}" alt="${alien.name}" />
      <div class="alien-stats">
        <h2>Alien Ship ${index + 1}</h2>
        <p>Hull: <span class="alien-hull">${alien.hull}</span></p>
        <p>Firepower: <span class="alien-firepower">${alien.firepower}</span></p>
        <p>Accuracy: <span class="alien-accuracy">${alien.accuracy.toFixed(2)}</span></p>
      </div>
    `;
    aliensContainer.appendChild(alienElement);
  });
};

const gameLoop = () => {
  if (ussAssembly.isDestroyed() || alienHorde.every((alien) => alien.isDestroyed())) {
    endGame();
    return;
  }

  updateScoreboard();
  displayPlayer();
  displayAliens();

  if (isPlayerTurn) {
    // Player's turn
    let targetAlien = alienHorde[currentAlienIndex];
    if (targetAlien && !targetAlien.isDestroyed()) {
      if (ussAssembly.attack(targetAlien)) {
        if (targetAlien.isDestroyed()) {
          console.log('Alien is destroyed!');
          if (currentAlienIndex < alienHorde.length - 1) {
            if (confirm("Alien destroyed! Do you want to attack the next alien?")) {
              currentAlienIndex++;
            } else {
              endGame();
              return;
            }
          } else {
            endGame();
            return;
          }
        }
      }
    }
  } else {
    // Alien's turn
    let attackingAlien = alienHorde[currentAlienIndex];
    if (attackingAlien && !attackingAlien.isDestroyed()) {
      attackingAlien.attack(ussAssembly);
    }
  }

  isPlayerTurn = !isPlayerTurn;
  setTimeout(gameLoop, 1000); // Adjust the delay as needed
};

const endGame = () => {
  if (ussAssembly.isDestroyed()) {
    console.log("You lose!");
  } else {
    console.log("You win!");
  }
};

const startGame = () => {
  currentRound = 1;
  isPlayerTurn = true;
  currentAlienIndex = 0;
  ussAssembly = new Player("USS_Assembly", 20, 5, 0.7, 'https://icon2.cleanpng.com/20180329/kww/avcqjcpzl.webp');
  alienHorde = Array(6).fill().map((_, index) => generateAlien(index));
  gameLoop();
 console.log (alienHorde)
  
};

const add_round = () => {
  currentRound++;
  updateScoreboard();
  alienHorde.push(generateAlien(alienHorde.length % alienImages.length));
  gameLoop();
};

const toggleTurn = () => {
  isPlayerTurn = !isPlayerTurn;
};
const attack = () => {
  if (isPlayerTurn) {
    let targetAlien = alienHorde[currentAlienIndex];
    if (targetAlien && !targetAlien.isDestroyed()) {
      ussAssembly.attack(targetAlien);
      if (targetAlien.isDestroyed()) {
        console.log('Alien is destroyed!');
        if (currentAlienIndex < alienHorde.length - 1) {
          currentAlienIndex++;
        } else {
          endGame();
          return;
        }
      }
    }
    isPlayerTurn = false;
    setTimeout(gameLoop, 1000); // Proceed to the next turn
  }
};

const retreat = () => {
  alert("You have retreated! Game over.");
  endGame();
};

document.querySelector('.starter').addEventListener('click', startGame);
document.querySelector('.starter:nth-of-type(2)').addEventListener('click', attack);
document.querySelector('.starter:nth-of-type(3)').addEventListener('click', retreat);
document.querySelector('.starter:nth-of-type(4)').addEventListener('click', add_round);
document.querySelector('.starter:nth-of-type(5)').addEventListener('click', toggleTurn);
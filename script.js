const YOUR_SHIP = document.querySelector('.player-shooter');
const PLAY_AREA = document.querySelector('#main-play-area');
const ALIENS_IMG = [
    'img/monster-1.png',
    'img/monster-2.png',
    'img/monster-3.png'
];
const INSTRUCTIONS_TEXT = document.querySelector('.game-instructions');
const START_BUTTON = document.querySelector('.start-button');
let alienInterval;

function flyShip(event) {
    if(event.key === 'ArrowUp') {
        event.preventDefault();
        moveUp();
    } else if(event.key === 'ArrowDown') {
        event.preventDefault();
        moveDown();
    } else if(event.key === ' ') {
        event.preventDefault();
        fireLaser();
    }
}

function moveUp() {
    let topPosition = getComputedStyle(YOUR_SHIP).getPropertyValue('top');
    if(topPosition === '0px') {
        return;
    } else {
        let position = parseInt(topPosition);
        position -= 25;
        YOUR_SHIP.style.top = `${position}px`;
    }
}

function moveDown() {
    let topPosition = getComputedStyle(YOUR_SHIP).getPropertyValue('top');
    if(topPosition === '525px') {
        return;
    } else {
        let position = parseInt(topPosition);
        position += 25;
        YOUR_SHIP.style.top = `${position}px`;
    }
}

function fireLaser() {
    let laser = createLaserElement();
    PLAY_AREA.appendChild(laser);
    moveLaser(laser);
}

function createLaserElement() {
    let xPosition = parseInt(window.getComputedStyle(YOUR_SHIP).getPropertyValue('left'));
    let yPosition = parseInt(window.getComputedStyle(YOUR_SHIP).getPropertyValue('top'));
    let newLaser = document.createElement('img');
    newLaser.src = 'img/shoot.png';
    newLaser.classList.add('laser');
    newLaser.style.left = `${xPosition}px`;
    newLaser.style.top = `${yPosition - 15}px`;
    return newLaser;
}

function moveLaser(laser) {
    let laserInterval = setInterval(() => {
        let xPosition = parseInt(laser.style.left);
        let aliens = document.querySelectorAll('.alien');

        aliens.forEach((alien) => {
            if(checkLaserCollision(laser, alien)) {
                alien.src = 'img/explosion.png';
                alien.classList.remove('alien');
                alien.classList.add('dead-alien');
            }
        });

        if(xPosition === 500) {
            laser.remove();
        } else {
            laser.style.left = `${xPosition + 8}px`;
        }
    }, 10);
}

function createAliens() {
    let newAlien = document.createElement('img');
    let alienSprite = ALIENS_IMG[Math.floor(Math.random() * ALIENS_IMG.length)];
    newAlien.src = alienSprite;
    newAlien.classList.add('alien');
    newAlien.classList.add('alien-transition');
    newAlien.style.left = '400px';
    newAlien.style.top = `${Math.floor(Math.random() * 410) + 30}px`;
    PLAY_AREA.appendChild(newAlien);
    moveAlien(newAlien);
}

function moveAlien(alien) {
    let moveAlienInterval = setInterval(() => {
        let xPosition = parseInt(window.getComputedStyle(alien).getPropertyValue('left'));

        if(xPosition <= 50) {
            if(Array.from(alien.classList).includes('dead-alien')) {
                alien.remove()
            } else {
                gameOver();
            }
        } else {
            alien.style.left = `${xPosition - 4}px`;
        }
    }, 30)
}

function checkLaserCollision(laser, alien) {
    let laserTop = parseInt(laser.style.top);
    let laserLeft = parseInt(laser.style.left);
    let laserBottom = laserTop - 20;
    let alienTop = parseInt(alien.style.top);
    let alienLeft = parseInt(alien.style.left);
    let alienBottom = alienTop - 30;

    if(laserLeft != 500 && laserLeft + 40 != alienLeft) {
        if(laserTop <= alienTop && laserTop >= alienBottom) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

START_BUTTON.addEventListener('click', (event) => {
    playGame();
});

function playGame() {
    START_BUTTON.style.display = 'none';
    INSTRUCTIONS_TEXT.style.display = 'none';
    window.addEventListener('keydown', flyShip);
    alienInterval = setInterval(() => {
        createAliens();
    }, 2000);
}

function gameOver() {
    window.removeEventListener('keydown', flyShip);
    clearInterval(alienInterval);
    let aliens = document.querySelectorAll('.alien');
    aliens.forEach((alien) => alien.remove());
    let lasers = document.querySelectorAll('.laser');
    lasers.forEach((laser) => laser.remove()); 
    setTimeout(() => {
        alert('Game Over!');
        YOUR_SHIP.style.stop = '250px';
        START_BUTTON.style.display = 'block';
        INSTRUCTIONS_TEXT.style.display = 'block';
    });
}

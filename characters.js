//board
let backgroundMusic;

let chocolateupanim;
let chocolateleftanim;
let chocolatedrightanim;
let chocolatedownanim;
let pacmanNormalImage;
let pacmanAnimToggle = false;

let board;
const rowCount = 21;
const columnCount = 19;
const tileSize = 32;
const boardWidth = columnCount * tileSize;
const boardHeight = rowCount * tileSize;const offsetX = (1505 - boardWidth) / 2;  // center horizontally
const offsetY = (694 - boardHeight) / 2;  // center verticallylet context;

let backgroundImage;
let blueGhostImage;
let orangeGhostImage;
let pinkGhostImage;
let redGhostImage;
let pacmanUpImage;
let pacmanDownImage;
let pacmanLeftImage;
let pacmanRightImage;
let wallImage;

let width = 1505;
let height = 694;

//X = wall, O = skip = pac man, ' ' = food
//Ghosts: b = blue, o = orange, p = pink, r = red
const tileMap = [
    "XXXXXXXXXXXXXXXXXXX",
    "X                 X",
    "X r               X",
    "X                 X",
    "X                 X",
    "X   XXX     XXX   X",
    "X   X.........X   X",
    "X   X.o.......X   X",
    "X   X.........X   X",
    "X   X.........X   X",
    "X   X....P....X   X",
    "X   X.......p.X   X",
    "X   X.........X   X",
    "X   XXX     XXX   X",
    "X                 X",
    "X                 X",
    "X                 X",
    "X                 X",
    "X               b X",
    "X                 X",
    "XXXXXXXXXXXXXXXXXXX"
];

const walls = new Set();
const foods = new Set();
const ghosts = new Set();
let pacman;

const directions = ['U', 'D', 'L', 'R']; //up down left right
let score = 0;
let lives = 3;
let gameOver = false;
let pressedKeys = new Set();
let pressedDirections = [];
let keyTimers = new Map();
let keyIntervals = new Map();

let imagesLoaded = 0;
const totalImages = 11; // background, wall, 4 ghosts, 4 pacman, 1 anim

window.onload = function () {
    board = document.getElementById("board");
    board.height = height;
    board.width = width;
    context = board.getContext("2d"); //used for drawing on the board

    loadImages();
}

function loadImages() {
    backgroundImage = new Image();
    backgroundImage.src = "./background.png";
    backgroundImage.onload = imageLoaded;

    wallImage = new Image();
    wallImage.src = "./iceblock.png";
    wallImage.onload = imageLoaded;

    blueGhostImage = new Image();
    blueGhostImage.src = "./blueGhost.png";
    blueGhostImage.onload = imageLoaded;
    orangeGhostImage = new Image();
    orangeGhostImage.src = "./orangeGhost.png";
    orangeGhostImage.onload = imageLoaded;
    pinkGhostImage = new Image();
    pinkGhostImage.src = "./pinkGhost.png";
    pinkGhostImage.onload = imageLoaded;
    redGhostImage = new Image();
    redGhostImage.src = "./redGhost.png";
    redGhostImage.onload = imageLoaded;

    pacmanUpImage = new Image();
    pacmanUpImage.src = "./chocolateup.png";
    pacmanUpImage.onload = imageLoaded;
    pacmanDownImage = new Image();
    pacmanDownImage.src = "./chocolatedown.png";
    pacmanDownImage.onload = imageLoaded;
    pacmanLeftImage = new Image();
    pacmanLeftImage.src = "./chocolateleft.png";
    pacmanLeftImage.onload = imageLoaded;
    pacmanRightImage = new Image();
    pacmanRightImage.src = "./chocolateright.png";
    pacmanRightImage.onload = imageLoaded;
    chocolateupanim = new Image();
    chocolateupanim.src = "./chocolateupanim.png";
    chocolateupanim.onload = imageLoaded;
    chocolatedownanim = new Image();
    chocolatedownanim.src = "./chocolatedownanim.png";
    chocolatedownanim.onload = imageLoaded;
    chocolateleftanim = new Image();
    chocolateleftanim.src = "./chocolateleftanim.png";
    chocolateleftanim.onload = imageLoaded;
    chocolaterightanim = new Image();
    chocolaterightanim.src = "./chocolaterightanim.png";
    chocolaterightanim.onload = imageLoaded;
}

function imageLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        loadMap();
        console.log(walls.size)
        // console.log(foods.size)
        // console.log(ghosts.size)
        for (let ghost of ghosts.values()) {
            const newDirection = directions[Math.floor(Math.random() * 4)];
            ghost.updateDirection(newDirection);
        }
        update();
        document.addEventListener("keydown", movePacman);
        document.addEventListener("keyup", stopPacman);
        backgroundMusic = new Audio("./background.mp3");
        backgroundMusic.loop = true;
        backgroundMusic.volume = 0.5; // pas aan indien nodig
        

        setInterval(() => {
            if (gameOver || !pacman) return;
            
            if (pacman.direction == 'U'){
            pacmanAnimToggle = !pacmanAnimToggle;
            pacman.image = pacmanAnimToggle ? chocolateupanim : pacmanNormalImage;
            }
            if (pacman.direction == 'D'){
            pacmanAnimToggle = !pacmanAnimToggle;
            pacman.image = pacmanAnimToggle ? chocolatedownanim : pacmanNormalImage;
            }
            if (pacman.direction == 'L'){
            pacmanAnimToggle = !pacmanAnimToggle;
            pacman.image = pacmanAnimToggle ? chocolateleftanim : pacmanNormalImage;
            }
            if (pacman.direction == 'R'){
            pacmanAnimToggle = !pacmanAnimToggle;
            pacman.image = pacmanAnimToggle ? chocolaterightanim : pacmanNormalImage;
            }
        }, 175);
    }
}


function loadMap() {
    walls.clear();
    foods.clear();
    ghosts.clear();

    for (let r = 0; r < rowCount; r++) {
        for (let c = 0; c < columnCount; c++) {
            const row = tileMap[r];
            const tileMapChar = row[c];


            const x = c * tileSize + offsetX;
            const y = r * tileSize + offsetY;

            if (tileMapChar == 'X') { //block wall
                const wall = new Block(wallImage, x, y, 25, 30);
                walls.add(wall);
            }
            else if (tileMapChar == 'b') { //blue ghost
                const ghost = new Block(blueGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            }
            else if (tileMapChar == 'o') { //orange ghost
                const ghost = new Block(orangeGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            }
            else if (tileMapChar == 'p') { //pink ghost
                const ghost = new Block(pinkGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            }
            else if (tileMapChar == 'r') { //red ghost
                const ghost = new Block(redGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            }
            else if (tileMapChar == 'P') { //pacman
                pacman = new Block(pacmanRightImage, x, y, tileSize, tileSize);
                pacmanNormalImage = pacmanRightImage;
            }
            else if (tileMapChar == ' ') { //empty is food
                const food = new Block(null, x + tileSize / 2 - 2, y + tileSize / 2 - 2, 4, 4);
                foods.add(food);
            }
        }
    }
}

function update() {
    if (gameOver) {
        return;
    }
    move();
    draw();
    setTimeout(update, 50); //1000/50 = 20 FPS
}

function draw() {
    context.clearRect(0, 0, board.width, board.height);
    context.drawImage(backgroundImage, 0, 0, board.width, board.height);

    for (let wall of walls.values()) {
        context.drawImage(wall.image, wall.x, wall.y, 35, 45);
    }

    context.fillStyle = "white";
    for (let food of foods.values()) {
        context.fillRect(food.x, food.y, food.width, food.height);
    }

    for (let ghost of ghosts.values()) {
        context.drawImage(ghost.image, ghost.x, ghost.y, ghost.width, ghost.height);
    }

    //score
    context.fillStyle = "white";
    context.font = "14px sans-serif";
    if (gameOver) {
        context.fillText("Game Over: " + String(score), tileSize / 2, tileSize / 2);
    }
    else {
        context.fillText("x" + String(lives) + " " + String(score), tileSize / 2, tileSize / 2);
    }
    context.drawImage(pacman.image, pacman.x, pacman.y, pacman.width, pacman.height);
}

function move() {
    pacman.x += pacman.velocityX;
    pacman.y += pacman.velocityY;


    //check wall collisions for pacman
    for (let wall of walls.values()) {
        if (collision(pacman, wall)) {
            pacman.x -= pacman.velocityX;
            pacman.y -= pacman.velocityY;
            break;
        }
    }

    //check ghosts collision
    for (let ghost of ghosts.values()) {
        if (collision(ghost, pacman)) {
            lives -= 1;
            if (lives == 0) {
                gameOver = true;
                return;
            }
            resetPositions();
        }

        if (ghost.y == tileSize * 9 && ghost.direction != 'U' && ghost.direction != 'D') {
            ghost.updateDirection('U');
        }

        ghost.x += ghost.velocityX;
        ghost.y += ghost.velocityY;
        for (let wall of walls.values()) {
            if (collision(ghost, wall) || ghost.x <= offsetX || ghost.x + ghost.width >= offsetX + boardWidth) {
                ghost.x -= ghost.velocityX;
                ghost.y -= ghost.velocityY;
                const newDirection = directions[Math.floor(Math.random() * 4)];
                ghost.updateDirection(newDirection);
            }
        }
    }

    //check food collision
    let foodEaten = null;
    for (let food of foods.values()) {
        if (collision(pacman, food)) {
            foodEaten = food;
            score += 10;
            break;
        }
    }
    foods.delete(foodEaten);

    //next level
    if (foods.size == 0) {
        loadMap();
        resetPositions();
    }

}

function moveOneTile(direction) {
    // Calculate target position one tile away
    let targetX = pacman.x;
    let targetY = pacman.y;
    if (direction == 'U') {
        targetY -= tileSize;
    } else if (direction == 'D') {
        targetY += tileSize;
    } else if (direction == 'L') {
        targetX -= tileSize;
    } else if (direction == 'R') {
        targetX += tileSize;
    }

    // Check if target position is a wall
    let canMove = true;
    const targetBlock = { x: targetX, y: targetY, width: tileSize, height: tileSize };
    for (let wall of walls.values()) {
        if (collision(targetBlock, wall)) {
            canMove = false;
            break;
        }
    }

    if (canMove) {
        pacman.x = targetX;
        pacman.y = targetY;
        pacman.direction = direction;
    }

    //update pacman images
    if (pacman.direction == 'U') {
        pacmanNormalImage = pacmanUpImage;
    }
    else if (pacman.direction == 'D') {
        pacmanNormalImage = pacmanDownImage;
    }
    else if (pacman.direction == 'L') {
        pacmanNormalImage = pacmanLeftImage;
    }
    else if (pacman.direction == 'R') {
        pacmanNormalImage = pacmanRightImage;
    }
}





function movePacman(e) {
    if (pressedKeys.has(e.code)) return;
    pressedKeys.add(e.code);

    if (backgroundMusic.paused) {
        backgroundMusic.play();
    }

    if (gameOver) {
        loadMap();
        resetPositions();
        lives = 3;
        score = 0;
        gameOver = false;
        update(); //restart game loop
        return;
    }

    let newDirection = null;
    if (e.code == "ArrowUp" || e.code == "KeyW") {
        newDirection = 'U';
    }
    else if (e.code == "ArrowDown" || e.code == "KeyS") {
        newDirection = 'D';
    }
    else if (e.code == "ArrowLeft" || e.code == "KeyA") {
        newDirection = 'L';
    }
    else if (e.code == "ArrowRight" || e.code == "KeyD") {
        newDirection = 'R';
    }

    if (newDirection) {
        // Move immediately on key press
        moveOneTile(newDirection);
        // Start continuous tile movement if key is held
        keyIntervals.set(e.code, setInterval(() => moveOneTile(newDirection), 300));
    }
}

function stopPacman(e) {
    pressedKeys.delete(e.code);

    // Clear the interval for this key
    if (keyIntervals.has(e.code)) {
        clearInterval(keyIntervals.get(e.code));
        keyIntervals.delete(e.code);
    }

    let directionToRemove = null;
    if (e.code == "ArrowUp" || e.code == "KeyW") {
        directionToRemove = 'U';
    }
    else if (e.code == "ArrowDown" || e.code == "KeyS") {
        directionToRemove = 'D';
    }
    else if (e.code == "ArrowLeft" || e.code == "KeyA") {
        directionToRemove = 'L';
    }
    else if (e.code == "ArrowRight" || e.code == "KeyD") {
        directionToRemove = 'R';
    }

    if (directionToRemove) {
        const index = pressedDirections.indexOf(directionToRemove);
        if (index > -1) {
            pressedDirections.splice(index, 1);
        }
    }

    // If no directions are pressed, stop Pacman
    if (pressedDirections.length === 0) {
        pacman.velocityX = 0;
        pacman.velocityY = 0;
    } else {
        // Continue with the last pressed direction
        const lastDirection = pressedDirections[pressedDirections.length - 1];
        pacman.updateDirection(lastDirection);
    }

    //iceblock when pressing space

    //rechts
    if (pacman.direction === 'R' && e.code === "Space") {
    for (let i = 1; i <= 4; i++) { 
        const wall = new Block(wallImage, pacman.x + i * 32, pacman.y, 25, 30);
        walls.add(wall);
    }
}

    if (pacman.direction === 'R' && e.code === "KeyM") {
        const wall = new Block(wallImage, pacman.x + 32, pacman.y, 25, 30);
        walls.add(wall);
    }


        //links
    if (pacman.direction === 'L' && e.code === "Space") {
    for (let i = 1; i <= 4; i++) { 
        const wall = new Block(wallImage, pacman.x - i * 32, pacman.y, 25, 30);
        walls.add(wall);
    }
}

    if (pacman.direction === 'L' && e.code === "KeyM") {
        const wall = new Block(wallImage, pacman.x - 32, pacman.y, 25, 30);
        walls.add(wall);
    }
        
        //boven
    if (pacman.direction === 'U' && e.code === "Space") {
    for (let i = 1; i <= 4; i++) { 
        const wall = new Block(wallImage, pacman.x, pacman.y - i * 32, 25, 30);
        walls.add(wall);
    }
}

    if (pacman.direction === 'U' && e.code === "KeyM") {
        const wall = new Block(wallImage, pacman.x, pacman.y - 32, 25, 30);
        walls.add(wall);
    }

        //beneden
    if (pacman.direction === 'D' && e.code === "Space") {
    for (let i = 1; i <= 4; i++) { 
        const wall = new Block(wallImage, pacman.x, pacman.y + i * 32, 25, 30);
        walls.add(wall);
    }
}

    if (pacman.direction === 'D' && e.code === "KeyM") {
        const wall = new Block(wallImage, pacman.x, pacman.y + 32, 25, 30);
        walls.add(wall);
    }


    //breaking iceblokc when facing direction of iceblok and pressing space
}

function collision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
        a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
        a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
        a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}

function resetPositions() {
    pacman.reset();
    pacman.velocityX = 0;
    pacman.velocityY = 0;
    for (let ghost of ghosts.values()) {
        ghost.reset();
        const newDirection = directions[Math.floor(Math.random() * 4)];
        ghost.updateDirection(newDirection);
    }
}

class Block {
    constructor(image, x, y, width, height) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.startX = x;
        this.startY = y;

        this.direction = 'R';
        this.velocityX = 0;
        this.velocityY = 0;
    }

    updateDirection(direction) {
        this.direction = direction;
        this.updateVelocity();
    }

    updateVelocity() {
        if (this.direction == 'U') {
            this.velocityX = 0;
            this.velocityY = -tileSize / 6;
        }
        else if (this.direction == 'D') {
            this.velocityX = 0;
            this.velocityY = tileSize / 6;
        }
        else if (this.direction == 'L') {
            this.velocityX = -tileSize / 6;
            this.velocityY = 0;
        }
        else if (this.direction == 'R') {
            this.velocityX = tileSize / 6;
            this.velocityY = 0;
        }
    }

    reset() {
        this.x = this.startX;
        this.y = this.startY;
    }
}
//board
let pacmanUpImage;
let pacmanDownImage;
let pacmanLeftImage;
let pacmanRightImage;


const directions = ['U', 'D', 'L', 'R']; //up down left right

let tileSize = 20;
let canvas;
let ctx;
let pacman;
let pacmanNormalImage;
let gameRunning = true;

window.onload = function() {
    pacmanUpImage = new Image();
    pacmanUpImage.src = "./chocolateup.png";
    pacmanDownImage = new Image();
    pacmanDownImage.src = "./chocolatedown.png";
    pacmanLeftImage = new Image();
    pacmanLeftImage.src = "./chocolateleft.png";
    pacmanRightImage = new Image();
    pacmanRightImage.src = "./chocolateright.png";

    pacmanUpImage.onload = function() {
        canvas = document.getElementById('board');
        ctx = canvas.getContext('2d');
        canvas.width = 1500;
        canvas.height = 600;
        pacman = new Pacman();
        pacman.x = 100;
        pacman.y = 100;
        pacman.startX = 100;
        pacman.startY = 100;
        pacman.width = tileSize;
        pacman.height = tileSize;
        pacmanNormalImage = pacmanUpImage;
        draw();
        gameLoop();
    };
    document.addEventListener('keydown', movePacman);
    document.addEventListener('keyup', stopPacman);
}



function move() {
    
    pacman.x += pacman.velocityX;
    pacman.y += pacman.velocityY;

}

function movePacman(e) {


    if (e.code == "ArrowUp" || e.code == "KeyW") {
        pacman.updateDirection('U');
    }
    else if (e.code == "ArrowDown" || e.code == "KeyS") {
        pacman.updateDirection('D');
    }
    else if (e.code == "ArrowLeft" || e.code == "KeyA") {
        pacman.updateDirection('L');
    }
    else if (e.code == "ArrowRight" || e.code == "KeyD") {
        pacman.updateDirection('R');
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

function stopPacman(e) {
    pacman.velocityX = 0;
    pacman.velocityY = 0;
}



function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(pacmanNormalImage, pacman.x, pacman.y, pacman.width, pacman.height);
}

function gameLoop() {
    if (gameRunning) {
        move();
        draw();
    }
    requestAnimationFrame(gameLoop);
}

class Pacman {
    constructor() {
        this.direction = 'R';
        this.velocityX = 0;
        this.velocityY = 0;
    }

    updateDirection(dir) {
        this.direction = dir;
        this.updateVelocity();
    }
    updateVelocity() {
        if (this.direction == 'U') {
            this.velocityX = 0;
            this.velocityY = -tileSize/6;
        }
        else if (this.direction == 'D') {
            this.velocityX = 0;
            this.velocityY = tileSize/6;
        }
        else if (this.direction == 'L') {
            this.velocityX = -tileSize/6;
            this.velocityY = 0;
        }
        else if (this.direction == 'R') {
            this.velocityX = tileSize/6;
            this.velocityY = 0;
        }
        else if (this.direction !== 'U' && 'D' && 'L' && 'R'){
            this.velocityX = 0
            this.velocityY = 0
        };

    };

    reset() {
        this.x = this.startX;
        this.y = this.startY;
    
}
}

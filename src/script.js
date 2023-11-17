const canvas = document.querySelector("#lawnmowerCanvas");
const ctx = canvas.getContext("2d");

const W = canvas.width, H = canvas.height;

var lawn = [];
for (var i = 0; i < W; i += 64) {
  for (var j = 0; j < H; j += 64) {
    lawn.push({ x: i, y: j, width: 64, height: 64, color: "green" });
  }
}


// Lawnmower object
let lawnmower = {
    x: W / 2,
    y: H / 2,
    speed: 4,
    dirX: 0,
    dirY: 0,
    canplay: false
};

let images = {
    right: new Image(),
    left: new Image(),
    up: new Image(),
    down: new Image(),
    upLeft: new Image(),
    upRight: new Image(),
    downLeft: new Image(),
    downRight: new Image()
};

images.right.src = './src/images/lawnmower-right.png';
images.left.src = './src/images/lawnmower-left.png';
images.up.src = './src/images/lawnmower-up.png';
images.down.src = './src/images/lawnmower-down.png';
images.upLeft.src = './src/images/lawnmower-upleft.png';
images.upRight.src = './src/images/lawnmower-upright.png';
images.downLeft.src = './src/images/lawnmower-downleft.png';
images.downRight.src = './src/images/lawnmower-downright.png';

let currentImage = images.right;

window.addEventListener('keydown', keyPressed);
window.addEventListener('keyup', keyReleased);

// Lawnmower image
let lawnmowerImage = new Image();
lawnmowerImage.src = './src/images/lawnmower-right.png';
lawnmowerImage.onload = function () {
    render();
};

function keyPressed(e) {
    if (e.key == 'ArrowRight')
        lawnmower.dirX = 1;
    if (e.key == 'ArrowLeft')
        lawnmower.dirX = -1;
    if (e.key == 'ArrowDown')
        lawnmower.dirY = 1;
    if (e.key == 'ArrowUp')
        lawnmower.dirY = -1;

    e.preventDefault();
}

function keyReleased(e) {
    if (e.key == 'ArrowRight' || e.key == 'ArrowLeft')
        lawnmower.dirX = 0;
    if (e.key == 'ArrowDown' || e.key == 'ArrowUp')
        lawnmower.dirY = 0;

    e.preventDefault();
}

document.getElementById("startButton").addEventListener("click", (event) => {
    lawnmower.canplay = true
    var speedElement = document.getElementById("speedInput")
    var speed = parseInt(speedElement.value);
    lawnmower.speed = speed
    speedElement.disabled = true;
    event.target.disabled = true
})

function updateImage() {
    if (lawnmower.dirX === 1 && lawnmower.dirY === 0) {
        currentImage = images.right;
    } else if (lawnmower.dirX === -1 && lawnmower.dirY === 0) {
        currentImage = images.left;
    } else if (lawnmower.dirX === 0 && lawnmower.dirY === -1) {
        currentImage = images.up;
    } else if (lawnmower.dirX === 0 && lawnmower.dirY === 1) {
        currentImage = images.down;
    } else if (lawnmower.dirX === -1 && lawnmower.dirY === -1) {
        currentImage = images.upLeft;
    } else if (lawnmower.dirX === 1 && lawnmower.dirY === -1) {
        currentImage = images.upRight;
    } else if (lawnmower.dirX === -1 && lawnmower.dirY === 1) {
        currentImage = images.downLeft;
    } else if (lawnmower.dirX === 1 && lawnmower.dirY === 1) {
        currentImage = images.downRight;
    }
}


// Animation loop
function render() {
    ctx.clearRect(0, 0, W, H);
    lawn.forEach(function(block) {
        ctx.fillStyle = block.color;
        ctx.fillRect(block.x, block.y, block.width, block.height);
      });
    // Draw lawnmower
    ctx.drawImage(currentImage, lawnmower.x, lawnmower.y, 64, 64);

    // Update lawnmower position
    if (lawnmower.canplay) {
        const prevX = lawnmower.x;
        const prevY = lawnmower.y;

        lawnmower.x += lawnmower.dirX * lawnmower.speed;
        lawnmower.y += lawnmower.dirY * lawnmower.speed;

        // Boundary checking
        if (lawnmower.x < 5) lawnmower.x = 5;
        if (lawnmower.y < 5) lawnmower.y = 5;
        if (lawnmower.x + 50 > W) lawnmower.x = W - 50;
        if (lawnmower.y + 50 > H) lawnmower.y = H - 50;

        updateImage()

        lawn.forEach(function(block) {
            if (
                prevX < block.x + block.width &&
                prevX + 50 > block.x &&
                prevY < block.y + block.height &&
                prevY + 50 > block.y
            ) {
                block.color = "lightgreen";
            }
        });
    }


    window.requestAnimationFrame(render);
}

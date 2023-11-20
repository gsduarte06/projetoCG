const canvas = document.querySelector("#lawnmowerCanvas");
const ctx = canvas.getContext("2d");

const W = canvas.width, H = canvas.height;

// Lawn initialization with an obstacle (hole)
const lawn = [];
for (let i = 0; i < W; i += 8) {
    for (let j = 0; j < H; j += 8) {
        lawn.push({ x: i, y: j, width: 8, height: 8, color: "green"});
    }
}

// Add an obstacle (hole) to the lawn

for (let v in lawn){
    console.log(v);
    if((lawn[v].x >= 80 && lawn[v].x < 112) && (lawn[v].y >= 80 && lawn[v].y < 112)){
        lawn[v].color = "lightgreen"
    }
}
lawn.push({ x: 80, y: 80, width: 32, height: 32, color: "lightgreen"});
console.log(lawn);
for (let i = 80; i < 80+32; i += 8) {
    for (let j = 80; j < 80+32; j += 8) {

    }
}

// Lawnmower object
const lawnmower = {
    x: W / 2,
    y: H / 2,
    speed: 4,
    dirX: 0,
    dirY: 0,
    canplay: false
};

// Images for different directions
const images = {
    right: new Image(),
    left: new Image(),
    up: new Image(),
    down: new Image(),
    upLeft: new Image(),
    upRight: new Image(),
    downLeft: new Image(),
    downRight: new Image()
};

// Set image sources
images.right.src = './src/images/lawnmower-right.png';
images.left.src = './src/images/lawnmower-left.png';
images.up.src = './src/images/lawnmower-up.png';
images.down.src = './src/images/lawnmower-down.png';
images.upLeft.src = './src/images/lawnmower-upleft.png';
images.upRight.src = './src/images/lawnmower-upright.png';
images.downLeft.src = './src/images/lawnmower-downleft.png';
images.downRight.src = './src/images/lawnmower-downright.png';

let currentImage = images.right;

// Event listeners
window.addEventListener('keydown', keyPressed);
window.addEventListener('keyup', keyReleased);

// Lawnmower image
const lawnmowerImage = new Image();
lawnmowerImage.src = './src/images/lawnmower-right.png';
lawnmowerImage.onload = function () {
    render();
};

// Handle key presses
function keyPressed(e) {
    if (e.key === 'ArrowRight') lawnmower.dirX = 1;
    if (e.key === 'ArrowLeft') lawnmower.dirX = -1;
    if (e.key === 'ArrowDown') lawnmower.dirY = 1;
    if (e.key === 'ArrowUp') lawnmower.dirY = -1;

    e.preventDefault();
}

// Handle key releases
function keyReleased(e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') lawnmower.dirX = 0;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') lawnmower.dirY = 0;

    e.preventDefault();
}

// Start button event listener
document.getElementById("startButton").addEventListener("click", (event) => {
    lawnmower.canplay = true
    const speedElement = document.getElementById("speedInput")
    const speed = parseInt(speedElement.value);
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

lawnmowerImage.width = 32; // default
lawnmowerImage.height = 32; // default
// Animation loop
function render() {
    // Check win condition
    const win = arr => arr.every(v => v.color === arr[0].color && arr[0].color === "lightgreen" && lawnmower.canplay)
    if (win(lawn)) {
        alert("WIN WIN")
        lawnmower.canplay = false;
    }

    ctx.clearRect(0, 0, W, H);

    // Draw lawn
    lawn.forEach(function (block) {
        ctx.fillStyle = block.color;
        ctx.fillRect(block.x, block.y, block.width, block.height);
    });

// Update lawnmower position
if (lawnmower.canplay) {
    const prevX = lawnmower.x;
    const prevY = lawnmower.y;

    // Update lawnmower position based on direction
    lawnmower.x += lawnmower.dirX * lawnmower.speed;
    lawnmower.y += lawnmower.dirY * lawnmower.speed;

    // Boundary checking for the canvas edges
    if (lawnmower.x < 5) lawnmower.x = 5;
    if (lawnmower.y < 5) lawnmower.y = 5;
    if (lawnmower.x + 32 > W) lawnmower.x = W - 32;
    if (lawnmower.y + 32 > H) lawnmower.y = H - 32;

    // Boundary checking for the hole
    const hole = lawn[lawn.length - 1]; // The last element is the hole
    if (
        lawnmower.x < hole.x + hole.width &&
        lawnmower.x + 32 > hole.x &&
        lawnmower.y < hole.y + hole.height &&
        lawnmower.y + 32 > hole.y
    ) {
        // Adjust lawnmower position to prevent moving into the hole
        lawnmower.x = prevX;
        lawnmower.y = prevY;
    }

    // Update lawn color based on lawnmower movement
    lawn.forEach(function (block) {
        if (
            prevX < block.x + block.width &&
            prevX + 30 > block.x &&
            prevY < block.y + block.height &&
            prevY + 30 > block.y
        ) {
            if (block.color === "green" && block !== hole) {
                block.color = "lightgreen";
            }
        }
    });

    // Check if the lawnmower is moving diagonally
    if (lawnmower.dirX !== 0 && lawnmower.dirY !== 0) {
        lawnmowerImage.width = 50;
        lawnmowerImage.height = 50;
    } else {
        lawnmowerImage.width = 32;
        lawnmowerImage.height = 32;
    }

    // Update lawnmower image
    updateImage();
}

    // Draw lawnmower
    ctx.drawImage(currentImage, lawnmower.x, lawnmower.y, lawnmowerImage.width, lawnmowerImage.height);

    window.requestAnimationFrame(render);
}

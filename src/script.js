const canvas = document.querySelector("#lawnmowerCanvas");
const ctx = canvas.getContext("2d");

const W = canvas.width, H = canvas.height;
//Production code comented for testing
/* var lawn = [];
for (var i = 0; i < W; i += 8) {
    for (var j = 0; j < H; j += 8) {
        lawn.push({ x: i, y: j, width: 8, height: 8, color: "green" });
    }
} */
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
function animWin() {
    document.getElementById("wrapper").style.display= "flex";
    for (i = 0; i < 200; i++) {
        // Random rotation
        var randomRotation = Math.floor(Math.random() * 360);
        // Random width & height between 0 and viewport
        var randomWidth = Math.floor(Math.random() * Math.max(document.documentElement.clientWidth, window.innerWidth || 0));
        var randomHeight = Math.floor(Math.random() * Math.max(document.documentElement.clientHeight, window.innerHeight || 0));

        // Random animation-delay
        var randomAnimationDelay = Math.floor(Math.random() * 10);
        console.log(randomAnimationDelay)

        // Random colors
        var colors = ['#0CD977', '#FF1C1C', '#FF93DE', '#5767ED', '#FFC61C', '#8497B0']
        var randomColor = colors[Math.floor(Math.random() * colors.length)];

        // Create confetti piece
        var confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.top = randomHeight + 'px';
        confetti.style.left = randomWidth + 'px';
        confetti.style.backgroundColor = randomColor;
        confetti.style.transform = 'skew(15deg) rotate(' + randomRotation + 'deg)';
        confetti.style.animationDelay = randomAnimationDelay + 's';
        document.getElementById("confetti-wrapper").appendChild(confetti);
    }
}
lawnmowerImage.width = 32; // default
lawnmowerImage.height = 32; // default
// Animation loop
function render() {
    //Check win
    const win = arr => arr.every(v => v.color === arr[0].color && arr[0].color === "lightgreen" && lawnmower.canplay)
    if (win(lawn)) {
        lawnmower.canplay = false;
        animWin();
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

        lawnmower.x += lawnmower.dirX * lawnmower.speed;
        lawnmower.y += lawnmower.dirY * lawnmower.speed;

        // Boundary checking
        if (lawnmower.x < 5) lawnmower.x = 5;
        if (lawnmower.y < 5) lawnmower.y = 5;
        if (lawnmower.x + 32 > W) lawnmower.x = W - 32;
        if (lawnmower.y + 32 > H) lawnmower.y = H - 32;

        // Update lawn color based on lawnmower movement
        lawn.forEach(function (block) {
            if (
                prevX < block.x + block.width &&
                prevX + 30 > block.x &&
                prevY < block.y + block.height &&
                prevY + 30 > block.y
            ) {
                block.color = "lightgreen";
            }
        });


        // Check if the lawnmower is moving diagonally
        if (lawnmower.dirX !== 0 && lawnmower.dirY !== 0) {
            lawnmowerImage.width = 50; // Adjust the width
            lawnmowerImage.height = 50; // Adjust the height
        } else {
            lawnmowerImage.width = 32; // Reset the width to default
            lawnmowerImage.height = 32; // Reset the height to default
        }
        // Update lawnmower image
        updateImage();

    }


    // Draw lawnmower
    ctx.drawImage(currentImage, lawnmower.x, lawnmower.y, lawnmowerImage.width, lawnmowerImage.height);


    window.requestAnimationFrame(render);

}

document.getElementById('playButton').addEventListener('click', function() {
    document.querySelector('.intro-container').classList.add('fade-out');
    setTimeout(function() {
      document.querySelector('.intro-container').style.display = 'none';
      document.querySelector('#gameContainer').style.display = 'block';
    }, 1000);
  });
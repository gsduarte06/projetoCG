
const canvas = document.querySelector("#lawnmowerCanvas");
const ctx = canvas.getContext("2d");

const W = canvas.width, H = canvas.height;

// Lawn initialization with an obstacle (hole)

const lawn = [];
for (let i = 0; i < W; i += 8) {
    for (let j = 0; j < H; j += 8) {
        lawn.push({ x: i, y: j, width: 8, height: 8, color: "green", IsObst: 0 });
    }
}

function generateRandomCoordinate(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}





// Add an obstacle (hole) to the lawn





// Lawnmower object
let lawnmower = {
    x: 0,
    y: 0,
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
function PlaceObsticles(quantity) {
    for (i = 0; i < quantity; i++) {
        var x = generateRandomCoordinate(64, W-64);
        var y = generateRandomCoordinate(64, H-64);
        var difx = x + 24;
        var dify = y+ 22;
        for (let v in lawn) {
            if ((lawn[v].x >= x && lawn[v].x < difx) && (lawn[v].y >= y && lawn[v].y < dify)) {
                lawn[v].color = "lightgreen"
            }
        }
        lawn.push({ x: x, y: y, width: 22, height: 24, color: "lightgreen", IsObst: 1 });
    }
}
var quantityObstacles = 0
let TreeImage = new Image();
TreeImage.src = "./src/images/tree-1.png"
document.getElementById("startButton").addEventListener("click", (event) => {
    lawnmower.canplay = true
    var speedElement = document.getElementById("speedInput")
    var speed = parseInt(speedElement.value) + 2;
    lawnmower.speed = speed
    var ObstElement = document.getElementById("ObstaclesInput")
    quantityObstacles = ObstElement.value;
    PlaceObsticles(quantityObstacles);
    speedElement.disabled = true;
    event.target.disabled = true;
    ObstElement.disabled = true;
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
    const wrapper = document.getElementById("wrapper")
    wrapper.style.display = "flex"
    wrapper.style.zIndex = "2"
    for (i = 0; i < 200; i++) {
        // Random rotation
        var randomRotation = Math.floor(Math.random() * 360);
        // Random width & height between 0 and viewport
        var randomWidth = Math.floor(Math.random() * Math.max(document.documentElement.clientWidth, window.innerWidth || 0));
        var randomHeight = Math.floor(Math.random() * Math.max(document.documentElement.clientHeight, window.innerHeight || 0));

        // Random animation-delay
        var randomAnimationDelay = Math.floor(Math.random() * 10);

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


const lenghLawn = lawn.filter((x) => (x.color != "lightgreen" && x.IsObst === 0)).length
function calcPercentage(){
    console.log(lenghLawn);
    console.log(lawn.filter((x) => (x.color != "green" && x.IsObst === 0)).length);
    return parseInt((lawn.filter((x) => (x.color != "green" && x.IsObst === 0)).length/lenghLawn) * 100);
}
lawnmowerImage.width = 32; // default
lawnmowerImage.height = 32; // default
// Animation loop
function render() {
    //Check win
    const win = arr => arr.every(v => v.color === arr[0].color && arr[0].color === "lightgreen" && lawnmower.canplay)
    if (win(lawn)) {
        document.getElementById("percentage").textContent = `${calcPercentage()}%`;
        lawnmower.canplay = false;
        animWin();
    }
    ctx.clearRect(0, 0, W, H);
    // Draw lawn
    lawn.forEach(function (block) {

        if (block.IsObst != 1) {
            ctx.fillStyle = block.color;
            ctx.fillRect(block.x, block.y, block.width, block.height);
        }

    });

    // Update lawnmower position
    if (lawnmower.canplay) {
        document.getElementById("percentage").textContent = `${calcPercentage()}%`;
        const prevX = lawnmower.x;
        const prevY = lawnmower.y;

        // Update lawnmower position based on direction
        lawnmower.x += lawnmower.dirX * lawnmower.speed;
        lawnmower.y += lawnmower.dirY * lawnmower.speed;

        // Boundary checking for the canvas edges
        if (lawnmower.x < 0) lawnmower.x = 0;
        if (lawnmower.y < 0) lawnmower.y = 0;
        if (lawnmower.x + 30 > W) lawnmower.x = W - 30;
        if (lawnmower.y + 30 > H) lawnmower.y = H - 30;

        // Boundary checking for the hole
        for (i = 0; i < quantityObstacles; i++) {
            const hole = lawn[lawn.length - (i+1)]; // The last element is the hole
            console.log(hole);
            console.log(i);
            console.log(lawn.length);
            if (lawnmower.x < hole.x + hole.width &&
                lawnmower.x + 28> hole.x &&
                lawnmower.y < hole.y + hole.height &&
                lawnmower.y + 28> hole.y) {
                // Adjust lawnmower position to prevent moving into the hole
                lawnmower.x = prevX;
                lawnmower.y = prevY;

            }
        }

        // Update lawn color based on lawnmower movement
        lawn.forEach(function (block) {
            if (
                prevX < block.x + block.width &&
                prevX + 30 > block.x &&
                prevY < block.y + block.height &&
                prevY + 30 > block.y
            ) {
                if (block.color === "green" && block.IsObst != 1) {
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

    lawn.forEach(function (block) {
        if (block.IsObst != 0) {
            ctx.drawImage(TreeImage, block.x - 18, block.y - 46, TreeImage.width, TreeImage.height);
        }

    });


    window.requestAnimationFrame(render);

}

document.getElementById('mowText').addEventListener('click', function () {
    document.querySelector('.intro-container').classList.add('fade-out');
    setTimeout(function () {
        document.querySelector('.intro-container').style.display = 'none';
        document.querySelector('#gameContainer').style.display = 'block';
    }, 1000); 
});

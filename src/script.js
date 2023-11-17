var canvas = document.getElementById("lawnmowerCanvas");
var ctx = canvas.getContext("2d");

var grassColor = "Green"; // Light Green (initial color of grass)

var lawn = [];
for (var i = 0; i < canvas.width; i += 20) {
  for (var j = 0; j < canvas.height; j += 20) {
    lawn.push({ x: i, y: j, width: 20, height: 20, color: grassColor });
  }
}

var lawnmower = {
  x: 50,
  y: canvas.height / 2,
  width: 30,
  height: 20,
  speed: 2,
  canClick: false,
  path: [] // Added path to track the lawnmower's trail
};

function drawLawnmower() {
  ctx.fillStyle = "red"; // Color of the lawnmower
  ctx.fillRect(lawnmower.x, lawnmower.y, lawnmower.width, lawnmower.height);
}

function drawLawn() {
  lawn.forEach(function(block) {
    ctx.fillStyle = block.color;
    ctx.fillRect(block.x, block.y, block.width, block.height);
  });
}



function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function update() {
  clearCanvas();
  drawLawn();
  drawLawnmower();
}

function isInsideLawn(x, y) {
  return (
    x >= 0 &&
    x + lawnmower.width <= canvas.width &&
    y >= 0 &&
    y + lawnmower.height <= canvas.height
  );
}

function moveLawnmowerTo(x, y) {
  if (!lawnmower.canClick) {
    return; 
  }

  if (!isInsideLawn(x, y)) {
    return; 
  }

  var dx = x - lawnmower.x;
  var dy = y - lawnmower.y;
  var distance = Math.sqrt(dx * dx + dy * dy);

  var numSteps = Math.ceil(distance / lawnmower.speed);
  var stepX = dx / numSteps;
  var stepY = dy / numSteps;

  lawnmower.canClick = false; 

  function animate() {
    if (numSteps > 0) {
      var newX = lawnmower.x + stepX;
      var newY = lawnmower.y + stepY;

      lawnmower.path.push({ x: lawnmower.x, y: lawnmower.y }); 
      lawnmower.x = newX;
      lawnmower.y = newY;

      
      lawn.forEach(function(block) {
        if (
          lawnmower.x < block.x + block.width &&
          lawnmower.x + lawnmower.width > block.x &&
          lawnmower.y < block.y + block.height &&
          lawnmower.y + lawnmower.height > block.y
        ) {
          block.color = "lightgreen";
        }
      });

      update();

      numSteps--;

      if (numSteps === 0) {
        lawnmower.canClick = true; // Allow a new click after the animation is complete
      } else {
        requestAnimationFrame(animate);
      }
    }
  }

  animate();
}

document.getElementById("startButton").addEventListener("click",(event) =>{
  lawnmower.canClick= true
  var speedElement = document.getElementById("speedInput")
  var speed = parseInt(speedElement.value) + 1;
  lawnmower.speed = speed
  speedElement.disabled = true;
  event.target.disabled = true
} )

canvas.addEventListener("click", function(e) {
  var rect = canvas.getBoundingClientRect();
  var clickX = e.clientX - rect.left;
  var clickY = e.clientY - rect.top;

  moveLawnmowerTo(clickX, clickY);
});

// Usar as setas
document.addEventListener("keydown", function (e) {
  // Arrow key codes: Left (37), Up (38), Right (39), Down (40)
  console.log(e.keyCode);
  switch (e.keyCode) {
    case 65: // Left arrow key
      moveLawnmowerTo(lawnmower.x - lawnmower.speed, lawnmower.y);
      break;
    case 87 : // Up arrow key
      moveLawnmowerTo(lawnmower.x, lawnmower.y - lawnmower.speed);
      break;
    case 68: // Right arrow key
      moveLawnmowerTo(lawnmower.x + lawnmower.speed, lawnmower.y);
      break;
    case 83: // Down arrow key
      moveLawnmowerTo(lawnmower.x, lawnmower.y + lawnmower.speed);
      break;
    case 81: // Diagonal: Up + Left
      moveLawnmowerTo(lawnmower.x - lawnmower.speed, lawnmower.y - lawnmower.speed);
      break;
    case 69: // Diagonal: Up + Right
      moveLawnmowerTo(lawnmower.x + lawnmower.speed, lawnmower.y - lawnmower.speed);
      break;
    case 90: // Diagonal: Down + Left
      moveLawnmowerTo(lawnmower.x - lawnmower.speed, lawnmower.y + lawnmower.speed);
      break;
    case 67: // Diagonal: Down + Right
      moveLawnmowerTo(lawnmower.x + lawnmower.speed, lawnmower.y + lawnmower.speed);
      break;
  }
});

update();

document.getElementById('playButton').addEventListener('click', function() {
  document.querySelector('.intro-container').classList.add('fade-out');
  setTimeout(function() {
    document.querySelector('.intro-container').style.display = 'none';
    document.querySelector('#gameContainer').style.display = 'block';
  }, 1000);
});



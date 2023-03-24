// Map
let gamemap;

let engine;

// Possition and direction of player
// let pos;
// let dir;
// let cameraPlane;

let xoff = 0;
let yoff = 0;
let aoff = 0;
let rotSpeed =  0


// size of screen
const gameWidth = 320; //=> This will be the base to calculate the vectors in rays
const gameHeight = 200;

let gameScale = 1;

function setup() {
	// Size of screen. This will generate var height and width globaly
	// createCanvas(800, 600);
	createCanvas(gameWidth, gameHeight);
	// remove black row to divide frames
	noStroke();

	gamemap = new Map();
	inputHandler = new InputHandler();
	engine = new RayEngine(gameWidth, gameHeight, gamemap);
}

/*This is the function with a eternal loop*/
function draw() {

	scale(gameScale);

	background(35);

	inputHandler.checkKeys();

	engine.generateFrame(deltaTime); // DeltaTime is from ps5. Time in milissec between 1 call and other. It's not good fixed xpto Frames per second. Better use this/calculate
	image(engine.frameBuffer, 0, 0);
	// pearlinNoise();

	// Walking
	if (inputHandler.isKeyDown("up")) {
		engine.walkUp();
	} else if (inputHandler.isKeyDown("down")) {
		engine.walkDown();
	} else {
		engine.stopWalking();
	}

	// strafe
	if (inputHandler.isKeyDown("left")) {
		engine.strafeLeft();
	} else if (inputHandler.isKeyDown("right")) {
		engine.strafeRight();
	} else {
		engine.stopStrafe();
	}

	// Rotation
	if (inputHandler.isKeyDown("rotateright")) {
		engine.rotationRight(inputHandler.getKey("rotateright"));
	} else if (inputHandler.isKeyDown("rotateleft")) {
		engine.rotationLeft(inputHandler.getKey("rotateleft"));
	} else {
		engine.stopRotation();
	}
}

function pearlinNoise() {

	let rotSpeed = noise(aoff+50)/60;

	engine.pos.x = noise(aoff)*8;
	engine.pos.y = noise(aoff+100)*8;
	engine.dir.rotate(rotSpeed);

	xoff+=0.005;
	yoff+=0.005;
	aoff+=0.01;
}


function mouseClicked() {
	requestPointerLock(); // Will make the mouse pointer hidden
	let fs = fullscreen();

	if (fs) {
		resizeCanvas(gameWidth, gameHeight);
		gameScale = 1;
	} else {
		resizeCanvas(gameWidth*5, gameHeight*5);
		gameScale = 6;
	}

	fullscreen(!fs);
}

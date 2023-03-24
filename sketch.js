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

function setup() {
	// Size of screen. This will generate var height and width globaly
	createCanvas(800, 600);
	// remove black row to divide frames
	noStroke();

	gamemap = new Map();
	engine = new RayEngine(gameWidth, gameHeight, gamemap);
}

/*This is the function with a eternal loop*/
function draw() {
	background(35);

	engine.generateFrame();
	image(engine.frameBuffer, 0, 0);

	// pearlinNoise();

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

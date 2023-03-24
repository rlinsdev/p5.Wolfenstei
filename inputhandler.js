class InputHandler {
	constructor () {
		this.keys = {};

		this.keys["up"] = false;
		this.keys["down"] = false;
		this.keys["left"] = false;
		this.keys["right"] = false;
		this.keys["rotateright"] = false;
		this.keys["rotateright"] = false;
		this.keys["shoot"] = false;

	}

	checkKeys() {
		this.keys["up"] = keyIsDown(UP_ARROW) ? true : false;
		this.keys["down"] = keyIsDown(DOWN_ARROW) ? true : false;
		this.keys["left"] = keyIsDown(LEFT_ARROW) ? true : false;
		this.keys["right"] = keyIsDown(RIGHT_ARROW) ? true : false;
		this.keys["shoot"] = keyIsDown(32) ? true : false;
	}

	isKeyDown(key) {
		return this.keys[key];
	}
}

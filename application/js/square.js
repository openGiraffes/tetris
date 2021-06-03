class Square {
	constructor() {
		this.data = [
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		];
		this.origin = {
			x: 0,
			y: 0
		};
		this.dir = 0;
	}
	canRotate(isValid) {
		var d = (this.dir + 1) % 4;
		if (d == 4) {
			d = 0;
		}
		var test = [
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		];
		for (var i = 0; i < this.data.length; i++) {
			for (var j = 0; j < this.data[0].length; j++) {
				test[i][j] = this.rotates[d][i][j];
			}
		}
		return isValid(this.origin, test);
	}
	rotate(num) {
		if (!num)
			num = 1;
		this.dir = (this.dir + num) % 4;
		if (this.dir == 4) {
			this.dir = 0;
		}
		for (var i = 0; i < this.data.length; i++) {
			for (var j = 0; j < this.data[0].length; j++) {
				this.data[i][j] = this.rotates[this.dir][i][j];
			}
		}
	}
	down() {
		this.origin.x = this.origin.x + 1;
	}
	canDown(isValid) {
		var test = {};
		test.x = this.origin.x + 1;
		test.y = this.origin.y;
		return isValid(test, this.data);
	}
	canLeft(isValid) {
		var test = {};
		test.x = this.origin.x;
		test.y = this.origin.y - 1;
		return isValid(test, this.data);
	}
	left() {
		this.origin.y = this.origin.y - 1;
	}
	canRight(isValid) {
		var test = {};
		test.x = this.origin.x;
		test.y = this.origin.y + 1;
		return isValid(test, this.data);
	}
	right() {
		this.origin.y = this.origin.y + 1;
	}
}
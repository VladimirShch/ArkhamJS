"use strict"

class City
{
	constructor(image, x, y, screen, scale)
	{
		this.x = x;
		this.y = y;
		this.screen = screen;
		this.image = image;
		this.scale = scale;
	}

	draw(context){
		context.drawImage
		(
			this.image,
			this.screen.x/this.scale,
			this.screen.y/this.scale,
			canvas.width/this.scale,
			canvas.height/this.scale,
			0,
			0,
			canvas.width,
			canvas.height
		);
	}
}

class GameScreen{
	constructor(canv, distanceToMove){
		this.x = 0;
		this.y = 0;
		this.canvas = canv;
		this.distanceWhenMove = distanceToMove;
	}
}

class Character
{	
	constructor(characterName, health, x, y, velocity, screen, mapWidth, mapHeight, collisionManager, weapon)
	{
		this.characterName = characterName;
		this.health = health;
		this.x = x;
		this.y = y;
		this.velocity = velocity;
		this.screen = screen;
		this.mapWidth = mapWidth;
		this.mapHeight = mapHeight;
		this.collisionManager = collisionManager;
		this.weapon = weapon;
		this.activeWeapon = weapon[0];
		this.lastAnimationX = x;
		this.lastAnimationY = y;
		this.framesInAnimation = 4; // Потому что 4 изображения всего на анимацию
		this.frame = 0;

		this.image = new Image();
		this.image.src = `${this.characterName}/Move/down.png`;
		this.previousDirection = "d";
		this.lastAnimationTime = Date.now();

		this.wound = null;
	}
	hit(){
		this.activeWeapon.hit(this.previousDirection);
	}

	takeDamage(damage){
		this.health -= damage;
		this.wound = new Wound(this.previousDirection);
	}

	move(direction)
	{
		if(this.activeWeapon.isHitting()){
			return;
		}
		
		if (this.previousDirection != direction){
			switch (direction) {
				case "r":
					this.image.src = `${this.characterName}/Move/right.png`;
					break;
				case "l":
					this.image.src = `${this.characterName}/Move/left.png`;
					break;
				case "d":
					this.image.src = `${this.characterName}/Move/down.png`;
					break;
				case "u":
					this.image.src = `${this.characterName}/Move/up.png`;
					break;
			}
		}
		if(direction == "r")
		{ 
			if(this.x < this.mapWidth){
				if(this.collisionManager.getPossibleDistance(this.x + this.image.width/this.framesInAnimation, this.x + this.image.width/this.framesInAnimation + this.velocity, this.y, this.y + this.image.height, direction)){
					this.x += this.velocity;
				}
				//this.x = Math.min(this.x + this.velocity, this.mapWidth - this.image.width/this.framesInAnimation);
			}
			
			if((this.x - this.screen.x)/this.screen.canvas.width >= this.screen.distanceWhenMove 
				&& this.screen.x + this.screen.canvas.width < this.mapWidth){
					this.screen.x = Math.min(this.screen.x + this.velocity, this.mapWidth - this.screen.canvas.width);
			}
		}
		else if(direction == "l")
		{	
			if(this.x > 0){
				if(this.collisionManager.getPossibleDistance(this.x, this.x - this.velocity, this.y, this.y + this.image.height, direction)){
					this.x -= this.velocity;
				}
				//this.x = Math.max(this.x - this.velocity, 0);
			}		
			
			if((this.x - this.screen.x)/this.screen.canvas.width <= (1 - this.screen.distanceWhenMove) && this.screen.x > 0){
				this.screen.x = Math.max(this.screen.x - this.velocity, 0);
			}
		}
		else if(direction == "d")
		{	
			if(this.y < this.mapHeight){
				if(this.collisionManager.getPossibleDistance(this.x, this.x + this.image.width/this.framesInAnimation, this.y + this.image.height, this.y + this.image.height + this.velocity, direction)){
					this.y += this.velocity;
				}
				//this.y = Math.min(this.y + this.velocity, this.mapHeight - this.image.height);
			}		
						
			if((this.y - this.screen.y)/this.screen.canvas.height >= this.screen.distanceWhenMove && this.screen.y + this.screen.canvas.height < this.mapHeight){
				this.screen.y = Math.min(this.screen.y + this.velocity, this.mapHeight - this.screen.canvas.height);
			}
		}
		else if(direction == "u")
		{		
			if(this.y > 0){
				if(this.collisionManager.getPossibleDistance(this.x, this.x + this.image.width/this.framesInAnimation, this.y, this.y - this.velocity, direction)){
					this.y -= this.velocity;
				}
				//this.y = Math.max(this.y - this.velocity, 0);;
			}	
			
			if((this.y - this.screen.y)/this.screen.canvas.height <= 1 - this.screen.distanceWhenMove && this.screen.y > 0){
				this.screen.y = Math.max(this.screen.y - this.velocity, 0);;
			}
		}

		console.log(this.x, this.y);
		// Немного не отсюда
		if(direction !== this.previousDirection){
			this.frame = 0;
		}

		this.previousDirection = direction;

		// ----------!!! Глобалка !!!-------------
		gameDirector.heatMap.build(this.x, this.y);
	}
	
	setAnimation()
	{		
		//!! Переделать
		const currentTime = Date.now();
		if(currentTime - this.lastAnimationTime < 1000/4){
			return;
		}
		this.lastAnimationTime = currentTime;
		if(this.x == this.lastAnimationX && this.y == this.lastAnimationY)
		{
			this.frame  = 0;
		}
		else
		{
			if(this.frame == this.framesInAnimation - 1)
			{
				this.frame = 0;				
			}
			else
			{
				this.frame++;				
			}	
		}
		this.lastAnimationX = this.x;
		this.lastAnimationY = this.y;
	}	

	findTarget(){
		let startX, endX, startY, endY;
		
		if(this.previousDirection === "r"){
			startX = this.x + this.image.width / this.framesInAnimation;
			endX = startX + this.activeWeapon.range;
			startY = this.y;
			endY = this.y + this.image.height;
		}
		else if(this.previousDirection === "l"){
			startX = this.x - this.activeWeapon.range;
			endX = this.x;
			startY = this.y;
			endY = this.y + this.image.height;
		}
		else if(this.previousDirection === "d"){
			startX = this.x;
			endX = this.x + this.image.width / this.framesInAnimation;
			startY = this.y + this.image.height;
			endY = startY + this.activeWeapon.range;
		}
		else if(this.previousDirection === "u"){
			startX = this.x;
			endX = this.x + this.image.width / this.framesInAnimation;
			startY = this.y - this.activeWeapon.range;
			endY = this.y;
		}

		// TODO sort by distance
		for (let m of gameDirector.monsters)
		{
			// TODO явно 4 задано!
			if(m.x <= endX && m.x + m.image.width / m.framesInAnimation >= startX && m.y <= endY && m.y + m.image.height >= startY){
				return m;
			}
		}

		return null;
	}

	draw(context){
		if(this.activeWeapon.isHitting()){
			this.activeWeapon.draw(context, this.x - this.screen.x, this.y - this.screen.y);

			// Вообще не отсюда, тут про отрисовку только по идее
			if(this.activeWeapon.damage && !this.activeWeapon.damage.delivered){
				const target = this.findTarget();
				if(target){
					target.takeDamage(this.activeWeapon.damage.value);
					this.activeWeapon.damage.delivered = true;
				}
			}
		}

		if(this.wound && this.wound.frame == -1){
			this.wound = null;
		}

		if(this.wound){
			this.wound.draw(this.x - this.screen.x, this.y - this.screen.y, context);
		}

		this.setAnimation();

		context.drawImage
		(
			this.image,
			this.frame * this.image.width / this.framesInAnimation,
			0,
			this.image.width / this.framesInAnimation,
			this.image.height,
			this.x - this.screen.x,
			this.y - this.screen.y,
			this.image.width / this.framesInAnimation,
			this.image.height
		);
	}
}

class Weapon{
	constructor(name, frames, hittingFrame, hitRate, range, animationVelocity){
		this.name = name;
		this.frames = frames;
		this.hittingFrame = hittingFrame;
		this.hitRate = hitRate;
		this.range = range;
		this.animationVelocity = animationVelocity;
		this.imageRight = new Image();
		this.imageRight.src = `Weapon/${this.name}/right.png`;
		this.imageLeft = new Image();
		this.imageLeft.src = `Weapon/${this.name}/left.png`;
		this.imageDown = new Image();
		this.imageDown.src = `Weapon/${this.name}/down.png`;
		this.imageUp = new Image();
		this.imageUp.src = `Weapon/${this.name}/up.png`;
		this.activeImage = null;
		this.lastAnimationTime = Date.now();
		this.currentFrame = -1;
		this.damage = null; 
	}

	hit(direction){
		switch(direction){
			case "r":
				//this.image.src = `Weapon/${this.name}/right.png`;
				this.activeImage = this.imageRight;
				break;
			case "l":
				//this.image.src = `Weapon/${this.name}/left.png`;
				this.activeImage = this.imageLeft;
				break;
			case "u":
				//this.image.src = `Weapon/${this.name}/up.png`;
				this.activeImage = this.imageUp;
				break;
			case "d":
				//this.image.src = `Weapon/${this.name}/down.png`;
				this.activeImage = this.imageDown;
				break;
		}
		this.lastAnimationTime = Date.now();
		this.currentFrame = 0;
	}

	// Попадания ещё для каждого оружия по-своему рассчитывать надо. Да и урон. И скорость. Возможно, иконка оружия для меню или инвентаря
	draw(context, x, y){
		if(!this.isHitting()){
			return;
		}
		// TODO: remove
		//console.log(this.currentFrame);		
		const currentTime = Date.now();
		if(currentTime - this.lastAnimationTime >= 1000/ this.animationVelocity / this.frames){
			this.lastAnimationTime = currentTime;
			this.currentFrame++;
		}

		if(this.currentFrame > this.frames){
			this.currentFrame = -1;
			return;
		}

		if(!this.damage && this.currentFrame - 1 == this.hittingFrame){
			this.damage = new Damage(this.hitRate);
		}
		if(this.damage && (this.damage.delivered || this.currentFrame - 1 != this.hittingFrame)){
			this.damage = null;
		}

		context.drawImage(this.activeImage, (this.currentFrame-1) * this.activeImage.width / this.frames, 0, this.activeImage.width / this.frames, this.activeImage.height, x, y, this.activeImage.width / this.frames, this.activeImage.height);
	}
	isHitting() { return this.currentFrame >= 0; }
}

class Damage{
	constructor(value){
		this.value = value;
		this.delivered = false;
	}
}
class Mist{
	constructor(screen){
		this.screen = screen;
		this.image = new Image();
		this.image.src = "Mist_large.png";
		this.startingPoint = 0;
		this.lastScreenX = 0;
	}

	draw(context){
		this.startingPoint += 1 + this.screen.x - this.lastScreenX;
		this.lastScreenX = this.screen.x;
		if(this.startingPoint >= 4000) // размер изображения - 4000, размер экрана - 1000. Итого когда будет последний помещающийся на экран кусок - отмотать
		{
			this.startingPoint = 0;
		}
		if(this.startingPoint < 0){
			this.startingPoint = 4000;
		}

		context.drawImage(this.image, this.startingPoint, 0, this.screen.canvas.width, this.screen.canvas.height, 0, 0, this.screen.canvas.width, this.screen.canvas.height); // Тут всё неправильно
		if(this.startingPoint + this.screen.canvas.width > 4000){
			context.drawImage(this.image, this.startingPoint - 4000, 0,  this.screen.canvas.width, this.screen.canvas.height, 0, 0, this.screen.canvas.width, this.screen.canvas.height);
		}
	}
}

class CollisionManager{
	constructor(pixelsPerTile){
		this.pixelsPerTile = pixelsPerTile;
	}
	
	isObstacle(xTileNumber, yTileNumber){
		if (yTileNumber > collisions.length || xTileNumber > collisions[yTileNumber].length){
			return true;
		}

		return collisions[yTileNumber][xTileNumber] != 0;
	}

	isCollision(x, y){
		const xTileNumber = Math.floor(x / this.pixelsPerTile) - 1;
		const yTileNumber = Math.floor(y / this.pixelsPerTile);

		if (yTileNumber > collisions.length || xTileNumber > collisions[yTileNumber].length){
			return true;
		}

		return collisions[yTileNumber][xTileNumber] != 0;
	}

	getPossibleDistance(xStart, xEnd, yStart, yEnd, direction){
		const xStartTile = Math.floor(xStart / this.pixelsPerTile) - 1;
		const xEndTile = Math.floor(xEnd / this.pixelsPerTile) - 1;
		const yStartTile = Math.floor(yStart / this.pixelsPerTile);
		const yEndTile = Math.floor(yEnd / this.pixelsPerTile);

		switch (direction){
			case "r":	
				for(let j = xStartTile; j <= xEndTile; j++){
					for(let i = yStartTile; i <= yEndTile; i++){
						if(collisions[i][j] != 0){
							return false;
						}
					}
				}
				return true;
			case "l":
				for(let j = xStartTile; j >= xEndTile; j--){
					for(let i = yStartTile; i <= yEndTile; i++){
						if(collisions[i][j] != 0){
							return false;
						}
					}
				}
				return true;
			case "d":
				for(let j = yStartTile; j <= yEndTile; j++){
					for(let i = xStartTile; i <= xEndTile; i++){
						if(collisions[j][i] != 0){
							return false;
						}
					}
				}
				return true;
			case "u":
				for(let j = yStartTile; j >= yEndTile; j--){
					for(let i = xStartTile; i <= xEndTile; i++){
						if(collisions[j][i] != 0){
							return false;
						}
					}
				}
				return true;
		}
	}
}

class HeatMap{
	constructor(width, height, pixelsInTile, collisionManager){
		this.width = width;
		this.height = height;
		this.pixelsInTile = pixelsInTile;
		this.collisionManager = collisionManager;
		this.map = [];
		for(let i = 0; i < this.height; i++){
			this.map[i] = [];
		}

		this.maxValue = Math.floor(Math.max(width, height)) + 1;
		this.lastXTile = 0;
		this.lastYTile = 0;

		this.lastX = 0;
		this.lastY = 0;
	}
	
	// Локальная карта - по пикселю, когда враг уже подошёл глобально и теперь надо только сократить листанцию
	buildLocal(x, y, width, height){
		if(x == this.lastX && y == this.lastY){
			return;
		}
		this.lastX = x;
		this.lastY = y;
		const localSize = this.pixelsInTile*3; // в квадрате 3*3 будем
	}

	build(x, y){
		const xTileNumber = Math.floor(x / this.pixelsInTile);
		const yTileNumber = Math.floor(y / this.pixelsInTile);
		if(xTileNumber == this.lastXTile && yTileNumber == this.lastYTile){
			return;
		}
		this.lastXTile = xTileNumber;
		this.lastYTile = yTileNumber;

		for(let i = 0; i < this.height; i++){
			for(let j = 0; j < this.width; j++){
				this.map[i][j] = this.maxValue;
			}
		}
		let currentMinimals = [];
		let currentMinimalValue = 0;
		

		this.map[yTileNumber][xTileNumber] = currentMinimalValue;
		currentMinimals.push({x: xTileNumber, y: yTileNumber});

		currentMinimalValue++;
		while (currentMinimals.length > 0){
			let nextMinimals = [];
			while(currentMinimals.length > 0){
				let tile = currentMinimals.pop();
				this.addIfPossibleAndNeeded(tile.x - 1, tile.y, currentMinimalValue, nextMinimals);
				this.addIfPossibleAndNeeded(tile.x + 1, tile.y, currentMinimalValue, nextMinimals);
				this.addIfPossibleAndNeeded(tile.x, tile.y + 1, currentMinimalValue, nextMinimals);
				this.addIfPossibleAndNeeded(tile.x, tile.y - 1, currentMinimalValue, nextMinimals);
			}
			currentMinimals = nextMinimals;
			currentMinimalValue++;
		}
		// TODO: remove
		//console.log(this.map);
		// for(let i = 0; i < this.height; i++){
		// 	console.log(this.map[i]);
		// }
		// for(let i = 0; i < this.height; i++){
		// 	for(let j = 0; j < this.width; j++){
		// 		console.log(this.map[i][j]);
		// 	}
		// }
	}

	addIfPossibleAndNeeded(x, y, currentMinimalValue, nextMinimals){
		if(this.possibleToAdd(x, y) && !this.alreadyAdded(x, y, nextMinimals) 
		&& !this.collisionManager.isObstacle(x, y) && this.map[y][x] > currentMinimalValue){
			this.map[y][x] = currentMinimalValue;
			nextMinimals.push({x:x, y:y});
		}	
	}

	possibleToAdd(x, y){
		if(x < 0 || y < 0 || x >= this.width || y >= this.height){
			return false;
		}

		return true;
	}

	alreadyAdded(x, y, nextMinimal){
		nextMinimal.forEach(item => {if(item.x == x && item.y == y) return true;});

		return false;
	}
}

class Enemy{
	constructor(name, health, x, y, velocity, collisionManager, screen, pixelsInTile, weapon){
		this.name = name;
		this.health = health;
		this.x = x;
		this.y = y;
		this.velocity = velocity;
		this.collisionManager = collisionManager;
		this.screen = screen;
		this.pixelsInTile = pixelsInTile;
		this.weapon = weapon;
		this.image = new Image();
		this.image.src = `${this.name}/Move/down.png`;
		this.action = "s";
		this.frame = 0;
		this.lastAnimationTime = Date.now();
		this.wound = null;
		this.framesInAnimation = 4;
	}
	
	isAlive(){
		return this.health > 0;
	}
	
	getDirection(){
		if(this.image.src.includes(`${this.name}/Move/right.png`)){
			return "r"
		}
		if(this.image.src.includes(`${this.name}/Move/left.png`)){
			return "l"
		}
		if(this.image.src.includes(`${this.name}/Move/down.png`)){
			return "d"
		}
		if(this.image.src.includes(`${this.name}/Move/up.png`)){
			return "u"
		}
	}

	turnRight() {this.image.src = `${this.name}/Move/right.png`;}
	turnLeft() {this.image.src = `${this.name}/Move/left.png`;}
	turnUp() {this.image.src = `${this.name}/Move/up.png`;}
	turnDown() {this.image.src = `${this.name}/Move/down.png`;}

	takeDamage(damage){
		this.health -= damage;
		const direction = this.action != "s" ? this.action 
			: this.image.src == `${this.name}/Move/right.png` ? "r" 
			: this.image.src == `${this.name}/Move/left.png` ? "l" 
			: this.image.src == `${this.name}/Move/up.png` ? "u" : "d";
		this.wound = new Wound(direction);
	}

	selectAction(){
		const xTileNumber = Math.floor(this.x / this.pixelsInTile);
		const yTileNumber = Math.floor(this.y / this.pixelsInTile);
		
		if(gameDirector.heatMap.map[yTileNumber][xTileNumber] === 1){
			if(gameDirector.heatMap.map[yTileNumber + 1][xTileNumber] === 0){
				this.turnDown();
			}
			else if(gameDirector.heatMap.map[yTileNumber - 1][xTileNumber] === 0){
				this.turnUp();
			}
			else if(gameDirector.heatMap.map[yTileNumber][xTileNumber + 1] === 0){
				this.turnRight();
			}
			else if(gameDirector.heatMap.map[yTileNumber][xTileNumber - 1] === 0){
				this.turnLeft();
			}
			return "h";
		}

		if(gameDirector.heatMap.map[yTileNumber][xTileNumber] === 0){
			if(this.x >= gameDirector.character.x + gameDirector.character.image.width / gameDirector.character.framesInAnimation 
				&& this.x + this.image.width / this.framesInAnimation >= gameDirector.character.x + gameDirector.character.image.width / gameDirector.character.framesInAnimation){
				this.turnLeft();
			}
			else if(this.x <= gameDirector.character.x && this.x + this.image.width / this.framesInAnimation <= gameDirector.character.x){
				this.turnRight();
			}
			else if(this.y >= gameDirector.character.y + gameDirector.character.image.height 
					&& this.y + this.image.height >= gameDirector.character.y + gameDirector.character.image.height){
				this.turnUp();
			}
			else if(this.y <= gameDirector.character.y && this.y + this.image.height <= gameDirector.character.y){
				this.turnDown;
			}
			return "h";
		}

		let selectedTileWeight = gameDirector.heatMap.map[yTileNumber][xTileNumber + 1];
		let currentAction =  "r";

		if(gameDirector.heatMap.map[yTileNumber][xTileNumber - 1] < selectedTileWeight){
			selectedTileWeight = gameDirector.heatMap.map[yTileNumber][xTileNumber - 1];
			currentAction = "l";
		}
		if(gameDirector.heatMap.map[yTileNumber + 1][xTileNumber] < selectedTileWeight){
			selectedTileWeight = gameDirector.heatMap.map[yTileNumber + 1][xTileNumber];
			currentAction = "d";
		}
		if(gameDirector.heatMap.map[yTileNumber - 1][xTileNumber] < selectedTileWeight){
			selectedTileWeight = gameDirector.heatMap.map[yTileNumber - 1][xTileNumber];
			currentAction = "u";
		}

		// Не ходить через препятствия
		// if(selectedTileWeight >= gameDirector.heatMap.maxValue){
		// 	currentAction = "s";
		// 	return;
		// }

		return currentAction;
	}

	selectAndPerformAction(){
		if(!this.isAlive()){
			return;
		}
		// Если совершается удар, никакого выбора действий
		if(this.weapon.isHitting()){
			return;
		}

		const currentAction = this.selectAction();
		
		if (currentAction != this.action && currentAction != "h" && currentAction != "s"){
			switch(currentAction){
				case "r":
					this.turnRight();
					break;			
				case "l":	
					this.turnLeft();
					break;
				case "d":
					this.turnDown();
					break;
				case "u":
					this.turnUp();;	
					break;
			}
		}

		// щас костыли будут, чтобы подскочить окончательно
		if(currentAction === "h"){
			const direction = this.getDirection();
			if(direction === "r" && this.x + this.image.width / this.framesInAnimation < gameDirector.character.x - 1){
				this.x = gameDirector.character.x - this.image.width / this.framesInAnimation - 1;
			}
			else if(direction === "l" && this.x > gameDirector.character.x + gameDirector.character.image.width / gameDirector.character.framesInAnimation + 1){
				this.x = gameDirector.character.x + gameDirector.character.image.width / gameDirector.character.framesInAnimation + 1;
			}
			else if(direction === "d" && this.y + this.image.height < gameDirector.character.y - 1){
				this.y =  gameDirector.character.y - this.image.height - 1;
			}
			else if(direction === "u" && this.y > gameDirector.character.y + gameDirector.character.image.height + 1){
				this.y = gameDirector.character.y + gameDirector.character.image.height + 1;
			}
			this.action = currentAction;
			
			this.weapon.hit(direction);
			
			return;
		}

		switch(currentAction){
			case "r":
				//if(!this.collisionManager.isCollision(x + 1, y)){
				this.x += this.velocity;					
				//}	
				break;			
			case "l":	
				this.x -= this.velocity;		
				break;
			case "d":
				this.y += this.velocity;
				break;
			case "u":
				this.y -= this.velocity;
				break;
		}

		this.action = currentAction;
	}

	setFrame(){
		const currentTime = Date.now();
		if((currentTime - this.lastAnimationTime) < 1000 / this.framesInAnimation){
			return;
		}

		if(this.action == "s" || this.action == "h"){
			this.frame = 0;
			return;
		}

		this.frame++;
		this.lastAnimationTime = currentTime;
		if(this.frame >= this.framesInAnimation){
			this.frame = 0;				
		}
	}

	findTarget(){
		let startX, endX, startY, endY;
		const direction = this.getDirection();
		if(direction === "r"){
			startX = this.x + this.image.width / this.framesInAnimation;
			endX = startX + this.weapon.range;
			startY = this.y;
			endY = this.y + this.image.height;
		}
		else if(direction === "l"){
			startX = this.x - this.weapon.range;
			endX = this.x;
			startY = this.y;
			endY = this.y + this.image.height;
		}
		else if(direction === "d"){
			startX = this.x;
			endX = this.x + this.image.width / this.framesInAnimation;
			startY = this.y + this.image.height;
			endY = startY + this.weapon.range;
		}
		else if(direction === "u"){
			startX = this.x;
			endX = this.x + this.image.width / this.framesInAnimation;
			startY = this.y - this.weapon.range;
			endY = this.y;
		}

		// TODO sort by distance
		// for (let m of gameDirector.characters)
		// {
		// 	// TODO явно 4 задано!
		// 	if(m.x <= endX && m.x + m.image.width / m.framesInAnimation >= startX && m.y <= endY && m.y + m.image.height >= startY){
		// 		return m;
		// 	}
		// }
		if(gameDirector.character.x <= endX && gameDirector.character.x + gameDirector.character.image.width / gameDirector.character.framesInAnimation >= startX && gameDirector.character.y <= endY && gameDirector.character.y + gameDirector.character.image.height >= startY){
			return gameDirector.character;
		}

		return null;
	}


	draw(context){
		if(!this.isAlive()){
			return;
		}

		if(this.x < this.screen.x || this.x > this.screen.x + this.screen.canvas.width || this.y < this.screen.y || this.y > this.screen.y + this.screen.canvas.height){
			return;
		}
		
		if(this.weapon.isHitting()){
			this.weapon.draw(context, this.x - this.screen.x, this.y - this.screen.y);

			// Вообще не отсюда, тут про отрисовку только по идее
			if(this.weapon.damage && !this.weapon.damage.delivered){
				const target = this.findTarget();
				if(target){
					target.takeDamage(this.weapon.damage.value);
					this.weapon.damage.delivered = true;
				}
			}
		}

		// --- Wound ---
		if(this.wound && this.wound.frame == -1){
			this.wound = null;
		}

		if(this.wound){
			this.wound.draw(this.x - this.screen.x, this.y - this.screen.y, context);
		}
		// -------

		this.setFrame();

		context.drawImage
		(
			this.image,
			this.frame * this.image.width / this.framesInAnimation,
			0,
			this.image.width / this.framesInAnimation,
			this.image.height,
			this.x - this.screen.x,
			this.y - this.screen.y,
			this.image.width / this.framesInAnimation,
			this.image.height
		);
	}
}

class Wound{
	constructor(direction){
		this.image = new Image();
		this.lastTime = Date.now();
		this.frame = 0;
		switch(direction){
			case "r":
				this.image.src = "wound_right.png"
				break;
			case "l":
				this.image.src = "wound_left.png"
				break;
			case "d":
				this.image.src = "wound_down.png"
				break;
			case "u":
				this.image.src = "wound_up.png"
				break;
		}
	}

	setFrame(){
		let currentTime = Date.now();
		if(currentTime - this.lastTime < 1000/16){
			return;
		}
		this.lastTime = currentTime;
		this.frame++;
		if(this.frame > 3){
			this.frame = -1;
		}
	}

	draw(x, y, context){
		if(this.frame < 0){
			return;
		}
		this.setFrame();
		context.drawImage(this.image, this.frame * this.image.width / 4, 0, this.image.width / 4, this.image.height, x, y, this.image.width / 4, this.image.height);
	}
}

const canvas = document.querySelector("#canvas");
const context = canvas.getContext("2d");
let gameDirector = {};

resize();

characterSelection();


function start(city, character, mist)
{
	//const timer = setInterval(() => update(city, character, mist), 1000/5);
	let previousTime  = Date.now();
	function animate(){
		if(gameDirector.gameFinished){
			return;
		}
		requestAnimationFrame(() => {
			requestAnimationFrame(animate);
			const currentTime = Date.now();
			if(currentTime - previousTime >= 1000/30){
				previousTime = currentTime;
				update(city, character, mist);
			}			
		});
	}

	animate();
}

function resize()
{
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

function keyDown(e, character)
{
	console.log(e.keyCode);
	
	if(character.activeWeapon.isHitting()){
		return;
	}

	switch(e.keyCode)
	{
		case 32:
			character.hit();
			break;	
		// Влево
		case 37:
			character.move("l");
			break;
		// Вправо
		case 39:
			character.move("r");
			break;
		// Вверх
		case 38:
			character.move("u");
			break;
		// Вниз
		case 40:
			character.move("d");
			break;
		case 49:
			character.activeWeapon = character.weapon[0];
			break;
		case 50:
			if(character.weapon.length > 1){
				character.activeWeapon = character.weapon[1];
			}
			break;
		case 51:
			character.takeDamage(0);
			break;
	}
}

function update(city, character, mist)
{
	context.clearRect(0, 0, canvas.width, canvas.height);
	
	city.draw(context);
	character.draw(context);
	mist.draw(context);
	gameDirector.monsters.forEach(m => m.draw(context));
	//monsters[0].draw(context);
}

// -----------------Character selection menu-------------------------
function characterSelection(){
	
	context.clearRect(0, 0, canvas.width, canvas.height);

	const titleWidth = 500,
		  titleHeight = 100;
	
	const charSheetWidth = 348,
		  charSheetHeight = 206,
		  verticalStartingPosition = titleHeight + 10,
		  imageLeftPosition = canvas.width / 2 - charSheetWidth / 2,
		  margin = 10;
	
	const characterNames = ["Mark", "Amanda", "Michael"];
	let selectedCharacter = 0;
	let imagesLoaded = 0;
	
	const headerImage = new Image();
	headerImage.onload = onImageLoaded;
	headerImage.src = "Select_character.png";

	const selectedCharacterImage = new Image();
	selectedCharacterImage.onload = onImageLoaded;
	selectedCharacterImage.src = "selection_mark.png";						

	let characters = [];
	characterNames.forEach((characterName, number) =>{
		const character = {
			name: characterName
		};

		characters.push(character);

		character.image = new Image();
		character.image.onload = onImageLoaded;
		character.image.src = `${characterName}/charsheet.png`;	
	});

	function onImageLoaded(){
		imagesLoaded++;
		if(imagesLoaded === characterNames.length + 2){
			prepareMenu();
		}
	}

	function drawMenu(){
		context.drawImage(headerImage, canvas.width / 2 - titleWidth / 2, 0);
		
		characters.forEach((character, number) => {
			context.drawImage(character.image, imageLeftPosition, verticalStartingPosition + (charSheetHeight + margin) * number);
						
			if(selectedCharacter === number){
				context.drawImage(selectedCharacterImage, imageLeftPosition - 10, verticalStartingPosition + (charSheetHeight + margin) * number - 10);	
			}
		});
	}
	
	function prepareMenu(){
		drawMenu();

		document.onmousemove = e => {
			if(e.x >=  imageLeftPosition && e.x <=  imageLeftPosition + charSheetWidth && 
				e.y >= verticalStartingPosition && e.y <= verticalStartingPosition + (charSheetHeight + margin) * (characterNames.length - 1) + charSheetHeight){
					
					const newSelected = Math.floor((e.y - verticalStartingPosition) / (charSheetHeight + margin));
					if(newSelected != selectedCharacter){
						requestAnimationFrame(() => {
							context.clearRect(0, 0, canvas.width, canvas.height);
							drawMenu();
						});		
					}
	
					selectedCharacter = newSelected;
			}
	
		};
	
		// Fix case if clicked on margin
		canvas.onclick = (e) => {

			if(e.x >=  imageLeftPosition && e.x <=  imageLeftPosition + charSheetWidth && 
				e.y >= verticalStartingPosition && e.y <= verticalStartingPosition + (charSheetHeight + margin) * (characterNames.length - 1) + charSheetHeight){
					
					const selectedCharacter = Math.floor((e.y - verticalStartingPosition) / (charSheetHeight + margin));
					document.onmousemove = '';		
				    startGame(characterNames[selectedCharacter]);
			}
		};
	}
		
}


function startGame(characterName){		
	canvas.onclick = null;

	const screen = new GameScreen(canvas, 2/3);
	const cityImage = new Image();
	cityImage.onload = (e) => OnCityImageLoaded(e.target, screen, characterName);
	cityImage.src = "Map_3.png";
	
}

// Переделать - вынесено в эту функцию из-за того, что видимо до создания персонажа не успевает карта города загрузиться и размеры 0 получаются
function OnCityImageLoaded(cityImage, screen, characterName){
	const scale = 1.5;
	const city = new City(cityImage, 0, 0, screen, scale);
	const  collisionManager = new CollisionManager(24*scale);
	gameDirector.heatMap = new HeatMap(Math.floor(city.image.width*scale/24) + 1, Math.floor(city.image.height*scale/24) + 1, 24*scale, collisionManager);
	const weapon = [new Weapon("Knife", 5, 3, 1, 5, 2), new Weapon("Pistol", 5, 4, 2, 400, 1)];
	const character = new Character(characterName, 5, 280*scale, 300*scale, 5, screen, city.image.width*scale, city.image.height*scale, collisionManager, weapon); // 4000 5000 было image.widt image.height
	const mist = new Mist(screen);
	gameDirector.character = character; // TODO: поместить heatMap в персонажа
	gameDirector.maxMonsters = 5;
	gameDirector.monsters = [];
	gameDirector.monsters.push(new Enemy("Cultist", 3, 1500, 3500, 4, collisionManager, screen, 24*scale, new Weapon("Knife", 5, 3, 1, 1, 3)));
	
	window.addEventListener("resize", resize);
	window.addEventListener("keydown", onKeyDown);
	
	gameDirector.mainTimer = setInterval(() => {
		gameDirector.monsters = gameDirector.monsters.filter(m => m.isAlive());
		gameDirector.monsters.forEach(m => m.selectAndPerformAction());
		// Условия поражения
		if(gameDirector.character.health <= 0){
			clearGame();
			characterSelection();
		}
	} , 1000/30);

	gameDirector.monsterRespawnTimer = setInterval(() =>{
		if(gameDirector.monsters.length < gameDirector.maxMonsters){
			let ok = false;
			let x, y;
			while(!ok){
				x = Math.floor(Math.random()*10000 % (city.image.width * scale));
				y = Math.floor(Math.random()*10000 % (city.image.height * scale));
				const xTileNumber = Math.floor(x / (24*scale));
				const yTileNumber = Math.floor(y / (24*scale));
				if(x <= city.image.width * scale && y <= city.image.height * scale && gameDirector.heatMap.map[yTileNumber][xTileNumber] != gameDirector.heatMap.maxValue){
					ok = true;
				}
			}
			gameDirector.monsters.push(new Enemy("Cultist", 3, x, y, 4, collisionManager, screen, 24*scale, new Weapon("Knife", 5, 2, 1, 5, 3)));
		}
	}, 10000);
	
	function onKeyDown(e){
		keyDown(e, character);
	}

	function  clearGame(){
		window.removeEventListener("resize", resize);
		window.removeEventListener("keydown", onKeyDown);
		clearInterval(gameDirector.mainTimer);
		clearInterval(gameDirector.monsterRespawnTimer);
		gameDirector.gameFinished = true;
	}

	start(city, character, mist);
}

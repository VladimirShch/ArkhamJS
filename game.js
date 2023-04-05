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
	constructor(characterName, x, y, velocity, screen, mapWidth, mapHeight, collisionManager, weapon)
	{
		this.characterName = characterName;
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
	}
	hit(){
		this.activeWeapon.hit(this.previousDirection, this.x - this.screen.x, this.y - this.screen.y);
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

	draw(context){

		if(this.activeWeapon.isHitting()){
			this.activeWeapon.draw(context);
		}

		this.setAnimation();

		context.drawImage
		(
			this.image,
			this.frame * this.image.width / 4,
			0,
			this.image.width / 4,
			this.image.height,
			this.x - this.screen.x,
			this.y - this.screen.y,
			this.image.width / 4,
			this.image.height
		);
	}
}

class Weapon{
	constructor(name, frames, hitRate, animationVelocity){
		this.name = name;
		this.frames = frames;
		this.hitRate = hitRate;
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
		this.x = 0;
		this.y = 0;
	}
	hit(direction, x, y){
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
		this.x = x;
		this.y = y;
	}
	// Попадания ещё для каждого оружия по-своему рассчитывать надо. Да и урон. И скорость. Возможно, иконка оружия для меню или инвентаря
	draw(context){
		if(!this.isHitting()){
			return;
		}

		console.log(this.currentFrame);
		
		const currentTime = Date.now();
		if(currentTime - this.lastAnimationTime >= 1000/ this.animationVelocity / this.frames){
			this.lastAnimationTime = currentTime;
			this.currentFrame++;
		}

		if(this.currentFrame > this.frames){
			this.currentFrame = -1;
			return;
		}

		context.drawImage(this.activeImage, (this.currentFrame-1) * this.activeImage.width / this.frames, 0, this.activeImage.width / this.frames, this.activeImage.height, this.x, this.y, this.activeImage.width / this.frames, this.activeImage.height);
	}
	isHitting() { return this.currentFrame >= 0;}
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

let canvas = document.querySelector("#canvas");
let context = canvas.getContext("2d");

resize();

characterSelection();


function start(city, character, mist)
{
	//const timer = setInterval(() => update(city, character, mist), 1000/5);
	let previousTime  = Date.now();
	function animate(){
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
	}
}

function update(city, character, mist)
{
	context.clearRect(0, 0, canvas.width, canvas.height);
	
	city.draw(context);
	character.draw(context);
	mist.draw(context);
}

// -----------------Character selection menu-------------------------
function characterSelection(){
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
	const scale = 1.5;
	const cityImage = new Image();
	cityImage.onload = (e) => OnCityImageLoaded(e.target, screen, scale, characterName);
	cityImage.src = "Map_3.png";
	
}

// Переделать - вынесено в эту функцию из-за того, что видимо до создания персонажа не успевает карта города загрузиться и размеры 0 получаются
function OnCityImageLoaded(cityImage, screen, scale, characterName){
	const city = new City(cityImage, 0, 0, screen, scale);
	let  collisionManager = new CollisionManager(24*scale);
	const weapon = [new Weapon("Knife", 5, 1, 2), new Weapon("Pistol", 5, 2, 1)];
	const character = new Character(characterName, 280*scale, 300*scale, 5, screen, city.image.width*scale, city.image.height*scale, collisionManager, weapon); // 4000 5000 было image.widt image.height
	const mist = new Mist(screen);

	window.addEventListener("resize", resize);
	window.addEventListener("keydown", (e) => keyDown(e, character));

	start(city, character, mist);
}

"use strict"

class City
{
	constructor(imageSource, x, y, screen)
	{
		this.x = x;
		this.y = y;
		this.screen = screen;
		this.image = new Image();
		this.image.src = imageSource;
	}

	draw(context){
		context.drawImage
		(
			this.image,
			this.screen.x,
			this.screen.y,
			1000,
			800,
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
		this.distanceToMove = distanceToMove;
	}
}

class Character
{	
	constructor(characterName, x, y, screen, mapWidth, mapHeight)
	{
		this.characterName = characterName;
		this.x = x;
		this.y = y;
		this.screen = screen;
		this.mapWidth = mapWidth;
		this.mapHeight = mapHeight;
		this.lastAnimationX = x;
		this.lastAnimationY = y;
		this.framesInAnimation = 4; // Потому что 4 изображения всего на анимацию
		this.frame = 0;
		this.image = new Image();
		this.image.src = `${this.characterName}/Move/down.png`;
		this.previousDirection = "d";
		this.lastAnimationTime = Date.now();
	}
	
	Move(direction)
	{
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
				this.x++;
			}
			
			if((this.x - this.screen.x)/this.screen.canvas.width >= this.screen.distanceToMove 
				&& this.screen.x + this.screen.canvas.width < this.mapWidth){
				this.screen.x++
			}
		}
		else if(direction == "l")
		{	
			if(this.x > 0){
				this.x--;
			}		
			
			if((this.x - this.screen.x)/this.screen.canvas.width <= (1 - this.screen.distanceToMove) && this.screen.x > 0){
				this.screen.x--;
			}
		}
		else if(direction == "d")
		{	
			if(this.y < this.mapHeight){
				this.y++;
			}		
						
			if((this.y - this.screen.y)/this.screen.canvas.height >= this.screen.distanceToMove && this.screen.y + this.screen.canvas.height < this.mapHeight){
				this.screen.y++;
			}
		}
		else if(direction == "u")
		{		
			if(this.y > 0){
				this.y--;
			}	
			
			if((this.y - this.screen.y)/this.screen.canvas.height <= 1 - this.screen.distanceToMove && this.screen.y > 0){
				this.screen.y--;
			}
		}

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

class Mist{
	constructor(screen){
		this.screen = screen;
		this.image = new Image();
		this.image.src = "Mist_large.png";
		this.startingPoint = 0;
	}

	draw(context){
		if(this.startingPoint >= 3000) // размер изображения - 4000, размер экрана - 1000. Итого когда будет последний помещающийся на экран кусок - отмотать
		{
			this.startingPoint = 0
		}
		else{
			this.startingPoint += 1;
		}
		context.drawImage(this.image, this.startingPoint + this.screen.x, 0, 1000, 800, 0, 0, canvas.width, canvas.height); // Тут всё неправильно
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
	switch(e.keyCode)
	{
		// Влево
		case 37:
			character.Move("l");
			break;
		// Вправо
		case 39:
			character.Move("r");
			break;
		// Вверх
		case 38:
			character.Move("u");
			break;
		// Вниз
		case 40:
			character.Move("d");
			break;
	}
}

function update(city, character, mist)
{
	context.clearRect(0, 0, canvas.width, canvas.height);
	//moveMapIfNeeded(city, character);
	
	city.draw(context);
	character.draw(context);
	mist.draw(context);
}

// function moveMapIfNeeded(city, character){
// 	// Всё костыли - переделать!!! получается, что шагаем, координаты прибавляем мы на событие нажатия клавиши, а перерисовываем и двигаем карту - по таймеру
// 	if(character.x !== character.lastX || character.y !== character.lastY){
// 		// Идем вправо, персонаж ушел на 2/3 экрана или больше
// 		if(character.previousDirection === "r" && character.x >= canvas.width / 3 * 2 && city.x + canvas.width <= city.image.width){
// 			const dif = character.x - character.lastAnimationX;
// 			character.x -= dif;
// 			character.lastAnimationX -= dif;
// 			city.x += dif;
// 			if(city.x + canvas.width > city.image.width){
// 				city.x = city.image.width - canvas.width;
// 			}
// 		}
// 		// Идем влево
// 		if(character.previousDirection === "l" && character.x <= canvas.width / 3 && city.x > 0){
// 			const dif = character.lastAnimationX - character.x;
// 			character.x += dif;
// 			character.lastAnimationX += dif;
// 			city.x -= dif;
// 			if(city.x < 0){
// 				city.x = 0;
// 			}
// 		}
// 		// Идем вниз
// 		if(character.previousDirection === "d" && character.y >= canvas.height / 3 * 2 && city.y + canvas.height <= city.image.height){
// 			const dif = character.y - character.lastAnimationY;
// 			character.y -= dif;
// 			character.lastAnimationY -= dif;
// 			city.y += dif;
// 			if(city.y + canvas.height > city.image.height){
// 				city.y = city.image.height - canvas.height;
// 			}
// 		}
// 		// Идем вверх
// 		if(character.previousDirection === "u" && character.y <= canvas.height / 3 && city.y > 0){
// 			const dif = character.lastAnimationY - character.y;
// 			character.y += dif;
// 			character.lastAnimationY += dif;
// 			city.y -= dif;
// 			if(city.y < 0){
// 				city.y = 0;
// 			}
// 		}
// 	}
	
// }

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
	const city = new City("Map_3.png", 0, 0, screen);
	const character = new Character(characterName, 500, 300, screen, 4000, 5000);
	const mist = new Mist(screen);

	window.addEventListener("resize", resize);
	window.addEventListener("keydown", (e) => keyDown(e, character));

	start(city, character, mist);
}

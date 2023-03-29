"use strict"

class City
{
	constructor(imageSource, x, y)
	{
		this.x = x;
		this.y = y;
		this.image = new Image();
		this.image.src = imageSource;
	}
}

class Character
{	
	constructor(characterName, x, y)
	{
		this.characterName = characterName;
		this.x = x;
		this.y = y;
		this.lastX = x;
		this.lastY = y;
		this.startingFrame = 0;
		this.framesPerImage = 1;
		this.endingFrame = 4 * this.framesPerImage; // Потому что 4 изображения всего на анимацию
		this.frame = this.startingFrame;
		this.image = new Image();
		this.image.src = `${this.characterName}/Move/down.png`;
		this.previousDirection = "d";
		//this.animationNum = 0;
		//this.angle = "90";
		//this.image.onload = () => this.image.style.transform = `rotate(${this.angle}deg)`;
		//this.rotation = 0; // радианы
	}
	
	Move(direction)
	{
		if(direction == "r")
		{ 
			//this.image.style.transform = "rotate(0deg)";
			//this.rotation = 0;
			this.image.src = `${this.characterName}/Move/right.png`;
			this.x++;
		}
		else if(direction == "l")
		{
			//this.angle = '180';
			//this.image.style.transform = "rotate(180deg)";
			//this.rotation = 3,14159;
			this.image.src = `${this.characterName}/Move/left.png`;
			this.x--;
		}
		else if(direction == "d")
		{
			//this.image.style.transform = "rotate(270deg)";
			//this.rotation = -1,5708;
			this.image.src = `${this.characterName}/Move/down.png`;
			this.y++;
		}
		else if(direction == "u")
		{
			//this.image.style.transform = "rotate(90deg)";
			//this.rotation = 1,5708;
			this.image.src = `${this.characterName}/Move/up.png`;
			this.y--;
		}
		
		if(direction !== this.previousDirection){
			this.frame = 0;
		}

		this.previousDirection = direction;
	}
	
	setAnimation()
	{
		if(this.x == this.lastX && this.y == this.lastY)
		{
			this.frame  = 0;
		}
		else
		{
			//this.image.src  = `${this.characterName}/Move/${(this.frame/this.framesPerImage + 1)}.png`;
			if(this.frame == this.endingFrame - 1)
			{
				this.frame = this.startingFrame;				
			}
			else
			{
				this.frame++;				
			}
			
			this.lastX = this.x;
			this.lastY = this.y;
		}
	}	
}

class Mist{
	constructor(){
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
			this.startingPoint += 2;
		}
		context.drawImage(this.image, this.startingPoint, 0, 1000, 800, 0, 0, canvas.width, canvas.height); // Тут всё неправильно
	}
}

let canvas = document.querySelector("#canvas");
let context = canvas.getContext("2d");

resize();

characterSelection();


function start(city, character, mist)
{
	const timer = setInterval(() => update(city, character, mist), 1000/5);
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
	moveMapIfNeeded(city, character);
	context.drawImage
	(
		city.image,
		city.x,
		city.y,
		1000,
		800,
		0,
		0,
		canvas.width,
		canvas.height
	);
	
	character.setAnimation();
	//context.save();
	//context.translate(canvas.width/2, canvas.height/2);
	//context.translate(character.x, character.y);
	//context.rotate(character.rotation);
	context.drawImage
	(
		character.image,
		Math.floor(character.frame/character.framesPerImage) * (character.image.width / 4),
		0,
		character.image.width / 4,
		character.image.height,
		character.x,
		character.y,
		character.image.width / 4,
		character.image.height
	);
	//context.rotate(-character.rotation);
	//context.translate(-character.x, -character.y);
	//context.restore();

	mist.draw(context);
}

function moveMapIfNeeded(city, character){
	// Всё костыли - переделать!!! получается, что шагаем, координаты прибавляем мы на событие нажатия клавиши, а перерисовываем и двигаем карту - по таймеру
	if(character.x !== character.lastX || character.y !== character.lastY){
		// Идем вправо, персонаж ушел на 2/3 экрана или больше
		if(character.previousDirection === "r" && character.x >= canvas.width / 3 * 2 && city.x + canvas.width <= city.image.width){
			const dif = character.x - character.lastX;
			character.x -= dif;
			character.lastX -= dif;
			city.x += dif;
			if(city.x + canvas.width > city.image.width){
				city.x = city.image.width - canvas.width;
			}
		}
		// Идем влево
		if(character.previousDirection === "l" && character.x <= canvas.width / 3 && city.x > 0){
			const dif = character.lastX - character.x;
			character.x += dif;
			character.lastX += dif;
			city.x -= dif;
			if(city.x < 0){
				city.x = 0;
			}
		}
		// Идем вниз
		if(character.previousDirection === "d" && character.y >= canvas.height / 3 * 2 && city.y + canvas.height <= city.image.height){
			const dif = character.y - character.lastY;
			character.y -= dif;
			character.lastY -= dif;
			city.y += dif;
			if(city.y + canvas.height > city.image.height){
				city.y = city.image.height - canvas.height;
			}
		}
		// Идем вверх
		if(character.previousDirection === "u" && character.y <= canvas.height / 3 && city.y > 0){
			const dif = character.lastY - character.y;
			character.y += dif;
			character.lastY += dif;
			city.y -= dif;
			if(city.y < 0){
				city.y = 0;
			}
		}
	}
	
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

	let city = new City("Map_3.png", 0, 0);
	let character = new Character(characterName, 500, 300);
	const mist = new Mist();

	window.addEventListener("resize", resize);
	window.addEventListener("keydown", (e) => keyDown(e, character));

	start(city, character, mist);
}

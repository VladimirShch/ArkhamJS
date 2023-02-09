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
		this.image.src = `${this.characterName}/stand.png`;
		this.angle = "90";
		this.image.onload = () => this.image.style.transform = `rotate(${this.angle}deg)`;
		//this.rotation = 0;
	}
	
	Move(direction)
	{
		if(direction == "r")
		{ 
			//this.image.style.transform = "rotate(0deg)";
			//this.rotation = 0;
			this.x++;
		}
		else if(direction == "l")
		{
			this.angle = '180';
			//this.image.style.transform = "rotate(180deg)";
			//this.rotation = 180;
			this.x--;
		}
		else if(direction == "d")
		{
			//this.image.style.transform = "rotate(270deg)";
			//this.rotation = -90;
			this.y++;
		}
		else if(direction == "u")
		{
			//this.image.style.transform = "rotate(90deg)";
			//this.rotation = 90;
			this.y--;
		}		
	}
	
	SetAnimation()
	{
		if(this.x == this.lastX && this.y == this.lastY)
		{
			//this.frame++;
			//if(this.frames >= this.framesPerImage)
			//{
				this.frame = this.startingFrame;
				this.image.src = `${this.characterName}/stand.png`;
			//}			
		}
		else
		{
			this.image.src  = `${this.characterName}/Move/${(this.frame/this.framesPerImage + 1)}.png`;
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

let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

Resize();

characterSelection();


function Start(city, character)
{
	const timer = setInterval(() => Update(city, character), 1000/5);
}

function Resize()
{
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

function KeyDown(e, character)
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

function Update(city, character)
{
	context.clearRect(0, 0, canvas.width, canvas.height);
	
	context.drawImage
	(
		city.image,
		0,
		0,
		1000,
		800,
		city.x,
		city.y,
		canvas.width,
		canvas.height
	);
	
	character.SetAnimation();
	//context.save();
	//context.translate(canvas.width/2, canvas.height/2);
	//context.rotate(character.rotation*Math.PI/180);
	context.drawImage
	(
		character.image,
		0,
		0,
		character.image.width,
		character.image.height,
		character.x,
		character.y,
		character.image.width,
		character.image.height
	);
	//context.restore();
}

function characterSelection(){
	const selectText = new Image();
	selectText.src = "Select_character.png";
	selectText.onload = () => context.drawImage(selectText, canvas.width / 2 - 90, 10);

	const markImage = new Image();
	markImage.src = "Mark/mark_charlist.png";
	markImage.onload = () => context.drawImage(markImage, canvas.width / 2 - markImage.width / 2, 50);
	
	const amandaImage = new Image();
	amandaImage.src = "Amanda/amanda_charlist.png";
	amandaImage.onload = () => context.drawImage(amandaImage, canvas.width/2 - amandaImage.width / 2, 50 + markImage.height + 10);
	
	const michaelImage = new Image();
	michaelImage.src = "Michael/michael_charlist.png";
	michaelImage.onload = () => context.drawImage(michaelImage, canvas.width/2 - michaelImage.width / 2, 50 + markImage.height + amandaImage.height + 20);

	canvas.onclick = (e) => {
		if(e.x >=  canvas.width / 2 - markImage.width / 2 && e.x <=  canvas.width / 2 + markImage.width / 2 && 
			e.y >= 50 && e.y <= 50 + markImage.height){				
			StartGame("Mark");
		}
		else if(e.x >=  canvas.width/2 - amandaImage.width / 2 && e.x <=  canvas.width/2 + amandaImage.width / 2 && 
			e.y >= 50 + markImage.height + 10 && e.y <= 50 + markImage.height + 10 + amandaImage.height){
			StartGame("Amanda");
		}
		else if(e.x >= michaelImage, canvas.width/2 - michaelImage.width / 2 && michaelImage, canvas.width/2 + michaelImage.width / 2 && 
			e.y >=50 + markImage.height + amandaImage.height + 20 && e.y <= 50 + markImage.height + amandaImage.height + 20 + michaelImage.height){
			StartGame("Michael");
		}
	};
	
}


function StartGame(characterName){		
	canvas.onclick = null;

	let city = new City("Map_3.png", 0, 0);
	let character = new Character(characterName, 500, 300);
	
	window.addEventListener("resize", Resize);
	window.addEventListener("keydown", (e) => KeyDown(e, character));

	Start(city, character);
}

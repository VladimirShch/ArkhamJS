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
	constructor(characterFolder, x, y)
	{
		this.characterFolder = characterFolder;
		this.x = x;
		this.y = y;
		this.lastX = x;
		this.lastY = y;
		this.startingFrame = 0;
		this.framesPerImage = 1;
		this.endingFrame = 4 * this.framesPerImage; // Потому что 4 изображения всего на анимацию
		this.frame = this.startingFrame;
		this.image = new Image();
		this.image.src = this.characterFolder + "/stand.png";
		
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
		else if(direction == "u")
		{
			//this.image.style.transform = "rotate(90deg)";
			//this.rotation = 90;
			this.y--;
		}
		else if(direction == "l")
		{
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
	}
	
	SetAnimation()
	{
		if(this.x == this.lastX && this.y == this.lastY)
		{
			//this.frame++;
			//if(this.frames >= this.framesPerImage)
			//{
				this.frame = this.startingFrame;
				this.image.src = this.characterFolder + "/stand.png";
			//}			
		}
		else
		{
			this.image.src  = this.characterFolder + "/Move/"+ (this.frame/this.framesPerImage + 1) + ".png";
			if(this.frame == this.endingFrame)
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

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

Resize();

window.addEventListener("resize", Resize);
window.addEventListener("keydown", function (e) {KeyDown(e);});

var city = new City("Map_3.png", 0, 0);
var character = new Character("Michael", 20, 20);

Start();

function Start()
{
	timer = setInterval(Update, 1000/5);
}

function Resize()
{
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

function KeyDown(e)
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

function Update()
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


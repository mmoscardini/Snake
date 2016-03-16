$(document).ready(function () {
    //Variables
    var cw; //cell width
	var d; //direction
	var food;
	var score;

    //Get canvas stuff
    var canvas = $("#canvas")[0];
    var ctx = canvas.getContext("2d");
    var w = $("#canvas").width();
    var h = $("#canvas").height();
	
	var nx; //snake head x position
	var ny; // snake head y position
    init();

    //(re)Start Game
    function init() {
		//assign standard variables
		d = "right";
		cw = 10;
		score = 0;
		
        createSnake();
		SpawnFood();
		
		//create Update
		if (typeof game_loop != "undefined") clearInterval(game_loop);
        game_loop = setInterval(Update, 60);
		
    };

    //Create the snake - Array of squares
    var snakeArray;
    function createSnake() {
        var size = 5;
        snakeArray = [];
        for (var i = size-1; i >= 0; i--) {
            snakeArray.push({ x: i, y: 0 });
        }
    }

	//#######################################################################
	//START UPDATE 
    function Update() {
		//Paint background every frame to overwrite past positions
		ctx.fillStyle = "white";
		ctx.fillRect(0,0,h,w);
		
        //paint the snake
        for (var i = 0; i < snakeArray.length; i++) {
            var s = snakeArray[i];
            paintCell(s.x,s.y,"blue");
        }
		
		//paint food
		paintCell(food.x, food.y,"red");
		
		SnakeMoviment();
		EatFood();
		
		
		//Losing Condition
		if (nx == -1 || nx == w / cw || ny == -1 || ny == h / cw || check_collision(nx,ny,snakeArray)) {
            //restart game
            init();
			return;
        }
		
		//Scoring
		var scoreText = "Score: " + score;
		ctx.font = "15px Helvetica";
		ctx.fillStyle = "black";
		ctx.fillText(scoreText, 15 , h - 15);
    }
	//END UPDATE
	//#######################################################################
	
	//Paint generic Cell
		function paintCell (x,y,color){
			ctx.fillStyle = color;
			ctx.fillRect(x * cw, y * cw, cw, cw);
			ctx.strokeStyle = "white";
			ctx.strokeRect(x * cw, y * cw, cw, cw);
		}
	
	//Snake Moviment
	function SnakeMoviment(){
		//Every 60ms move the tail in front of the head
		nx = snakeArray[0].x;
		ny = snakeArray[0].y;
		//Increment head position depending on where the snake is facing
		if (d == "right") nx++;
        else if (d == "left") nx--;
        else if (d == "up") ny--;
        else if (d == "down") ny++;
	}
	
	//Control painting if the player eats food or just keep walking
	function EatFood(){
		//if the head and food are in the same place, the snake grow
		if (nx == food.x && ny == food.y){
			var grow = {x:nx, y:ny};
			snakeArray.unshift(grow);
			score++;
			SpawnFood();
		}
		//else (head food diferent places) the snake moves normaly
		else {
			var tail = snakeArray.pop(); //remove and store the last array position
			tail.x = nx; tail.y = ny; //move it to the new head position
			snakeArray.unshift(tail); //create new cell at the beguining of the array
		}
	}
	
	//Spawn new food on the screen
	function SpawnFood(){
		food = {
			x: Math.round(Math.random() * (w - cw) / cw),
            y: Math.round(Math.random() * (h - cw) / cw)
		}
		//If he food spawns beneath the snake, recreate food
		for (var i = 0; i < snakeArray.length; i++) {
            if (food.x == snakeArray[i].x && food.y == snakeArray[i].y){
				SpawnFood();
			}
        }
	}
	
	//Check if the head and other body cell are in the same coordenates 
	//(x,y) for head coord and array for snake
	function check_collision(x,y,array){
		for (var i = 1; i < array.length; i++) {
            if (array[i].x == x && array[i].y == y)
                return true;
        }
        return false;
	}
	
	//Keyboard Input - change direction
	$(document).keydown(function(e){
		var key = e.which;
		if (key == "37" && d != "right") d = "left";
        else if (key == "38" && d != "down") d = "up";
        else if (key == "39" && d != "left") d = "right";
        else if (key == "40" && d != "up") d = "down";
	});
});
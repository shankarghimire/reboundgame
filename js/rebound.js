//variables to hold DOM
var playingArea;
var ball;
var paddle;
var score;
var gear;
var controls;
var newButton;
var difficultySelect;
var doneButton;
var snd;
var music;
var exitButton;

//variables to hold configured Information
var aWidth; //to hold available width of the screen
var aHeight; // to hold the available height of the screen
var pWidth;//playing area width
var pHeight; // playing area height
var dx = 2; // to hold horizontal moving speed
var dy = 1; //to hold vertical moving speed
var pdx = 48; //to hold paddle moving speed
var currentScore = 0;
var timer;
var paddleLeft = 228;
var ballLeft = 100;
var ballTop = 8;
var drag = false;
var sndEnabled = false;
var musicEnabled = false;
var isGameOver = false;

var beepX;
var beepY;
var beepPaddle;
var beepGameOver;
var bgMusic;

//AddEventListener
window.addEventListener('load',init);
window.addEventListener('resize',init);

//functions definions
function init(){
    playingArea = document.getElementById('playingArea');
    ball = document.getElementById('ball');
    paddle = document.getElementById('paddle');
    score = document.getElementById('score');
    gear = document.getElementById('gear');
    controls = document.getElementById('controls');
    newButton = document.getElementById('new');
    difficultySelect = document.getElementById('difficulty');
    doneButton = document.getElementById('done');
    exitButton = document.getElementById('exit');
    snd = document.getElementById('snd');
    music = document.getElementById('music');

    //calls layoutPage() function
    layoutPage();

    //keyboard event listener using function
    //document.addEventListener('keydown', keyListener, false);

    //keyboard event listener using Arrow Function
    document.addEventListener('keydown', e =>{
        var key = e.keyCode;
        if((key == 37 && paddleLeft > 0)){
            paddleLeft -= pdx;
            if(paddleLeft < 0){
                paddleLeft = 0;
            }
        }
        else if((key == 39 && paddleLeft < (pWidth - 64)  )){
            paddleLeft += pdx;
            if(paddleLeft > (pWidth - 64)){
                paddleLeft = pWidth - 64;
            }           
        }
        paddle.style.left = paddleLeft + 'px';
    },false);
    
    //mouse down event listener using normal functions
    playingArea.addEventListener('mousedown',mouseDown,false);
    playingArea.addEventListener('mouseup',mouseUp,false);
    playingArea.addEventListener('mousemove',mouseMove,false);

    //touch event
    playingArea.addEventListener('touchstart',mouseDown,false);
    playingArea.addEventListener('touchend',mouseUp,false);
    playingArea.addEventListener('touchmove',mouseMove,false);
    
    //gear controls
    gear.addEventListener('click',showSettings,false);
    newButton.addEventListener('click',newGame,false);
    doneButton.addEventListener('click',hideSettings,false);
    exitButton.addEventListener('click',(e)=>{
        alert("See you soon! \n" +"     ☺☺☺");
        window.close();
    },false);

    difficultySelect.addEventListener('change',function(){
        setDifficulty(difficultySelect.selectedIndex)
    },false);

    snd.addEventListener('click',toggleSound,false);
    music.addEventListener('click',toggleMusic,false);

    //calls function setBallPosition
    setBallStartPosition();
    //start game animation
    timer = window.requestAnimationFrame(startGame);
}

function setBallStartPosition(){
    ballLeft = pWidth /2;
    ballTop = 8;
    ball.style.left = ballLeft + 'px';
    ball.style.top = ballTop + 'px';

    //function call to generate x direction value
    dx = generateDirectionX(-3,3);
    //Generates the horizontal moving direction value in the range of -2 to + 2 randomly
    // var startRange = -2;
    // var endRange = 2;
    // dx = Math.round( (Math.random() * (endRange - startRange) + startRange)) ;
    // console.log("dx: " + dx);
}

function generateDirectionX(min,max){
   return Math.round( (Math.random() * (max - min) + min)) ;
}
function layoutPage(){

    aWidth = window.innerWidth;
    aHeight = window.innerHeight;
    pWidth = aWidth - 20;
    pHeight = aHeight - 50;
    playingArea.style.width = pWidth + 'px';
    playingArea.style.height = pHeight + 'px';

    console.log("pWidth: " + pWidth + " , pHeight : " + pHeight);
    var scoreHeight = score.clientHeight;
    var scoreHeight = score.clientHeight;
    console.log("score Height: " + scoreHeight);
}

//function to start animation
function startGame(){
    render();
    detectCollisions();
    //timer = window.requestAnimationFrame(startGame);

    if(ballTop < (pHeight -36) ){
        //alert("ballTop: " + ballTop + " , pHeight : " + pHeight);
        timer = requestAnimationFrame(startGame);
    }else{
        gameOver();
    }
}
//function to render animation
function render(){
    moveBall();   
    updateScore();
    difficulty();
}
//function to move ball
function moveBall(){
    ballLeft += dx;
    ballTop += dy;
    ball.style.left = ballLeft + 'px';
    ball.style.top = ballTop + 'px';
    //console.log("Ball Left : " + ballLeft + " , Ball Top: " + ballTop);
}

//function to detect collision of ball 
function detectCollisions(){
    if(collisionX()){
        dx *= -1;
    }
    if(collisionY()){
        dy *= -1;
    }
}

//function to detect left or right side collision
function collisionX(){
    if(ballLeft < 4 || ballLeft > pWidth -20){
        playSound(beepX);
        return true;
    }
    return false;
}

//function to detect bottom side collision
function collisionY(){
    
    if(ballTop < 0){
        playSound(beepY);
        return true;
    }
   
    if(ballTop > (pHeight -64) ){
        /*
        if(ballLeft >= paddleLeft && ballLeft <= paddleLeft + 64){
            dx = generateDirectionX(-8,8);
            return true;
        }
        */
 
        if(ballLeft >= paddleLeft + 16 && ballLeft < paddleLeft + 48){
           
            if( dx < 0){
                dx = -2;
            }
            else{
                dx = 2;
            }
            playSound(beepPaddle);
            return true;
        }
        else if(ballLeft >= paddleLeft && ballLeft < paddleLeft + 16){
            
            if( dx < 0){
                dx = -8;
            }
            else{
                dx = 8;
            }
            playSound(beepPaddle);
            return true;
        }
        else if(ball >= paddleLeft + 48 && ballLeft <= paddleLeft + 64){
       
            if( dx < 0){
                dx = -8;
            }
            else{
                dx = 8;
            } 
            playSound(beepPaddle);  
            return true;
        }
    }
    //console.log("ball Top: " + ballTop);
    return false;   
}

function keyListener(e){
    var key = e.keyCode;

    if((key == 37 && paddleLeft > 0)){
        paddleLeft -= pdx;
        if(paddleLeft < 0){
            paddleLeft = 0;
        }
    }
    else if((key == 39 && paddleLeft < (pWidth - 64)  )){
        paddleLeft += pdx;
        if(paddleLeft > (pWidth - 64)){
            paddleLeft = pWidth - 64;
        }   
    }
    paddle.style.left = paddleLeft + 'px';
    //console.log("paddleLeft : " + paddleLeft);
    //console.log("PWidth : " + pWidth);
}

//mouse events handler functions
function mouseDown(e){
    drag = true;
}

function mouseUp(e){ 
    drag = false;
}
function mouseMove(e){
    if(drag){
        //console.log("mouse move");
        e.preventDefault();
        paddleLeft = e.clientX -32 || e.targetTouches[0].pageX -32;
        if(paddleLeft < 0){
            paddleLeft = 0;
        }
        if(paddleLeft > (pWidth - 64)){
            paddleLeft = (pWidth - 64);
        }
        paddle.style.left = paddleLeft + 'px';
    } 
}

function difficulty(){
    if(currentScore % 1000 === 0){
        if( dy > 0){
            dy += 2;
        }
        else{
            dy -= 2;
        }
    }
}
function updateScore(){
    currentScore += 5;
    score.innerHTML = "Score : " +  currentScore;  
}


function showSettings(){
    controls.style.display = 'block';
    cancelAnimationFrame(timer);
    if(isGameOver){
        doneButton.disabled = true;
    }
    else{
        doneButton.disabled = false;
    }


}
function hideSettings(){
    //alert("Testing done Button");
    console.log("Testing doneButton!");
    controls.style.display = 'none';
    timer = requestAnimationFrame(startGame);

}

function setDifficulty(diff){
    switch( diff ){
        case 0:
            dy = 2;
            pdx = 48;
            break;
        case 1:
            dy = 4;
            pdx = 32;
            break;
        case 2:
            dy = 6;
            pdx = 16;
            break;
        default:
            dy = 2;
            pdx = 48;
    }
}

function newGame(){
    ball.style.display = "block";
    setBallStartPosition();
    // ballTop = 8;
    currentScore = 0;
    dx = 2;
    setDifficulty(difficultySelect.selectedIndex);
    //alert("difficulty level: " + difficultySelect.selectedIndex );
    score.style.backgroundColor = 'rgb(32,128,64)';
    hideSettings();
    isGameOver = false;
}

function toggleSound(){
    //alert("testing");
    if(beepX == null){
        initAudio();
    }
    sndEnabled = !sndEnabled;
}
function playSound(objSound){
    if(sndEnabled){
        objSound.play();
    }
}

function toggleMusic(){
    //alert("testing music checkbox");
    if(bgMusic == null){
        initAudio();
    }
    if(musicEnabled){
        bgMusic.pause();
    }else{
        bgMusic.loop = true;
        bgMusic.play();
    }
    musicEnabled = !musicEnabled;
    
}

function initAudio(){
    //load audio files
    beepX = new Audio('./sounds/beepX.mp3');
    beepY = new Audio('./sounds/beepY.mp3');
    beepPaddle = new Audio('./sounds/beepPaddle.mp3');
    beepGameOver = new Audio('./sounds/beepGameOver.mp3');
    bgMusic = new Audio('./sounds/music.mp3');
    

    //turn off volume
    beepX.volume = 0;
    beepY.volume = 0;
    beepPaddle.volume = 0;
    beepGameOver.volume = 0;
    bgMusic.volume = 0;

    //play each file
    beepX.play();
    beepY.play();
    beepPaddle.play();
    beepGameOver.play();
    bgMusic.play();

    //pauses each file
    //this stores them in memory for later
    beepX.pause();
    beepY.pause();
    beepPaddle.pause();
    beepGameOver.pause();
    bgMusic.pause();

    //set the volume
    beepX.volume = 1;
    beepY.volume = 1;
    beepPaddle.volume = 1;
    beepGameOver.volume = 1;
    bgMusic.volume = 1;
}

function gameOver(){
    cancelAnimationFrame(timer);
    score.innerHTML += "  Game Over!";
    score.style.backgroundColor = 'rgb(255,0,0)';
    ball.style.display = "none";
    playSound(beepPaddle);
    isGameOver = true;
    showSettings();

}
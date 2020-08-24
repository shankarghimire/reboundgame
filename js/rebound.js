//variables to hold DOM
var playingArea;


//variables to hold configured Information
var aWidth; //to hold available width of the screen
var aHeight; // to hold the available height of the screen
var pWidth;//playing area width
var pHeight; // playing area height




//AddEventListener
window.addEventListener('load',init);
window.addEventListener('resize',init);

//functions definions
function init(){
    playingArea = document.getElementById('playingArea');

    //calls layoutPage() function
    layoutPage();
}

function layoutPage(){
    aWidth = window.innerWidth;
    aHeight = window.innerHeight;
    pWidth = aWidth - 20;
    pHeight = aHeight - 20;
    playingArea.style.width = pWidth + 'px';
    playingArea.style.height = pHeight + 'px';
}
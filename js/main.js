const redTile = "red-tile";         //numerical value 1
const blueTile = "blue-tile";       //numberical value 2
const greenTile = "green-tile";     //numerical value 3
const yellowTile = "yellow-tile";   //numerical value 4

const userClickArray = [];
const solutionarray = [];

//GAMESTATES
const PLAYERINPUTSTATE = "PLAYERINPUTSTATE";
const COMPUTERSHOWOFFSTATE = "COMPUTERSHOWOFFSTATE";

let gameState = PLAYERINPUTSTATE;
const BLINKINTERVAL = 1000; //interval when the computer shows off the pattern

let userClickCounter = 0;

//Adding onClick-listener to the tile area
$("#gametiles").click(event => {
   tileClickHandler(event.target.id);
});


//Event delegator method. The click registers the source, then
//this method handles what to do, based on the source.
function tileClickHandler(tileId){
    //first check if the user should be able to click at all.
    if(PLAYERINPUTSTATE === gameState){
        if(solutionarray.length > 0){
            switch(tileId){
                case redTile:
                    executeClick(redTile);
                    break;
                case blueTile:
                    executeClick(blueTile);
                    break;
                case greenTile:
                    executeClick(greenTile);
                    break;
                case yellowTile:
                    executeClick(yellowTile);
                    break;
                default:
                    //Handle error..
                    break;
            }
        } else {
            removeOverlay();
            generateSequence();//adds the first tile to the sequence.
        }
    } else {
        //TODO: give feedback to user if clicks are not handled
    }
}

//play audiofile and add tile to user array.
function executeClick(tileId) {
    playAudio(tileId);
    userClickArray.push(tileId);

    if(isClickCorrect(userClickCounter++)){
        if(userClickArray.length == solutionarray.length){
            userClickCounter = 0;
            userClickArray.length = 0;
            generateSequence();
        }
    } else {
        gameOver();
    }
}
//convenience function D.R.Y.
function playAudio(tileId){
    console.log(tileId);
    let audio; 
    switch (tileId) {
        case redTile:
            audio = new Audio('../mp3/beep-02.mp3');
            break;
        case blueTile:
            audio = new Audio('../mp3/beep-06.mp3');
            break;
        case greenTile:
            audio = new Audio('../mp3/beep-07a.mp3');
            break;
        case yellowTile:
            audio = new Audio('../mp3/beep-08b.mp3');
            break;  
        default:
            break;
    }
    audio.play();
}
//removes the passive state game overlay
function removeOverlay(){
    $('.overlay').fadeToggle();
}

function generateSequence(){
    gameState = COMPUTERSHOWOFFSTATE;
    const randomTile = getRandomTile();
    solutionarray.push(randomTile);//adds a random tile to the end of the array
    
    blinkTilesInSolutionArray(BLINKINTERVAL, 0);
}

function isClickCorrect(index){
    const isEqual = userClickArray[index]===solutionarray[index];
    console.log(isEqual);
    return isEqual;
}

function gameOver(){
    $('.overlay').fadeToggle();
    $('.overlay-text').text("Game over! Click to play again!");
    gameState = PLAYERINPUTSTATE;
    userClickArray.length = 0;
    solutionarray.length = 0;
    userClickCounter = 0;
    new Audio('./mp3/beep-03.mp3').play();
}
// Goes through the solutionarray and blinks the tile that corresponds to the ID
// that corresponds with a given index in the array.
function blinkTilesInSolutionArray(timeBetweenBlinks, index){
 
    setTimeout(_ => {
       
        $(`#${solutionarray[index]}`).addClass('active');
        playAudio(solutionarray[index]);
        //Reomoving the class before full framecycle has passed.
        //This is important in case there are two frames of same color after each other
        setTimeout(_=> {
            $(`#${solutionarray[index-1]}`).removeClass('active');
        }, timeBetweenBlinks*0.75);

        if(solutionarray.length > ++index){
            blinkTilesInSolutionArray(timeBetweenBlinks, index);
        } else {
            gameState = PLAYERINPUTSTATE;
        }
    }, timeBetweenBlinks);
}

//this function erases all values stored in the solutionarray. I.e. resets the game.
function eraseSequence(){
    solutionarray.length = 0;
}


//Switches gamestate between playerinputstate, where playerinputs are accepted
//and computershowoffstate, where the computer shows current sequence.
function switchGameState(){
    if(gameState === COMPUTERSHOWOFFSTATE){
        gameState = PLAYERINPUTSTATE;
    } else {
        gameState = COMPUTERSHOWOFFSTATE;
    }
}

// this function returns a random tile. The value is aligned with the
// HTML attribute ID of the tiles
function getRandomTile(){
    const randomNumber = Math.ceil(Math.random()*4);//4 because there is 4 tiles. Thats predetermined.
    let tile;
    switch (randomNumber) {
        case 1:
            tile = redTile;
            break;
        case 2:
            tile = blueTile;
            break;
        case 3:
            tile = greenTile;
            break;
        case 4:
            tile = yellowTile;
            break;
        default:
            tile = null;
            break;
    }
   return tile;
}
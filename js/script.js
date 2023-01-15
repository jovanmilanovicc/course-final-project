const playerConfigOverlay = document.getElementById('config-overlay');
const backDrop = document.getElementById('backdrop')

const editPlayer1 = document.getElementById('edit-player1');
const editPlayer2 = document.getElementById('edit-player2');

const cancelBtn = document.getElementById('cancel-btn');

const form = document.querySelector('form');
const formErrors = document.getElementById('config-errors');

const startGame = document.getElementById('start-btn');
const gameArea = document.getElementById('active-game');

const gameFields = document.querySelector('#game-board');
const activePlayerName = document.getElementById('active-player-name'); 

const gameOverElement = document.getElementById('game-over');

//Helper var
let gameData = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
];
let editedPlayer = 0;
let activePlayer = 0;
let currentRound = 1;
let gameIsOver = false;
let players = [{
    name: '',
    symbol: 'X'
},
    {
        name: '',
        symbol: 'O'
    }];
//**Helper var **/

//Make enter username appear

editPlayer1.addEventListener('click', event => {
    playerConfigOverlay.style.display = 'block';
    backDrop.style.display = 'block';

    editedPlayer = +event.target.dataset.playerid
});

editPlayer2.addEventListener('click', event => {
    playerConfigOverlay.style.display = 'block';
    backDrop.style.display = 'block';

    editedPlayer = +event.target.dataset.playerid;
})

function closeForm(event){
    playerConfigOverlay.style.display = 'none';
    backDrop.style.display = 'none';
    form.firstElementChild.classList.remove('error');
    formErrors.textContent = '';
    form.firstElementChild.lastElementChild.value = '';
}

cancelBtn.addEventListener('click', closeForm);

backDrop.addEventListener('click', closeForm);
//**Make enter username appear**
//Getting and validating form data
form.addEventListener('submit', event => {
    event.preventDefault();
    //const userName = event.target.playername.value;
    const formData = new FormData(event.target);
    const enteredName = formData.get('playername').trim();

    if(!enteredName){
        event.target.firstElementChild.classList.add('error');
        formErrors.textContent = 'Enter a valid name';
        return;
    }
    const updatePlayer = document.getElementById('player' + editedPlayer + '-data');
    updatePlayer.children[1].textContent = enteredName;

    players[editedPlayer - 1].name = enteredName;
    
    closeForm();
});
//**Getting and validating form data**
//Start game

function resetGame(){
activePlayer = 0;
currentRound = 0;
gameIsOver = false;
gameOverElement.firstElementChild.innerHTML = ' <h2>You won, <span id="winner-name">PLAYER NAME</span>!</h2>'; 
gameOverElement.style.display = 'none';

let gameIndex = 0;
for(let i = 0; i < 3; i++){
    for(let j = 0; j < 3; j++){
        gameData[i][j] = 0;
        gameFields.children[gameIndex].textContent = '';
        gameFields.children[gameIndex].classList.remove('disabled');

        gameIndex++;
    }
}
}

startGame.addEventListener('click', () => {
    if(players[0] == '' || players[1].name == ''){
        alert('Select player names');
        return;
    }

resetGame();

    gameArea.style.display = 'block';
    activePlayerName.textContent = players[activePlayer].name;
});
//Click on fields
function switchPlayer(){
    if(activePlayer === 0){
        activePlayer = 1;
    }else{
        activePlayer = 0;
    }
    activePlayerName.textContent = players[activePlayer].name;
}


gameFields.addEventListener('click', event => {
    if (event.target.tagName !== 'LI' || gameIsOver){
        return;
        
    }
    
    const selectedCol = event.target.dataset.col - 1;
    const selectedRow = event.target.dataset.rows - 1;

    if(gameData[selectedRow][selectedCol] > 0) {
        alert('Select an empty field')
        return;
    }

    event.target.textContent = players[activePlayer].symbol;
    event.target.classList.add('disabled');

    gameData[selectedRow][selectedCol] = activePlayer + 1;
   

    const winnerId =  gameOver();
    if(winnerId !== 0){
        endGame(winnerId);
    }
    console.log(winnerId);
    currentRound++;
    switchPlayer();
        
    })
//**Click on fields **
//**Start game **
function gameOver(){
    //Check rows
    for(i = 0;i < 3;i++){
    if(gameData[i][0] > 0 && gameData[i][0] === gameData[i][1] && gameData[i][1] === gameData[i][2]){
        return gameData[i][0];
    }
}
//Check columns
for(i = 0;i < 3;i++){
    if(gameData[0][i] > 0 && gameData[0][i] === gameData[1][i] && gameData[1][i] === gameData[2][i]){
        return gameData[0][i];
    }
}
//Check diagonal
if(gameData[0][0] > 0 && gameData[0][0] === gameData[1][1] && gameData[1][1] === gameData[2][2]){
    return gameData[0][0];
}
if(gameData[2][0] > 0 && gameData[2][0] === gameData[1][1] && gameData[1][1] === gameData[0][2]){
    return gameData[2][0];
}
if(currentRound === 9){
    return -1;

}

return 0;
    
}

function endGame(winnerId){
    gameIsOver = true;
    gameOverElement.style.display= 'block';
    if(winnerId > 0){
    const winnerName = players[winnerId - 1].name;
    gameOverElement.firstElementChild.firstElementChild.textContent = winnerName;
    }else{
        gameOverElement.firstElementChild.textContent = 'Its a draw';
    }
}



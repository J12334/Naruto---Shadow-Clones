
//this project is object oriented designed pattern
//class is basically blueprint of object you create
class AudioController{
    constructor() {
        this.bgMusic = new Audio('Sound/bgmusic.mp3');
        this.flipSound = new Audio('Sound/flip.wav');
        this.matchSound = new Audio('Sound/match.mp3');
        this.victorySound = new Audio('Sound/victory.mp3');
        this.gameOverSound = new Audio('Sound/gameover.mp3');
        this.bgMusic.volume = 0.5;
        this.matchSound.volume = 0.4;
        this.bgMusic.loop = true;
    }

    startMusic(){
        this.stopMusic();
        this.bgMusic.play();
    }

    stopMusic(){
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;

        // this.matchSound.pause();
        // this.matchSound.currentTime = 0;

        this.gameOverSound.pause();

        this.victorySound.pause();
        // this.gameOverSound.currentTime = 0;
    }

    flip(){
        this.flipSound.currentTime = 0;
        this.flipSound.play();
    }

    match(){
        this.matchSound.currentTime = 0;
        this.matchSound.play();
    }

    victory(){
        this.stopMusic();
        this.victorySound.currentTime = 0;
        this.victorySound.play();
    }
    
    gameOver(){
        this.stopMusic();
        this.gameOverSound.currentTime = 0;
        this.gameOverSound.play();
    }
}

class Konoha{
    constructor(totaltime, cards){
        this.cardsArray = cards;
        this.totaltime = totaltime;
        this.timeRemaining = totaltime;
        this.timer = document.getElementById('time-remaining');
        this.ticker = document.getElementById('flips');
        this.audioController = new AudioController();
    }

    startGame(){
        this.cardToCheck = null;
        this.totalClicks = 0;
        this.timeRemaining = this.totaltime;
        this.matchedCards = [];
        this.busy = true;
        
        this.hideCards();

        setTimeout(() => {
            this.audioController.startMusic();
            this.shuffleCards();
            this.countdown = this.startCountdown();
            this.busy = false;
        }, 500);
        
        this.timer.innerText = this.timeRemaining;
        this.ticker.innerText = this.totalClicks;
    }

    shuffleCards(){
        for(let i = this.cardsArray.length - 1; i>0; i--){
            //fisheryets shuffling algorithm
            //random creats any num from 0 to 1
            let rIndex = Math.floor(Math.random() * (i+1));
            this.cardsArray[rIndex].style.order = i;
            this.cardsArray[i].style.order = rIndex;
        }
    }

    hideCards() {
        this.cardsArray.forEach(card => {
            card.classList.remove('visible');
            card.classList.remove('matched');
        });
    }

    flipCard(card){
        if(this.canFlipCard(card)){
            this.audioController.flip();
            this.totalClicks++;
            this.ticker.innerText = this.totalClicks;
            card.classList.add('visible');

            if(this.cardToCheck){
               this.checkForCardMatch(card);
            }else{
               this.cardToCheck = card;
            }
        }
    }

    
    canFlipCard(card){
        // return true;
        return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
    }

    checkForCardMatch(card){
        if(this.getCardType(card) === this.getCardType(this.cardToCheck)){
           this.cardmatch(card, this.cardToCheck);
        }else{
           this.cardmismatch(card, this.cardToCheck);
        }

        this.cardToCheck = null;
    }

    cardmismatch(card1, card2){
        this.busy = true;
        setTimeout(() => {
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy = false;
        }, 700);
    }

    cardmatch(card1, card2){
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        card1.classList.add('matched');
        card2.classList.add('matched');
        this.audioController.match();
        if(this.matchedCards.length === this.cardsArray.length){
            this.victory();
        }
    }

    getCardType(card){
        //checking src of image 
        return card.getElementsByClassName('card-value')[0].src;
    }

    startCountdown(){
        return setInterval(() => {
            this.timeRemaining--;
            this.timer.innerText = this.timeRemaining;
            if(this.timeRemaining === 0){
                this.gameOver();
            }
        }, 1000);
    }

    gameOver(){
        clearInterval(this.countdown);
        this.audioController.gameOver();
        document.getElementById('game-over-text').classList.add('visible');
    }

    victory(){
        clearInterval(this.countdown);
        this.audioController.victory();
        document.getElementById('victory-text').classList.add('visible'); 
    }

    
}



function ready(){

    let overlays = Array.from(document.getElementsByClassName('overlay-text'));
    let cards = Array.from(document.getElementsByClassName('card'));
    let game = new Konoha(60, cards);

    overlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible');
            // //instance of our AuridoController class
            // //own properties and functions 
            // let audioController = new AudioController();
            // audioController.startMusic();
            game.startGame();
        });
    });

    cards.forEach(card => {
        card.addEventListener('click', () => {
             game.flipCard(card);
        });
    });

}


if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', ready());
}else{
    ready();
}



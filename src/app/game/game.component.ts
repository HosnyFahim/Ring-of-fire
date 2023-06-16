import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  currentCard: string = '';
  game!: Game;
  constructor() {}

  ngOnInit(): void {
    this.newGame();
  }

  newGame() {
    this.game = new Game();
    console.log(this.game);
  }

  takeCard() {
    if (!this.game.pickCardAnimation) {
      
   
      this.currentCard = this.game.stack.pop()!;
      this.pickCardAnimation = true;
      console.log('New Card' + this.currentCard);
      console.log('Gane', this.game);
      setTimeout(() => {
        this.game.playedcards.push(this.currentCard);
        this.pickCardAnimation = false;
      }, 700);
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Firestore, collectionData, collection, setDoc, doc, docData, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { EditPlayerComponent } from '../edit-player/edit-player.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit{
  game!: Game;
  gameId!: String;

  constructor(private route: ActivatedRoute, private firestore: Firestore, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((params: any) => {
      this.gameId = params.id
      const document = doc(this.firestore,`games/${this.gameId}`);
      docData(document).subscribe((data: any) => {
        this.game.currentPlayer = data.game.currentPlayer;
        this.game.playedCards = data.game.playedCards;
        this.game.stack = data.game.stack;
        this.game.players = data.game.players;
        this.game.player_images = data.game.player_images;
        this.game.pickCardAnimation = data.game.pickCardAnimation;
        this.game.currentCard = data.game.currentCard;
      })
    }) 
  }

  newGame() {
    this.game = new Game();
  }

  takeCard() {
    if (this.game.players.length > 1) {
      if (this.game.stack.length == 0) {
        this.setGameOver();
      } else if (!this.game.pickCardAnimation && this.game.players.length > 0) {
        this.playCard();
        
        if (this.game.stack.length == 1) {
          // Letzte Karte wurde genommen, das Spiel ist vorbei
          this.setGameOver();
        }
      }
    } else {
      this.openDialog();
    }
  }

  playCard() {
    if(this.game.stack.length > 1){
      let popedCard = this.game.stack.pop() as string;
      this.game.currentCard = popedCard;
      this.game.pickCardAnimation = true;
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      this.saveGame();
      setTimeout(() => {
        this.game.playedCards.push(this.game.currentCard);
        this.game.pickCardAnimation = false;
        this.saveGame();
      }, 1000);
    }
  }

  setGameOver() {
    this.game.gameOver = true;
    this.saveGame();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if(name && name.length > 0) {
        this.game.players.push(name);
        this.game.player_images.push('1.webp');
        this.saveGame();
      }
    });
  }

  saveGame() {
    const document = doc(this.firestore,`games/${this.gameId}`);
    return updateDoc(document, { game: this.game.toJson() });
  }

  editPlayer(playerId: number) {
    const dialogRef = this.dialog.open(EditPlayerComponent);
    dialogRef.afterClosed().subscribe((change: string) => {
      if(change) {
        if(change == 'Delete') {
          this.game.players.splice(playerId, 1);
          this.game.player_images.splice(playerId, 1);
        } else {
          this.game.player_images[playerId] = change;
        }
        this.saveGame();
      }
    });
  }

  restartGame() {
    const prevPlayers = this.game.players;
    const prevPlayerImgs = this.game.player_images;
    this.game = new Game();
    this.game.players = prevPlayers;
    this.game.player_images = prevPlayerImgs;
    this.saveGame();
  }

}
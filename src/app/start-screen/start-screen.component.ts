import { Component, OnInit } from '@angular/core';
import { Firestore, collection, doc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Game } from 'src/models/game';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent implements OnInit {

  constructor(private firestore: Firestore, private router: Router) { }

  ngOnInit(): void {
      
  }

  newGame() {
    // Start Game
    let game = new Game();
    const coll = collection(this.firestore, "games");
    const docRef = doc(coll);
    setDoc(docRef, { game: game.toJson() })
    this.router.navigateByUrl(`/game/${docRef.id}`);
  }

}

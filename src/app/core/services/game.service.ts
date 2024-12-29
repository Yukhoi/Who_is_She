import { BehaviorSubject } from "rxjs";
import { Injectable } from '@angular/core';
import { Player } from "../interfaces/player.interface";

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private playersSource = new BehaviorSubject<Player[]>([]);
  private selectedPlayerSource = new BehaviorSubject<Player | null>(null);
  private showButtonSource = new BehaviorSubject<boolean>(true);

  players$ = this.playersSource.asObservable();
  selectedPlayer$ = this.selectedPlayerSource.asObservable();
  showButton$ = this.showButtonSource.asObservable();

  setPlayers(players: Player[]) {
    this.playersSource.next(players);
  }

  setSelectedPlayer(player: Player) {
    this.selectedPlayerSource.next(player);
  }

  setShowButton(show: boolean) {
    this.showButtonSource.next(show);
  }
}
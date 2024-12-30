import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Player } from '../../../core/interfaces/player.interface';

@Injectable({
  providedIn: 'root'
})
export class GuessingInterfaceService {

  private guessedPlayerSource = new BehaviorSubject<Player | null>(null);
  private tentativeSource = new BehaviorSubject<number>(1);
  private showResultsSource = new BehaviorSubject<boolean>(false);

  guessedPlayer$ = this.guessedPlayerSource.asObservable();
  tentative$ = this.tentativeSource.asObservable();
  showResults$ = this.showResultsSource.asObservable();

  setGuessedPlayer(player: Player) {
    this.guessedPlayerSource.next(player);
  }

  setTentative(tentative: number) {
    this.tentativeSource.next(tentative);
  }

  setShowResults(show: boolean) {
    this.showResultsSource.next(show);
  }
}

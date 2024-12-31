import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Player } from '../../core/interfaces/player.interface';
import { GameService } from '../../core/services/game.service';
import { SearchBoxComponent } from './components/search-box/search-box.component';
import { ResultListComponent } from './components/result-list/result-list.component';
import { GuessingInterfaceService } from './services/guessing-interface.service';

@Component({
  selector: 'app-guessing-interface',
  standalone: true,
  imports: [
    CommonModule,
    SearchBoxComponent,
    ResultListComponent,
  ],
  templateUrl: './guessing-interface.component.html',
  styleUrl: './guessing-interface.component.css',
})

export class GuessingInterfaceComponent {
  players: Player[] = [];
  selectedPlayer: Player | null = null;
  guessedPlayer: Player | null = null;
  showButton = true;
  showResults = false;
  tentative: number = 1;

  @Output() showButtonChange = new EventEmitter<boolean>();

  constructor(
    private gameService: GameService,
    private guessingInterfaceService: GuessingInterfaceService,
  ) {
  }

  ngOnInit() {
    this.gameService.players$.subscribe((players) => {
      this.players = players;
    });

    this.gameService.selectedPlayer$.subscribe((player) => {
      this.selectedPlayer = player;
    });

    this.gameService.showButton$.subscribe((show) => {
      this.showButton = show;
    });
  }

  onPlayerGuessed(player: Player) {
    this.guessedPlayer = player;
    this.guessingInterfaceService.setGuessedPlayer(player);
  }

  onShowResultsChange(show: boolean) {
    this.showResults = show;
    this.guessingInterfaceService.setShowResults(show);
  }

  onShowButtonChange(show: boolean) {
    this.showButton = show;
    this.showButtonChange.emit(show);
  }

  onTentativeChange(tentative: number) {
    this.tentative = tentative;
    this.guessingInterfaceService.setTentative(tentative);
  }
}
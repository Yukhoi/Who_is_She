import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Player } from './core/interfaces/player.interface';
import { StartButtonComponent } from './components/start-button/start-button.component';
import { GuessingInterfaceComponent } from './components/guessing-interface/guessing-interface.component';
import { GameService } from './core/services/game.service';
import { InfoDialogComponent } from './components/info-popup/info-popup.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, StartButtonComponent, GuessingInterfaceComponent, InfoDialogComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Who_is_She';
  players: Player[] = [];
  selectedPlayer: Player | null = null;
  showButton = true;

  constructor(private gameService: GameService) {}

  onPlayersChange(players: Player[]) {
    this.players = players;
    this.gameService.setPlayers(players);
  }

  onSelectedPlayerChange(player: Player) {
    this.selectedPlayer = player;
    this.gameService.setSelectedPlayer(player);
  }

  onShowButtonChange(showButton: boolean) {
    this.showButton = showButton;
    this.gameService.setShowButton(showButton);
  }
}

import { Component, Output, EventEmitter } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { Player } from '../../core/interfaces/player.interface';
import { GameMode } from './models';
import { StartButtonService } from './services/start-button.service';
import { GameService } from '../../core/services/game.service';

@Component({
  selector: 'app-start-button',
  standalone: true,
  imports: [MatSelectModule, MatFormFieldModule, FormsModule],
  templateUrl: './start-button.component.html',
  styleUrl: './start-button.component.css',
})
export class StartButtonComponent {
  players: Player[] = [];
  selectedPlayer: Player | null = null;
  selectedGameMode: GameMode = 'Easy Mode';
  showButton = true;

  @Output() playersChange = new EventEmitter<Player[]>();
  @Output() selectedPlayerChange = new EventEmitter<Player>();
  @Output() showButtonChange = new EventEmitter<boolean>();

  constructor(
    private startButtonService: StartButtonService,
    private gameService: GameService
  ) {}

  ngOnInit() {
    this.gameService.showButton$.subscribe((show) => {
      this.showButton = show;
    });
  }

  async getAndSelectRandomPlayer() {
    const response = await this.startButtonService.getPlayers();

    this.players = response || [];
    this.playersChange.emit(this.players);

    this.selectedPlayer = await this.startButtonService.SelectRandomPlayer(
      this.selectedGameMode,
      this.players
    );
    this.selectedPlayerChange.emit(this.selectedPlayer);

    this.showButton = false;
    this.showButtonChange.emit(this.showButton);
  }
}

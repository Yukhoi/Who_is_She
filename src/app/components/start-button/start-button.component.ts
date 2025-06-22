import { Component, Output, EventEmitter } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { Player } from '../../core/interfaces/player.interface';
import { GameMode } from './models';
import { StartButtonService } from './services/start-button.service';
import { GameService } from '../../core/services/game.service';
import {MatTooltipModule} from '@angular/material/tooltip';
import { InfoDialogComponent } from '../info-popup/info-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-start-button',
  standalone: true,
  imports: [MatSelectModule, MatFormFieldModule, FormsModule, MatTooltipModule, MatIconModule, InfoDialogComponent],
  templateUrl: './start-button.component.html',
  styleUrl: './start-button.component.css',
})
export class StartButtonComponent {
  players: Player[] = [];
  selectedPlayer: Player | null = null;
  selectedGameMode: GameMode = 'Easy Mode';
  selectedLeague: string = "Women's Super League";
  showButton = true;

  @Output() playersChange = new EventEmitter<Player[]>();
  @Output() selectedPlayerChange = new EventEmitter<Player>();
  @Output() showButtonChange = new EventEmitter<boolean>();

  constructor(
    private startButtonService: StartButtonService,
    private gameService: GameService,
    private dialog: MatDialog
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

  openInfoDialog(event: MouseEvent, title: string, message: string) {
    event.stopPropagation(); 
    this.dialog.open(InfoDialogComponent, {
      data: { title, message },
    });
  }
}

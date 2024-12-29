import { Component, OnInit, ChangeDetectorRef, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlayerDialogComponent } from './player-dialog/player-dialog.component';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import '../../node_modules/flag-icons/css/flag-icons.min.css';
import { Player } from './core/interfaces/player.interface';
import { StartButtonComponent } from './start-button/start-button.component';
import { GuessingInterfaceComponent } from './guessing-interface/guessing-interface.component';
import { GameService } from './core/services/game.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    AsyncPipe,
    ReactiveFormsModule,
    MatDialogModule,
    MatTableModule,
    StartButtonComponent,
    GuessingInterfaceComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Who_is_She';
  players: Player[] = [];
  selectedPlayer: Player | null = null;
  searchQuery: string = '';
  showButton = true;
  showResults = false;
  selectedGuess: Player | null = null;
  comparisonResultsList: any[] = [];
  searchBarControl = new FormControl('');
  filteredPlayers!: Observable<Player[]>;
  tentative = 1;
  totalGuesses = 8;
  displayedColumns: string[] = [
    'tentative',
    'player',
    'nationality',
    'team',
    'position',
    'age',
    'number',
  ];

  constructor(
    private gameService: GameService
  ) {}  

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

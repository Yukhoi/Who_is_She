import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Player } from '../../core/interfaces/player.interface';
import { GameService } from '../../core/services/game.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { PlayerDialogComponent } from '../player-dialog/player-dialog.component';
import { ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AsyncPipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SearchBoxComponent } from './components/search-box/search-box.component';
import { GuessingInterfaceService } from './services/guessing-interface.service';

@Component({
  selector: 'app-guessing-interface',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    CommonModule,
    MatTableModule,
    AsyncPipe,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    SearchBoxComponent,
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
  searchBarControl = new FormControl('');
  filteredPlayers!: Observable<Player[]>;
  tentative: number = 1;
  totalGuesses = 8;
  comparisonResultsList: any[] = [];
  displayedColumns: string[] = [
    'player',
    'nationality',
    'team',
    'position',
    'age',
    'number',
  ];
  dataSource: MatTableDataSource<any>;

  @Output() showButtonChange = new EventEmitter<boolean>();

  constructor(
    private gameService: GameService,
    private guessingInterfaceService: GuessingInterfaceService,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog,
  ) {
    this.dataSource = new MatTableDataSource();
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

  comparePlayer(guessedPlayer: any) {
    if (!this.selectedPlayer) return;

    this.showResults = true;
    const comparison = {
      player: guessedPlayer,
      results: {
        nationality:
          guessedPlayer.nationality === this.selectedPlayer.nationality,
        team: guessedPlayer.team === this.selectedPlayer.team,
        position: guessedPlayer.position === this.selectedPlayer.position,
        age: guessedPlayer.age === this.selectedPlayer.age,
        biggerAge: +guessedPlayer.age > +this.selectedPlayer.age,
        smallerAge: +guessedPlayer.age < +this.selectedPlayer.age,
        number: guessedPlayer.number === this.selectedPlayer.number,
        biggerNumber: +guessedPlayer.number > +this.selectedPlayer.number,
        smallerNumber: +guessedPlayer.number < +this.selectedPlayer.number,
        firstName: guessedPlayer.firstName === this.selectedPlayer.firstName,
        lastName: guessedPlayer.lastName === this.selectedPlayer.lastName,
      },
      id: this.tentative,
    };
    this.tentative++;
    this.guessingInterfaceService.setTentative(this.tentative);
    this.comparisonResultsList.push(comparison);
    this.dataSource.data = [...this.comparisonResultsList];

    if (
      comparison.results.nationality &&
      comparison.results.team &&
      comparison.results.position &&
      comparison.results.age &&
      comparison.results.number
    ) {
      this.openDialog(
        'Congratulations!',
        'You guessed the player correctly!',
        guessedPlayer,
      );
    } else if (this.tentative >= this.totalGuesses) {
      this.openDialog(
        'Game Over',
        'You have used all your guesses. The correct player was:',
        this.selectedPlayer,
      );
    }
    this.cdr.detectChanges();
  }

  openDialog(title: string, message: string, player: Player) {
    const dialogRef = this.dialog.open(PlayerDialogComponent, {
      data: {
        title: title,
        message: message,
        player: player,
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.resetGame();
    });
  }

  resetGame() {
    this.tentative = 1;
    this.guessingInterfaceService.setTentative(this.tentative);
    this.showButton = true;
    this.showButtonChange.emit(true);
    this.showResults = false;
    this.comparisonResultsList = [];
    this.searchBarControl.reset();
  }

  onPlayerSelected(player: Player) {
    this.comparePlayer(player);
  }

  onShowResultsChange(show: boolean) {
    this.showResults = show;
  }
}

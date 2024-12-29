import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
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

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
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
    StartButtonComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
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
  dataSource: MatTableDataSource<any>;

  constructor(
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.filteredPlayers = this.searchBarControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ' '))
    );
  }

  private _filter(value: string): Player[] {
    const filterValue = value.toLowerCase();

    return this.players.filter(
      (player) =>
        player.firstName.toLowerCase().includes(filterValue) ||
        player.lastName.toLowerCase().includes(filterValue)
    );
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
        biggerAge: (+guessedPlayer.age) > (+this.selectedPlayer.age),
        smallerAge: (+guessedPlayer.age) < (+this.selectedPlayer.age),
        number: guessedPlayer.number === this.selectedPlayer.number,
        biggerNumber: (+guessedPlayer.number) > (+this.selectedPlayer.number),
        smallerNumber: (+guessedPlayer.number) < (+this.selectedPlayer.number),
        firstName: guessedPlayer.firstName === this.selectedPlayer.firstName,
        lastName: guessedPlayer.lastName === this.selectedPlayer.lastName,
      },
      id: this.tentative,
    };
    this.tentative++;
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
        guessedPlayer
      );
    } else if (this.tentative >= this.totalGuesses) {
      this.openDialog(
        'Game Over',
        'You have used all your guesses. The correct player was:',
        this.selectedPlayer
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
    this.showButton = true;
    this.showResults = false;
    this.selectedPlayer = null;
    this.comparisonResultsList = [];
    this.searchBarControl.reset();
  }

  trackByFn(index: number, item: any): any {
    return item.id;
  }

  onPlayersChange(players: Player[]) {
    this.players = players;
  }

  onSelectedPlayerChange(player: Player) {
    this.selectedPlayer = player;
  }

  onShowButtonChange(showButton: boolean) {
    this.showButton = showButton;
  }
}

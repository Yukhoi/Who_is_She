import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
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

interface Player {
  id: number;
  firstName: string;
  lastName: string;
  nationality: string;
  team: string;
  position: string;
  age: number;
  number: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HttpClientModule,
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
  comparisonResultsLength = 0;
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
    private http: HttpClient,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.http
      .get<{ players: Player[] }>('assets/players/cleaned_data.json')
      .subscribe((data) => {
        this.players = data.players;
      });

    this.filteredPlayers = this.searchBarControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ' '))
    );
  }

  selectRandomPlayer() {
    if (this.players.length > 0) {
      const randomIndex = Math.floor(Math.random() * this.players.length);
      this.selectedPlayer = this.players[randomIndex];
      console.log('Selected player:', this.selectedPlayer);
      this.showButton = false;
    }
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

    this.comparisonResultsLength++;
    this.tentative++;
    this.showResults = true;

    const comparison = {
      player: guessedPlayer,
      results: {
        nationality:
          guessedPlayer.nationality === this.selectedPlayer.nationality,
        team: guessedPlayer.team === this.selectedPlayer.team,
        position: guessedPlayer.position === this.selectedPlayer.position,
        age: guessedPlayer.age === this.selectedPlayer.age,
        biggerAge: guessedPlayer.age > this.selectedPlayer.age,
        smallerAge: guessedPlayer.age < this.selectedPlayer.age,
        number: guessedPlayer.number === this.selectedPlayer.number,
        biggerNumber: guessedPlayer.number > this.selectedPlayer.number,
        smallerNumber: guessedPlayer.number < this.selectedPlayer.number,
        firstName: guessedPlayer.firstName === this.selectedPlayer.firstName,
        lastName: guessedPlayer.lastName === this.selectedPlayer.lastName,
      },
      id: this.comparisonResultsLength,
    };

    this.comparisonResultsList.push(comparison);
    this.dataSource.data = [...this.comparisonResultsList];

    console.log('Comparison results:', this.comparisonResultsList);

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
    console.log('Resetting game...');
    this.tentative = 0;
    this.showButton = true;
    this.showResults = false;
    this.selectedPlayer = null;
    this.comparisonResultsList = [];
    this.searchBarControl.reset();
    console.log('comparisonResultsList:', this.comparisonResultsList);
  }

  trackByFn(index: number, item: any): any {
    return item.id;
  }
}

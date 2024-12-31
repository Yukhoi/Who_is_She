import { Component, Input, ChangeDetectorRef, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Player } from '../../../../core/interfaces/player.interface';
import { GuessingInterfaceService } from '../../services/guessing-interface.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { PlayerDialogComponent } from '../../../player-dialog/player-dialog.component';
import { Comparison } from './models/comparison.interface';
import { ResultListService } from './services/result-list.service';

@Component({
  selector: 'app-result-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatDialogModule,
    CommonModule,
    PlayerDialogComponent,
  ],
  templateUrl: './result-list.component.html',
  styleUrl: './result-list.component.css'
})
export class ResultListComponent {

  @Input() showButton: boolean = true;
  @Input() selectedPlayer: Player | null = null;
  @Input() guessedPlayer: Player | null = null;
  @Output() showButtonChange = new EventEmitter<boolean>();
  @Output() showResultsChange = new EventEmitter<boolean>();
  @Output() tentativeChange = new EventEmitter<number>();
  // @Output() selectedPlayerChange = new EventEmitter<Player | null>();
  
  tentative: number = 1;
  totalGuesses: number = 8;
  showResults: boolean = false;
  comparisonResultsList: Comparison[] = [];
  dataSource: MatTableDataSource<any>;
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
    private guessingInterfaceService: GuessingInterfaceService,
    private resultListService: ResultListService,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog,
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.guessingInterfaceService.tentative$.subscribe(tentative => {
      this.tentative = tentative;
    });

    this.guessingInterfaceService.showResults$.subscribe(showResults => {
      this.showResults = showResults;
    });

    this.guessingInterfaceService.guessedPlayer$.subscribe(player => {
      this.guessedPlayer = player;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['guessedPlayer'] && changes['guessedPlayer'].currentValue) {
      this.onGuessedPlayerChange(changes['guessedPlayer'].currentValue);
    }
  }

  onGuessedPlayerChange(guessedPlayer: any) {
    if (!this.selectedPlayer || !guessedPlayer) return;

    this.showResults = true;
    this.showResultsChange.emit(true);

    const comparison = this.resultListService.comparePlayer(
      guessedPlayer,
      this.selectedPlayer,
      this.tentative
    );

    this.comparisonResultsList.push(comparison);
    this.tentative++;
    this.tentativeChange.emit(this.tentative);

    this.dataSource.data = [...this.comparisonResultsList];

    if (this.resultListService.isWinningGuess(comparison)) {
      this.openDialog(
        'Congratulations!',
        'You guessed the player correctly!',
        guessedPlayer,
      );
    } else if (this.tentative > this.totalGuesses) {
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
    this.tentativeChange.emit(1);
    this.comparisonResultsList = [];
    this.showButton = true;
    this.showButtonChange.emit(true);
    this.showResults = false;
    this.showResultsChange.emit(false);
  }
}

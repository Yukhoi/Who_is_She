import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Player } from '../../../../core/interfaces/player.interface';
import { CommonModule } from '@angular/common';
import { GuessingInterfaceService } from '../../services/guessing-interface.service';

@Component({
  selector: 'app-search-box',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule
  ],
  templateUrl: './search-box.component.html',
  styleUrl: './search-box.component.css'
})
export class SearchBoxComponent implements OnInit {
  @Input() players: Player[] = [];
  @Output() playerSelected = new EventEmitter<Player>();
  @Output() showResultsChange = new EventEmitter<boolean>();

  searchBarControl = new FormControl('');
  filteredPlayers!: Observable<Player[]>;
  guessedPlayer: Player | null = null;
  tentative: number = 1;  
  showResults: boolean = false;

  constructor(private guessingInterfaceService: GuessingInterfaceService) {}

  ngOnInit() {
    this.guessingInterfaceService.guessedPlayer$.subscribe(player => {
      this.guessedPlayer = player;
    });

    this.guessingInterfaceService.tentative$.subscribe(tentative => {
      this.tentative = tentative;
    });

    this.guessingInterfaceService.showResults$.subscribe(showResults => {
      this.showResults = showResults;
    });

    this.filteredPlayers = this.searchBarControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ' '))
    );
  }

  private _filter(value: string): Player[] {
    const filterValue = value.toLowerCase();
    return this.players.filter(player => {
      const firstName = player.firstName ? player.firstName.toLowerCase() : '';
      const lastName = player.lastName ? player.lastName.toLowerCase() : '';
      return firstName.includes(filterValue) || lastName.includes(filterValue);
    });
  }

  onPlayerSelected(player: Player) {
    this.playerSelected.emit(player);
    this.showResults = true;
    this.showResultsChange.emit(this.showResults);
    this.searchBarControl.setValue('');
  }
}

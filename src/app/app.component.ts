import { Component, OnInit } from '@angular/core';
import { HttpClient,HttpClientModule } from '@angular/common/http';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    HttpClientModule,
    RouterModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'Who_is_She';
  players: any[] = [];
  selectedPlayer: any = null;
  searchQuery: string = '';
  showButton = true;
  filteredPlayers: any[] = [];
  selectedGuess: any = null;
  comparisonResultsList: any[] = [];



  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.http.get<any>('assets/players/players.json').subscribe(data => {
      this.players = data.players;
    });
  }

  selectRandomPlayer() {
    if (this.players.length > 0) {
      const randomIndex = Math.floor(Math.random() * this.players.length);
      this.selectedPlayer = this.players[randomIndex];
      console.log('Selected player:', this.selectedPlayer);
      this.showButton = false;

    }
  }

  onSearch() {
    console.log('Searching for:', this.searchQuery);
    if (this.searchQuery) {
      this.filteredPlayers = this.players.filter(player => 
        player.firstName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        player.lastName.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredPlayers = [];
    }
  }

  comparePlayer(guessedPlayer: any) {
    const comparison = {
      player: guessedPlayer,
      results: {
        nationality: guessedPlayer.nationality === this.selectedPlayer.nationality,
        team: guessedPlayer.team === this.selectedPlayer.team,
        position: guessedPlayer.position === this.selectedPlayer.position,
        age: guessedPlayer.age === this.selectedPlayer.age,
        number: guessedPlayer.number === this.selectedPlayer.number
      }
    };
    this.comparisonResultsList.unshift(comparison); // Add new result at the beginning
    this.searchQuery = ''; // Clear search box
    this.filteredPlayers = []; // Clear dropdown
  }
}

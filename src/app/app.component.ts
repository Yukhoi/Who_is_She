import { Component, OnInit } from '@angular/core';
import { HttpClient,HttpClientModule } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Who_is_She';
  players: any[] = [];
  selectedPlayer: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any>('assets/players/players.json').subscribe(data => {
      this.players = data.players;
    });
  }

  selectRandomPlayer() {
    if (this.players.length > 0) {
      const randomIndex = Math.floor(Math.random() * this.players.length);
      this.selectedPlayer = this.players[randomIndex];
      console.log(this.selectedPlayer);
    }
  }
}

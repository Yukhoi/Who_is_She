import { Injectable } from '@angular/core';
import { Player } from '../../../core/interfaces/player.interface';
import { GameMode, RandomIndexMap } from '../models';

@Injectable({
  providedIn: 'root',
})
export class StartButtonService {
  private randomIndex: RandomIndexMap = {
    'Easy Mode': 112,
    'Hard Mode': 300,
  };

  constructor() {}

  async getPlayers(): Promise<Player[]> {
    const response = await fetch('assets/players/cleaned_data.json');
    const data = await response.json();
    return data.players;
  }

  async SelectRandomPlayer(selectedGameMode: GameMode, players: Player[]) {
    const index = this.randomIndex[selectedGameMode];
    return players[Math.floor(Math.random() * index)];
  }
}

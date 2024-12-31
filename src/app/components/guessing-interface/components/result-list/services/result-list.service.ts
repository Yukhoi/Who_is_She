import { Injectable } from "@angular/core";
import { Player } from "../../../../../core/interfaces/player.interface";
import { Comparison } from "../models/comparison.interface";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ResultListService{

  comparePlayer(guessedPlayer: Player, selectedPlayer: Player, tentative: number): Comparison{
    const comparison: Comparison = {
      player: guessedPlayer,
      results: {
        nationality: guessedPlayer.nationality === selectedPlayer.nationality,
        team: guessedPlayer.team === selectedPlayer.team,
        position: guessedPlayer.position === selectedPlayer.position,
        age: guessedPlayer.age === selectedPlayer.age,
        biggerAge: +guessedPlayer.age > +selectedPlayer.age,
        smallerAge: +guessedPlayer.age < +selectedPlayer.age,
        number: guessedPlayer.number === selectedPlayer.number,
        biggerNumber: +guessedPlayer.number > +selectedPlayer.number,
        smallerNumber: +guessedPlayer.number < +selectedPlayer.number,
        firstName: guessedPlayer.firstName === selectedPlayer.firstName,
        lastName: guessedPlayer.lastName === selectedPlayer.lastName,
      },
      id: tentative,
    };
    return comparison;
  }

  isWinningGuess(comparison: Comparison): boolean {
    return (
      comparison.results.nationality &&
      comparison.results.team &&
      comparison.results.position &&
      comparison.results.age &&
      comparison.results.number
    );
  }
}
import { Player } from "../../../../../core/interfaces/player.interface";

export interface ComparisonResults {
  nationality: boolean;
  team: boolean;
  position: boolean;
  age: boolean;
  biggerAge: boolean;
  smallerAge: boolean;
  number: boolean;
  biggerNumber: boolean;
  smallerNumber: boolean;
  firstName: boolean;
  lastName: boolean;
}

export interface Comparison {
  player: Player;
  results: ComparisonResults;
  id: number;
}
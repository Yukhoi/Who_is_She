import { ApplicationConfig } from '@angular/core';
import { GameService } from './core/services/game.service';


export const appConfig: ApplicationConfig = {
  providers: [GameService]
};

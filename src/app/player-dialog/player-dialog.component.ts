import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-player-dialog',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './player-dialog.component.html',
  styleUrl: './player-dialog.component.css'
})
export class PlayerDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(data);
  }
}

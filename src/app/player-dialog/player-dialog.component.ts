import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-player-dialog',
  standalone: true,
  imports: [MatDialogModule, MatTableModule, CommonModule],
  templateUrl: './player-dialog.component.html',
  styleUrl: './player-dialog.component.css',
})
export class PlayerDialogComponent {
  displayedColumns: string[] = ['property', 'value'];
  dataSource: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(data);
    this.dataSource = [
      { property: 'First Name', value: data.player.firstName },
      { property: 'Last Name', value: data.player.lastName },
      { property: 'Nationality', value: data.player.nationality },
      { property: 'Team', value: data.player.team },
      { property: 'Position', value: data.player.position },
      { property: 'Age', value: data.player.age },
      { property: 'Number', value: data.player.number }
    ];
  }

  trackBy(index: number, item: any): any {
    return item.id;
  }
}

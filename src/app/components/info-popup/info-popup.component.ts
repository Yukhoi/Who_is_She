import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-info-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  template: `
     <div class="dialog-container">
      <h2>{{ data.title }}</h2>
      <p>{{ data.message }}</p>
      <button mat-button (click)="closeDialog()">Got it</button>
    </div>
  `,
  styles: [
    `
      .dialog-container {
        text-align: center;
        padding: 20px;
      }
      button {
        margin-top: 20px;
      }
    `,
  ],
})
export class InfoDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<InfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }
}
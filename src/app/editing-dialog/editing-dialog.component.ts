import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PeriodicElementType } from '../types/periodic-element-type';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-editing-dialog',
  standalone: true,
  templateUrl: `./editing-dialog.component.html`,
  styleUrl: `./editing-dialog.component.css`,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, TitleCasePipe],
})
export class EditingDialogComponent {
  inputData: string | number = '';

  constructor(
    public dialogRef: MatDialogRef<EditingDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      column: keyof PeriodicElementType;
      oldValue: string | number;
    }
  ) {
    this.inputData = data.oldValue;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.dialogRef.close(this.inputData);
  }
}

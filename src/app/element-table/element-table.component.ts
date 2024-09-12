import { Component, Input } from '@angular/core';

import { EditingDialogComponent } from '../editing-dialog/editing-dialog.component';
import { FormsModule } from '@angular/forms';
import { HighlightPipe } from '../highlight.pipe';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { PeriodicElementFetchType } from '../types/periodic-element-fetch-type';
import { PeriodicElementType } from '../types/periodic-element-type';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-element-table',
  standalone: true,
  imports: [
    MatTableModule,
    TitleCasePipe,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    HighlightPipe,
  ],
  templateUrl: './element-table.component.html',
  styleUrl: './element-table.component.css',
})
export class ElementTableComponent {
  constructor(public dialog: MatDialog) {}

  @Input() elementPromise: Promise<PeriodicElementFetchType> | null = null;

  timeoutId: any;
  filter = '';
  periodicElements: PeriodicElementType[] = [];
  filteredElements = this.periodicElements;
  displayedColumns: (keyof PeriodicElementType)[] = [
    'position',
    'name',
    'weight',
    'symbol',
  ];
  fetchStatus: 'loading' | 'error' | 'success' = 'loading';

  async ngOnChanges() {
    (async () => {
      const newData = await this.elementPromise;

      if (newData?.ok) {
        this.periodicElements = newData.message;
        this.filteredElements = this.periodicElements;
        this.fetchStatus = 'success';
      } else {
        this.fetchStatus = 'error';

        throw new Error(newData?.message);
      }
    })();
  }

  changeField(
    column: keyof PeriodicElementType,
    row: number,
    oldValue: PeriodicElementType[keyof PeriodicElementType]
  ) {
    const dialogRef = this.dialog.open(EditingDialogComponent, {
      data: { column, oldValue },
    });

    dialogRef.afterClosed().subscribe((newValue: string | number) => {
      if (newValue) {
        if (column === 'weight') {
          newValue = parseFloat(newValue + '');

          if (isNaN(newValue)) {
            return;
          }
        }

        (this.periodicElements[row][column] as typeof newValue) = newValue;

        this.setFilter(this.filter);
      }
    });
  }

  setFilter(newFilter: string) {
    this.filter = newFilter;

    if (newFilter === '') {
      this.filteredElements = this.periodicElements;
    } else {
      this.filteredElements = this.periodicElements.filter((element) => {
        return Object.values(element).some((v) =>
          (v + '').toLowerCase().includes(this.filter)
        );
      });
    }
  }

  handleInputChange(newFilter: string) {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {
      this.setFilter(newFilter.toLowerCase());
    }, 2000);
  }
}

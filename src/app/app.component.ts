import { Component } from '@angular/core';
import { ElementTableComponent } from './element-table/element-table.component';
import { RouterOutlet } from '@angular/router';
import fetchElements from '../api/fetchElements';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ElementTableComponent],
  template: `<div>
    <app-element-table [elementPromise]="elementPromise" />
  </div>`,
  styleUrl: './app.component.css',
})
export class AppComponent {
  elementPromise = fetchElements();
}

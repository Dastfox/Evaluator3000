import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NavModule} from './nav/nav.module';
import {StudentTableModule} from './students-table/students-table.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavModule,
    StudentTableModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'E-valuateur';
}

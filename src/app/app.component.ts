import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router'; // Імпортуємо RouterOutlet

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule], // Додаємо RouterOutlet
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'crud_app';
}

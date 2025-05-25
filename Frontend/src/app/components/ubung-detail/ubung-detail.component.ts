import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ubung-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ubung-detail.component.html',
  styleUrls: ['./ubung-detail.component.scss']
})
export class UbungDetailComponent {
  @Input() ubung: any; // Hier wird die Übung als Input-Property definiert
}
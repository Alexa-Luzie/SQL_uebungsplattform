import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { UbungDataService } from '../../services/ubung-data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ubung-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ubung-list.component.html',
  styleUrls: ['./ubung-list.component.scss']
})
export class UbungListComponent implements OnInit {
  @Output() ubungAusgewaehlt = new EventEmitter<any>(); // EventEmitter, um die ausgewählte Übung an den Parent-Component zu senden
  ubungen: any[] = [];// Array, um die Übungen zu speichern

  constructor(private ubungService: UbungDataService) {}

  ngOnInit() { // Lifecycle hook, der beim Initialisieren des Components aufgerufen wird
    // Hier wird der Service aufgerufen, um die Übungen zu laden
    this.ubungService.getUebungen().subscribe({
      next: (data) => (this.ubungen = data),
      error: (err) => console.error('Fehler beim Laden der Übungen', err),
    });
  }

  ubungWaehlen(ubung: any) { // Methode, die aufgerufen wird, wenn eine Übung ausgewählt wird
    // Hier wird das Event ausgelöst, um die ausgewählte Übung an den Parent-Component zu senden
    this.ubungAusgewaehlt.emit(ubung);
  }
}
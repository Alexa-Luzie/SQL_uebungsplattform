import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UbungDataService {
  private baseUrl = 'http://localhost:3000/ubungen';

  // Ajoute le BehaviorSubject qui contient la liste actuelle des Übungen
  private uebungenSubject = new BehaviorSubject<any[]>([]);
  uebungen$ = this.uebungenSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUebungen();
  }

  loadUebungen() {
    this.http.get<any[]>(this.baseUrl).subscribe({
      next: (data) => this.uebungenSubject.next(data),
      error: (err) => console.error('Fehler beim Laden der Übungen', err),
    });
  }

  refreshUebungen() {
    this.loadUebungen();
  }
}
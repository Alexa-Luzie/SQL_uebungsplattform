import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ImportedDatabase {
  id: number;
  name: string;
  fileName: string;
}

@Injectable({ providedIn: 'root' })
export class ImportedDatabaseService {
  private apiUrl = 'http://localhost:3000/upload/databases';

  constructor(private http: HttpClient) {}

  getImportedDatabases(): Observable<ImportedDatabase[]> {
    return this.http.get<ImportedDatabase[]>(this.apiUrl);
  }
}

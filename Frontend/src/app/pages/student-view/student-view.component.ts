import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { TasksService, Task } from '../../tasks.service';
import { SqlRunnerComponent } from '../../sql-runner/sql-runner.component';
import { DbVisualizationComponent } from '../../db-visualization/db-visualization.component';

@Component({
  selector: 'app-student-view',
  standalone: true,
  imports: [CommonModule, SqlRunnerComponent, DbVisualizationComponent],
  templateUrl: './student-view.component.html',
  styleUrls: ['./student-view.component.scss']
})
export class StudentViewComponent implements OnInit {
  tasks: Task[] = [];
  selectedTask: Task | null = null;
  loading = false;
  error: string | null = null;

  databases: { id: number; name: string; created: boolean }[] = [];

  constructor(private tasksService: TasksService, private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loading = true;
    this.tasksService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Fehler beim Laden der Aufgaben';
        this.loading = false;
      }
    });
    // Lade importierte Datenbanken
    this.http.get<any[]>('http://localhost:3000/upload/databases').subscribe({
      next: (data) => this.databases = data,
      error: () => this.databases = []
    });
  }

  onTaskSelected(event: Event) {
    const select = event.target as HTMLSelectElement;
    const idx = select.selectedIndex - 1;
    this.selectedTask = idx >= 0 ? this.tasks[idx] : null;
  }
  toggleEdit(task: Task) {
    if (this.selectedTask && this.selectedTask.id === task.id) {
      this.selectedTask = null;
      return;
    }

    // Prüfen, ob die Task eine Datenbank referenziert
    if (task.database) {
      // Versuche, die Datenbank nur über die ID zu finden
      const db = this.databases.find(d => String(d.id) === String(task.database));
      if (db && db.created) {
        this.selectedTask = task;
        this.cdr.detectChanges();
      } else if (db && !db.created) {
        // Nur wenn sie noch nicht erstellt ist, importieren
        this.http.get<any>(`http://localhost:3000/database/import/${db.id}`).subscribe({
          next: (res) => {
            if (res.error && !res.error.includes('bereits eine Datenbank erstellt')) {
              alert('Fehler beim Erstellen der Datenbank: ' + res.error);
            } else {
              this.selectedTask = task;
              // Optional: Datenbanken neu laden
              this.http.get<any[]>('http://localhost:3000/upload/databases').subscribe({
                next: (data) => this.databases = data
              });
              this.cdr.detectChanges();
            }
          },
          error: () => {
            alert('Fehler beim Erstellen der Datenbank!');
          }
        });
      } else {
        alert('Keine passende importierte SQL-Datei für diese Aufgabe gefunden!');
      }
    } else {
      this.selectedTask = task;
    }
  }

  getTaskIndex(task: Task, i: number): number {
    if (this.selectedTask) {
      return this.tasks.findIndex((t: Task) => t.id === task.id) + 1;
    }
    return i + 1;
  }

  getStatusLabel(status: string | undefined): string {
    switch (status) {
      case 'in bearbeitung':
        return 'In Bearbeitung';
      case 'fertig':
        return 'Abgeschlossen';
      default:
        return 'Offen';
    }
  }

  isTaskCompleted(task: Task): boolean {
    return task.status === 'fertig';
  }

  editTask(taskId: string): void {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      this.selectedTask = task;
    }
  }

  cancelTask(taskId: string): void {
    if (this.selectedTask?.id === taskId) {
      this.selectedTask = null;
    }
  }

  submitTask(taskId: string): void {
    const userId = localStorage.getItem('userId'); // Dynamische User-ID
    if (!userId) {
      console.error('Fehler: Keine User-ID gefunden.');
      return;
    }

    const solution = {
      taskId: String(taskId),
      userId: userId,
      solutionQuery: 'SELECT * FROM users;', // Beispiel-Abfrage, dynamisch ersetzen
      isCorrect: true // Beispielwert, dynamisch ersetzen
    };

    const headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}` // JWT-Token aus dem LocalStorage
    };

    this.http.post<{ message: string; status: string }>('http://localhost:3000/solutions', solution, { headers }).subscribe({
      next: (response: { message: string; status: string }) => {
        console.log(response.message);
        const task = this.tasks.find((t: Task) => t.id === taskId);
        if (task) {
          task.status = response.status; // Status aus der Backend-Antwort setzen
        }
      },
      error: (err: any) => {
        console.error(`Fehler beim Abgeben der Aufgabe ${taskId}:`, err.message);
      }
    });
  }
}



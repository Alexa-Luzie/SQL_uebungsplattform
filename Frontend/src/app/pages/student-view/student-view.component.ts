import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
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

  constructor(private tasksService: TasksService, private http: HttpClient, private router: Router) {}

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
    this.updateTaskStatuses();
  }

  updateTaskStatuses(): void {
    this.tasks.forEach(task => {
      this.http.get<{ taskId: string; status: string }>(`http://localhost:3000/solutions/${task.id}/status`)
        .subscribe({
          next: (response) => {
            task.status = response.status;
          },
          error: () => {
            console.error(`Fehler beim Abrufen des Status für Aufgabe ${task.id}.`);
          }
        });
    });
  }

  onTaskSelected(event: Event) {
    const select = event.target as HTMLSelectElement;
    const idx = select.selectedIndex - 1;
    this.selectedTask = idx >= 0 ? this.tasks[idx] : null;
  }

  toggleEdit(task: Task): void {
    if (this.selectedTask?.id === task.id) {
      this.selectedTask = null;
      return;
    }

    if (task.database) {
      const db = this.databases.find(d => d.name === task.database || d.id === Number(task.database));
      if (db?.created) {
        this.selectedTask = task;
      } else if (db) {
        this.http.get<any>(`http://localhost:3000/database/import/${db.id}`).subscribe({
          next: () => {
            db.created = true;
            this.selectedTask = task;
          },
          error: () => {
            alert('Fehler beim Erstellen der Datenbank!');
          }
        });
      } else {
        alert('Keine passende Datenbank gefunden!');
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

  submitTask(taskId: string): void {
    this.http.post<{ message: string; status: string }>(`http://localhost:3000/solutions/${taskId}/submit`, {}).subscribe({
      next: (response) => {
        console.log(response.message);
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
          task.status = response.status; // Status aus der Backend-Antwort setzen
        }
        this.router.navigate(['/student-view']); // Zurück zur Übersicht navigieren
      },
      error: (err) => {
        console.error(`Fehler beim Abgeben der Aufgabe ${taskId}:`, err.message);
      }
    });
  }

  editTask(taskId: string): void {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      this.selectedTask = task;
      console.log(`Bearbeiten der Aufgabe mit ID ${taskId}`);
    }
  }

  cancelTask(taskId: string): void {
    if (this.selectedTask?.id === taskId) {
      this.selectedTask = null;
      console.log(`Bearbeiten der Aufgabe mit ID ${taskId} abgebrochen.`);
    }
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
    return task.status === 'fertig'; // Überprüft, ob die Aufgabe abgeschlossen ist
  }
}



import { Component, OnInit } from '@angular/core';
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

  constructor(private tasksService: TasksService, private http: HttpClient) {}

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
  // ...existing code...
  toggleEdit(task: Task) {
    if (this.selectedTask && this.selectedTask.id === task.id) {
      this.selectedTask = null;
      return;
    }

    // Prüfen, ob die Task eine Datenbank referenziert
    if (task.database) {
      // Finde die importierte DB zur Task
      const db = this.databases.find(d => d.name === task.database || d.id === Number(task.database));
      if (db && db.created) {
        this.selectedTask = task;
      } else if (db) {
        // Wenn sie noch nicht erstellt ist, erstelle sie
        this.http.get<any>(`http://localhost:3000/database/import/${db.id}`).subscribe({
          next: (res) => {
            if (res.error) {
              alert('Fehler beim Erstellen der Datenbank: ' + res.error);
            } else {
              this.selectedTask = task;
              // Optional: Datenbanken neu laden
              this.http.get<any[]>('http://localhost:3000/upload/databases').subscribe({
                next: (data) => this.databases = data
              });
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
}



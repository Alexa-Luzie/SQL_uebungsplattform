import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TasksService, Task } from '../tasks.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit, OnChanges {
  @Input() task: Task | null = null;
  @Output() taskCreated = new EventEmitter<Task>();
  @Output() taskUpdated = new EventEmitter<Task>();
  @Output() cancel = new EventEmitter<void>();

  formTask: Partial<Task> = { title: '', description: '', database: '', solution: '' };
  loading = false;
  error = '';

  allDatabases: any[] = [];

  constructor(
    private tasksService: TasksService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    // Beide Datenbanktypen laden und zusammenführen
    this.http.get<any[]>('http://localhost:3000/imported-databases').subscribe(imported => {
      this.http.get<any[]>('http://localhost:3000/custom-databases').subscribe(custom => {
        imported.forEach(db => db.type = 'imported');
        custom.forEach(db => db.type = 'custom');
        this.allDatabases = [...imported, ...custom];
      });
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['task'] && this.task) {
      this.formTask = { ...this.task };
    } else {
      this.formTask = { title: '', description: '', database: '', solution: '' };
    }
  }

  submit() {
    this.loading = true;
    const { id, ...payload } = this.formTask;
    if (payload.database !== undefined && payload.database !== null) {
      payload.database = String(payload.database);
    }
    if (this.task && this.task.id) {
      this.tasksService.updateTask(Number(this.task.id), payload).subscribe({
        next: (updated) => {
          this.loading = false;
          this.taskUpdated.emit(updated);
        },
        error: (err) => {
          this.loading = false;
          this.error = err.message || 'Fehler beim Aktualisieren!';
        }
      });
    } else {
      this.tasksService.createTask(payload as Omit<Task, 'id'>).subscribe({
        next: (created) => {
          this.loading = false;
          this.taskCreated.emit(created);
          this.formTask = { title: '', description: '', database: '', solution: '' };
        },
        error: (err) => {
          this.loading = false;
          this.error = err.message || 'Fehler beim Erstellen!';
        }
      });
    }
  }

  cancelForm() {
    this.cancel.emit();
  }
}

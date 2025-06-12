import { ImportedDatabaseService, ImportedDatabase } from '../services/imported-database.service';
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TasksService, Task } from '../tasks.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnChanges {
  importedDatabases: ImportedDatabase[] = [];
  @Input() task: Task | null = null;
  @Output() taskCreated = new EventEmitter<Task>();
  @Output() taskUpdated = new EventEmitter<Task>();
  @Output() cancel = new EventEmitter<void>();

  formTask: Partial<Task> = { title: '', description: '', database: '', solution: '' };
  loading = false;
  error = '';

  constructor(
    private tasksService: TasksService,
    private importedDatabaseService: ImportedDatabaseService
  ) {
    this.importedDatabaseService.getImportedDatabases().subscribe((dbs) => {
      this.importedDatabases = dbs;
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
    // Datenbank-ID immer als String senden
    if (payload.database !== undefined && payload.database !== null) {
      payload.database = String(payload.database);
    }
    if (this.task && this.task.id) {
      // Bearbeiten
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
      // Neu anlegen
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

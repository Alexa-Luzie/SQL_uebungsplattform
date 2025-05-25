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
  @Input() task: Task | null = null;
  @Output() taskCreated = new EventEmitter<Task>();
  @Output() taskUpdated = new EventEmitter<Task>();
  @Output() cancel = new EventEmitter<void>();

  formTask: Task = { title: '', description: '', database: '' };
  loading = false;
  error = '';

  constructor(private tasksService: TasksService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['task'] && this.task) {
      this.formTask = { ...this.task };
    } else {
      this.formTask = { title: '', description: '', database: '' };
    }
  }

  submit() {
    this.loading = true;
    if (this.task && this.task.id) {
      // Bearbeiten
      this.tasksService.updateTask(this.task.id, this.formTask).subscribe({
        next: (updated) => {
          this.loading = false;
          this.taskUpdated.emit(updated);
        },
        error: () => {
          this.loading = false;
          this.error = 'Fehler beim Aktualisieren!';
        }
      });
    } else {
      // Neu anlegen
      this.tasksService.createTask(this.formTask).subscribe({
        next: (created) => {
          this.loading = false;
          this.taskCreated.emit(created);
          this.formTask = { title: '', description: '', database: '' };
        },
        error: () => {
          this.loading = false;
          this.error = 'Fehler beim Erstellen!';
        }
      });
    }
  }

  cancelForm() {
    this.cancel.emit();
  }
}

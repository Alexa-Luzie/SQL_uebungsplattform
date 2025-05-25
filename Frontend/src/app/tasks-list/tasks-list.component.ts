import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksService, Task } from '../tasks.service';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [CommonModule, TaskFormComponent],
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss']
})
export class TasksListComponent implements OnInit {
  tasks: Task[] = [];
  loading = true;
  showForm = false;
  editTask: Task | null = null;

  constructor(private tasksService: TasksService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks() {
    this.loading = true;
    this.tasksService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onTaskCreated(task: Task) {
    this.showForm = false;
    this.editTask = null;
    this.loadTasks();
  }

  onTaskUpdated(task: Task) {
    this.showForm = false;
    this.editTask = null;
    this.loadTasks();
  }

  onEdit(task: Task) {
    this.editTask = { ...task };
    this.showForm = true;
  }

  onDelete(id?: number) {
    if (!id) return;
    if (confirm('Wirklich löschen?')) {
      this.tasksService.deleteTask(id).subscribe(() => this.loadTasks());
    }
  }

  onCancel() {
    this.showForm = false;
    this.editTask = null;
  }
}

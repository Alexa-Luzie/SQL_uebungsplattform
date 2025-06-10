import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksService, Task } from '../tasks.service';
import { TaskFormComponent } from '../task-form/task-form.component';
import { AuthDataService } from '../auth/auth-data.service';
import { Router } from '@angular/router';

export interface User {
  id: string;
  email: string;
  name: string;
  rolle: 'TUTOR' | 'ADMIN' | 'DOZENT' | 'STUDENT';
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [CommonModule, TaskFormComponent],
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss']
})
export class TasksListComponent implements OnInit {
  tasks: Task[] = [];
  loading = false;
  showForm = false;
  editTask: Task | null = null;
  userRole: User['rolle'] | null = null;
  error: string | null = null;

  selectedTask: Task | null = null;

  @Output() taskSelected = new EventEmitter<Task>();

  constructor(
    private tasksService: TasksService,
    private auth: AuthDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.auth.getProfile().subscribe({
      next: (profile: User) => {
        this.userRole = profile.rolle;
        this.loadTasks();
      },
      error: () => {
        this.userRole = null;
        this.loadTasks();
      }
    });
  }

  loadTasks() {
    this.loading = true;
    this.error = null;
    this.tasksService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Fehler beim Laden der Aufgaben';
        this.tasks = [];
        this.loading = false;
      }
    });
  }

  onEdit(task: Task) {
    this.editTask = { ...task };
    this.showForm = true;
  }

  onDelete(id?: number) {
    if (!id) return;
    if (confirm('Wirklich löschen?')) {
      this.tasksService.deleteTask(id).subscribe({
        next: () => this.loadTasks(),
        error: () => this.error = 'Fehler beim Löschen'
      });
    }
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

  onCancel() {
    this.showForm = false;
    this.editTask = null;
  }

  // Sicheres Dropdown-Handling für Studierende
  onDropdownChange(event: Event) {
    const select = event.target as HTMLSelectElement | null;
    if (select && select.selectedIndex > 0) {
      this.selectedTask = this.tasks[select.selectedIndex - 1];
      this.selectTask(this.selectedTask);
    } else {
      this.selectedTask = null;
    }
  }

  selectTask(task: Task) {
    this.taskSelected.emit(task);
  }

  isLehrkraft(): boolean {
    return ['TUTOR', 'DOZENT', 'ADMIN'].includes(this.userRole ?? '');
  }

  isTasksRoute(): boolean {
    return this.router.url === '/tasks';
  }
}

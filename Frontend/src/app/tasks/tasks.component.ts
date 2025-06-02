import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksListComponent } from '../tasks-list/tasks-list.component';
import { SqlRunnerComponent } from '../sql-runner/sql-runner.component';
import { AuthDataService } from '../auth/auth-data.service';
import { Task } from '../tasks.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule,
    TasksListComponent,
    SqlRunnerComponent
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent {
  selectedTask: Task | null = null;
  userRole: string | null = null;

  constructor(private auth: AuthDataService) {
    this.auth.getProfile().subscribe(profile => {
      this.userRole = profile.rolle;
    });
  }

  onTaskSelected(task: Task) {
    this.selectedTask = task;
  }
}
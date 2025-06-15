import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TasksListComponent } from '../tasks-list/tasks-list.component';
import { SqlRunnerComponent } from '../sql-runner/sql-runner.component';
import { AuthDataService } from '../auth/auth-data.service';
import { Task } from '../tasks.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TasksListComponent,
    SqlRunnerComponent
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent implements OnInit {
  selectedTask: Task | null = null;
  userRole: string | null = null;
  customDatabases: any[] = [];
  selectedDatabaseId: number | null = null;

  constructor(private auth: AuthDataService, private http: HttpClient) {
    this.auth.getProfile().subscribe(profile => {
      this.userRole = profile.rolle;
    });
  }

  ngOnInit() {
    this.http.get<any[]>('http://localhost:3000/custom-databases').subscribe(dbs => {
      this.customDatabases = dbs;
    });
  }

  onTaskSelected(task: Task) {
    this.selectedTask = task;
  }
}
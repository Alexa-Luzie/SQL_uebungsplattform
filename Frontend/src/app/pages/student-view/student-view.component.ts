import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksListComponent } from '../../tasks-list/tasks-list.component';
import { SqlRunnerComponent } from '../../sql-runner/sql-runner.component';

@Component({
  selector: 'app-student-view',
  standalone: true,
  imports: [CommonModule, TasksListComponent, SqlRunnerComponent],
  templateUrl: './student-view.component.html',
  styleUrls: ['./student-view.component.scss']
})
export class StudentViewComponent {
  selectedTask: any = null;

  onTaskSelected(task: any) {
    this.selectedTask = task;
  }
}

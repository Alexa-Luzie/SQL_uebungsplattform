import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksListComponent } from '../../tasks-list/tasks-list.component';

@Component({
  selector: 'app-admin-view',
  standalone: true,
  imports: [CommonModule, TasksListComponent],
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.scss']
})
export class AdminViewComponent {}
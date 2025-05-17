import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/tasks', pathMatch: 'full' },
  {
    path: 'tasks',
    loadComponent: () =>
      import('./tasks-list/tasks-list.component').then(m => m.TasksListComponent)
  }
];
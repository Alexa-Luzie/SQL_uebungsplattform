import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { ProfileComponent } from './profile/profile.component';  
import { LoginComponent } from './login/login.component';  
import { RegisterComponent } from './register/register.component'; 
import { HomeComponent } from './home/home.component';
import { StudentViewComponent } from './pages/student-view/student-view.component';
import { AuthGuard } from './auth/auth.guard';  
import { authInterceptor } from './auth/auth.interceptor';
import { SqlUploadComponent } from './sql-upload/sql-upload.component';

// Aufgabenlisten-Komponente als Standalone-Import
export const routes: Routes = [
  { path: '', redirectTo: 'student-view', pathMatch: 'full' },  // Standardroute
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'student-view', component: StudentViewComponent, canActivate: [AuthGuard] },
  {
    path: 'tasks',
    loadComponent: () =>
      import('./tasks-list/tasks-list.component').then(m => m.TasksListComponent)
  },
  { path: 'sql-upload', component: SqlUploadComponent, canActivate: [AuthGuard] }
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimationsAsync()
  ]
};

import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { ProfileComponent } from './profile/profile.component';  
import { LoginComponent } from './login/login.component';  
import { RegisterComponent } from './register/register.component'; 
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth/auth.guard';
import { RoleGuard } from './auth/role.guard';
import { authInterceptor } from './auth/auth.interceptor';
import { SqlUploadComponent } from './sql-upload/sql-upload.component';

import { StudentViewComponent } from './pages/student-view/student-view.component';
import { TutorViewComponent } from './pages/tutor-view/tutor-view.component';
import { DozentenViewComponent } from './pages/dozenten-view/dozenten-view.component';
import { AdminViewComponent } from './pages/admin-view/admin-view.component';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'login',
    pathMatch: 'full' 
  },
  { 
    path: 'login', 
    component: LoginComponent 
  },
  { 
    path: 'register', 
    component: RegisterComponent 
  },
  { 
    path: 'profile', 
    component: ProfileComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'student-view', 
    component: StudentViewComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'tutor-view', 
    component: TutorViewComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'dozenten-view', 
    component: DozentenViewComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'admin-view', 
    component: AdminViewComponent, 
    canActivate: [AuthGuard] 
  },
  {
    path: 'tasks',
    loadComponent: () =>
      import('./tasks/tasks.component').then(m => m.TasksComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'sql-upload', 
    component: SqlUploadComponent, 
    canActivate: [AuthGuard, RoleGuard] 
  },
  { 
    path: 'home', 
    component: HomeComponent 
  },
  { 
    path: '**',
    redirectTo: 'login' 
  }
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    provideAnimationsAsync()
  ]
};

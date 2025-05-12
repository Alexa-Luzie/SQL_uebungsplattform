import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { Routes } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { ProfileComponent } from './profile/profile.component';  
import { LoginComponent } from './login/login.component';  
import { RegisterComponent } from './register/register.component'; 

import { AuthGuard } from './auth/auth.guard';  
import { withInterceptors } from '@angular/common/http';
import { authInterceptor } from './auth/auth.interceptor';

import { HomeComponent } from './home/home.component';



export const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent },

  //Geschützte Routen:
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimationsAsync()
  ]
};

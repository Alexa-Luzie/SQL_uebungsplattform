import { Component, OnInit } from '@angular/core';
import { AuthDataService } from '../auth-data.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: any;
  loading: boolean = true;
  errorMessage: string = '';

  constructor(
    private authDataService: AuthDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authDataService.getProfile().subscribe({
      next: (data) => {
        this.user = data;
        this.loading = false;
        // Alle User laden wenn Admin
      },
      error: (error) => {
        console.error('Fehler beim Laden der Profildaten', error);
        this.errorMessage = 'Beim Abrufen der Profildaten ist ein Fehler aufgetreten. Bitte versuche es später erneut.';
        this.loading = false;
        this.router.navigate(['/login']);
      }
    });
  }


  logout(): void {
    this.authDataService.clearToken();
    this.router.navigate(['/login']);
    window.location.reload();
  }

}
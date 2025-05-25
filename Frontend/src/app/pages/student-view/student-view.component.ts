import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UbungListComponent } from '../../components/ubung-list/ubung-list.component';
import { UbungDetailComponent } from '../../components/ubung-detail/ubung-detail.component'; 
import { SqlRunnerComponent } from '../../sql-runner/sql-runner.component';

@Component({
  selector: 'app-student-view',
  standalone: true,
  imports: [CommonModule, UbungListComponent, UbungDetailComponent, SqlRunnerComponent],
  templateUrl: './student-view.component.html',
  styleUrls: ['./student-view.component.scss']
})
export class StudentViewComponent {
  ausgewaehlteUbung: any = null;

  onUbungAusgewaehlt(ubung: any) {
    this.ausgewaehlteUbung = ubung;
  }

}

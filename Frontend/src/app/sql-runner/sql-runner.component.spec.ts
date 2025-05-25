import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SqlRunnerComponent } from './sql-runner.component';

describe('SqlRunnerComponent', () => {
  let component: SqlRunnerComponent;
  let fixture: ComponentFixture<SqlRunnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SqlRunnerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SqlRunnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

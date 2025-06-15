import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomDatabaseFormComponent } from './custom-database-form.component';

describe('CustomDatabaseFormComponent', () => {
  let component: CustomDatabaseFormComponent;
  let fixture: ComponentFixture<CustomDatabaseFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomDatabaseFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomDatabaseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

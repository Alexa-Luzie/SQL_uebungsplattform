import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UbungListComponent } from './ubung-list.component';

describe('UbungListComponent', () => {
  let component: UbungListComponent;
  let fixture: ComponentFixture<UbungListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UbungListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UbungListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

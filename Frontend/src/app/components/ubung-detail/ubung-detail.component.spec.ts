import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UbungDetailComponent } from './ubung-detail.component';

describe('UbungDetailComponent', () => {
  let component: UbungDetailComponent;
  let fixture: ComponentFixture<UbungDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UbungDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UbungDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentalWavierDetailsComponent } from './rental-wavier-details.component';

describe('RentalWavierDetailsComponent', () => {
  let component: RentalWavierDetailsComponent;
  let fixture: ComponentFixture<RentalWavierDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentalWavierDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RentalWavierDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

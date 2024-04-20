import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimRentalWavierOneComponent } from './claim-rental-wavier-one.component';

describe('ClaimRentalWavierOneComponent', () => {
  let component: ClaimRentalWavierOneComponent;
  let fixture: ComponentFixture<ClaimRentalWavierOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaimRentalWavierOneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClaimRentalWavierOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimRentalWavierTwoComponent } from './claim-rental-wavier-two.component';

describe('ClaimRentalWavierTwoComponent', () => {
  let component: ClaimRentalWavierTwoComponent;
  let fixture: ComponentFixture<ClaimRentalWavierTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaimRentalWavierTwoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClaimRentalWavierTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

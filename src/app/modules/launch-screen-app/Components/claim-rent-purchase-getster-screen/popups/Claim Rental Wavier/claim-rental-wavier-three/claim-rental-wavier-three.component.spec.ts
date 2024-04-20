import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimRentalWavierThreeComponent } from './claim-rental-wavier-three.component';

describe('ClaimRentalWavierThreeComponent', () => {
  let component: ClaimRentalWavierThreeComponent;
  let fixture: ComponentFixture<ClaimRentalWavierThreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaimRentalWavierThreeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClaimRentalWavierThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

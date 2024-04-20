import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimRentPurchaseGetsterScreenComponent } from './claim-rent-purchase-getster-screen.component';

describe('ClaimRentPurchaseGetsterScreenComponent', () => {
  let component: ClaimRentPurchaseGetsterScreenComponent;
  let fixture: ComponentFixture<ClaimRentPurchaseGetsterScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaimRentPurchaseGetsterScreenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClaimRentPurchaseGetsterScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

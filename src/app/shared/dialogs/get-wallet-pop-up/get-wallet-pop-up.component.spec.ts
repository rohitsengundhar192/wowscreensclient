import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetWalletPopUpComponent } from './get-wallet-pop-up.component';

describe('GetWalletPopUpComponent', () => {
  let component: GetWalletPopUpComponent;
  let fixture: ComponentFixture<GetWalletPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetWalletPopUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetWalletPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

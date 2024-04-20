import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WowWalletPopUpComponent } from './wow-wallet-pop-up.component';

describe('WowWalletPopUpComponent', () => {
  let component: WowWalletPopUpComponent;
  let fixture: ComponentFixture<WowWalletPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WowWalletPopUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WowWalletPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

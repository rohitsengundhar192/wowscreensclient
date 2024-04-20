import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseTwoComponent } from './purchase-two.component';

describe('PurchaseTwoComponent', () => {
  let component: PurchaseTwoComponent;
  let fixture: ComponentFixture<PurchaseTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseTwoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

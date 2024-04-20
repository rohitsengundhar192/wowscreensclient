import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOneComponent } from './purchase-one.component';

describe('PurchaseOneComponent', () => {
  let component: PurchaseOneComponent;
  let fixture: ComponentFixture<PurchaseOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseOneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

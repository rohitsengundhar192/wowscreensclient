import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvideProofOfDeliveryComponent } from './provide-proof-of-delivery.component';

describe('ProvideProofOfDeliveryComponent', () => {
  let component: ProvideProofOfDeliveryComponent;
  let fixture: ComponentFixture<ProvideProofOfDeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProvideProofOfDeliveryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProvideProofOfDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

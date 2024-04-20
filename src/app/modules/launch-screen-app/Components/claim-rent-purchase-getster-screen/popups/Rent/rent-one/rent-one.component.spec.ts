import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentOneComponent } from './rent-one.component';

describe('RentOneComponent', () => {
  let component: RentOneComponent;
  let fixture: ComponentFixture<RentOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentOneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RentOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

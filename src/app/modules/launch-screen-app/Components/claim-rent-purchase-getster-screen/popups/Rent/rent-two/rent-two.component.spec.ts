import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentTwoComponent } from './rent-two.component';

describe('RentTwoComponent', () => {
  let component: RentTwoComponent;
  let fixture: ComponentFixture<RentTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentTwoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RentTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeShareForGetsterScreenComponent } from './time-share-for-getster-screen.component';

describe('TimeShareForGetsterScreenComponent', () => {
  let component: TimeShareForGetsterScreenComponent;
  let fixture: ComponentFixture<TimeShareForGetsterScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeShareForGetsterScreenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeShareForGetsterScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

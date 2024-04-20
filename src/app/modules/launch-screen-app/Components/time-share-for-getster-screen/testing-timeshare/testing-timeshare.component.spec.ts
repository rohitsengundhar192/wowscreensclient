import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestingTimeshareComponent } from './testing-timeshare.component';

describe('TestingTimeshareComponent', () => {
  let component: TestingTimeshareComponent;
  let fixture: ComponentFixture<TestingTimeshareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestingTimeshareComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestingTimeshareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

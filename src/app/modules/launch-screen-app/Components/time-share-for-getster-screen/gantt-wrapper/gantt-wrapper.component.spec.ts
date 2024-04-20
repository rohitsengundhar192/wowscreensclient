import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GanttWrapperComponent } from './gantt-wrapper.component';

describe('GanttWrapperComponent', () => {
  let component: GanttWrapperComponent;
  let fixture: ComponentFixture<GanttWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GanttWrapperComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GanttWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

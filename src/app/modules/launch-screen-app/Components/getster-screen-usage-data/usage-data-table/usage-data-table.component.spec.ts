import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsageDataTableComponent } from './usage-data-table.component';

describe('UsageDataTableComponent', () => {
  let component: UsageDataTableComponent;
  let fixture: ComponentFixture<UsageDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsageDataTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsageDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

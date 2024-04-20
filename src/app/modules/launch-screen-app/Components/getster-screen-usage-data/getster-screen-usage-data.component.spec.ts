import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetsterScreenUsageDataComponent } from './getster-screen-usage-data.component';

describe('GetsterScreenUsageDataComponent', () => {
  let component: GetsterScreenUsageDataComponent;
  let fixture: ComponentFixture<GetsterScreenUsageDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetsterScreenUsageDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetsterScreenUsageDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

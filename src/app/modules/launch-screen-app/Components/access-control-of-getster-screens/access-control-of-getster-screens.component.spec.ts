import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessControlOfGetsterScreensComponent } from './access-control-of-getster-screens.component';

describe('AccessControlOfGetsterScreensComponent', () => {
  let component: AccessControlOfGetsterScreensComponent;
  let fixture: ComponentFixture<AccessControlOfGetsterScreensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccessControlOfGetsterScreensComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessControlOfGetsterScreensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

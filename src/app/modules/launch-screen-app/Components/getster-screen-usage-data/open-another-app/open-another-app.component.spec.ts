import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenAnotherAppComponent } from './open-another-app.component';

describe('OpenAnotherAppComponent', () => {
  let component: OpenAnotherAppComponent;
  let fixture: ComponentFixture<OpenAnotherAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenAnotherAppComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenAnotherAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

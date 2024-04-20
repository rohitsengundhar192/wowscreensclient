import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBookScreenComponent } from './new-book-screen.component';

describe('NewBookScreenComponent', () => {
  let component: NewBookScreenComponent;
  let fixture: ComponentFixture<NewBookScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewBookScreenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewBookScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

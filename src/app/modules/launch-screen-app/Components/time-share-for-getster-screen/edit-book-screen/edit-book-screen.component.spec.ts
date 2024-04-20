import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBookScreenComponent } from './edit-book-screen.component';

describe('EditBookScreenComponent', () => {
  let component: EditBookScreenComponent;
  let fixture: ComponentFixture<EditBookScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditBookScreenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditBookScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

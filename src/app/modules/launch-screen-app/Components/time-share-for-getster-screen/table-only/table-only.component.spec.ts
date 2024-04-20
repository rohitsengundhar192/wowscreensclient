import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableOnlyComponent } from './table-only.component';

describe('TableOnlyComponent', () => {
  let component: TableOnlyComponent;
  let fixture: ComponentFixture<TableOnlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableOnlyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableOnlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

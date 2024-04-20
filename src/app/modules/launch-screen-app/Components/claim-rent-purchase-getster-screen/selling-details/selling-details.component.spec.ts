import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellingDetailsComponent } from './selling-details.component';

describe('SellingDetailsComponent', () => {
  let component: SellingDetailsComponent;
  let fixture: ComponentFixture<SellingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellingDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

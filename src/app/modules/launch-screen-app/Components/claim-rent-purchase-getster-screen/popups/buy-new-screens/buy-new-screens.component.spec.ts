import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyNewScreensComponent } from './buy-new-screens.component';

describe('BuyNewScreensComponent', () => {
  let component: BuyNewScreensComponent;
  let fixture: ComponentFixture<BuyNewScreensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyNewScreensComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyNewScreensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BestmonthComponent } from './bestmonth.component';

describe('BestmonthComponent', () => {
  let component: BestmonthComponent;
  let fixture: ComponentFixture<BestmonthComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BestmonthComponent]
    });
    fixture = TestBed.createComponent(BestmonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingshiftsComponent } from './upcomingshifts.component';

describe('UpcomingshiftsComponent', () => {
  let component: UpcomingshiftsComponent;
  let fixture: ComponentFixture<UpcomingshiftsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpcomingshiftsComponent]
    });
    fixture = TestBed.createComponent(UpcomingshiftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

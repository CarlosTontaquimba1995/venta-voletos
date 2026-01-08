import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatSelectionStepComponent } from './seat-selection-step.component';

describe('SeatSelectionStepComponent', () => {
  let component: SeatSelectionStepComponent;
  let fixture: ComponentFixture<SeatSelectionStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeatSelectionStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeatSelectionStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

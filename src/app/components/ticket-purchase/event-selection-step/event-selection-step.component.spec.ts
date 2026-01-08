import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventSelectionStepComponent } from './event-selection-step.component';

describe('EventSelectionStepComponent', () => {
  let component: EventSelectionStepComponent;
  let fixture: ComponentFixture<EventSelectionStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventSelectionStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventSelectionStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketPurchaseStepperComponent } from './ticket-purchase-stepper.component';

describe('TicketPurchaseStepperComponent', () => {
  let component: TicketPurchaseStepperComponent;
  let fixture: ComponentFixture<TicketPurchaseStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketPurchaseStepperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketPurchaseStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

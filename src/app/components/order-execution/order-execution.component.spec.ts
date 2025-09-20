import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderExecutionComponent } from './order-execution.component';

describe('OrderExecutionComponent', () => {
  let component: OrderExecutionComponent;
  let fixture: ComponentFixture<OrderExecutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderExecutionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderExecutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

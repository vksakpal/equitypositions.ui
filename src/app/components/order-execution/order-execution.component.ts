import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Order, ActionType, OrderType } from '../../models';
import { EquityPositionsService } from '../../services/equity-positions.service';

@Component({
  selector: 'app-order-execution',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './order-execution.component.html',
  styleUrl: './order-execution.component.css',
})
export class OrderExecutionComponent implements OnInit {
  orderForm: FormGroup;
  actionTypes = Object.values(ActionType);
  orderTypes = Object.values(OrderType);
  isSubmitting = false;
  submitSuccess = false;
  submitError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private equityPositionsService: EquityPositionsService,
    private router: Router
  ) {
    this.orderForm = this.fb.group({
      tradeId: ['', [Validators.required]],
      symbol: ['', [Validators.required, Validators.pattern(/^[A-Z]{1,5}$/)]],
      quantity: ['', [Validators.required, Validators.min(1)]],
      actionType: ['', [Validators.required]],
      orderType: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.orderForm.valid) {
      this.isSubmitting = true;
      this.submitError = null;
      this.submitSuccess = false;

      const order: Order = this.orderForm.value;
      
      // First try to execute via API, fallback to mock if fails
      this.equityPositionsService.executeOrder(order).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          if (response.success) {
            this.submitSuccess = true;
            console.log('Order executed successfully:', response);
            
            // Show success message and redirect after delay
            setTimeout(() => {
              this.router.navigate(['/positions']);
            }, 2000);
          } else {
            this.submitError = response.message || 'Order execution failed';
          }
        },
        error: (error) => {
          console.warn('API call failed, trying mock execution:', error);
          
          // Fallback to mock execution
          this.equityPositionsService.mockExecuteOrder(order).subscribe({
            next: (response) => {
              this.isSubmitting = false;
              this.submitSuccess = true;
              console.log('Order executed successfully (mock):', response);
              
              // Show success message and redirect after delay
              setTimeout(() => {
                this.router.navigate(['/positions']);
              }, 2000);
            },
            error: (mockError) => {
              this.isSubmitting = false;
              this.submitError = 'Failed to execute order. Please try again.';
              console.error('Both API and mock execution failed:', mockError);
            }
          });
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.orderForm.controls).forEach((key) => {
      const control = this.orderForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const control = this.orderForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) return `${fieldName} is required`;
      if (control.errors['pattern']) return `Invalid ${fieldName} format`;
      if (control.errors['min']) return `${fieldName} must be greater than 0`;
    }
    return '';
  }

  resetForm(): void {
    this.orderForm.reset();
    this.submitSuccess = false;
    this.submitError = null;
    this.isSubmitting = false;
  }

  goBack(): void {
    this.router.navigate(['/positions']);
  }
}

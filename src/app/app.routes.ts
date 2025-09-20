import { Routes } from '@angular/router';
import { PositionsComponent } from './components/positions/positions.component';
import { OrderExecutionComponent } from './components/order-execution/order-execution.component';

export const routes: Routes = [
  { path: '', redirectTo: '/positions', pathMatch: 'full' },
  { path: 'positions', component: PositionsComponent },
  { path: 'order-execution', component: OrderExecutionComponent },
  { path: '**', redirectTo: '/positions' },
];

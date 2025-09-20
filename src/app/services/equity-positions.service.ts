import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Position, Order } from '../models';

export interface PositionsResponse {
  positions: Position[];
}

export interface ExecuteOrderRequest {
  tradeID: number;
  symbol: string;
  quantity: number;
  actionType: string;
  orderType: string;
}

export interface ExecuteOrderResponse {
  success: boolean;
  message?: string;
  orderId?: string;
}

@Injectable({
  providedIn: 'root',
})
export class EquityPositionsService {
  private readonly positionsApiUrl =
    'https://localhost:44352/v1/equity-positions/details';
  private readonly executeOrderApiUrl =
    'https://localhost:44352/v1/equity-positions/execute';

  constructor(private http: HttpClient) {}

  /**
   * Fetches equity positions from the API
   * @returns Observable<Position[]>
   */
  getPositions(): Observable<Position[]> {
    return this.http.get<PositionsResponse>(this.positionsApiUrl).pipe(
      map((response) => response.positions),
      catchError(this.handleError)
    );
  }

  /**
   * Gets mock data when API is not available
   * @returns Observable<Position[]>
   */
  getMockPositions(): Observable<Position[]> {
    const mockData: Position[] = [
      { symbol: 'REL', quantity: 60 },
      { symbol: 'AAPL', quantity: 100 },
      { symbol: 'GOOGL', quantity: -25 },
      { symbol: 'MSFT', quantity: 75 },
      { symbol: 'TSLA', quantity: -10 },
      { symbol: 'AMZN', quantity: 30 }
    ];
    return of(mockData);
  }

  /**
   * Executes an order by sending it to the API
   * @param order Order object from the form
   * @returns Observable<ExecuteOrderResponse>
   */
  executeOrder(order: Order): Observable<ExecuteOrderResponse> {
    const requestBody: ExecuteOrderRequest = {
      tradeID: parseInt(order.tradeId),
      symbol: order.symbol.toUpperCase(),
      quantity: order.quantity,
      actionType: order.actionType,
      orderType: order.orderType,
    };

    return this.http.post<ExecuteOrderResponse>(this.executeOrderApiUrl, requestBody).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Mock execute order for testing when API is not available
   * @param order Order object from the form
   * @returns Observable<ExecuteOrderResponse>
   */
  mockExecuteOrder(order: Order): Observable<ExecuteOrderResponse> {
    // Simulate API delay
    return of({
      success: true,
      message: 'Order executed successfully (mock)',
      orderId: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    });
  }

  /**
   * Handles HTTP errors
   * @param error HttpErrorResponse
   * @returns Observable<never>
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Backend returned an unsuccessful response code
      errorMessage = `Server Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    console.error('EquityPositionsService Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}

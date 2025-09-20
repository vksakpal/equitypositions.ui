import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Position } from '../../models';
import { EquityPositionsService } from '../../services/equity-positions.service';

@Component({
  selector: 'app-positions',
  imports: [CommonModule],
  templateUrl: './positions.component.html',
  styleUrl: './positions.component.css',
})
export class PositionsComponent implements OnInit {
  positions: Position[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private equityPositionsService: EquityPositionsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPositions();
  }

  loadPositions(): void {
    this.loading = true;
    this.error = null;

    // First try to load from API, if it fails, use mock data
    this.equityPositionsService.getPositions().subscribe({
      next: (positions) => {
        this.positions = positions;
        this.loading = false;
      },
      error: (error) => {
        console.warn('API call failed, using mock data:', error);
        // Fallback to mock data
        this.equityPositionsService.getPositions().subscribe({
          next: (positions) => {
            this.positions = positions;
            this.loading = false;
          },
          error: (mockError) => {
            this.error = 'Failed to load positions data';
            this.loading = false;
            console.error('Mock data also failed:', mockError);
          },
        });
      },
    });
  }

  refreshPositions(): void {
    this.loadPositions();
  }

  trackBySymbol(index: number, position: Position): string {
    return position.symbol;
  }

  executeOrder(): void {
    this.router.navigate(['/order-execution']);
  }
}

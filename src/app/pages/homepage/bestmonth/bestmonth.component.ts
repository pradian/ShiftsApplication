import { Component, OnChanges, OnInit } from '@angular/core';
// import { HomepageComponent } from '../homepage.component';
import { FirebaseAuthService } from 'src/app/utilitis/services/firebase-auth.service';
import { Shift } from 'src/app/utilitis/types';

@Component({
  selector: 'app-bestmonth',
  templateUrl: './bestmonth.component.html',
  styleUrls: ['./bestmonth.component.css'],
})
export class BestmonthComponent implements OnInit, OnChanges {
  bestMonthStats = { bestMonth: '', income: 0, totalShifts: 0 };
  upcomingShifts: Shift[] = [];
  isLoading: boolean = false;

  constructor(
    // private homepage: HomepageComponent,
    private authService: FirebaseAuthService
  ) {}

  ngOnInit(): void {
    this.handleCalculateTheBestMonth();
  }
  ngOnChanges(): void {
    this.handleCalculateTheBestMonth();
    this.bestMonthStats;
  }

  async handleCalculateTheBestMonth() {
    this.isLoading = true;
    const userId: string | null = localStorage.getItem('userId');
    if (userId) {
      this.authService.getSortedShifts(userId).then((sortedShifts) => {
        const result = this.authService.calculateBestMonth(sortedShifts);
        this.bestMonthStats = result;
        this.isLoading = false;
      });
    } else {
      this.bestMonthStats = {
        bestMonth: 'No shifts found',
        income: 0,
        totalShifts: 0,
      };
      this.isLoading = false;
    }
  }
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}

import { Component, OnChanges, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
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
  userId?: string;

  constructor(
    // private homepage: HomepageComponent,
    private auth: Auth,
    private authService: FirebaseAuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idFromUrl = this.route.snapshot.paramMap.get('id');
    if (idFromUrl) {
      this.userId = idFromUrl;
    } else {
      this.userId = this.auth.currentUser?.uid;
    }
    this.handleCalculateTheBestMonth();
  }

  ngOnChanges(): void {
    this.bestMonthStats;
  }

  async handleCalculateTheBestMonth() {
    this.isLoading = true;
    if (this.userId) {
      this.authService.getSortedShifts(this.userId).then((sortedShifts) => {
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

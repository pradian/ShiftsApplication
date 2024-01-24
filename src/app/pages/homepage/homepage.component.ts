import { Component, OnInit } from '@angular/core';
import {
  Firestore,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  where,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { FirebaseAuthService } from 'src/app/utilitis/services/firebase-auth.service';
import { Shift } from 'src/app/utilitis/types';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent implements OnInit {
  bestMonthStats = { bestMonth: '', income: 0, totalShifts: 0 };
  upcomingShifts: Shift[] = [];
  isLoading: boolean = false;
  userId?: string | null = localStorage.getItem('userId');
  userShifts: Shift[] = [];

  constructor(
    private authService: FirebaseAuthService,
    private firestore: Firestore,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.handleCalculateTheBestMonth();
    this.handleUpcomingShifts();
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

  // Upcoming shifts

  async handleUpcomingShifts() {
    this.isLoading = true;
    const newDate = new Date(Date.now());
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    const shiftsCollection = collection(
      this.firestore,
      `shifts/${userId}/shifts`
    );
    const shiftsQuery = query(
      shiftsCollection,
      where('dateStart', '>', newDate),
      orderBy('dateStart', 'asc')
    );

    try {
      const shiftsSnapshot = await getDocs(shiftsQuery);
      this.upcomingShifts = shiftsSnapshot.docs.map(
        (doc) => doc.data() as Shift
      );
      this.isLoading = false;
    } catch (error) {
      console.error('Error fetching upcoming shifts:', error);
    }
  }
  navigateEditShift(uid: string) {
    this.router.navigate(['/shift', uid]);
  }
  async deleteShift(shiftId: string) {
    if (!shiftId) return;
    await deleteDoc(
      doc(this.firestore, `shifts/${this.userId}/shifts`, shiftId)
    )
      .then((doc) => {
        this.userShifts = this.userShifts.filter(
          (shift) => shift.uid !== shiftId
        );

        this.authService.showSnackBar('Shift deleted successfuly');
      })
      .catch(() => {
        this.authService.showSnackBar(
          'Shift was not deleted. Please try again',
          'snack-bar-warning'
        );
      });
  }
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}

import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Shift } from '../../utilitis/types';
import { FirebaseAuthService } from 'src/app/utilitis/services/firebase-auth.service';
import {
  Firestore,
  Timestamp,
  deleteDoc,
  doc,
  updateDoc,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shifts',
  templateUrl: './shifts.component.html',
  styleUrls: ['./shifts.component.css'],
})
export class ShiftsComponent implements OnChanges, OnInit {
  userShifts: Shift[] = [];
  userId?: string | null = localStorage.getItem('userId');
  isLoading = false;
  itemsPerPage = 20;
  currentPage = 1;
  totalItems = 0;

  constructor(
    private authService: FirebaseAuthService,
    private firestore: Firestore,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.fetchUserShifts();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.userShifts;
  }

  async fetchUserShifts() {
    const userUId = localStorage.getItem('userId');
    this.isLoading = true;
    const data = await this.authService.readUserShifts(
      this.firestore,
      `shifts/${this.userId}/shifts`,
      this.userId
    );
    if (data) {
      this.totalItems = data.filter(
        (shift) => shift.userId === this.userId
      ).length;

      this.userShifts = data
        .filter((shift) => shift.userId === this.userId)
        .sort((a, b) => {
          const dateA = a.dateStart.toMillis();
          const dateB = b.dateStart.toMillis();
          return dateB - dateA; // Sort in descending order
        })
        .slice(
          (this.currentPage - 1) * this.itemsPerPage,
          this.currentPage * this.itemsPerPage
        );
    }

    this.isLoading = false;
  }
  shiftTotal(startDate: Timestamp, endDate: Timestamp, wage: number) {
    return Math.round(
      ((endDate.toMillis() - startDate.toMillis()) / 1000 / 60 / 60) * wage
    );
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
}

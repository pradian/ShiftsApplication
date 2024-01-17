import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Shift } from '../../utilitis/types';
import { FirebaseAuthService } from 'src/app/utilitis/services/firebase-auth.service';
import { Firestore, Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-shifts',
  templateUrl: './shifts.component.html',
  styleUrls: ['./shifts.component.css'],
})
export class ShiftsComponent implements OnChanges, OnInit {
  userShift: Shift[] = [];
  userId?: string | null = localStorage.getItem('userId');
  isLoading = false;

  constructor(
    private authService: FirebaseAuthService,
    private firestore: Firestore
  ) {}
  ngOnInit(): void {
    this.fetchUserShifts();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.userShift;
  }

  async fetchUserShifts() {
    this.isLoading = true;
    const data = await this.authService.readUserShifts(
      this.firestore,
      'shifts',
      this.userId
    );
    if (data) {
      data.forEach((shift) => {
        if (shift.userId === this.userId) {
          const shiftWithTotal = shift;
          this.userShift.push(shift);
        }
      });
    }
    this.isLoading = false;
  }
  shiftTotal(startDate: Timestamp, endDate: Timestamp, wage: number) {
    return Math.round(
      ((endDate.toMillis() - startDate.toMillis()) / 1000 / 60 / 60) * wage
    );
  }
  async deleteShift(shiftId: string) {
    try {
      w;
      await this.authService.deleteShift(this.firestore, 'shifts', shiftId);
      this.userShift = this.userShift.filter((shift) => shift.id !== shiftId);
    } catch (error) {
      console.error('error deleting shift: ', error);
    }
  }
}

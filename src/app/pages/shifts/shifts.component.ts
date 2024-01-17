import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Shift } from '../../utilitis/types';
import { FirebaseAuthService } from 'src/app/utilitis/services/firebase-auth.service';
import { Firestore, Timestamp, deleteDoc, doc } from '@angular/fire/firestore';

@Component({
  selector: 'app-shifts',
  templateUrl: './shifts.component.html',
  styleUrls: ['./shifts.component.css'],
})
export class ShiftsComponent implements OnChanges, OnInit {
  userShifts: Shift[] = [];
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
    this.userShifts;
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
          this.userShifts.push(shift);
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
  deleteShift(shiftId: string) {
    deleteDoc(doc(this.firestore, 'shifts', shiftId))
      .then((doc) => {
        console.log('in then:', doc);
        console.log('shift id:', shiftId);

        this.authService.showSnackBar('Shift deleted successfuly');
      })
      .catch(() => {
        this.authService.showSnackBar(
          'Shift was not deleted. Please try again',
          'snack-bar-warning'
        );
      });
  }
  // removeEmployee(id: string) {
  //   deleteDoc(doc(this.firestore, 'shifts', id)).then(
  //     console.log,
  //     console.error
  //   );
  // }
}

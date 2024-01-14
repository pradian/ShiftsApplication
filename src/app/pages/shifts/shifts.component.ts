import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Shift } from '../../utilitis/types';
import { FirebaseAuthService } from 'src/app/utilitis/services/firebase-auth.service';
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-shifts',
  templateUrl: './shifts.component.html',
  styleUrls: ['./shifts.component.css'],
})
export class ShiftsComponent implements OnChanges, OnInit {
  userShift: Shift[] = [];
  userId?: string | null = localStorage.getItem('userId');

  constructor(
    private authService: FirebaseAuthService,
    private firestore: Firestore
  ) {}
  ngOnInit(): void {
    console.log(this.userShift);

    this.fetchUserShifts();
    console.log(this.userShift);
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.userShift;
  }

  async fetchUserShifts() {
    const data = await this.authService.readUserShifts(
      this.firestore,
      'shifts',
      this.userId
    );
    if (data) {
      data.forEach((shift) => {
        if (shift.userId === this.userId) {
          this.userShift.push(shift);
        }
      });
    }
  }
}

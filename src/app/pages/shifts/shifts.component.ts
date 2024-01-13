import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { Shift } from '../../utilitis/types';
import { FirebaseAuthService } from 'src/app/utilitis/services/firebase-auth.service';
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-shifts',
  templateUrl: './shifts.component.html',
  styleUrls: ['./shifts.component.css'],
})
export class ShiftsComponent implements OnChanges {
  userShifts: Shift[] = [];

  constructor(
    private authService: FirebaseAuthService,
    private firestore: Firestore
  ) {}
  ngOnChanges(changes: SimpleChanges): void {}
}

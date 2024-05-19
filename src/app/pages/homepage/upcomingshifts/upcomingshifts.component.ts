import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
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
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseAuthService } from 'src/app/utilitis/services/firebase-auth.service';
import { Shift } from 'src/app/utilitis/types';

@Component({
  selector: 'app-upcomingshifts',
  templateUrl: './upcomingshifts.component.html',
  styleUrls: ['./upcomingshifts.component.css'],
})
export class UpcomingshiftsComponent implements OnInit {
  isLoadingUpcoming: boolean = false;
  userId?: string;
  userShifts: Shift[] = [];
  upcomingShifts: Shift[] = [];

  constructor(
    private auth: Auth,
    private authService: FirebaseAuthService,
    private firestore: Firestore,
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
    this.handleUpcomingShifts();
  }

  async handleUpcomingShifts() {
    this.isLoadingUpcoming = true;
    const newDate = new Date(Date.now());
    const userId = this.userId;
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
      this.isLoadingUpcoming = false;
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

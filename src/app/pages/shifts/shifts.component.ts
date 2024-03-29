import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Member, Shift } from '../../utilitis/types';
import { FirebaseAuthService } from 'src/app/utilitis/services/firebase-auth.service';
import { Firestore, Timestamp, deleteDoc, doc } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-shifts',
  templateUrl: './shifts.component.html',
  styleUrls: ['./shifts.component.css'],
})
export class ShiftsComponent implements OnChanges, OnInit {
  userShifts: Shift[] = [];
  userId?: string | null =
    this.route.snapshot.paramMap.get('id') || localStorage.getItem('userId');
  isLoading = false;
  itemsPerPage = 20;
  currentPage = 1;
  totalItems = 0;
  idFromUrl: string | null = this.route.snapshot.paramMap.get('id');
  userData?: Member;

  // Filters

  positions: string[] = ['Mechanic', 'Curier', 'Accounting', 'Electrician'];
  toDateFilter: any = '';
  fromDateFilter: any = '';
  positionFilter: any = '';
  nameFilter: any = '';

  constructor(
    private authService: FirebaseAuthService,
    private firestore: Firestore,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.fetchUserShifts();
    this.getUser();
  }
  ngOnChanges(): void {
    this.userShifts;
    this.userData;
  }

  adminAddShift() {
    this.router.navigate(['/admin/addUserShift/', '', this.userId]);
  }

  async fetchUserShifts() {
    this.isLoading = true;
    const data = await this.authService.readUserShifts(
      this.firestore,
      `shifts/${this.userId}/shifts`
    );
    if (data) {
      this.totalItems = data.filter(
        (shift) => shift.userId === this.userId
      ).length;

      this.userShifts = data
        .filter(
          (shift) =>
            shift.userId === this.userId &&
            shift.dateStart.toMillis() < Date.now() &&
            (this.nameFilter === '' ||
              shift.name
                .toLowerCase()
                .includes(this.nameFilter.toLowerCase())) &&
            (this.positionFilter === '' ||
              shift.position.toLocaleLowerCase() === this.positionFilter) &&
            this.isDateInRange(shift.dateStart, shift.dateEnd)
        )
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

  // Edit shift

  navigateEditShift(uid: string) {
    if (!this.idFromUrl) {
      this.router.navigate(['/shift', uid]);
    } else {
      this.router.navigate(['/admin/editUserShift', uid, this.idFromUrl]);
    }
  }

  // Delete shift

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

  // Filter shift

  applyFilters() {
    this.positionFilter = this.positionFilter
      ? this.positionFilter.toLowerCase()
      : '';
    this.fetchUserShifts();
  }
  isDateInRange(dateStart: Timestamp, dateEnd: Timestamp): boolean {
    const fromDate = this.fromDateFilter ? new Date(this.fromDateFilter) : null;
    const toDate = this.toDateFilter ? new Date(this.toDateFilter) : null;

    if (fromDate && toDate) {
      return (
        dateStart.toMillis() >= fromDate.getTime() &&
        dateEnd.toMillis() <= toDate.getTime()
      );
    } else if (fromDate) {
      return dateStart.toMillis() >= fromDate.getTime();
    } else if (toDate) {
      return dateEnd.toMillis() <= toDate.getTime();
    }
    return true;
  }

  // Get user data
  async getUser() {
    const users = await this.authService
      .readMembersData(this.firestore, 'users')

      .then((members) => {
        members.forEach((member) => {
          if (member.uid === this.userId) {
            this.userData = member;
          }
        });
      });
  }

  // Reset filters inputs

  resetFilters() {
    this.fromDateFilter = '';
    this.toDateFilter = '';
    this.positionFilter = '';
    this.nameFilter = '';
    this.fetchUserShifts();
  }
}

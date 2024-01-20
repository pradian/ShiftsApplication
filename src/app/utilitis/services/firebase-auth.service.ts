import { Injectable } from '@angular/core';
import {
  Auth,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';
import {
  Firestore,
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { Member, Shift } from '../types';
import { MatSnackBar } from '@angular/material/snack-bar';
import { deleteDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthService {
  getUserProfileData() {
    throw new Error('Method not implemented.');
  }
  createdUser?: User;
  currentUser?: User;
  authService: any;
  isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  constructor(
    private auth: Auth,
    private _snackBar: MatSnackBar,
    protected firestore: Firestore
  ) {}

  isLoggedIn(): boolean {
    return !!localStorage.getItem('userId');
  }

  // User Login

  async login(email: string, password: string) {
    try {
      const credentials = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      this.currentUser = credentials.user;
      localStorage.setItem('userId', this.currentUser.uid);
      this.isLoggedInSubject.next(true);
      return credentials.user;
    } catch {
      throw new Error('Invalid credentials. Please try again');
    }
  }

  // Register user

  async register(email: string, password: string) {
    const credentials = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    this.createdUser = credentials.user;
    alert(`Welcome ${this.createdUser.email}!`);
    return credentials.user;
  }

  // Update user profile

  async updateUserProfile(
    id: string,
    firstName: string,
    lastName: string,
    role: string,
    email: string,
    birthDate: Date
  ): Promise<void> {
    const userRef = doc(this.firestore, 'users', id);
    const userDoc = await getDoc(userRef);

    const userData = {
      uid: id,
      firstName,
      lastName,
      role,
      email,
      birthDate,
    };

    if (userDoc.exists()) {
      await setDoc(userRef, userData, { merge: true });
    } else {
      await setDoc(userRef, userData);
    }
  }

  // Add user shift

  async addUserShift(
    dateStart: Date,
    dateEnd: Date,
    wage: number,
    position: string,
    name: string,
    userId: string,
    comments: string,
    uid: string
  ): Promise<void> {
    const userUId = localStorage.getItem('userId');
    const shiftCollection = collection(this.firestore, 'shifts');
    const shiftCollectionRef = doc(
      this.firestore,
      `shifts/${userUId}/shifts`,
      uid
    );

    const existingShiftQuerry = query(
      shiftCollection,
      where('name', '==', name),
      where('userId', '==', userId)
    );
    const existingShifts = await getDocs(existingShiftQuerry);

    if (!existingShifts.empty) {
      throw new Error();
    }
    const formattedDateStart = new Date(dateStart);
    const formattedDateEnd = new Date(dateEnd);
    const shiftData = {
      dateStart: formattedDateStart,
      dateEnd: formattedDateEnd,
      wage,
      position,
      name,
      userId: userId,
      comments,
      uid: uid,
    };

    await setDoc(shiftCollectionRef, shiftData);
  }

  // Read members data

  async readMembersData(fdb: any, coll: string): Promise<Member[]> {
    const usersDBCol = collection(fdb, coll);
    const fetchedUsers: Member[] = [];
    const querySnapshot = await getDocs(usersDBCol);
    querySnapshot.forEach((doc) => {
      fetchedUsers.push(doc.data() as Member);
    });

    return fetchedUsers;
  }

  // Read user shifts

  async readUserShifts(fdb: any, coll: string, userId: any): Promise<Shift[]> {
    const usersShifts: Shift[] = [];
    const shiftsDBCol = collection(fdb, coll);
    const querySnapshot = await getDocs(shiftsDBCol);
    querySnapshot.forEach((doc) => {
      const shiftData = doc.data() as Shift;
      usersShifts.push(doc.data() as Shift);
    });

    return usersShifts;
  }

  // Calculate total earnings per month

  calculateBestMonth(sortedShifts: Shift[]): {
    bestMonth: string;
    income: number;
    totalShifts: number;
  } {
    const monthsEarnings: any[] = [];

    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    sortedShifts.forEach((shift) => {
      const date = new Date(shift.dateStart.toMillis());
      const year = date.getFullYear();
      const month = date.getMonth();
      const newDate = new Date(Date.now());
      if (shift.dateStart.toDate() <= newDate) {
        const existingMonth = monthsEarnings.find(
          (item: any) => item.year === year && item.month === month
        );

        const shiftTotal = this.shiftTotal(
          shift.dateStart,
          shift.dateEnd,
          shift.wage
        );

        if (existingMonth) {
          existingMonth.total += shiftTotal;
        } else {
          monthsEarnings.push({
            year: year,
            month: month,
            total: shiftTotal,
          });
        }
      }
    });

    const sortedMonths = monthsEarnings.sort(
      (a: { total: number }, b: { total: number }) => b.total - a.total
    );

    if (sortedMonths.length > 0) {
      const bestMonth = `${monthNames[sortedMonths[0].month]} ${
        sortedMonths[0].year
      }`;
      const income = sortedMonths[0].total;
      const totalShifts = sortedMonths.length;

      return { bestMonth, income, totalShifts };
    } else {
      return { bestMonth: 'No shifts found!', income: 0, totalShifts: 0 };
    }
  }

  // Total income per shift

  shiftTotal(startDate: Timestamp, endDate: Timestamp, wage: number) {
    return Math.round(
      ((endDate.toMillis() - startDate.toMillis()) / 1000 / 60 / 60) * wage
    );
  }

  // Upcomming shifts

  async upcommingShifts(shift: Shift) {
    const upcomming = [];
  }

  // Sorted shifts

  async getSortedShifts(userId: string): Promise<Shift[]> {
    const userUid = localStorage.getItem('userId');

    const shiftsCollection = collection(
      this.firestore,
      `shifts/${userId}/shifts`
    );
    const shiftsQuery = query(shiftsCollection, where('userId', '==', userId));
    const shiftsSnapshot = await getDocs(shiftsQuery);

    const shifts: Shift[] = [];

    shiftsSnapshot.forEach((doc) => {
      const shiftData = doc.data() as Shift;
      shifts.push(shiftData);
    });

    return shifts.sort(
      (a, b) => a.dateStart.toMillis() - b.dateStart.toMillis()
    );
  }

  // // Delete shifts

  // async deleteShift(shiftId: string) {
  //   const shiftRef = doc(this.firestore, 'shifts', shiftId);

  //   try {
  //     await deleteDoc(shiftRef);
  //   } catch (error) {
  //     console.error('Error deleting doc', error);
  //     throw new Error('Unable to delete document. Please try again');
  //   }
  // }

  // Logout

  async logout() {
    await signOut(this.auth);
    this.currentUser = undefined;
    this.isLoggedInSubject.next(false);
    return;
  }

  // SnackBar
  showSnackBar(
    message: string,
    snackBarClass: string = 'snack-bar-success'
  ): void {
    this._snackBar.open(message, 'Close!', {
      duration: 3000,
      panelClass: [snackBarClass],
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
    });
  }
}

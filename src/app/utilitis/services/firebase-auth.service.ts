import { Injectable } from '@angular/core';
import {
  Auth,
  User,
  reauthenticateWithCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  EmailAuthProvider,
} from '@angular/fire/auth';
import {
  Firestore,
  Timestamp,
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
  // Reauth
  async reAuth(password: string): Promise<User> {
    try {
      const user = this.auth.currentUser;
      console.log('Reauth', user, this.auth.currentUser?.email, password);
      if (!this.auth.currentUser?.email || !user) {
        throw new Error('User not found');
      }
      const credential = EmailAuthProvider.credential(
        this.auth.currentUser?.email,
        password
      );
      await reauthenticateWithCredential(user, credential);

      return user;
    } catch (error) {
      console.error('Error reauthenticating user:', error);
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
    return credentials.user;
  }

  // Update user profile

  async updateUserProfile(
    id: string,
    firstName: string,
    lastName: string,
    role: string,
    email = this.auth.currentUser?.email,
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

  // Change user password

  async newPassword(pwd: string) {
    try {
      const user = this.auth.currentUser;
      if (!user) {
        throw new Error('User not found');
      }
      await updatePassword(user, pwd);
    } catch (error) {
      console.error('Error changing password:', error);
      throw new Error('Error changing password');
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

  // Update shift

  async updateUserShift(
    dateStart: Date,
    dateEnd: Date,
    wage: number,
    position: string,
    name: string,
    comments: string,
    shiftId: string
  ): Promise<void> {
    const userUId = localStorage.getItem('userId');
    const shiftDocRef = doc(
      this.firestore,
      `shifts/${userUId}/shifts`,
      shiftId
    );
    const shiftDoc = await getDoc(shiftDocRef);

    const formattedDateStart = new Date(dateStart);
    const formattedDateEnd = new Date(dateEnd);
    const shiftData = {
      dateStart: formattedDateStart,
      dateEnd: formattedDateEnd,
      wage,
      position,
      name,
      comments,
      uid: shiftId,
    };
    if (shiftDoc) await setDoc(shiftDocRef, shiftData, { merge: true });
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
      usersShifts.push(shiftData);
    });

    return usersShifts;
  }

  // Get shift by id

  async getShiftById(shiftId: string): Promise<Shift | null> {
    const userId = localStorage.getItem('userId');
    try {
      const shiftDoc = await getDoc(
        doc(this.firestore, `shifts/${userId}/shifts`, shiftId)
      );

      if (shiftDoc.exists()) {
        const shiftData = shiftDoc.data() as Shift;
        return { ...shiftData, uid: shiftDoc.id };
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching shift data:', error);
      return null;
    }
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
          existingMonth.totalShifts++;
        } else {
          monthsEarnings.push({
            year: year,
            month: month,
            total: shiftTotal,
            totalShifts: 1,
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
      const totalShifts = sortedMonths[0].totalShifts;

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

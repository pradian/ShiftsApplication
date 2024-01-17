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
  // firestore: any;
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
      // Update existing user profile in the database
      await setDoc(userRef, userData, { merge: true });
    } else {
      // Create a new user profile in the database
      await setDoc(userRef, userData);
    }
  }

  async addUserShift(
    dateStart: Date,
    dateEnd: Date,
    wage: number,
    position: string,
    name: string,
    userId: string,
    comments: string
  ): Promise<void> {
    const shiftCollection = collection(this.firestore, 'shifts');

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
    };

    await addDoc(shiftCollection, shiftData);
  }

  async readMembersData(fdb: any, coll: string): Promise<Member[]> {
    const usersDBCol = collection(fdb, coll);
    const fetchedUsers: Member[] = [];
    const querySnapshot = await getDocs(usersDBCol);
    querySnapshot.forEach((doc) => {
      fetchedUsers.push(doc.data() as Member);
    });

    return fetchedUsers;
  }

  async readUserShifts(fdb: any, coll: string, userId: any): Promise<Shift[]> {
    const usersShifts: Shift[] = [];
    const shiftsDBCol = collection(fdb, coll);
    const querySnapshot = await getDocs(shiftsDBCol);
    querySnapshot.forEach((doc) => {
      const shiftData = doc.data() as Shift;
      shiftData.id = doc.id;
      usersShifts.push(doc.data() as Shift);
    });

    return usersShifts;
  }
  async deleteShift(shiftId: string) {
    const shiftRef = doc(this.firestore, 'shifts', shiftId);

    try {
      await deleteDoc(shiftRef);
    } catch (error) {
      console.error('Error deleting doc', error);
      throw new Error('Unable to delete document. Please try again');
    }
  }

  async logout() {
    await signOut(this.auth);
    this.currentUser = undefined;
    this.isLoggedInSubject.next(false);
    return;
  }
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

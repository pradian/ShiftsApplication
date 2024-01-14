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
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
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
    const shiftRef = doc(this.firestore, 'shifts');
    const shiftDoc = await getDoc(shiftRef);
    const shiftData = {
      dateStart,
      dateEnd,
      wage,
      position,
      name,
      userId: userId,
      comments,
    };

    await addDoc(collection(this.firestore, 'shifts'), shiftData);
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
      usersShifts.push(doc.data() as Shift);
    });

    return usersShifts;
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

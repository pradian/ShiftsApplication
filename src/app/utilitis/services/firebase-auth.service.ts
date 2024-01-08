import { Injectable } from '@angular/core';
import {
  Auth,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from '@angular/fire/auth';
import {
  DocumentData,
  Firestore,
  Query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  collection,
  getDocs,
  query,
  where,
} from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { Member } from '../types';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastComponent } from 'src/app/components/toast/toast.component';

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
  firestore: any;
  isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();
  constructor(private auth: Auth, private snackBar: MatSnackBar) {}

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
      this.snackBar.openFromComponent(ToastComponent, {
        duration: 3000,
        data: 'Login successful!',
      });
      this.isLoggedInSubject.next(true);
      return credentials.user;
    } catch {
      this.snackBar.openFromComponent(ToastComponent, {
        duration: 3000,
        data: 'Login unsuccessful! Try again',
      });
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

  async updateProfile(
    firstName: string,
    lastName: string,
    role: string,
    email: string,
    birthDate: Date
  ) {
    const userId = localStorage.getItem('userId');
    if (!this.currentUser || !!userId) return;

    try {
      await updateProfile(this.currentUser, {
        displayName: `${firstName} ${lastName}`,
      });

      const userRef = this.firestore.doc(`users/${userId}`);
      await userRef.set(
        { firstName, lastName, role, email, birthDate },
        { merge: true }
      );

      return true;
    } catch (error) {
      throw new Error('Error updating profile');
    }
  }
  async readMembersData(fdb: any, coll: string): Promise<Member[]> {
    const usersDBCol = await collection(fdb, coll);
    const fetchedUsers: Member[] = [];
    const querySnapshot = await getDocs(usersDBCol);
    querySnapshot.forEach((doc) => {
      fetchedUsers.push(doc.data() as Member);
    });

    return fetchedUsers;
  }

  async logout() {
    await signOut(this.auth);
    this.currentUser = undefined;
    this.isLoggedInSubject.next(false);
    return;
  }
}

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
import { Observable } from 'rxjs';
import { Member } from '../types';

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
  constructor(private auth: Auth) {}

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
  async updateProfile(firstName: string, lastName: string, role: string) {
    const userId = localStorage.getItem('userId');
    if (!this.currentUser || !!userId) return;

    try {
      await updateProfile(this.currentUser, {
        displayName: `${firstName} ${lastName}`,
      });

      const userRef = this.firestore.doc(`users/${userId}`);
      await userRef.set({ firstName, lastName, role }, { merge: true });

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
    return;
  }
}

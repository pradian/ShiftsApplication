import { Injectable } from '@angular/core';
import {
  Auth,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from '@angular/fire/auth';
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
    if (!this.currentUser) return;

    try {
      await updateProfile(this.currentUser, {
        displayName: `${firstName} ${lastName}`,
      });

      const userRef = this.firestore.doc(`users/${this.currentUser.uid}`);
      await userRef.set({ firstName, lastName, role }, { merge: true });

      // Optionally, update the local currentUser object with the updated display name
      // this.currentUser.displayName = `${firstName} ${lastName}`;

      return true;
    } catch (error) {
      throw new Error('Error updating profile');
    }
  }
  logout() {
    this.authService.logout().then(console.log).catch(console.error);
  }
}

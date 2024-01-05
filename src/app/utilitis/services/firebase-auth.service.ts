import { Injectable } from '@angular/core';
import {
  Auth,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from '@angular/fire/auth';
import {
  DocumentData,
  Query,
  QuerySnapshot,
  collection,
  getDocs,
  query,
  where,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
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

      // Optionally, update the local currentUser object with the updated display name
      // this.currentUser.displayName = `${firstName} ${lastName}`;

      return true;
    } catch (error) {
      throw new Error('Error updating profile');
    }
  }
  // async getUserProfileData(): Promise<any>{
  //   try{
  //     const userId = localStorage.getItem('userId');
  //     if(!userId){
  //       throw new Error("User ID not found")
  //     }
  //     const userDoc = await this.firestore
  //   }
  // }
  async getData(collectionName: string): Promise<any[]> {
    try {
      const collectionRef = this.firestore.collection(collectionName);
      const querySnapshot: QuerySnapshot<DocumentData> =
        await collectionRef.get();
      const documentsData: DocumentData[] = querySnapshot.docs.map((doc) =>
        doc.data()
      );
      return documentsData;
    } catch (error) {
      throw new Error('Error fetching data');
    }
  }
  logout() {
    this.authService
      .logout()
      .then(localStorage.removeItem('userId'))
      .catch(console.error);
  }
}

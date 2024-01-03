import { Firestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserInterface } from '../models/user-interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private firestore: Firestore) {}

  // getUser(userId: string): Observable<UserInterface> {
  //   return this.firestore.collection('users').doc(userId).valueChanges();
  // }
}

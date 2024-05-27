import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { User, UserFullData } from '../types';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userSubject: BehaviorSubject<UserFullData | null> =
    new BehaviorSubject<UserFullData | null>(null);

  user$ = this.userSubject.asObservable();
  constructor() {}

  updateUser(user: UserFullData) {
    this.userSubject.next(user);
  }

  getUserObservable(): Observable<UserFullData | null> {
    return this.userSubject.asObservable();
  }

  getCurrentUser(): UserFullData | null {
    return this.userSubject.getValue();
  }

  setUser(user: UserFullData): void {
    this.userSubject.next(user);
  }

  getUser(): UserFullData | null {
    return this.userSubject.value;
  }

  clearUser(): void {
    this.userSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.userSubject.value;
  }
}

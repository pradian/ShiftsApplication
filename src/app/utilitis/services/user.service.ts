import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { User, UserFullData } from '../types';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userSubject = new BehaviorSubject<UserFullData | null>(null);

  user$ = this.userSubject.asObservable();

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

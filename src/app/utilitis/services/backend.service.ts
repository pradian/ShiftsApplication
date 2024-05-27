import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserInterfaceBE } from '../models/user-interface';
import { UpdateUserData, User, UserFullData } from '../types';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  private apiUrl = 'http://localhost:3100/api';
  private currenUserSubject: BehaviorSubject<UserFullData | null> =
    new BehaviorSubject<UserFullData | null>(null);

  constructor(
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private userService: UserService
  ) {}

  getData() {
    return this.http.get<UserInterfaceBE[]>(`${this.apiUrl}/user/getAllUsers`);
  }

  registerUser(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/createUser`, user).pipe(
      catchError((error) => {
        console.error('Error registering user:', error.error);

        return throwError(() => error.error);
      })
    );
  }

  loginUser(email: string, password: string): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/user/login`, { email, password })
      .pipe(
        catchError((error) => {
          console.error('Error logging in user:', error.error);
          return throwError(() => error.error);
        }),
        map((response: any) => {
          console.log(response.bearer);
          console.log(response.user);

          if (response.bearer) {
            localStorage.setItem('authorization', response.bearer);
          }
          if (response.user) {
            this.userService.setUser(response.user);
          }

          return response;
        })
      );
  }

  editUser(
    firstName: string,
    lastName: string,
    email: string,
    birthDate: Date
  ): Observable<any> {
    const userId = this.userService.getUser()?._id;
    const token = localStorage.getItem('authorization');
    const headers = new HttpHeaders().set('authorization', `${token}`);
    console.log(userId);

    return this.http
      .put(
        `${this.apiUrl}/user/editUser/${userId}`,
        {
          firstName,
          lastName,
          email,
          birthDate,
        },
        { headers }
      )
      .pipe(
        catchError((error) => {
          console.error('Error editing user:', error.error);
          return throwError(() => error.error);
        })
      );
  }

  getUserShifts(): Observable<any> {
    const token = localStorage.getItem('authorization');
    const headers = new HttpHeaders().set('authorization', `${token}`);
    return this.http
      .get(`${this.apiUrl}/shifts/getAllUserShifts/`, {
        headers: headers,
      })
      .pipe(
        catchError((error) => {
          console.error('Error getting user shifts:', error.error);
          return throwError(() => error.error);
        })
      );
  }

  showSnackBar(
    message: string,
    snackBarClass: string = 'snack-bar-success'
  ): void {
    this._snackBar.open(message, '', {
      duration: 3000,
      panelClass: [snackBarClass],
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  }
}

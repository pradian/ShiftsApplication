import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserInterfaceBE } from '../models/user-interface';
import { User } from '../types';
import { Observable, catchError, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  private apiUrl = 'http://localhost:3100/api';
  constructor(private http: HttpClient, private _snackBar: MatSnackBar) {}

  getData() {
    return this.http.get<UserInterfaceBE[]>(`${this.apiUrl}/user/getAllUsers`);
  }

  registerUser(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/createUser`, user).pipe(
      catchError((error) => {
        // Handle the error here, potentially re-throwing a new error
        console.error('Error registering user:', error);
        return of(error);
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

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavigationEnd, Router } from '@angular/router';
import { Subject, filter, takeUntil } from 'rxjs';
import { FirebaseAuthService } from 'src/app/utilitis/services/firebase-auth.service';
import { Member } from 'src/app/utilitis/types';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit, OnDestroy {
  userId = localStorage.getItem('userId');
  userData?: Member | null;
  isLoggedIn?: boolean = false;

  private unsubscribe: Subject<void> = new Subject<void>();
  constructor(
    private authService: FirebaseAuthService,
    private firestore: Firestore,
    private router: Router,
    private auth: Auth,
    private _snackBar: MatSnackBar
  ) {}
  ngOnInit(): void {
    this.checkUserStatus();

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.unsubscribe)
      )
      .subscribe(() => this.checkUserStatus());
  }
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  checkUserStatus() {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.getUser();
    }
  }
  getisLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  async getUser() {
    this.userId = localStorage.getItem('userId');
    const users = await this.authService
      .readMembersData(this.firestore, 'users')

      .then((members) => {
        members.forEach((member) => {
          if (member.uid === this.userId) {
            this.userData = member;
          }
        });
      });
  }
  updateLoginStatus() {
    this.isLoggedIn = this.authService.isLoggedIn();
  }
  handleLogout() {
    this.authService
      .logout()
      .then(() => {
        localStorage.removeItem('userId');
        this.updateLoginStatus();
        this.router.navigate(['/login']);
        // this._snackBar.open('Successfuly logged out.', 'Close', {
        //   duration: 3000,
        //   horizontalPosition: 'end',
        //   verticalPosition: 'top',
        //   panelClass: ['custom-snackBar', 'snackbar-success'],
        // });
        this.authService.showSnackBar('Successfuly logged out.');
      })
      .catch((error) => {
        this.authService.showSnackBar('There was an error when logged out.');
        console.log('Error');
      });
  }
}

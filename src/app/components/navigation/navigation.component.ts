import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavigationEnd, Router } from '@angular/router';
import { Subject, filter, takeUntil } from 'rxjs';
import { FirebaseAuthService } from 'src/app/utilitis/services/firebase-auth.service';
import { Member } from 'src/app/utilitis/types';
import { MatIconModule } from '@angular/material/icon';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit, OnDestroy {
  userId = localStorage.getItem('userId');
  userData?: Member | null;
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;

  @Output() reqCloseNav = new EventEmitter<void>();

  private unsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private authService: FirebaseAuthService,
    private firestore: Firestore,
    private router: Router,
    private auth: Auth,
    private _snackBar: MatSnackBar,
    private appC: AppComponent
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
  async checkUserIsAdmin() {
    this.userId = localStorage.getItem('userId');
    console.log(this.userId);
    const users = await this.authService
      .readMembersData(this.firestore, 'users')
      .then((members) => {
        members.forEach((member) => {
          if (member.uid === this.userId && member.role === 'admin') {
            this.isAdmin = true;
          }
        });
      });
  }
  buttonClicked() {
    this.reqCloseNav.emit();
  }
  checkUserStatus() {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.getUser();
      this.checkUserIsAdmin();
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

        this.authService.showSnackBar('Successfuly logged out.');
      })
      .catch((error) => {
        this.authService.showSnackBar('There was an error when logged out.');
        console.log('Error');
      });
  }
}

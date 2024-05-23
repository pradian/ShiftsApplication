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
import { Member, User, UserFullData } from 'src/app/utilitis/types';
import { MatIconModule } from '@angular/material/icon';
import { AppComponent } from 'src/app/app.component';
import { BackendService } from 'src/app/utilitis/services/backend.service';
import { UserService } from 'src/app/utilitis/services/user.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit, OnDestroy {
  userId: string | undefined;
  userData?: UserFullData | null = this.auth.getUser();
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;

  @Output() reqCloseNav = new EventEmitter<void>();

  private unsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private authService: BackendService,
    private firestore: Firestore,
    private router: Router,
    private auth: UserService,
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
    if (this.userData?.role === 'admin') {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
  }
  buttonClicked() {
    this.reqCloseNav.emit();
  }
  checkUserStatus() {
    this.isLoggedIn = this.auth.isLoggedIn();
    if (this.isLoggedIn) {
      this.getUser();
      this.checkUserIsAdmin();
    }
  }
  getisLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  async getUser() {
    return (this.userId = this.auth.getUser()?._id);
  }
  updateLoginStatus() {
    this.isLoggedIn = this.auth.isLoggedIn();
  }
  handleLogout() {
    this.auth.clearUser();
  }
}

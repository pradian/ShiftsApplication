import { Component, OnDestroy, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
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
    private auth: Auth
  ) {}
  ngOnInit(): void {
    this.auth.onAuthStateChanged(() => this.checkUserStatus());
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
      })
      .catch((error) => {
        console.log('Error');
      });
  }
}

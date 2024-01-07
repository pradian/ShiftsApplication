import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { FirebaseAuthService } from 'src/app/utilitis/services/firebase-auth.service';
import { Member } from 'src/app/utilitis/types';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit, OnDestroy {
  userId = localStorage.getItem('userId');
  userData?: Member;
  isLoggedIn?: boolean = false;
  private navigationSubscription: any;
  constructor(
    private authService: FirebaseAuthService,
    private firestore: Firestore,
    private router: Router
  ) {
    this.navigationSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.checkUserStatus());
  }
  ngOnInit(): void {
    console.log(this.userData);
    // this.getUser();
    this.checkUserStatus();
    this.getUser();
  }
  ngOnDestroy(): void {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
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

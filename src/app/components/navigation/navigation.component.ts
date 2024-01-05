import { Component, OnDestroy, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
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
  constructor(
    private authService: FirebaseAuthService,
    private firestore: Firestore,
    private router: Router
  ) {}
  ngOnInit(): void {
    console.log(this.userData);

    this.getUser();
  }

  async getUser() {
    const user = await this.authService
      .readMembersData(this.firestore, 'users')
      .then((members) =>
        members.forEach((member) => {
          if (member.uid === this.userId) {
            this.userData = member;
            console.log(this.userData);
          }
        })
      );
  }

  handleLogout() {
    this.authService
      .logout()
      .then(() => {
        localStorage.removeItem('userId');
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.log('Error');
      });
  }
  ngOnDestroy(): void {
    this.userData;
  }
}

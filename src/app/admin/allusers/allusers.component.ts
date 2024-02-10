import { Member } from './../../utilitis/types';
import { Component, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { FirebaseAuthService } from 'src/app/utilitis/services/firebase-auth.service';

@Component({
  selector: 'app-allusers',
  templateUrl: './allusers.component.html',
  styleUrls: ['./allusers.component.css'],
})
export class AllusersComponent implements OnInit {
  userUid: string = '';
  allUsers: Member[] = [];
  bestMonthStats = { bestMonth: '', income: 0, totalShifts: 0 };
  constructor(
    private firestore: Firestore,
    private authService: FirebaseAuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllUsers();
  }

  async getAllUsers() {
    const usersDBCol = await this.authService.readMembersData(
      this.firestore,
      'users'
    );
    usersDBCol.forEach((member) => this.allUsers.push(member));
  }
  async getUserBestMonth(id: string) {
    const userShifts = await this.authService.getSortedShifts(id);

    this.authService.calculateBestMonth(userShifts);
  }
  navigate(id: string, path: string) {
    if (path === 'shifts') {
      this.router.navigate(['admin/userShifts', id]);
    } else if (path === 'user') {
      this.router.navigate(['admin/user', id]);
    }
  }
}

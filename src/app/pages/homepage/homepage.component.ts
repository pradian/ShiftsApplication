import { Component, OnInit } from '@angular/core';
import { FirebaseAuthService } from 'src/app/utilitis/services/firebase-auth.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent implements OnInit {
  bestMonthMessage = '';
  // userId?: string = this.authService.currentUser?.uid;
  constructor(private authService: FirebaseAuthService) {}

  ngOnInit(): void {
    const userId: string | null = localStorage.getItem('userId');
    if (userId) {
      this.authService.getSortedShifts(userId).then((sortedShifts) => {
        console.log('Sorted Shifts:', sortedShifts);
        this.bestMonthMessage =
          this.authService.calculateBestMonth(sortedShifts);
      });
    } else {
      console.error('User ID not found in localStorage');
    }
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}

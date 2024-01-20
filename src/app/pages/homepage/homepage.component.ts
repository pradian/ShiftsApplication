import { Component, OnInit } from '@angular/core';
import { FirebaseAuthService } from 'src/app/utilitis/services/firebase-auth.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent implements OnInit {
  bestMonthMessage = '';
  constructor(private authService: FirebaseAuthService) {}

  ngOnInit(): void {
    const userId: string | null = localStorage.getItem('userId');
    if (userId) {
      this.authService.getSortedShifts(userId).then((sortedShifts) => {
        this.bestMonthMessage =
          this.authService.calculateBestMonth(sortedShifts);
      });
    } else {
      this.bestMonthMessage = 'No shifts found';
    }
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}

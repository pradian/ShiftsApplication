import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { FirebaseAuthService } from 'src/app/utilitis/services/firebase-auth.service';
import { UserService } from 'src/app/utilitis/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
  constructor(private authService: UserService, private router: Router) {
    if (this.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }
}

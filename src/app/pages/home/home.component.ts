import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { FirebaseAuthService } from 'src/app/utilitis/services/firebase-auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
  constructor(
    private authService: FirebaseAuthService,
    private router: Router
  ) {
    if (this.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }
}

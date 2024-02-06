import { Component } from '@angular/core';
import { FirebaseAuthService } from 'src/app/utilitis/services/firebase-auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  constructor(private authService: FirebaseAuthService) {}
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}

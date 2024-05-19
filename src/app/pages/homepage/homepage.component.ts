import { Component, Output } from '@angular/core';
import { FirebaseAuthService } from 'src/app/utilitis/services/firebase-auth.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent {
  @Output() pageTitle: string = 'Dashboard';

  constructor(private authService: FirebaseAuthService) {}

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}

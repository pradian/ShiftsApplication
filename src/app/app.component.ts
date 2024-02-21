import { ActivatedRoute, Router } from '@angular/router';
import { Component } from '@angular/core';
import { FirebaseAuthService } from './utilitis/services/firebase-auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'ShiftApp';
  sidenavOppen: boolean = false;
  constructor(
    private authService: FirebaseAuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  handleSidenav() {
    this.sidenavOppen = !this.sidenavOppen;
    console.log(this.sidenavOppen);
  }
  isLoggedIn() {
    return this.authService.isLoggedIn();
  }
  isAdmin() {
    this.authService.getAdmin();
  }
}

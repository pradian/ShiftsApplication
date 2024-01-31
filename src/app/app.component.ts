import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'ShiftApp';
  sidenavOppen: boolean = false;

  handleSidenav() {
    this.sidenavOppen = !this.sidenavOppen;
    console.log(this.sidenavOppen);
  }
}

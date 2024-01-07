import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css'],
  // standalone: true,
})
export class ToastComponent {
  message: string = '';
  //
  constructor(private snackBar: MatSnackBar) {}

  open(message: string, duration = 3000) {
    this.message = message;
    this.snackBar.openFromComponent(ToastComponent, {
      duration: duration,
    });
  }

  dismiss() {
    this.snackBar.dismiss();
  }
}

import { Component, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseAuthService } from 'src/app/utilitis/services/firebase-auth.service';
// import { User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ToastComponent } from 'src/app/components/toast/toast.component';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  constructor(
    private authService: FirebaseAuthService,
    private firestore: Firestore,
    private fb: FormBuilder,
    private router: Router,
    private toast: ToastComponent,
    private _snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {}

  login() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { email, password } = this.loginForm.value;
      this.authService
        .login(email, password)
        .then((userCredential) => {
          if (userCredential && userCredential.uid) {
            const userId = userCredential.uid;
            localStorage.setItem('userId', userId);
            this._snackBar.open('Login successful.', 'Close', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
              panelClass: ['custom-snackBar', 'snackbar-success'],
            });
            this.router.navigate(['/']);
          }
          this.isLoading = false;
        })
        .catch(() => {
          this._snackBar.open('Invalid email or password', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['custom-snackBar', 'snackbar-error'],
          });
          this.isLoading = false;
        });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}

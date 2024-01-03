import { Component, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseAuthService } from 'src/app/utilitis/services/firebase-auth.service';
import { User } from '@angular/fire/auth';
import { Router } from '@angular/router';

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
    private router: Router
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
            this.router.navigate(['/']);
          }
          this.isLoading = false;
        })
        .catch(() => {
          alert('Email or password is incorect. Please try again.');
          this.isLoading = false;
        });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}

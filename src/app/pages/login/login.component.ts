import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BackendService } from 'src/app/utilitis/services/backend.service';
import { UserService } from 'src/app/utilitis/services/user.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  constructor(
    private authService: BackendService,
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {}

  login() {
    this.isLoading = true;
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.loginUser(email, password).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.userService.setUser(response.user);
          this.authService.showSnackBar('User logged in successfully');
          this.router.navigate(['/shifts']);
        },
        error: (error) => {
          this.isLoading = false;
          this.authService.showSnackBar(error, 'snack-bar-error');
        },
      });
    } else {
      this.isLoading = false;
      this.authService.showSnackBar(
        'Please fill all the fields',
        'snack-bar-warning'
      );
    }
  }
}

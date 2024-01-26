import { Component, OnInit } from '@angular/core';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseAuthService } from 'src/app/utilitis/services/firebase-auth.service';
import { ValidatorsService } from 'src/app/utilitis/services/validators.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [ValidatorsService],
})
export class RegisterComponent implements OnInit {
  [x: string]: any;
  registerForm: FormGroup;
  isLoading = false;
  constructor(
    private firestore: Firestore,
    private authService: FirebaseAuthService,
    private fb: FormBuilder,
    private validators: ValidatorsService,
    private router: Router
  ) {
    this.registerForm = this.fb.group(
      {
        email: [
          '',
          [
            Validators.required,
            Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
          ],
        ],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
        firstName: ['', Validators.min(3)],
        lastName: ['', Validators.min(3)],
        role: [''],
        birthDate: ['', Validators.required],
      },
      { validators: this.validators.passwordMatchValidator }
    );
  }

  ngOnInit(): void {}

  register() {
    if (this.registerForm?.valid) {
      const { email, password, firstName, lastName, birthDate } =
        this.registerForm.value;
      this.isLoading = true;
      this.authService
        .register(email, password)
        .then((result) => {
          this.isLoading = false;
          const user = this.authService.createdUser;
          if (user) {
            this.authService
              .updateUserProfile(
                user.uid,
                firstName,
                lastName,
                'user',
                email,
                birthDate
              )
              .then(() => {
                // this.authService.showSnackBar('User profile added successfuly');
              })
              .catch((error) => console.error('Error adding the profile'));
          }
          this.router.navigate(['/login']);
          this.authService.showSnackBar('Successfuly registered');
        })
        .catch((error) => {
          this.isLoading = false;
          this.authService.showSnackBar(
            'Error, please check the form',
            'snack-bar-warning'
          );
        });
    } else {
      this.registerForm?.markAllAsTouched();
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { Firestore, doc, setDoc, Timestamp } from '@angular/fire/firestore';
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
  maxDate: Date;
  minDate: Date;

  constructor(
    private firestore: Firestore,
    private authService: FirebaseAuthService,
    private fb: FormBuilder,
    private validators: ValidatorsService,
    private router: Router
  ) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 65, 0, 0);
    this.maxDate = new Date(currentYear - 18, 0, 0);
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
        firstName: ['', [Validators.required, Validators.minLength(3)]],
        lastName: ['', [Validators.required, Validators.minLength(3)]],
        role: [''],
        birthDate: ['', Validators.required],
      },
      {
        validators: this.validators.passwordMatchValidator,
        asyncValidators: [this.ageValidation.bind(this)],
      }
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
              .then(() => {})
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
  ageValidation(g: FormGroup) {
    const birthDate = g.get('birthDate')?.value as Date;
    const age = this.calculateAge(birthDate);

    if (age < 18 || age > 65) {
      return Promise.resolve({ invalidAge: true });
    } else {
      return Promise.resolve(null);
    }
  }

  private calculateAge(birthDate: Date): number {
    const today = new Date();
    const birthYear = birthDate.getFullYear();
    const currentYear = today.getFullYear();
    let age = currentYear - birthYear;

    const birthMonth = birthDate.getMonth();
    const currentMonth = today.getMonth();

    if (
      currentMonth < birthMonth ||
      (currentMonth === birthMonth && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }
}

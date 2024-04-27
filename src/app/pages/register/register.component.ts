import { Component, OnInit } from '@angular/core';
// import { Firestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BackendService } from 'src/app/utilitis/services/backend.service';
import { ValidatorsService } from 'src/app/utilitis/services/validators.service';
import { User } from 'src/app/utilitis/types';

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
    // private firestore: Firestore,
    private fb: FormBuilder,
    private validators: ValidatorsService,
    private router: Router,
    private beService: BackendService
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
    const { email, password, firstName, lastName, birthDate } =
      this.registerForm.value;
    this.isLoading = true;
    if (this.registerForm.valid) {
      const user: User = { email, password, firstName, lastName, birthDate };
      this.beService.registerUser(user).subscribe({
        next: () => {
          this.isLoading = false;
          this.beService.showSnackBar('Successfuly registered');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.isLoading = false;
          this.beService.showSnackBar(
            'Please check the form',
            '.snack-bar-error'
          );
          console.log(err);
        },
      });
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

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
      },
      { validators: this.validators.passwordMatchValidator }
    );
  }

  ngOnInit(): void {}

  register() {
    if (this.registerForm?.valid) {
      const { email, password } = this.registerForm.value;
      this.isLoading = true;
      this.authService
        .register(email, password)
        .then((result) => {
          console.log(result);
          this.isLoading = false;
          this.router.navigate(['/login']);
          this.authService.showSnackBar('Successfuly registered');
        })
        .catch((error) => {
          alert(error.message);
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
  addEmployee(
    firstName: string,
    lastName: string,
    email: string | undefined | null,
    birthDate: Date | string
  ) {
    const data: any = {};
    if (firstName) data.firstName = firstName;
    if (lastName) data.lastName = lastName;
    if (email) data.email = email;
    if (birthDate) data.bithDate = birthDate;
    data.role = 'user';
    data.uid = this.authService.createdUser?.uid;

    setDoc(doc(this.firestore, 'users', data.uid), data, {
      merge: true,
    }).then(console.log, console.error);
  }
}

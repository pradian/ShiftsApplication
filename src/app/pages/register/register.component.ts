import { Component, OnChanges, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    private auth: Auth,
    private firestore: Firestore,
    private authService: FirebaseAuthService,
    private fb: FormBuilder,
    private validators: ValidatorsService
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
        })
        .catch((error) => {
          alert(error.message);
          this.isLoading = false;
        });
    } else {
      this.registerForm?.markAllAsTouched();
    }
  }
}
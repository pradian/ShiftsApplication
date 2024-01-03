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
      this.authService
        .register(email, password)
        .then(console.log)
        .catch(console.error);
    } else {
      this.registerForm?.markAllAsTouched();
    }
  }
  // passwordMatchValidator(g: FormGroup) {
  //   const password = g.get('password')?.value;
  //   const confirmPassword = g.get('confirmPassword')?.value;
  //   if (password !== confirmPassword) {
  //     g.get('confirmPassword')?.setErrors({ mismatch: true });
  //   } else {
  //     g.get('confirmPassword')?.setErrors(null);
  //   }
  // }
}

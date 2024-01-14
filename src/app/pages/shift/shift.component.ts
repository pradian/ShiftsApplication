import { Component } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseAuthService } from 'src/app/utilitis/services/firebase-auth.service';

@Component({
  selector: 'app-shift',
  templateUrl: './shift.component.html',
  styleUrls: ['./shift.component.css'],
})
export class ShiftComponent {
  shiftForm: FormGroup;
  userId? = localStorage.getItem('userId');
  id = this.userId + '';

  constructor(
    private fb: FormBuilder,
    private authService: FirebaseAuthService,
    private firestore: Firestore,
    private router: Router
  ) {
    this.shiftForm = this.fb.group({
      dateStart: ['', Validators.required],
      dateEnd: ['', Validators.required],
      wage: ['', Validators.required],
      position: ['', Validators.required],
      name: ['', Validators.min(3)],
      comments: [''],
    });
  }

  async handleAddShift() {
    console.log('Add shift button pressed');

    if (this.shiftForm.valid) {
      console.log("Entering in 'if' ");

      const { dateStart, dateEnd, wage, position, name, comments } =
        this.shiftForm.value;
      console.log(
        'Form values: ',
        dateStart,
        dateEnd,
        wage,
        position,
        name,
        comments
      );

      await this.authService
        .addUserShift(
          dateStart,
          dateEnd,
          wage,
          position,
          name,
          this.id,
          comments
        )
        .then(
          () => {
            console.log('entering in "then"');

            this.router.navigate(['/shifts']);
            this.authService.showSnackBar('Shift added successfuly.');
          },
          (error) => {
            console.log('Error adding the shift', error);
          }
        );
    }
  }
}

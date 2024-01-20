import { Component } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseAuthService } from 'src/app/utilitis/services/firebase-auth.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-shift',
  templateUrl: './shift.component.html',
  styleUrls: ['./shift.component.css'],
})
export class ShiftComponent {
  shiftForm: FormGroup;
  userId = localStorage.getItem('userId');
  id = this.userId as string;
  isLoading = false;
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
      name: ['', [Validators.min(3), Validators.required]],
      comments: [''],
    });
  }

  async handleAddShift() {
    this.isLoading = true;

    if (this.shiftForm.valid) {
      const { dateStart, dateEnd, wage, position, name, comments } =
        this.shiftForm.value;

      await this.authService
        .addUserShift(
          dateStart,
          dateEnd,
          wage,
          position,
          name,
          this.id,
          comments,
          uuidv4()
        )
        .then(
          () => {
            (this.isLoading = false), this.router.navigate(['/shifts']);
            this.authService.showSnackBar('Shift added successfuly.');
          },
          (error) => {
            this.authService.showSnackBar(
              'Error adding the shift. Name already exists.',
              'snack-bar-warning'
            );
            this.isLoading = false;
          }
        )
        .catch(() => {
          this.isLoading = false;
          this.authService.showSnackBar(
            'Error adding the shift. Name already exists.',
            'snack-bar-warning'
          );
        });
    }
  }
}

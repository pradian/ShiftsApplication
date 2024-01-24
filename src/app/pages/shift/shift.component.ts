import { formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseAuthService } from 'src/app/utilitis/services/firebase-auth.service';
import { ValidatorsService } from 'src/app/utilitis/services/validators.service';
import { Shift } from 'src/app/utilitis/types';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-shift',
  templateUrl: './shift.component.html',
  styleUrls: ['./shift.component.css'],
})
export class ShiftComponent implements OnInit {
  @Input() shiftData: Shift | undefined;
  shiftForm: FormGroup;
  userId = localStorage.getItem('userId');
  id = this.userId as string;
  isLoading = false;
  shiftIdfromUrl?: string | null;
  formButton: string = '';
  positions: string[] = ['Mechanic', 'Curier', 'Accounting', 'Electrician'];
  constructor(
    private fb: FormBuilder,
    private authService: FirebaseAuthService,
    private firestore: Firestore,
    private router: Router,
    private route: ActivatedRoute,
    private validators: ValidatorsService
  ) {
    this.shiftForm = this.fb.group(
      {
        dateStart: ['', Validators.required],
        dateEnd: ['', [Validators.required]],
        wage: ['', Validators.required],
        position: ['', Validators.required],
        name: ['', [Validators.min(3), Validators.required]],
        comments: [''],
      },
      { validators: this.validators.dateEndAfterStartValidator }
    );
  }
  ngOnInit(): void {
    this.shiftIdfromUrl = this.route.snapshot.paramMap.get('id');
    console.log('ngOnInit', this.shiftData);
    if (this.shiftIdfromUrl) {
      this.fetchShiftData(this.shiftIdfromUrl);
      this.formButton = 'Edit Shift';
    } else {
      this.formButton = 'Add Shift';
    }
    // if (this.shiftData) {
    //   this.populateFormWithData(this.shiftData);
    // } else if (this.shiftIdfromUrl) {
    //   this.fetchShiftData(this.shiftIdfromUrl);
    // }
    console.log('ngOnInit', this.shiftData);
  }

  private populateFormWithData(shift: Shift) {
    console.log('populateFormWithData', shift);
    const formattedDateStart = formatDate(
      shift.dateStart.toDate(),
      'yyyy-MM-dd HH:mm',
      'en'
    );
    const formattedDateEnd = formatDate(
      shift.dateEnd.toDate(),
      'yyyy-MM-dd HH:mm',
      'en'
    );
    this.shiftForm.setValue({
      dateStart: formattedDateStart,
      dateEnd: formattedDateEnd,
      wage: shift.wage,
      position: shift.position,
      name: shift.name,
      comments: shift.comments,
    });
  }
  private async fetchShiftData(uid: string) {
    const shift = await this.authService.readUserShifts(
      this.firestore,
      `shifts/${this.userId}/shifts`,
      this.userId
    );
    const shiftData = shift.find((shift) => shift.uid === uid);
    if (shiftData) {
      console.log(shiftData);

      this.populateFormWithData(shiftData);
    }

    console.log(this.shiftIdfromUrl);
  }

  async handleAddShift() {
    this.isLoading = true;
    if (!this.shiftIdfromUrl) {
      console.log('handleAddShift, first if:', this.shiftData);

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
    } else {
      console.log('handleAddShift, else', this.shiftData);

      await this.updateShift();
    }
  }

  private async updateShift() {
    if (this.shiftIdfromUrl) {
      const { dateStart, dateEnd, wage, position, name, comments } =
        this.shiftForm.value;

      await this.authService
        .updateUserShift(
          dateStart,
          dateEnd,
          wage,
          position,
          name,
          comments,
          this.shiftIdfromUrl as string
        )
        .then(() => {
          this.isLoading = false;
          this.router.navigate(['/shifts']);
          this.authService.showSnackBar('Shift updated successfully.');
        })
        .catch(() => {
          this.isLoading = false;
          this.authService.showSnackBar(
            'Error updating the shift.',
            'snack-bar-warning'
          );
        });
    }
  }
}

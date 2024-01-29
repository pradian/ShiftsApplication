import { Component, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseAuthService } from 'src/app/utilitis/services/firebase-auth.service';
import { ValidatorsService } from 'src/app/utilitis/services/validators.service';
import { Member } from 'src/app/utilitis/types';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  userProfileForm: FormGroup;
  changePwdForm: FormGroup;
  authState = 'Loading....';
  userData?: Member;
  usersData: Member[] = [];
  userId? = localStorage.getItem('userId');
  id = this.userId + '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: FirebaseAuthService,
    protected firestore: Firestore,
    private router: Router,
    private validators: ValidatorsService
  ) {
    this.userProfileForm = this.fb.group({
      firstName: ['', Validators.min(3)],
      lastName: ['', Validators.min(3)],
      role: [''],
      birthDate: ['', Validators.required],
      email: [{ value: '', disabled: true }],
    });
    this.changePwdForm = this.fb.group(
      {
        oldPassword: ['', [Validators.required, Validators.minLength(6)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.validators.passwordMatchValidator }
    );
  }

  async ngOnInit(): Promise<void> {
    this.autofillForm();
  }

  async autofillForm() {
    try {
      const fetchedUsers = await this.authService.readMembersData(
        this.firestore,
        'users'
      );
      if (fetchedUsers.length > 0) {
        const currentUser = fetchedUsers.find(
          (user) => user.uid === this.userId
        );
        if (currentUser) {
          this.userData = currentUser;

          this.userProfileForm.patchValue({
            firstName: this.userData.firstName || '',
            lastName: this.userData.lastName || '',
            role: this.userData.role || '',
            birthDate: this.userData.birthDate || '',
            email: this.userData.email || '',
          });
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  async handleUpdateProfile() {
    this.isLoading = true;
    if (this.userProfileForm.valid) {
      const { firstName, lastName, role, email, birthDate } =
        this.userProfileForm.value;

      await this.authService
        .updateUserProfile(this.id, firstName, lastName, role, email, birthDate)
        .then(
          () => {
            this.router.navigate(['/']);

            this.authService.showSnackBar('Profile updated successfuly.');
          },
          (error) => {
            console.error('Error updating profile:', error);
          }
        );
    } else {
      console.error('Profile update failed. Please check form fields.');
    }
  }
  changePassword() {
    this.isLoading = true;
    if (this.authService.currentUser) {
      this.authService
        .reAuth(
          this.userProfileForm.value.email,
          this.changePwdForm.value.oldPassword
        )
        .then(() => {
          return this.authService.newPassword(
            this.changePwdForm.value.password
          );
        })
        .then(() => {
          this.isLoading = false;
          this.router.navigate(['/']);
          this.authService.showSnackBar('Password changed successfuly');
        })
        .catch(() => {
          this.isLoading = false;
          this.authService.showSnackBar(
            'Password change failed',
            'snack-bar-warning'
          );
        });
    }
  }
  formatISODate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

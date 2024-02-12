import { Component, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
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
  userId?: string;
  // id = this.userId + '';
  isLoading = false;
  isLoadingPwd = false;
  idFromUrl?: string | null;

  constructor(
    private fb: FormBuilder,

    private authService: FirebaseAuthService,
    protected firestore: Firestore,
    private router: Router,
    private validators: ValidatorsService,
    private route: ActivatedRoute,
    private location: Location
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
    this.idFromUrl = this.route.snapshot.paramMap.get('id');
    if (this.idFromUrl) {
      this.userId = this.idFromUrl as string;
    } else {
      this.userId = localStorage.getItem('userId') as string;
    }
    console.log(this.userId);

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
      const {
        firstName,
        lastName,
        role,
        email = this.userData?.email,
        birthDate,
      } = this.userProfileForm.value;

      await this.authService
        .updateUserProfile(
          this.userId as string,
          firstName,
          lastName,
          role,
          email,
          birthDate
        )
        .then(
          () => {
            this.location.back();

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
    this.isLoadingPwd = true;
    if (!this.authService.currentUser) {
      this.authService
        .reAuth(this.changePwdForm.value.oldPassword)
        .then(() => {
          return this.authService.newPassword(
            this.changePwdForm.value.password
          );
        })
        .then(() => {
          this.isLoadingPwd = false;
          this.router.navigate(['..']);
          this.authService.showSnackBar('Password changed successfuly');
        })
        .catch(() => {
          this.isLoadingPwd = false;
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

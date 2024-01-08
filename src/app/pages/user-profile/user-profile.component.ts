import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, docSnapshots, getDoc } from '@angular/fire/firestore';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FirebaseAuthService } from 'src/app/utilitis/services/firebase-auth.service';
import { Member } from 'src/app/utilitis/types';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  userProfileForm: FormGroup;
  authState = 'Loading....';
  userData?: Member;
  usersData: Member[] = [];
  userId = localStorage.getItem('userId');

  constructor(
    private fb: FormBuilder,
    private authService: FirebaseAuthService,
    private auth: Auth,
    protected firestore: Firestore
  ) {
    this.userProfileForm = this.fb.group({
      firstName: ['', Validators.min(3)],
      lastName: ['', Validators.min(3)],
      role: [''],
      birthDate: ['', Validators.required],
      email: ['', Validators.email],
    });
  }

  async ngOnInit(): Promise<void> {
    // await this.readData();
    this.autofillForm();
  }

  async autofillForm() {
    try {
      const fetchedUsers = await this.authService.readMembersData(
        this.firestore,
        'users'
      );
      console.log(fetchedUsers);
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
            birthDate:
              this.formatISODate(this.userData.birthDate.toDate()) || '',
            email: this.userData.email || '',
          });
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  async handleUpdateProfile() {
    if (this.userProfileForm.valid) {
      const { firstName, lastName, role, email, birthDate } =
        this.userProfileForm.value;

      await this.authService
        .updateProfile(firstName, lastName, role, email, birthDate)
        .then(
          () => {
            console.log('Profile updated successfully!');
            // Perform any additional actions upon successful update if needed
          },
          (error) => {
            console.error('Error updating profile:', error);
          }
        );
    } else {
      console.error('Profile update failed. Please check form fields.');
    }
  }
  formatISODate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

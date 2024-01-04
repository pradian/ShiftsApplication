import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FirebaseAuthService } from 'src/app/utilitis/services/firebase-auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  userProfileForm: FormGroup;
  authState = 'Loading....';
  userData: any;
  userId = localStorage.getItem('userId');

  constructor(
    private fb: FormBuilder,
    private authService: FirebaseAuthService,
    private auth: Auth
  ) {
    this.userProfileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      role: ['', Validators.required],
      // Add other fields as needed
    });
  }

  async ngOnInit(): Promise<void> {
    await this.readData();
  }
  async readData() {
    try {
      const users = await this.authService.getData('users'),
        user = users.find((user: { uid: string }) => {
          user.uid === this.userId;
        });
      if (user) {
        this.userData = user;
        this.userProfileForm.patchValue({
          firstName: this.userData.firstName || '',
          lastName: this.userData.lastName || '',
          role: this.userData.role || '',
        });
      }
    } catch (error) {
      console.error('Error Fetching user data:', error);
    }
  }
  saveProfile(): void {
    if (this.userProfileForm.valid) {
      const { firstName, lastName, role } = this.userProfileForm.value;
      this.authService
        .updateProfile(firstName, lastName, role)
        .then((result) => {
          if (result) {
            console.log('Profile updated successfully!');
            // Optionally, perform additional actions upon successful profile update
          } else {
            console.error('Failed to update profile.');
            // Handle errors or show error messages
          }
        })
        .catch((error) => {
          console.error('Error updating profile:', error);
          // Handle errors or show error messages
        });
    } else {
      // Handle form validation errors
    }
  }
}

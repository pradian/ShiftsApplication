import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  Firestore,
  Timestamp,
  collection,
  getDocs,
} from '@angular/fire/firestore';
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
  userData?: Member;
  userId = localStorage.getItem('userId');
  usersData: Member[] = [];

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
  async readData() {
    const usersDBCol = collection(this.firestore, 'users');
    const fetchedUsers: Member[] = [];
    const querySnapshot = await getDocs(usersDBCol);
    querySnapshot.forEach((doc) => {
      fetchedUsers.push(doc.data() as Member);
    });

    return fetchedUsers;
  }

  async autofillForm() {
    try {
      const fetchedUsers = await this.readData();

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

  saveProfile(): void {
    if (this.userProfileForm.valid) {
      const { firstName, lastName, role } = this.userProfileForm.value;
      this.authService
        .updateProfile(firstName, lastName, role)
        .then((result) => {
          if (result) {
            console.log('Profile updated successfully!');
          } else {
            console.error('Failed to update profile.');
          }
        })
        .catch((error) => {
          console.error('Error updating profile:', error);
        });
    } else {
    }
  }
  formatISODate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
type Member = {
  birthDate: Timestamp;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  uid: string;
};

// import { MatIconModule } from '@angular/material/icon';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { RegisterComponent } from './pages/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './pages/login/login.component';
import { NavigationComponent } from './components/navigation/navigation.component';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { ToastComponent } from './components/toast/toast.component';
// import { MatButtonModule } from '@angular/material/button';
// import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ShiftsComponent } from './pages/shifts/shifts.component';
import { MaterialModule } from './utilitis/material/material-module';
// import { MatIconModule } from '@angular/material/icon';
@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    NavigationComponent,
    HomepageComponent,
    UserProfileComponent,
    ToastComponent,
    ShiftsComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MaterialModule,
    // MatProgressSpinnerModule,
    BrowserAnimationsModule,
    // MatSnackBarModule,
    // MatButtonModule,
    // MatIconModule,
    AngularFireModule,
    AngularFirestoreModule,
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'shiftapp-16b21',
        appId: '1:716385019860:web:9d355088115bd6cd2c1841',
        storageBucket: 'shiftapp-16b21.appspot.com',
        apiKey: 'AIzaSyDJ-1uezTyKvamD4Llu49ywPGsJxDbXPd0',
        authDomain: 'shiftapp-16b21.firebaseapp.com',
        messagingSenderId: '716385019860',
        measurementId: 'G-GW9B3SKS78',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
  providers: [ToastComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}

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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './pages/login/login.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { ToastComponent } from './components/toast/toast.component';
import { ShiftsComponent } from './pages/shifts/shifts.component';
import { MaterialModule } from './utilitis/material/material-module';
import { ShiftComponent } from './pages/shift/shift.component';
import { BestmonthComponent } from './pages/homepage/bestmonth/bestmonth.component';
import { UpcomingshiftsComponent } from './pages/homepage/upcomingshifts/upcomingshifts.component';
import { HomeComponent } from './pages/home/home.component';
import { AllusersComponent } from './admin/allusers/allusers.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';

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
    ShiftComponent,
    BestmonthComponent,
    UpcomingshiftsComponent,
    HomeComponent,
    AllusersComponent,
    PageNotFoundComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    FormsModule,
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

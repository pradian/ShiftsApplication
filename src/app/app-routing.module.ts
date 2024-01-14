import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { authGuard } from './utilitis/guards/auth.guard';
import { ShiftsComponent } from './pages/shifts/shifts.component';
import { ShiftComponent } from './pages/shift/shift.component';

const routes: Routes = [
  {
    path: '',
    component: HomepageComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [authGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [authGuard],
  },
  {
    path: 'userprofile',
    component: UserProfileComponent,
    canActivate: [authGuard],
  },
  {
    path: 'shifts',
    component: ShiftsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'shift',
    component: ShiftComponent,
    canActivate: [authGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { authGuard } from './utilitis/guards/auth.guard';
import { ShiftsComponent } from './pages/shifts/shifts.component';
import { ShiftComponent } from './pages/shift/shift.component';
import { HomeComponent } from './pages/home/home.component';
import { AllusersComponent } from './admin/allusers/allusers.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { routeGuardGuard } from './utilitis/guards/route-guard.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [authGuard],
  },
  {
    path: 'dashboard',
    component: HomepageComponent,
    canActivate: [authGuard],
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
  { path: 'shift/:id', component: ShiftComponent, canActivate: [authGuard] },

  {
    path: 'admin/allUsers',
    component: AllusersComponent,
    canActivate: [authGuard, routeGuardGuard],
  },
  {
    path: 'admin/editUser/:id',
    component: UserProfileComponent,
    canActivate: [authGuard, routeGuardGuard],
  },
  {
    path: 'admin/userShifts/:id',
    component: ShiftsComponent,
    canActivate: [authGuard, routeGuardGuard],
  },
  {
    path: 'admin/editUserShift/:id1/:id2',
    component: ShiftComponent,
    canActivate: [authGuard, routeGuardGuard],
  },
  {
    path: 'admin/addUserShift/:id1/:id2',
    component: ShiftComponent,
    canActivate: [authGuard, routeGuardGuard],
  },
  {
    path: 'admin/stats/:id',
    component: HomepageComponent,
    canActivate: [authGuard, routeGuardGuard],
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {RegistrationComponent} from "./registration/registration.component";

import { SelectivePreloadingStrategyService } from './selective-preloading-strategy.service';
import {UserProfileComponent} from "./user-profile/user-profile/user-profile.component";
import {ProfileHomeComponent} from "./profile-home/profile-home/profile-home.component";

import {ProfileSettingsComponent} from "./user-profile/profile-settings/profile-settings.component";
import {AccListComponent} from "./user-profile/acc-list/acc-list.component";
import {AuthGuard} from "./_guards/auth.guard";
import {SiteInfoComponent} from "./site-info/site-info.component";
import {CntDeclaredComponent} from "./cnt-declared/cnt-declared.component";
import {AccPaymentComponent} from "./acc-payment/acc-payment.component";
import {AdminComponent} from "./admin/admin.component";
import {UsersComponent} from "./admin/users/users.component";
import {UserAccComponent} from "./admin/user-acc/user-acc.component";
import {AcquireComponent} from "./acquire/acquire.component";
import {SuccessPaymentComponent} from "./success-payment/success-payment.component";




const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'admin',
    component: AdminComponent,
    //canActivate: [AuthGuard],
    data: { roles: ['admin']},
      children: [
      {
        path: 'user-acc',
        component: UserAccComponent
      },
      {
        path: 'users',
        component: UsersComponent
      }]
  },
  {
    path: 'cnt-declared',
    component: CntDeclaredComponent
  },
  {
    path: 'acc-payment',
    component: AccPaymentComponent,
  },
  {
    path: 'acquire',
    component: AcquireComponent,
  },
  {
    path: 'success-payment',
    component: SuccessPaymentComponent
  },
  {
    path: 'site-info',
    component: SiteInfoComponent
  },
  {
    path: 'registration',
    component: RegistrationComponent
  },

  {
    path: 'profile-home',
    canActivate: [AuthGuard],
    loadChildren: './profile-home/profile-home.module#ProfileHomeModule'//).then(mod => mod.ProfileHomeModule),
    //component: ProfileHomeComponent//,
   // loadChildren: () => import('./profile-home/profile-home.module').then(mod => mod.ProfileHomeModule),
   // data: { preload: true }
  },

  {
    path: 'user-profile',
    component: UserProfileComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'settings',
        component: ProfileSettingsComponent
      },
      {
        path: '',
        component: AccListComponent
      }
    ]
  },

  { path: '**', redirectTo: '/login', pathMatch:'full'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes,
      {
        //enableTracing: false, // <-- debugging purposes only
       // preloadingStrategy: SelectivePreloadingStrategyService,
      })],

  exports: [RouterModule]
})
export class AppRoutingModule { }

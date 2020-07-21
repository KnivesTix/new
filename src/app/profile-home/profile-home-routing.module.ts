import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {ParamsComponent} from "./params/params.component";
import {UpdComponent} from "./upd/upd.component";
import {TariffComponent} from "./tariff/tariff.component";
import {RecalcComponent} from "./recalc/recalc.component";
import {PaysComponent} from "./pays/pays.component";
import {CntComponent} from "./cnt/cnt.component";
import {ProfileHomeComponent} from "./profile-home/profile-home.component";
import {PaymentComponent} from "./payment/payment.component";

import {FbaComponent} from "./fba/fba.component";
import {HomeComponent} from "./home/home.component";
import {FbaResolverService} from "../_services/fba-resolver.service";
import {SuccessPaymentComponent} from "../success-payment/success-payment.component";

const homeRoutes: Routes = [
  {
    path: '',
   // component: UserProfileComponent
    component: ProfileHomeComponent,
   /* resolve: {
      fba: FbaResolverService
    },
  */
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'upd',
        component: UpdComponent
      },
      {
        path: 'cnt',
        component: CntComponent
      },
      {
        path: 'pays',
        component: PaysComponent
      },
      {
        path: 'recalc',
        component: RecalcComponent
      },

      {
        path: 'tariff',
        component: TariffComponent
      },
      {
        path: 'params',
        component: ParamsComponent
      },
      {
        path: 'fba',
        component: FbaComponent
      },

      {
       path: 'payment',
       component: PaymentComponent,
      /*  resolve: {
          fba: FbaResolverService
        },
        */

      }
    ]},
  { path: '', redirectTo: '/user-profile', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(homeRoutes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }


import { NgModule }       from '@angular/core';
import { FormsModule }    from '@angular/forms';
import { CommonModule }   from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

import {UpdComponent} from "./upd/upd.component";
import {TariffComponent} from "./tariff/tariff.component";
import {ParamsComponent} from "./params/params.component";
import {HomeComponent} from "./home/home.component";
import {HomeRoutingModule} from "./profile-home-routing.module";
import {RecalcComponent} from "./recalc/recalc.component";
import {CntComponent} from "./cnt/cnt.component";
import {PaysComponent} from "./pays/pays.component";
import {ProfileHomeComponent} from "./profile-home/profile-home.component";
import {PaymentComponent} from "./payment/payment.component";

import { FbaComponent } from './fba/fba.component';
import { SuccessPaymentComponent } from '../success-payment/success-payment.component';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HomeRoutingModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ],
  declarations: [
    HomeComponent,
    ProfileHomeComponent,
    ParamsComponent,
    PaysComponent,
    CntComponent,
    TariffComponent,
    RecalcComponent,
    UpdComponent,
    PaymentComponent,

    FbaComponent
  ]
})
export class ProfileHomeModule {}

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component'
import { AppComponent } from './app.component';
import {AppRoutingModule} from "./app-routing.module";
import {RegistrationComponent} from "./registration/registration.component";
import {LoginService} from "./_services/login.service";
import {UpdService} from "./_services/upd.service";
import {AlertService} from "./_services/alert.service";
import { AlertComponent } from './alert/alert.component';

import {AccountService} from "./_services/account.service";
import {UserProfileComponent} from "./user-profile/user-profile/user-profile.component";
import { ProfileSettingsComponent } from './user-profile/profile-settings/profile-settings.component';
import { AccListComponent } from './user-profile/acc-list/acc-list.component';
import { PhoneDirective } from './phone.directive';
import {AuthGuard} from "./_guards/auth.guard";
import { SiteInfoComponent } from './site-info/site-info.component';
import { CntDeclaredComponent } from './cnt-declared/cnt-declared.component';
import { AccPaymentComponent } from './acc-payment/acc-payment.component';
import { AdminComponent } from './admin/admin.component';
import { UsersComponent } from './admin/users/users.component';
import { UserAccComponent } from './admin/user-acc/user-acc.component';
import {NgxPaginationModule} from "ngx-pagination";
import { ReceiptComponent } from './admin/receipt/receipt.component';
import { AcquireComponent } from './acquire/acquire.component';
import {SuccessPaymentComponent} from "./success-payment/success-payment.component";






@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    AlertComponent,
    UserProfileComponent,
    ProfileSettingsComponent,
    AccListComponent,
    PhoneDirective,
    SiteInfoComponent,
    CntDeclaredComponent,
    AccPaymentComponent,
    AdminComponent,
    UsersComponent,
    UserAccComponent,
    ReceiptComponent,
    AcquireComponent,
    SuccessPaymentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ],
  providers: [LoginService, UpdService, AlertService, AccountService, AuthGuard],

  bootstrap: [AppComponent]
})
export class AppModule { }

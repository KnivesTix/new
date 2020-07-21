import {Component, OnInit, Input, OnChanges} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { first } from 'rxjs/operators';

import {LoginService} from "../_services/login.service";
import {AlertService} from "../_services/alert.service";
import {throwError} from "rxjs";
import {ProfileHomeComponent} from "../profile-home/profile-home/profile-home.component";
import {User} from "../_models/user";
;

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnChanges{
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  user: User;
  private currentUser: string;

  constructor(
    private loginService: LoginService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private alertService: AlertService) {

    if (this.loginService.currentUserValue) {
      this.router.navigate(['/user-profile/']);
    }

  }

  ngOnInit() {
      this.loginForm = this.formBuilder.group({
      login: ['', Validators.required],
      pass: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/user-profile/';
  }
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    this.loginService.login(this.f.login.value, this.f.pass.value)
      .pipe(first())
      .subscribe(
        (data:any) => {
          let code = JSON.stringify(data.code);
          let msg =  JSON.stringify(data.msg);

          switch (code) {
            case "1":
              localStorage.setItem('currentUser', JSON.stringify(this.f.login.value));
              localStorage.setItem('user_id', JSON.stringify(data.user_id));
              localStorage.setItem('session_key', JSON.stringify(data.session_key));

              if (this.f.login.value === 'admin'){
                this.router.navigate(['/admin/users/']);
                break;
              }

              this.router.navigate([this.returnUrl]);
              break;
            default:
              this.loading = false;
              this.loginForm.reset();
              return this.alertService.error(msg, false);
          }
        },
        error => {
          console.log(error);
          this.alertService.error(error);
          this.loading = false;
        });
  }
ngOnChanges(){
  //console.log("ngOnChanges");
  this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
}

}

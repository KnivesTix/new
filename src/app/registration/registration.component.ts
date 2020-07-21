 import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {AlertService} from "../_services/alert.service";
import {Router, ActivatedRoute} from "@angular/router";
import {LoginService} from "../_services/login.service";
import {first} from "rxjs/internal/operators";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit{
  registrationForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  constructor(

    private router: Router,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private loginService: LoginService) {

  }

  ngOnInit() {
    this.registrationForm = this.formBuilder.group({
      login: ['', Validators.required],
      email: ['', [Validators.required,  Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(14)]],
      password: ['', Validators.required]
    });



    this.loading = false;

  }

  get f() { return this.registrationForm.controls; }

  onSubmit(){
    this.alertService.clear();
    this.submitted = true;

    if (this.registrationForm.invalid) {
      return;
    }


    this.loading = true;

    this.loginService.registration(this.registrationForm.value).pipe(first())
      .subscribe(
        (data:any) => {
         // console.log(data);
          this.loading = false;
          if (data.code == '-1') {
            this.alertService.error(data.msg);
          }
          else if (data.code == '1'){
            this.alertService.success(data.msg);
           // this.router.navigate(['/login']);
          }
          this.loading = false;

        },
        error => {

          this.loading = false;
          this.alertService.error(error.msg);

        });

  }
}

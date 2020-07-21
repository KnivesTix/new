import { Component, OnInit } from '@angular/core';
import {UserService} from "../../_services/user.service";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {AlertService} from "../../_services/alert.service";
import {Router} from "@angular/router";
import {first} from "rxjs/internal/operators";
import {AccountService} from "../../_services/account.service";

@Component({
  selector: 'app-acc-list',
  templateUrl: './acc-list.component.html',
  styleUrls: ['./acc-list.component.css']
})
export class AccListComponent implements OnInit {

  addAccForm: FormGroup;
  deleteAccForm: FormGroup;

  accForm: FormGroup;
  submitted = false;
  currentUser: string;
  currentAcc: string;
  sumForPay: string;
  //скрыть/показать поле поиска
  cassa: boolean;



  userAccArray: any[] = [];
  loading = false;
  constructor(
    private userService: UserService,
    private accService: AccountService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private router: Router) {
    this.cassa = true;
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }
  setAcc(acc_id: string){
    //console.log(acc_id);
    this.loading = true;
    localStorage.setItem('currentAcc', acc_id);
    this.currentAcc = JSON.parse(localStorage.getItem('currentAcc'));

    this.accService.calcCnt().pipe(first()).subscribe();

    this.router.navigate(['/profile-home/']);
   /* this.userService.getStatusAcc().subscribe(
      (data:any) => {
        if (data.code === 0){
          this.router.navigate(['/profile-home/']);

          this.userService.setStatusAcc(1).subscribe();

        }
        else{
          this.loading = false;
          return this.alertService.error(data.msg);
        }
      },
      error => {
        console.log(error);

      });
*/

  }


  get f() { return this.addAccForm.controls; }
  get form() { return this.deleteAccForm.controls; }
  get formAcc() { return this.accForm.controls; }

  ngOnInit() {
    sessionStorage.removeItem('total');
    sessionStorage.removeItem('orderId');
    this.deleteAccForm = this.formBuilder.group({
      login: [this.currentUser],
      acc_id: ['', Validators.required]
    });

    this.accForm = this.formBuilder.group({
      acc_id: ['', Validators.required]
    });

    this.addAccForm = this.formBuilder.group({
      login: [this.currentUser],
      acc_id: ['', Validators.required],
      pay_id: ['', Validators.required],
      fiscal_sign: ['', Validators.required]
    });

    return this.userService.getUserAcc().subscribe(
      (data:any) => {
        //console.log(data.code);
        if (data.code == '0'){
          this.userAccArray = null;
        }
        else {
          this.userAccArray = data;
        }
      },
      error => {
        console.log(error);

      });
  }
  onSubmit(){
    this.submitted = true;
    if (this.addAccForm.invalid) {
      return;
    }

    this.loading = true;

    this.userService.addUserAcc(this.addAccForm.value).pipe(first())
      .subscribe(
        (data:any) => {
          this.loading = false;
          //this.router.navigate(['/login']);
          this.userService.getUserAcc().subscribe(
            (data:any) => {

              this.userAccArray = data;
            },
            error => {
              console.log(error);

            });
          return this.alertService.success(data.msg);
        },
        error => {
          // console.log(error);
          this.loading = false;
          this.alertService.error(error);

        });


  }

  getAcc(){
    this.loading = true;
    localStorage.setItem('currentAcc', this.formAcc.acc_id.value);
    this.currentAcc = JSON.parse(localStorage.getItem('currentAcc'));

    this.router.navigate(['/profile-home/']);
  }

  deleteAcc(){
    this.submitted = true;
    if (this.deleteAccForm.invalid) {
      return;
    }

    this.loading = true;
    this.userService.deleteUserAcc(this.deleteAccForm.value).pipe(first())
      .subscribe(
        (data:any) => {
          this.loading = false;
          //this.router.navigate(['/login']);
          this.userService.getUserAcc().subscribe(
            (data:any) => {
              if (data.code == '0'){
                this.userAccArray = null;
              }
              else {
                this.userAccArray = data;
              }
            },
            error => {
              console.log(error);

            });
          return this.alertService.success(data.msg);
        },
        error => {
          // console.log(error);
          this.loading = false;
          this.alertService.error(error);

        });


  }

  clear(){
    this.alertService.clear();
  }

}

import {Component, OnInit, AfterContentInit} from '@angular/core';
import {first} from "rxjs/internal/operators";
import {AccountService} from "../../_services/account.service";
import {FormGroup, Validators, FormBuilder} from "@angular/forms";
import {PaySBRService} from "../../_services/pay-sbr.service";
import {AlertService} from "../../_services/alert.service";
import {JsonService} from "../../_services/json.service";
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../../_services/user.service";
import {LoginService} from "../../_services/login.service";

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit, AfterContentInit {
  public currentAcc: string;
  private orderId: string;
  sum_pay_total: number;
  isLoaded: boolean = false;
 // loading = false;
  result: string;
  load_sbr_form = false;
  af: number;
  fba: any[] = []; // Начисления по услугам
  bank_percent: number;
  cnt: any[] = []; // Счетчики
  json: any;
  sum_to_pay: number;
  sumUpdArray: any = [];
  payForm: FormGroup;
  submitted = false;
  totalPay: number;
  email: string;
  constructor(private accService: AccountService,
              private loginService: LoginService,
              private route: ActivatedRoute,
              private payService: PaySBRService,
              private alertService: AlertService,
              private userService: UserService,
              private jsonService: JsonService,
              private formBuilder: FormBuilder) {

    this.payService.currentTotalPay.subscribe(message=>this.totalPay = message);

  }

ngAfterContentInit():void{

  this.accService.getSrv().pipe(first())
    .subscribe(
      (data:any) => {
        this.fba = data;
      },
      error => {
        console.log(error);

      });

  this.accService.getData("cnt").pipe(first())
    .subscribe(
      (data: any) => {
        this.cnt = data;
        //console.log(this.cnt);
      },
      error => {
        console.log(error);
      });

  this.currentAcc = JSON.parse(localStorage.getItem('currentAcc'));

  this.payForm = this.formBuilder.group({
    acc_id: [this.currentAcc],
    offer: [false, Validators.requiredTrue],
    order: [false, Validators.requiredTrue],
    email: [''],
    sum_pay: [this.sum_pay_total]
  });
}
  ngOnInit():void {
    this.userService.getUser().pipe(first()).subscribe(
      (data: any)=> {
        //console.log(data[0].email);
        this.email = data[0].email;
      }
    );


   // console.log(this.totalPay);
   if (!this.totalPay){
     this.payService.currentTotalPay.subscribe(message=>this.totalPay = message);
   }

   if (isNaN(this.totalPay)){
     this.loginService.logout();
   }

        //  console.log("totalPay = " + this.totalPay);

          this.payService.getPercent(this.totalPay).pipe(first())
            .subscribe(
              (data:any) => {
                this.af = data.sum_bank;
                this.sum_pay_total = data.sum_to_pay;

                this.isLoaded = true;
              },
              error => {
                console.log(error);

              });

      /*  },
        error => {
          console.log(error);

        });*/
}

  get f() { return this.payForm.controls; }

  onSubmit(){
    this.submitted = true;
    this.load_sbr_form = true;
    if (this.payForm.invalid) {
      return;
    }
  // this.loading = true;
  if (this.totalPay === 0){
      this.load_sbr_form = false;
       return this.alertService.error("Сумма платежа должна быть больше 0!");
  }
    let amount = this.round(this.sum_pay_total * 100, 2);

    this.jsonService.getJson(this.cnt, this.fba).pipe(first()).subscribe((data:any)=>{this.json = data});

    this.json.sum_pay = this.totalPay;
    this.json.sum_pay_bank = amount;
    this.json.sum_af_bank = this.af;
    this.json.email = this.email;
    this.json.user_id = localStorage.getItem('user_id');
  //console.log(this.json);
    return this.payService.getFormUrlLink(this.json).pipe(first())
      .subscribe(
        (data:any) => {
          console.log(data);
          if (data.hasOwnProperty("formUrl")){

            this.load_sbr_form = false;
            this.orderId = data.orderId;

            sessionStorage.setItem('orderId', this.orderId);

            window.open(data.formUrl);
          }
          else{
            this.load_sbr_form = false;
            return this.alertService.error("Ошибка при создании формы для оплаты!");
          }

        },
        error => {
          console.log(error);

        });

  }
  // Округление
  round(value, precision) {
    let multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }

}

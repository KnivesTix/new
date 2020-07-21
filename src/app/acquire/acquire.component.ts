import {Component, OnInit, AfterContentInit, Input} from '@angular/core';
import {AccountService} from "../_services/account.service";
import {ActivatedRoute} from "@angular/router";
import {PaySBRService} from "../_services/pay-sbr.service";
import {AlertService} from "../_services/alert.service";
import {JsonService} from "../_services/json.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {first} from "rxjs/internal/operators";
import {UserService} from "../_services/user.service";

@Component({
  selector: 'app-acquire',
  templateUrl: './acquire.component.html',
  styleUrls: ['./acquire.component.css']
})
export class AcquireComponent implements OnInit, AfterContentInit {
  public currentAcc: string;
  private orderId: string;
  sum_pay_total: number;
  isLoaded: boolean = false;
  // loading = false;
  totalPay: number;
  af: number;
  fba: any[] = []; // Начисления по услугам
  bank_percent: number;
  cnt: any[] = []; // Счетчики
  json: any;
  sum_to_pay: number;
  sumUpdArray: any = [];
  payForm: FormGroup;
  submitted = false;
  message: string;
  constructor(private accService: AccountService,
              private route: ActivatedRoute,
              private payService: PaySBRService,
              private alertService: AlertService,
              private jsonService: JsonService,
              private userService: UserService,
              private formBuilder: FormBuilder,
  ) {
    this.payService.currentTotalPay.subscribe(message=>this.totalPay = message);
    //this.payService.onClick.subscribe(cnt=>this.totalPay = cnt);
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

    this.accService.getCnt().pipe(first())
      .subscribe(
        (data: any) => {
          this.cnt = data;

        },
        error => {
          console.log(error);
        });

    this.currentAcc = JSON.parse(localStorage.getItem('currentAcc'));

   // console.log(this.sum_pay_total);

    this.payForm = this.formBuilder.group({
      acc_id: [this.currentAcc],
      offer: [false, Validators.requiredTrue],
      order: [false, Validators.requiredTrue],
      email: ['', [Validators.required,  Validators.email]],
      sum_pay: [this.sum_pay_total]
    });

  }

  ngOnInit():void {

    this.payService.getPercent(this.totalPay).pipe(first())
      .subscribe(
        (data:any) => {
          this.af = data.sum_bank;
          //console.log(data);
          this.sum_pay_total = data.sum_to_pay;
        },
        error => {
          console.log(error);

        });
    this.isLoaded = true;



   /* this.accService.getData('fba_sup').pipe(first())
      .subscribe(
        (data:any) => {

          this.sumUpdArray = data[data.length - 1];

          this.payService.getPercent(this.sumUpdArray.sum_pay_total).pipe(first())
            .subscribe(
              (data:any) => {
                this.af = data.sum_bank;
                console.log(data);
                this.sum_pay_total = data.sum_to_pay;
              },
              error => {
                console.log(error);

              });
          this.isLoaded = true;
        },
        error => {
          console.log(error);

        });
*/


  }

  get f() { return this.payForm.controls; }

  onSubmit(){
    this.submitted = true;

    if (this.payForm.invalid) {
      return;
    }
    // this.loading = true;
    let amount = this.round(this.sum_pay_total * 100, 2);

    this.jsonService.getJson(this.cnt, this.fba).pipe(first()).subscribe((data:any)=>{this.json = data});

    this.json.sum_pay = this.totalPay;
    this.json.sum_pay_bank = amount;
    this.json.sum_af_bank = this.af;
    this.json.email = this.f.email.value;
    console.log(this.json);
    return this.payService.getFormUrlLink(this.json).pipe(first())
      .subscribe(
        (data:any) => {
          //console.log(data);
          if (data.hasOwnProperty("formUrl")){
            this.orderId = data.orderId;
            sessionStorage.setItem('orderId', this.orderId);

            window.open(data.formUrl);
            //this.loading = false;
          }
          else{
            return this.alertService.error("Ошибка!");
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

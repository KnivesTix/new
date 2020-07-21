import { Component, OnInit } from '@angular/core';
import {FormGroup, Validators, FormBuilder} from "@angular/forms";
import {first} from "rxjs/internal/operators";
import {AccountService} from "../_services/account.service";
import {CntService} from "../_services/cnt.service";
import {AlertService} from "../_services/alert.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-cnt-declared',
  templateUrl: './cnt-declared.component.html',
  styleUrls: ['./cnt-declared.component.css']
})
export class CntDeclaredComponent implements OnInit {
  cntForm: FormGroup;
  loading = false;
  private cntAcc: number;
  cnt: any[] = [];
  cntDeclared: any[] = [];
  submitted = false;
  qty: number = 0;
  sum_pay: number = 0;
  private accId: number;
  sum_af;
  sum_total;
  newCnt: any[] = [];

  constructor(private formBuilder: FormBuilder,
              private accService: AccountService,
              private cntService: CntService,
              private alertService: AlertService,
              private router: Router)  { }

  get f() { return this.cntForm.controls; }

  ngOnInit() {
    this.cntForm = this.formBuilder.group({
      acc_id: ['', Validators.required]
    });

  }
  getNewCnt(){
    this.cntService.getNewCnt(this.accId).pipe(first())
    .subscribe(
      (data:any) => {

        this.newCnt = data;
        // console.log(data);
        //this.isLoaded = false;
      },
      error => {
        console.log(error);

      });
  }
 /* getCnt(){
    this.cntAcc = this.f.acc_id.value;
    //console.log(this.cntAcc);
    return this.cntService.getCnt(this.cntAcc).pipe(first())
      .subscribe(
        (data:any) => {

          this.cnt = data;
          //console.log(data);
        },
        error => {
          console.log(error);

        });
  }
  */
 /* getCnt(){
    this.accService.getCnt().pipe(first())
      .subscribe(
        (data: any) => {
          this.cnt = data;
        //  console.log(data);
        },
        error => {
          console.log(error);
        });
  }
*/

  getCnt(){
 //   this.isLoaded = true;
    return this.cntService.getCnt(this.accId).pipe(first())
      .subscribe(
        (data:any) => {

          this.cnt = data;
          // console.log(data);
          //this.isLoaded = false;
        },
        error => {
          console.log(error);

        });
  }

  getDeclaredCnt(){
  //  this.isLoaded = true;
    return this.accService.calcCnt().pipe(first())
      .subscribe(
        (data:any) => {

          this.getCnt();
          //  this.cnt = data;
          //  console.log(data);
          //  this.isLoaded = false;
        },
        error => {
          console.log(error);

        });
  }

  setAcc() {
   // this.docId = 0;
    this.accId = this.f.acc_id.value;
    localStorage.setItem('currentAcc', this.accId.toString());
  }

  countSumPay(doc){


    for (const {p, index} of this.cnt.map((p, index) => ({ p, index }))) {
      this.sum_pay = this.round((p.val_cur - p.val_prev) * p.tariff * p.koefficient,2);
      this.sum_af = this.round((p.val_cur - p.val_prev) * p.tariff * p.koefficient * p.percent_af / 100,2);

      this.sum_total = this.round(this.sum_af + this.sum_pay,2);

      this.cnt[index].qty = this.round(p.val_cur - p.val_prev, 3);
      this.cnt[index].sum_pay = this.sum_pay;//this.round((p.val_cur - p.val_prev) * p.tariff * p.koefficient, 2);
      this.cnt[index].sum_af = this.sum_af;
      this.cnt[index].sum_total = this.sum_total;
    }
    // return this.round((val_cur - val_prev) * tariff * koef, 2);


    return (doc.val_cur - doc.val_prev) * doc.tariff * doc.koefficient
  }

  resetCntValue(){
    this.loading = true;

    return this.cntService.resetCnt().pipe(first())
      .subscribe(
        (data:any) => {
          this.loading = false;
          this.getCnt();
          this.alertService.success("Показания сброшены.", false);


          /*  setTimeout(()=>{
           this.alertService.clear();
           }, 2000);
           */
        },
        error => {
          console.log(error);
        });
  }

 /* getCntDeclared(){
    this.cntAcc = this.f.acc_id.value;
    //console.log(this.cntAcc);
    return this.cntService.getCntDeclared(this.cntAcc).pipe(first())
      .subscribe(
        (data:any) => {

          this.cntDeclared = data;
          //console.log(data);
        },
        error => {
          console.log(error);

        });
  }
*/

  getJsonCnt() {

    let json_cnt = {
      acc_id: this.accId,
      cnt: []
    };

    for (const {p, index} of this.cnt.map((p, index) => ({p, index}))) {

      if (this.cnt[index].val_cur < this.cnt[index].val_last){
        alert("Новое показание должно быть больше предыдущего!");
        return;
      }

      let cnt = json_cnt.cnt;
      cnt.push({
        cnt_id: this.cnt[index].cnt_id,
        val_prev: this.cnt[index].val_prev,
        val_last: this.cnt[index].val_last,
        qty: this.cnt[index].qty,
        val_cur: this.cnt[index].val_cur,
        sum_pay: this.cnt[index].sum_pay,
        srv_id: this.cnt[index].srv_id,
        sup_id: this.cnt[index].sup_id
      });

    }

    this.loading = true;

    this.cntService.setCnt(json_cnt).pipe(first())
      .subscribe(
        (data:any) => {
          this.loading = false;
          //this.getCnt();
          return this.alertService.success("Показания успешно внесены", false);
        },
        error => {
          console.log(error);
        });

  }

  onSubmit(){
    this.submitted = true;

    if (this.cntForm.invalid) {
      return;
    }
    this.setAcc();
    this.getDeclaredCnt();
    this.getCnt();

  }
/*
  getSumPay(val_cur:number, val_prev: number, tariff:number){
    for (const {p, index} of this.cnt.map((p, index) => ({ p, index }))) {
      this.cnt[index].qty = p.val_cur - p.val_prev;
      this.cnt[index].sum_pay = this.round(((p.val_cur - p.val_prev) * p.tariff * p.koefficient), 2);
    }
    return this.round(((val_cur - val_prev) * tariff), 2);
  }
*/
  countQty(val_cur: number, val_prev: number){
    this.qty = this.round(val_cur - val_prev,3);
    return this.qty;
  }
/*
  setSumPay(val_cur:number, val_last: number){
    if (val_cur < val_last){
      alert("Новое показание должно быть больше предыдущего!");
      return;
    }
  }
*/
/*  resetAll(){
    this.accService.resetAll().pipe(first())
      .subscribe(
        (data: any) => {
          this.getCnt();
          this.getCntDeclared();
        },
        error => {
          console.log(error);
        });
  }
*/
  /*resetCntValue(){
    this.loading = true;

    return this.cntService.resetCnt().pipe(first())
      .subscribe(
        (data:any) => {
          this.loading = false;
          this.getCnt();
          return this.alertService.success("Показания сброшены.", false);
        },
        error => {
          console.log(error);
        });

  }
*/
 /* getJsonCnt() {
    let json_cnt = {
      acc_id:  this.f.acc_id.value,
      cnt: []
    };

    for (const {p, index} of this.cnt.map((p, index) => ({p, index}))) {

      let cnt = json_cnt.cnt;
      cnt.push({
        cnt_id: this.cnt[index].cnt_id,
        pic_id:this.cnt[index].pic_id,
        qty: this.cnt[index].qty,
        val_cur: this.cnt[index].val_cur,
        srv_id: this.cnt[index].srv_id,
        sup_id: this.cnt[index].sup_id
      });

    }
    this.loading = true;

    this.accService.setCnt(json_cnt).pipe(first())
      .subscribe(
        (data:any) => {
          //this.loading = false;
          this.getCnt();
          this.getCntDeclared();
          this.loading = false;
        },
        error => {
          console.log(error);

        });


  }*/


 /* getJsonCnt() {
    let json_cnt = {
      acc_id:  this.f.acc_id.value,
      cnt: []
    };

    for (const {p, index} of this.cnt.map((p, index) => ({p, index}))) {

      let cnt = json_cnt.cnt;
      cnt.push({
        cnt_id: this.cnt[index].cnt_id,
        pic_id:this.cnt[index].pic_id,
        qty: this.cnt[index].qty,
        val_cur: this.cnt[index].val_cur,
        srv_id: this.cnt[index].srv_id,
      })
    }
    this.loading = true;

    this.cntService.setCntDeclared(json_cnt).pipe(first())
      .subscribe(
        (data:any) => {
          this.loading = false;
          this.getCntDeclared();
          return this.alertService.success("Показания успешно отправлены.", false);

        },
        error => {
          console.log(error);

        });
  }*/

  back(){
    this.router.navigate(['/profile-home/']);
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  round(value, precision) {
    let multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }
}

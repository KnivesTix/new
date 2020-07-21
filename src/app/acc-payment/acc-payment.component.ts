import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {first} from "rxjs/internal/operators";

import {AccountService} from "../_services/account.service";
import {PaySBRService} from "../_services/pay-sbr.service";


@Component({
  selector: 'app-acc-payment',
  templateUrl: './acc-payment.component.html',
  styleUrls: ['./acc-payment.component.css']
})

export class AccPaymentComponent implements OnInit {
  //@ViewChild('recaptcha') recaptchaElement: ElementRef;
  accForm: FormGroup;
  loading = false;
  isNotValid = true;
  private token;
  private tokenResult = false;
  private accId: number;
  accArray: any[] = null;
  //fba: any[] = [];//Введенные пользователем данные к оплате
  qr_json: any = {};
  submitted = false;
  fba: any[] = []; // Начисления по услугам

  cnt: any[] = []; // Счетчики

  docId: number = 0; // Идентификатор информационного документа
  error: string;
  sumAF: number = 0; // Сумма агентского вознаграждения(АВ)
  sumTotal: number = 0; //
  totalAF: number = 0; // Итоговая сумма АВ
  price : number = 0; //
  totalRest: number; // Исходящий остаток
  totalPay: number = 0; // Итоговая сумма платежа
  pdf_json: any = {};
  //qr_json: any = {};
  message: string;
  constructor(
              private accService: AccountService,
              private formBuilder: FormBuilder,
              private sbrService: PaySBRService) {

 //   this.sbrService.onClick.subscribe(cnt => this.totalPay = cnt);

  }

  setTotalPay():void {
    sessionStorage.setItem('total', this.totalPay.toString());
    this.sbrService.setTotalPay(this.totalPay);
  }

  ngOnInit() {
    this.sbrService.currentTotalPay.subscribe(total => this.totalPay = total);
    this.accForm = this.formBuilder.group({
      acc_id: ['', Validators.required]
    });
  }

  get f() { return this.accForm.controls; }

  onSubmit(){
    if (this.accForm.invalid) {
      return;
    }

    this.submitted = true;
    this.loading = true;
    this.setAcc();
    this.getSrv();
    this.getCnt();
  }

  countCurPay() {
    this.price = 0;
    this.totalAF = 0;
    this.totalPay = 0;
    //this.totalRest = 0;

    for (const {p, index} of this.fba.map((p, index) => ({p, index}))) {

      if (index != this.fba.length - 1) { // Убираем строку "Всего" из расчета (последняя в массиве)

        if (p.cur_pay === null){
          p.cur_pay = 0;
        }

        this.price += Number(p.cur_pay);
        this.totalAF += this.countAF(Number(p.cur_pay), Number(p.percent_af));
        this.totalPay += this.countTotal(Number(p.cur_pay));

        p.sum_af = this.countAF(Number(p.cur_pay), Number(p.percent_af));
        p.sum_for_pay_total = this.countTotal(Number(p.cur_pay));

      }
     /* else {
        p.cur_pay = this.price;
        p.sum_af = this.totalAF;//this.countAF(Number(p.cur_pay), Number(p.percent_af));
        p.sum_for_pay_total = this.totalPay;//this.countTotal(Number(p.cur_pay));
      }*/

      this.price = Number(this.round(this.price, 2));
      this.totalAF = this.round(this.totalAF, 2);
      this.totalPay = this.round(this.totalPay, 2);
     // this.totalRest = Number(this.round(this.totalRest, 2));

     // this.fba[index] = this.fba[index];

     // this.accArray = this.fba[this.fba.length - 1];
      this.accArray = this.fba[this.fba.length - 1];

    }

  }

 /* getJsonData(){
    this.jsonService.getJson(this.cnt, this.fba).pipe(first()).subscribe((data:any)=>{this.pdf_json = data});
  }
  */
  formingJDoc(){

    this.pdf_json = {
      srv:[],
      cnt: []
    };

    let cnt_item = 0;
    let srv_item = 0;
    for (const {p, index} of this.cnt.map((p, index) => ({p, index}))) {
      cnt_item = index + 1;
      this.pdf_json.cnt.push({
        item: cnt_item,
        srv_id: p.srv_id,
        sup_id: p.sup_id,
        val_prev: p.val_prev,
        val_cur: p.val_cur,
        qty: p.qty,
        sum_pay: p.sum_pay,
        cnt_id: p.cnt_id
      });
    }

    for (const {p, index} of this.fba.map((p, index) => ({ p, index }))) {
      //let af = this.round(this.countAF(Number(p.cur_pay), Number(p.percent_af)),2);
      //let sum_total = this.round(this.countTotal(Number(p.cur_pay)),2);
      srv_item = index + 1;
      this.pdf_json.srv.push({
        item: srv_item,
        ctype: p.cnt_type,
        dt: p.dt,
        ct: p.ct,
        sum_for_pay: p.sum_for_pay,
        sum_af: p.sum_af,
        srv_id: p.srv_id,
        sup_id: p.sup_id,
        chr_cnt: p.chr_cnt,
        sum_cur_pay: p.cur_pay,
        sum_pay: p.sum_for_pay_total
      });
    }
   // console.log(this.pdf_json);
  }


  setAcc() {
    this.docId = 0;
    this.accId = this.f.acc_id.value;
    localStorage.setItem('currentAcc', this.accId.toString());
  }

  getSrv(){
    //await this.accService.calcAcc().pipe(first()).subscribe();
    this.accService.getSrv().pipe(first())
      .subscribe(
        (data:any) => {
          if (data.code === 100){
            this.error = "Лицевой счет не найден!";
            this.loading = false;
            return;
          }
          this.fba = data;
          //console.log(data);
          this.countCurPay();
          this.loading = false;
        },
        error => {
          console.log(error);
        });
  }

  getCnt(){
    this.accService.getCnt().pipe(first())
      .subscribe(
        (data: any) => {
          this.cnt = data;
        },
        error => {
          console.log(error);
        });
  }

  formingQR(){

    this.loading = true;
    this.formingJDoc();

    this.pdf_json.acc_id = 0;

    this.pdf_json.cnt_count = this.pdf_json.cnt.length;
    this.pdf_json.npp = 0;
    this.pdf_json.type_pay = 0;
    this.pdf_json.status = 0;
    this.pdf_json.cassa_id = 98;
    this.pdf_json.operator_id = 0;
    this.pdf_json.doc_id = 0;
    this.pdf_json.sum_pay = this.totalPay;

    return this.accService.sendPay(this.pdf_json).pipe(first())
      .subscribe(
        (data:any) => {
          this.docId = data.doc_id;

          this.qr_json.doc_id = data.doc_id;
          this.qr_json.doc_date = "";
          this.qr_json.acc_id = 0;
          this.qr_json.address = "";
          this.qr_json.sum_pay = this.totalPay*100;

          this.accService.getQRCode(this.qr_json).pipe(first()).subscribe((data:any)=>{
            // QR-код передается в формате base64 и затем открывается в новом окне как картинка
            let image = new Image();
            image.src = data;
            let w = window.open("");
            w.document.write(image.outerHTML);
            w.document.close();
          });
          this.loading = false;

        },
        error => {
          console.log(error);

        });
  }

  resetAll(){
    this.accService.resetAll().pipe(first())
      .subscribe(
        (data: any) => {
          this.getCnt();
          this.getSrv();
        },
        error => {
          console.log(error);
        });
  }

  getSumPay(val_cur:number, val_prev: number, tariff:number){
    for (const {p, index} of this.cnt.map((p, index) => ({ p, index }))) {
      this.cnt[index].qty = p.val_cur - p.val_prev;
      this.cnt[index].sum_pay = this.round((p.val_cur - p.val_prev) * p.tariff, 2);
    }
    return this.round((val_cur - val_prev) * tariff, 2);
  }

  setSumPay(sup_id: number, srv_id: number, sum_pay: string){
   /* console.log(this.accId);
    console.log(sup_id);
    console.log(srv_id);
    console.log(sum_pay);
*/
    sum_pay = sum_pay.toString().replace(".", ",");
    this.accService.setFba(this.accId, sup_id, srv_id, sum_pay).pipe(first())
      .subscribe(
        (data: any) => {
          //this.getCnt();
          this.getSrv();
        },
        error => {
          console.log(error);
        });

    //this.getSrv();
      //alert("test");
 //     return;

  }

  getJsonCnt() {
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

    this.accService.setCnt(json_cnt).pipe(first())
      .subscribe(
        (data:any) => {
          this.loading = false;
          this.getCnt();
          this.getSrv();
         // return this.alertService.success("Показания успешно отправлены.", false);
        },
        error => {
          console.log(error);

        });

  }

  countAF(cur_pay: number, procent: number){
    this.sumAF = this.round(Number(cur_pay)/100 * Number(procent), 2);
    return this.round(Number(cur_pay)/100*Number(procent), 2);
  }

  // Расчет итоговой суммы платежа вместе с агентским вознаграждением
  countTotal(cur_pay: number){
    this.sumTotal = this.round(Number(cur_pay) + Number(this.sumAF), 2);
    return this.round(Number(cur_pay) + Number(this.sumAF), 2);
  }

  // Расчет остатка
  /*countRest(sum_for_pay: number, cur_pay: number){
   return this.round(Number(sum_for_pay) - Number(cur_pay), 2);
   }*/
  trackByIndex(index: number, obj: any): any {
    return index;
  }

  // Округление
  round(value, precision) {
    let multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }


  /*
   getQR(){

   this.loading = true;

   this.qr_json.doc_date = "";
   this.qr_json.acc_id = this.accId;

   this.qr_json.address = this.accArray[1];
   this.qr_json.sum_pay =  this.accArray[2]*100;
   this.paymentService.getQRCode(this.qr_json).pipe(first()).subscribe((data:any)=>{
   // QR-код передается в формате base64 и затем открывается в новом окне как картинка
   let image = new Image();
   image.src = data;
   let w = window.open("");
   w.document.write(image.outerHTML);
   }
   ,
   error => {
   console.log(error);

   });
   this.loading = false;

   }
   */


}

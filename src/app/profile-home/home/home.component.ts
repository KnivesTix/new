import {Component, OnInit, AfterContentInit, AfterContentChecked} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {AccountService} from "../../_services/account.service";
import {first} from "rxjs/internal/operators";
import {UpdService} from "../../_services/upd.service";
import {PaySBRService} from "../../_services/pay-sbr.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentAcc: string;
  sumUpdArray: any[] = [];
  pay_json:  any = {};
  loading = true;
  docId: number = 0;
  isLoaded: boolean = false;
  totalPay: number = 0; // Итоговая сумма платежа
  sendEmail: boolean = true;
  constructor(private accService: AccountService,
  private sbrService: PaySBRService){

  }

  ngOnInit() {
    this.isLoaded = true;
    //console.log(this.isLoaded);
    this.currentAcc = JSON.parse(localStorage.getItem('currentAcc'));
   // this.sbrService.currentTotalPay.subscribe(total => this.totalPay = total);

    this.accService.getSrv().pipe(first())
      .subscribe(
        (data:any) => {

          this.totalPay = data[data.length - 1].sum_for_pay_total;
          this.isLoaded = false;
        },
        error => {
          console.log(error);

        });

  }

  setTotalPay():void {
    sessionStorage.setItem('total', this.totalPay.toString());
    this.sbrService.setTotalPay(this.totalPay);
  }

 /* sendPay(){
    this.loading = true;

    this.pay_json.acc_id = 0;
    this.pay_json.cnt_count = this.pay_json.cnt.length;
    this.pay_json.npp = 0;
    this.pay_json.type_pay = 0;
    this.pay_json.status = 0;
    this.pay_json.cassa_id = 0;
    this.pay_json.operator_id = 0;
    this.pay_json.doc_id = 0;
    this.pay_json.sum_pay = this.totalPay;

    return this.accService.sendPay(this.pay_json).pipe(first())
      .subscribe(
        (data:any) => {
          this.docId = data.doc_id;
          // this.fbaSuppliers = data.pay;
          // this.docId = data.doc_id;
          console.log(data);
          this.loading = false;
          this.getPayDoc();
        },
        error => {
          console.log(error);

        });

  }
  */
 /*
  // Получить документ с QR-кодом
  getPayDoc(){
    return this.accService.getPdf(this.docId).pipe(first())
      .subscribe(
        (data:any) => {

          const fileURL = URL.createObjectURL(data);
          window.open(fileURL, '_blank');
        },
        error => {
          console.log(error);

        });

  }*/
}

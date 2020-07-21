import {Component, OnInit} from '@angular/core';
import {AccountService} from "../../_services/account.service";
import {first} from "rxjs/internal/operators";
import {CntService} from "../../_services/cnt.service";
import {AlertService} from "../../_services/alert.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-cnt',
  templateUrl: './cnt.component.html',
  styleUrls: ['./cnt.component.css']
})
export class CntComponent implements OnInit {
  loading = false;
  isLoaded: boolean = false;
  private currentAcc: string;
  cntArray: any[] = [];
  qty: number = 0;
  sum_pay: number = 0;
  sum_af;
  sum_total;
  constructor(private accService: AccountService,
              private cntService: CntService,
              private alertService: AlertService,
              private router: Router) {
    this.currentAcc = JSON.parse(localStorage.getItem('currentAcc'));

  }

  ngOnInit() {

    this.getCnt();

  }

  getCnt(){
    this.isLoaded = true;
    return this.accService.getData("cnt").pipe(first())
      .subscribe(
        (data:any) => {

          this.cntArray = data;
          //console.log("getCnt = " + data);
          this.isLoaded = false;
        },
        error => {
          console.log(error);

        });
  }

  getDeclaredCnt(){
    this.isLoaded = true;
    return this.accService.calcCnt().pipe(first())
      .subscribe(
        (data:any) => {
          this.getCnt();
        //  this.cntArray = data;
        //  console.log(data);
        //  this.isLoaded = false;
        },
        error => {
          console.log(error);

        });
  }

  countSumPay(doc){


    for (const {p, index} of this.cntArray.map((p, index) => ({ p, index }))) {
      this.sum_pay = this.round((p.val_cur - p.val_prev) * p.tariff * p.koefficient,2);
      this.sum_af = this.round((p.val_cur - p.val_prev) * p.tariff * p.koefficient * p.percent_af / 100,2);

      this.sum_total = this.round(this.sum_af + this.sum_pay,2);

      this.cntArray[index].qty = this.round(p.val_cur - p.val_prev, 3);
      this.cntArray[index].sum_pay = this.sum_pay;//this.round((p.val_cur - p.val_prev) * p.tariff * p.koefficient, 2);
      this.cntArray[index].sum_af = this.sum_af;
      this.cntArray[index].sum_total = this.sum_total;
    }
   // return this.round((val_cur - val_prev) * tariff * koef, 2);


   return (doc.val_cur - doc.val_prev) * doc.tariff * doc.koefficient
  }

  countQty(val_cur: number, val_prev: number){
    this.qty = this.round(val_cur - val_prev, 3);
    return this.qty;
  }

  /*countAF(doc){
    if (doc.sup_id === 3 || doc.sup_id === 6 || doc.sup_id === 40){
      return ((doc.val_cur - doc.val_prev) * doc.tariff * doc.koefficient *2 / 100)
    }

    return 0;
  }
  countTotal(doc){
    let af;
    if (doc.sup_id === 3 || doc.sup_id === 6 || doc.sup_id === 40){
      af = ((doc.val_cur - doc.val_prev) * doc.tariff * doc.koefficient *2 / 100);
      return ((doc.val_cur - doc.val_prev) * doc.tariff * doc.koefficient) + af;
    }
    return ((doc.val_cur - doc.val_prev) * doc.tariff * doc.koefficient);

  }
  */
 /* checkNewVal(val_cur:number, val_last: number){
    if (val_cur < val_last){
      //this.test = true;
      alert("Новое показание должно быть больше предыдущего!");
      return;
    }

  }
  */

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

  getJsonCnt() {

    let json_cnt = {
      acc_id: this.currentAcc,
      cnt: []
    };

    for (const {p, index} of this.cntArray.map((p, index) => ({p, index}))) {

      if (this.cntArray[index].val_cur < this.cntArray[index].val_last){
        alert("Новое показание должно быть больше предыдущего!");
        return;
      }

      let cnt = json_cnt.cnt;
      cnt.push({
        cnt_id: this.cntArray[index].cnt_id,
        val_prev: this.cntArray[index].val_prev,
        val_last: this.cntArray[index].val_last,
        qty: this.cntArray[index].qty,
        val_cur: this.cntArray[index].val_cur,
        sum_pay: this.cntArray[index].sum_pay,
        srv_id: this.cntArray[index].srv_id,
        sup_id: this.cntArray[index].sup_id
      })
    }
    this.loading = true;
    //console.log(json_cnt);
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

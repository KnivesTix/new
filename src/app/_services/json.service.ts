import { Injectable } from '@angular/core';
import {of} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class JsonService {
  pdf_json: any = {};
  private currentAcc: string;
  fba: any[] = [];//Введенные пользователем данные к оплате
  cnt: any[] = []; // Счетчики
  sumAF: number = 0; // Сумма агентского вознаграждения(АВ)
  constructor() { }

  getJson(cnt: any[]=[], fbaSrvUpdated: any[]=[]){
    this.cnt = cnt;
    this.fba = fbaSrvUpdated;
    this.pdf_json = {
      srv:[],
      cnt: []
    };

    let cnt_item = 0;
    let srv_item = 0;

    if (this.cnt) {
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
  }

  if (this.fba) {
    for (const {p, index} of this.fba.map((p, index) => ({p, index}))) {

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
  }
    this.pdf_json.acc_id = this.currentAcc = JSON.parse(localStorage.getItem('currentAcc'));
    this.pdf_json.cnt_count = this.pdf_json.cnt.length;
    this.pdf_json.npp = 0;
    this.pdf_json.type_pay = 0;
    this.pdf_json.status = 0;
    this.pdf_json.cassa_id = 98;
    this.pdf_json.operator_id = 0;
    this.pdf_json.doc_id = 0;
    this.pdf_json.sum_pay = this.fba[this.fba.length-1].sum_for_pay_total;
   // console.log("jsonService = " + this.pdf_json);
    return of(this.pdf_json);
  }
}

import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/internal/operators";
import {HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment"


@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private currentAcc: string;
  private userId: string;
  private url;
  private reportUrl;
  constructor(private http: HttpClient) {

    this.url = environment.url;
    this.reportUrl = environment.reportUrl;
  }
  // section (param, cnt, fba, pays, tariff, norm, recalc)
  getData(section: string){
    this.currentAcc = JSON.parse(localStorage.getItem('currentAcc'));
    this.userId = JSON.parse(localStorage.getItem('user_id'));

    let body = {acc_id: this.currentAcc, user_id: this.userId};
    return this.http.post(this.url + "common/" + section + "/", body).pipe(map(res => res))
  }

  getCnt(){
    this.currentAcc = JSON.parse(localStorage.getItem('currentAcc'));
   // this.userId = JSON.parse(localStorage.getItem('user_id'));

    let body = {acc_id: this.currentAcc};
    return this.http.post(this.url + "cnt/get_cnt", body).pipe(map(res => res))
  }
  setCnt(p_json: any){
    let body = p_json;
    return this.http.post(this.url + "cnt/set_cnt", body).pipe(map(res => res))
  }
  // начисления по услугам
  getSrv(){
    this.currentAcc = JSON.parse(localStorage.getItem('currentAcc'));
    let body = {acc_id: this.currentAcc};

    return this.http.post(this.url +  "fba/srv/", body).pipe(map(res => res))
  }

  getAccSrv(){
    this.currentAcc = JSON.parse(localStorage.getItem('currentAcc'));
    let body = {acc_id: this.currentAcc};

    return this.http.post(this.url +  "fba/acc_srv/", body).pipe(map(res => res))
  }
  calcAcc(){
    this.currentAcc = JSON.parse(localStorage.getItem('currentAcc'));
    let body = {acc_id: this.currentAcc};
    return this.http.post(this.url +  "common/calc/acc", body).pipe(map(res => res))
  }
  //--------------------------------------------------------------------------------

  calcCnt(){
    this.currentAcc = JSON.parse(localStorage.getItem('currentAcc'));
    let body = {acc_id: this.currentAcc};
    return this.http.post(this.url +  "cnt/calc_cnt", body).pipe(map(res => res))
  }

  //--------------------------------------------------------------------------------

  // Отправляем json-документ с данными для оплаты, в ответе получаем doc_id инф. документа(QR)
  sendPay(body: any){
    const httpOptions = {headers: new HttpHeaders({'Content-Type':  'application/json'})};
    this.currentAcc = JSON.parse(localStorage.getItem('currentAcc'));
    body.acc_id = this.currentAcc;

    return this.http.post(this.reportUrl + "get_doc_id", body, httpOptions).pipe(map(res => res))
  }

  getQRCode(body: any){
  //  const headers = new HttpHeaders({'Content-Type':  'image/png'});

    this.currentAcc = JSON.parse(localStorage.getItem('currentAcc'));
    body.acc_id = this.currentAcc;
    //console.log("body = " + JSON.stringify(body));

    return this.http.post(this.url + "qr", body,{responseType: 'text'}).pipe(map(res => res))

  }
  // Получить pdf документа с qr кодом по ID
  getPdf(doc_id: number):any{

    const headers = new HttpHeaders({'Content-Type':  'application/json'});

    this.currentAcc = JSON.parse(localStorage.getItem('currentAcc'));
    let body = {acc_id: this.currentAcc, doc_id: doc_id};
    //console.log(body);
    return this.http.post<Blob>(this.reportUrl + "get_pdf", body, {headers: headers, responseType: 'blob' as 'json'});
  }
  resetAll(){
    this.currentAcc = JSON.parse(localStorage.getItem('currentAcc'));
    let body = {acc_id: this.currentAcc};
    return this.http.post(this.url + "reset/acc-payment", body).pipe(map(res => res))
  }
  // Дубликат квитанции в pdf
  getNotice(pay_id: number):any{
    this.currentAcc = JSON.parse(localStorage.getItem('currentAcc'));
    const headers = new HttpHeaders({'Content-Type':  'application/json'});

    let body = {acc_id:  this.currentAcc , pay_id: pay_id};
   // console.log(body);
    return this.http.post<Blob>(this.url + "pdf", body, {headers: headers, responseType: 'blob' as 'json'});
  }
  // Дубликат квитанции в pdf с wls, ссылка генерируется из html pays.component.html
 /* getNotice2(pay_id: number):any{
    this.currentAcc = JSON.parse(localStorage.getItem('currentAcc'));
    const headers = new HttpHeaders({'Content-Type':  'application/json'});

    let body = {acc_id:  this.currentAcc , pay_id: pay_id};

   //  return this.http.post("http://10.170.8.4:3010/common/pay/notice", body);
  }
  */
  // Сбросить все введенные пользователем данные до начального состояния
  resetAllData(){
    this.currentAcc = JSON.parse(localStorage.getItem('currentAcc'));
    let body = {acc_id: this.currentAcc};
    return this.http.post(this.url + "reset", body).pipe(map(res => res))
  }
  setFba(acc_id: number, sup_id: number, srv_id: number, sum_pay: string){
   // this.currentAcc = JSON.parse(localStorage.getItem('currentAcc'));
    let body = {acc_id: acc_id, sup_id: sup_id, srv_id: srv_id, sum_pay: sum_pay};
    return this.http.post(this.url + "fba/set_fba", body).pipe(map(res => res))
  }
  // ????? вызывает inet.f_j_set_cur_pay(:p1, :p2) на wls
  sendFbaSrv(p_json: string){
    this.currentAcc = JSON.parse(localStorage.getItem('currentAcc'));
    let body = {acc_id: this.currentAcc, p_json: p_json};

    return this.http.post(this.url +  "fba/update_fba_srv/", body).pipe(map(res => res))
  }
}

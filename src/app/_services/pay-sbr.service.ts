import {Injectable, EventEmitter} from '@angular/core';
import {HttpHeaders} from "@angular/common/http";
import {map} from "rxjs/internal/operators";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PaySBRService {
  //private totalPay = 0;
  onClick:EventEmitter<any> = new EventEmitter();
  private registerSbr: string;
  private currentAcc: string;
  private url;
  private totalPay = new BehaviorSubject(parseFloat(sessionStorage.getItem('total')));
  currentTotalPay = this.totalPay.asObservable();

  constructor(private http: HttpClient) {
    this.url = environment.url;
    this.currentAcc = JSON.parse(localStorage.getItem('currentAcc'));
  }

  setTotalPay(message: number) {
  //  console.log("changeMessage = " + message);

    this.totalPay.next(message)
  }
/* doClick(){

   this.onClick.emit(this.totalPay);
   console.log("sber = " + this.totalPay);
}*/
  getFormUrlLink(json: {}) {
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'})};
    let body = json;
    return this.http.post(this.url + "pay/", body).pipe(map(res => res));
  }

  getPercent(sum_pay: number) {
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    //let body = {json: json};
  //  console.log(sum_pay);
    return this.http.get(this.url + "pay/get_percent/" + sum_pay).pipe(map(res => res));
  }

  getOrderStatus(orderId: string) {
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'})};

    let body = {acc_id: this.currentAcc, orderId: orderId};

    console.log("getOrderStatus = " + JSON.stringify(body));
    return this.http.post(this.url + "pay/get_order_status/", body).pipe(map(res => res))
  }

  updateOrderStatus(orderId: string) {
    let body = {acc_id: this.currentAcc, orderId: orderId};
    console.log("updateOrderStatus = " + JSON.stringify(body));
    return this.http.post(this.url + "pay/update_order_status/", body).pipe(map(res => res))
  }
}

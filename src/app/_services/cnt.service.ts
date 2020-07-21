import { Injectable } from '@angular/core';
import {map} from "rxjs/internal/operators";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CntService {
  //private url ="http://192.168.0.21:3010/";
  //private url ="http://10.170.8.4:3010/";
  private url;
  private currentAcc: string;
  constructor(private http: HttpClient) {
    this.url = environment.url;
  }
  // Запись показаний, которые внес пользователь
  setCnt(cnt_json: any){
  //  console.log(JSON.stringify(cnt_json));
    return this.http.post(this.url + "cnt", cnt_json).pipe(map(res => res))
  }
  // Сброс показаний, которые внес пользователь
  resetCnt(){
    this.currentAcc = JSON.parse(localStorage.getItem('currentAcc'));
    let body = {acc_id: this.currentAcc};
    return this.http.post(this.url + "cnt/reset_cnt", body).pipe(map(res => res))
  }

  getCnt(acc_id: number){
   // this.currentAcc = JSON.parse(localStorage.getItem('currentAcc'));
   // this.userId = JSON.parse(localStorage.getItem('userId'));

    let body = {acc_id: acc_id};
    return this.http.post(this.url + "cnt/get_cnt", body).pipe(map(res => res))
  }
  getCntDeclared(acc_id: number){
    // this.currentAcc = JSON.parse(localStorage.getItem('currentAcc'));
    // this.userId = JSON.parse(localStorage.getItem('userId'));

    let body = {acc_id: acc_id};
    return this.http.post(this.url + "cnt/get_cnt_declared", body).pipe(map(res => res))
  }
  setCntDeclared(p_json: any){
    let body = p_json;
    return this.http.post(this.url + "cnt/set_cnt_declared", body).pipe(map(res => res))
  }

  getNewCnt(acc_id: number){
    // this.currentAcc = JSON.parse(localStorage.getItem('currentAcc'));
    // this.userId = JSON.parse(localStorage.getItem('userId'));

    let body = {acc_id: acc_id};
    return this.http.post(this.url + "cnt/get_new_cnt", body).pipe(map(res => res))
  }


}

import { Injectable } from '@angular/core';

import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/internal/operators";
import {HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment"

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private url = 'http://10.170.8.4:3000/';
  constructor(private http: HttpClient) { }

  getUsers() {
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.get<any>(this.url + "users").pipe(map(res => res));
  }
  getUserAcc() {
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.get(this.url + "users/acc").pipe(map(res => res));
  }
  getAccInfo(acc_id) {
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.get(this.url + "users/" + acc_id).pipe(map(res => res));
  }
}

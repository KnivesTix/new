import { Injectable } from '@angular/core';

import { HttpHeaders, HttpClient, HttpResponse } from '@angular/common/http';
import {Observable, BehaviorSubject} from "rxjs";
import {map, catchError, retry} from "rxjs/internal/operators";
import {HttpErrorResponse} from "@angular/common/http";
import {User} from "../_models/user";
import {environment} from "../../environments/environment";

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};
export interface UserLogin{
  accId: number;
  pass:string;
}
@Injectable()
export class LoginService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  private url;
  constructor(private http: HttpClient) {

    this.currentUserSubject =  new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this.url = environment.url;
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }


  login(accId: number, pass: string){

    let body ={login: accId, pass: pass};
    return this.http.post<any>(this.url + "login", body)
      .pipe(map(res => {

        this.currentUserSubject.next(res);
        return res;
      }))
  }
  registration(body: string){
    return this.http.post<any>(this.url + "registration", body)
      .pipe(map(res => {
        return res;
      }))
  }
  logout(){
    // Удаление данных о пользователе из localStorage
    localStorage.removeItem('currentUser');
    localStorage.removeItem('session_key');
    localStorage.removeItem('currentAcc');
    localStorage.removeItem('user_id');
    sessionStorage.removeItem('orderId');
    localStorage.removeItem('orderId');
    this.currentUserSubject.next(null);
  }
}


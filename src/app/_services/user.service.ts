import { Injectable } from '@angular/core';
import {map} from "rxjs/internal/operators";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  currentUser: string;
  currentAcc: string;
  private url;

  constructor(private http: HttpClient) {
    this.url = environment.url;
  }
  // Получить все л.сч, которые привязал к уч. записи
  getUserAcc(){
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let body ={login: this.currentUser};
    return this.http.post<any>(this.url + "user", body).pipe(map(res => res))
  }
  // Добавить л.сч к учетной записи
  addUserAcc(body: string){
    return this.http.post<any>(this.url + "user/add_user_acc/", body)
      .pipe(map(res => res))
  }
  // Удалить л.сч с уч. записи
  deleteUserAcc(body: string){
    return this.http.post<any>(this.url + "user/delete_user_acc/", body)
      .pipe(map(res => res))
  }
  // Получить данные об уч. записи пользователя
  getUser(){
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let body ={login: this.currentUser};
    return this.http.post<any>(this.url + "user/get_user/", body)
      .pipe(map(res => res))
  }
  // Обновить уч. запись пользователя
  updateUser(body: string){
    return this.http.post<any>(this.url + "user/update_user/", body)
      .pipe(map(res => res))
  }
  getStatusAcc(){
    this.currentAcc = JSON.parse(localStorage.getItem('currentAcc'));
    let body ={acc_id: this.currentAcc};
    return this.http.post<any>(this.url + "user/get_status_acc/", body)
      .pipe(map(res => res))
  }
  // Установить статус, если счет уже открытт другим пользователем
  setStatusAcc(status: number){
    this.currentAcc = JSON.parse(localStorage.getItem('currentAcc'));
    let body ={acc_id: this.currentAcc, status: status};
    return this.http.post<any>(this.url + "user/set_status_acc/", body)
      .pipe(map(res => res))
  }
}

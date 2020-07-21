import { Injectable } from '@angular/core';

import { HttpHeaders, HttpClient, HttpResponse } from '@angular/common/http';
import {map, catchError, retry} from "rxjs/internal/operators";


@Injectable()
export class UpdService {
  private currentUser: string;

  constructor(private http: HttpClient) {
  }

  /*upd(){
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return this.http.get("http://10.170.8.4:3010/upd/" + this.currentUser).pipe(map(res => res))
  }
  */
}


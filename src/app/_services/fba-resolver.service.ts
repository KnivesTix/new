import { Injectable } from '@angular/core';
import {Resolve, Router, RouterStateSnapshot, ActivatedRouteSnapshot} from "@angular/router";
import {AccountService} from "./account.service";

import { Observable, of, EMPTY }  from 'rxjs';
import { mergeMap, take }         from 'rxjs/operators';
import {first} from "rxjs/internal/operators";
import {PaySBRService} from "./pay-sbr.service";


@Injectable({
  providedIn: 'root'
})
export class FbaResolverService implements Resolve<any> {


  constructor(private accService: AccountService, private router: Router, private payService: PaySBRService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
   /*return this.payService.getPercent().pipe(take(1))
      .subscribe(
        data => {
          if (data[0][0]){
            //this.bank_percent = data[0][0];
            return data[0][0];
          }
         else{
            //return EMPTY;
            return false;
          }
        });
        */
  /*  return this.accService.getData("update").pipe(take(1), mergeMap(fba => {
      if (fba) {
        return of(fba);
      } else {
        return EMPTY;
      }
    }))*/
  }


}

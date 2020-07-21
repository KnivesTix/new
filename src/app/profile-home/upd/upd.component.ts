import { Component, OnInit } from '@angular/core';
import {first} from "rxjs/internal/operators";

import {UpdService} from "../../_services/upd.service";
import {AccountService} from "../../_services/account.service";

@Component({
  selector: 'app-upd',
  templateUrl: './upd.component.html',
  styleUrls: ['./upd.component.css']
})
export class UpdComponent implements OnInit {
  updArray: any[] = [];
  private currentAcc: string;

  constructor(
    private accService: AccountService
  ) { this.currentAcc = JSON.parse(localStorage.getItem('currentAcc'));  }


  ngOnInit() {
    return  this.accService.getData('upd').pipe(first())
      .subscribe(
        (data:any) => {

          this.updArray = data.doc;
        },
          error => {
            console.log(error);

          });
  }
}

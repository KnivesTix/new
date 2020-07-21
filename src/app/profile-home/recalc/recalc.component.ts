import { Component, OnInit } from '@angular/core';
import {AccountService} from "../../_services/account.service";
import {first} from "rxjs/internal/operators";

@Component({
  selector: 'app-recalc',
  templateUrl: './recalc.component.html',
  styleUrls: ['./recalc.component.css']
})
export class RecalcComponent implements OnInit {
  recalcArray: any[] = [];
  private currentAcc: string;

  constructor(
    private accService: AccountService
  ) { this.currentAcc = JSON.parse(localStorage.getItem('currentAcc'));  }

  ngOnInit() {
    return this.accService.getData("recalc").pipe(first())
      .subscribe(
        (data:any) => {

          this.recalcArray = data.recalc;

        },


        error => {
          console.log(error);

        });

  }

}

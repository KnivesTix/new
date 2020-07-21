import { Component, OnInit } from '@angular/core';
import {first} from "rxjs/internal/operators";
import {AccountService} from "../../_services/account.service";

@Component({
  selector: 'app-tariff',
  templateUrl: './tariff.component.html',
  styleUrls: ['./tariff.component.css']
})
export class TariffComponent implements OnInit {
  trfArray: any[] = [];
  constructor(private accService: AccountService) { }

  ngOnInit() {
    return this.accService.getData("trf").pipe(first())
      .subscribe(
        (data:any) => {

          //console.log(data);
          this.trfArray = data.tariff;

        },
        error => {
          console.log(error);

        });
  }

}

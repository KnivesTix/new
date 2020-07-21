import { Component, OnInit } from '@angular/core';
import {first} from "rxjs/internal/operators";
import {AccountService} from "../../_services/account.service";

@Component({
  selector: 'app-params',
  templateUrl: './params.component.html',
  styleUrls: ['./params.component.css']
})
export class ParamsComponent implements OnInit {
  paramArray: any[] = [];

  constructor(private accService: AccountService) { }

  ngOnInit() {
    return  this.accService.getData("param").pipe(first())
      .subscribe(
        (data:any) => {
         this.paramArray = data.doc;

        },
        error => {
          console.log(error);

        });
  }

}

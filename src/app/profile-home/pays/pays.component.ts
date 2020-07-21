import { Component, OnInit } from '@angular/core';
import {AccountService} from "../../_services/account.service";
import {first} from "rxjs/internal/operators";


@Component({
  selector: 'app-pays',
  templateUrl: './pays.component.html',
  styleUrls: ['./pays.component.css']
})
export class PaysComponent implements OnInit {
  paysArray: any[] = [];
  p: number = 1;
  loading = false;
  private currentAcc: string;
  count: number = 15;
  constructor(private accService: AccountService) {
    this.currentAcc = JSON.parse(localStorage.getItem('currentAcc'));
  }

  ngOnInit() {
    return this.accService.getData("pay").pipe(first())
    .subscribe(
      (data:any) => {
        //console.log(data);
        this.paysArray = data;
        /*
         this.router.navigate([this.returnUrl]);
        */
      },
      error => {
        console.log(error);

      });

  }

  getPayDoc(pay_id: number){
   // this.loading = true;
   // console.log(pay_id);

    //this.accService.getNotice2(pay_id);/*.pipe(first())
    //  .subscribe(
      //  (data:any) => {
        //  this.loading = false;
          //const fileURL = URL.createObjectURL(data);
          //window.open(fileURL, '_blank');
  //      },
    //    error => {
      //    console.log(error);

//        });

  }

}

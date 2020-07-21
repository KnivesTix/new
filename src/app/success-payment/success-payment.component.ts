import {Component, OnInit, AfterViewChecked, OnDestroy} from "@angular/core";

import {first} from "rxjs/internal/operators";
import {PaySBRService} from "../_services/pay-sbr.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-success-payment',
  templateUrl: './success-payment.component.html',
  styleUrls: ['./success-payment.component.css']
})
export class SuccessPaymentComponent implements OnInit, OnDestroy {
  timeoutperiod: number = 0;

  constructor(private payService: PaySBRService,
              private router: Router) {

  }

  private orderId: string;
  // private orderNumber: number;
  private result: string;

  ngOnInit() {
//console.log("OnInit");
 //   this.orderId = sessionStorage.getItem('orderId');

   /* this.payService.getOrderStatus(this.orderId).pipe(first())
      .subscribe(
        (data: any) => {
          this.result = JSON.stringify(data);
          //this.orderNumber = localStorage.setItem('orderNumber', data.orderNumber);
      /*    let status;
          status = data.orderStatus;
          let timerId;
      if (status === 0){
             timerId = setInterval(() => this.payService.updateOrderStatus(data).pipe(first())
              .subscribe(
                (data: any) => {
                  //console.log(data);
                  console.log("update");

                },
                error => {
                  console.log(error);

                }), 1000);
      }
            // остановить вывод через 5 секунд
            if (status != 0 ){
              setTimeout(() => { clearInterval(timerId); console.log("clear interval"); });
            }*/
    /*     this.payService.updateOrderStatus(this.orderId).pipe(first())
            .subscribe(
              (data: any) => {
                //console.log(data);
              },
              error => {
                console.log(error);

              });

        },
        error => {
          console.log(error);

        });
*/

    if (this.timeoutperiod) {
      clearTimeout(this.timeoutperiod);
    }

    this.timeoutperiod = setTimeout(()=>{
      this.redirect()
    }, 4000);

  }
  ngOnDestroy() {
  //  sessionStorage.removeItem("total");
  //  sessionStorage.removeItem("orderId");
  }
  redirect(){
    this.router.navigate(['/profile-home/']);
  }
}

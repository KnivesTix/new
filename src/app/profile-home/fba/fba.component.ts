import {Component, OnInit, OnDestroy} from '@angular/core';
import {AccountService} from "../../_services/account.service";
import {first} from "rxjs/internal/operators";
import {AlertService} from "../../_services/alert.service";
import {JsonService} from "../../_services/json.service";
import {FormGroup} from "@angular/forms";
import {PaySBRService} from "../../_services/pay-sbr.service";



@Component({
  selector: 'app-fba',
  templateUrl: './fba.component.html',
  styleUrls: ['./fba.component.css']
})
export class FbaComponent implements OnInit {

  fbaSuppliers: any[] = []; // Начисления по поставщикам
  fba: any[] = []; // Начисления по услугам
  //fba: any[] = [];//Введенные пользователем данные к оплате
  cnt: any[] = []; // Счетчики
  accId: number;
  isLoaded: boolean = false;
  docId: number = 0; // Идентификатор информационного документа
  loading = false;

  sumAF: number = 0; // Сумма агентского вознаграждения(АВ)
  sumTotal: number = 0; //
  totalAF: number = 0; // Итоговая сумма АВ
  price : number = 0; //
  totalRest: number; // Исходящий остаток
  totalPay: number = 0; // Итоговая сумма платежа
 // pay_json:  any = {};
  pdf_json: any = {};
  qr_json: any = {};
  srvForm: FormGroup;

  constructor(
    private accService: AccountService,
    private alertService: AlertService,
    private jsonService: JsonService,
    private sbrService: PaySBRService) {}

  // Получаем данные и считаем итоговые суммы для таблицы с услугами
  ngOnInit() {
    // Данные по поставщикам

    this.accId = JSON.parse(localStorage.getItem('currentAcc'));
    this.getSrv();
    this.getCnt();
    this.getSrvSup();
  }


  getSrvSup(){
    this.accService.getData("fba_sup").pipe()
      .subscribe(
        (data:any) => {
          //this.loading = true;
          this.fbaSuppliers = data;

        },
        error => {
          console.log(error);
        });
  }

  getCnt(){
    this.accService.getData("cnt").pipe(first())
      .subscribe(
        (data: any) => {
          this.cnt = data;
        },
        error => {
          console.log(error);
        });
  }

  getSrv(){
    this.isLoaded = true;
    // Данные по услугам
    this.accService.getSrv().pipe(first())
      .subscribe(
        (data:any) => {
          this.fba = data;

          this.countCurPay();
          this.isLoaded = false;
        },
        error => {
          console.log(error);

        });

  }
  setTotalPay():void {
    sessionStorage.setItem('total', this.totalPay.toString());
   // console.log(this.totalPay);
    this.sbrService.setTotalPay(this.totalPay);
  }
  getJsonData(){
    this.jsonService.getJson(this.cnt, this.fba).pipe(first()).subscribe((data:any)=>{console.log(data)});
  }

  setSumPay(sup_id: number, srv_id: number, sum_pay: string){
   // console.log(this.accId);
   // console.log(sup_id);
   // console.log(srv_id);
    sum_pay = sum_pay.toString().replace(".", ",");
   // console.log(sum_pay);

    this.accService.setFba(this.accId, sup_id, srv_id, sum_pay).pipe(first())
      .subscribe(
        (data: any) => {
          this.getSrv();
        },
        error => {
          console.log(error);
        });
  }

  // Сброс всех введенных пользователем данных
  resetAllData(){
    this.loading = true;

    this.accService.resetAllData().pipe(first())
      .subscribe(
        (data:any) => {
          this.getSrv();
          this.getSrvSup();

           this.accService.calcCnt().pipe(first())
            .subscribe(
              (data:any) => {
                this.getCnt();
                //  this.cntArray = data;
                //  console.log(data);
                //  this.isLoaded = false;
              },
              error => {
                console.log(error);

              });
          this.countCurPay();

          this.loading = false;

          return this.alertService.success("Данные сброшены.", false);
        },
        error => {
          console.log(error);
        });
  }

  // Формирование и отправка json-документа(полностью) для QR-кода(qr-код для оплаты)
  formingQR(){

    this.loading = true;

    this.formingJDoc();

    this.pdf_json.acc_id = 0;
   //this.pdf_json.doc_type = doc_type;
    this.pdf_json.cnt_count = this.pdf_json.cnt.length;
    this.pdf_json.npp = 0;
    this.pdf_json.type_pay = 0;
    this.pdf_json.status = 0;
    this.pdf_json.cassa_id = 0;
    this.pdf_json.operator_id = 0;
    this.pdf_json.doc_id = 0;
   // this.pdf_json.sum_pay = this.totalPay;
    this.pdf_json.sum_pay = this.fba[this.fba.length-1].sum_for_pay_total;

    return this.accService.sendPay(this.pdf_json).pipe(first())
      .subscribe(
        (data:any) => {
          this.docId = data.doc_id;

          this.qr_json.doc_id = data.doc_id;
          this.qr_json.doc_date = "";
          this.qr_json.acc_id = 0;
          this.qr_json.address = "";
          this.qr_json.sum_pay = this.totalPay*100;

          this.accService.getQRCode(this.qr_json).pipe(first()).subscribe((data:any)=>{
            // QR-код передается в формате base64 и затем открывается в новом окне как картинка png
            let image = new Image();
            image.src = data;
            let w = window.open("");
            w.document.write(image.outerHTML);
            w.document.close();
          });
          this.loading = false;

        },
        error => {
          console.log(error);

        });
  }
  // Формирование и отправка json-документа(полностью) для QR-кода (информационный документ)
  sendQRData(){
    this.pdf_json = {};

    this.formingJDoc();

    this.loading = true;
    this.pdf_json.acc_id = 0;
    //this.pdf_json.doc_type = doc_type;
    this.pdf_json.cnt_count = this.pdf_json.cnt.length;
    this.pdf_json.npp = 0;
    this.pdf_json.type_pay = 0;
    this.pdf_json.status = 0;
    this.pdf_json.cassa_id = 98;
    this.pdf_json.operator_id = 0;
    this.pdf_json.doc_id = 0;
    //console.log(this.fba[this.fba.length-1].sum_for_pay_total);
    this.pdf_json.sum_pay = this.fba[this.fba.length-1].sum_for_pay_total;

    return this.accService.sendPay(this.pdf_json).pipe(first())
      .subscribe(
        (data:any) => {
          this.docId = data.doc_id;
          this.loading = false;

          this.getPayDoc();
        },
        error => {
          console.log(error);

        });

  }

  // Полный расчет итоговых сумм платежа с агентским по введенным пользователем данным
  // и формирование json-документов для QR-кода и информационного документа
  countCurPay(){
    this.price = 0;
    this.totalAF = 0;
    this.totalPay = 0;
    this.totalRest = 0;

    for (const {p, index} of this.fba.map((p, index) => ({ p, index }))) {

      if (index != this.fba.length - 1) { // Убираем строку "Всего" из расчета (последняя в массиве)
        if (p.cur_pay === null){
          p.cur_pay = 0;
        }

        this.price += Number(p.cur_pay);

        this.totalAF += this.countAF(Number(p.cur_pay), Number(p.percent_af));

        this.totalPay += this.countTotal(Number(p.cur_pay));

        this.totalRest += Number(this.countRest(Number(p.sum_for_pay), Number(p.cur_pay)));
        this.countAF(Number(p.cur_pay), Number(p.percent_af));


      //  p.sum_af = this.countAF(Number(p.cur_pay), Number(p.percent_af));
      //  p.sum_for_pay_total = this.countTotal(Number(p.cur_pay));

      }

      this.price = Number(this.round(this.price, 2));
      this.totalAF = this.round(this.totalAF, 2);

      this.totalPay = this.round(this.totalPay, 2);
      //console.log("total after = " + this.totalPay);
      this.totalRest = Number(this.round(this.totalRest, 2));

     // this.fba[index] = this.fba[index];


    }

//----------------------------------------------------------------------
    this.formingJDoc();
   // this.formingPay();
//----------------------------------------------------------------------
   // console.log(this.fba);
  }

// Формирование json-документа(услуги и счетчики) при оплате QR-кодом
  formingJDoc(){

    this.pdf_json = {
      srv:[],
      cnt: []
    };

    let cnt_item = 0;
    let srv_item = 0;
    if (this.cnt){
    for (const {p, index} of this.cnt.map((p, index) => ({p, index}))) {
      cnt_item = index + 1;
      this.pdf_json.cnt.push({
        item: cnt_item,
        srv_id: p.srv_id,
        sup_id: p.sup_id,
        val_prev: p.val_prev,
        val_cur: p.val_cur,
        qty: p.qty,
        sum_pay: p.sum_pay,
        cnt_id: p.cnt_id
      });

    }
    }
    //console.log(this.pdf_json);
    for (const {p, index} of this.fba.map((p, index) => ({ p, index }))) {
     // let af = this.round(this.countAF(Number(p.cur_pay), Number(p.percent_af)),2);
     // let sum_total = this.round(this.countTotal(Number(p.cur_pay)),2);

      srv_item = index + 1;
      this.pdf_json.srv.push({
        item: srv_item,
        ctype: p.cnt_type,
        dt: p.dt,
        ct: p.ct,
        sum_for_pay: p.sum_for_pay,
        sum_af: p.sum_af,
        srv_id: p.srv_id,
        sup_id: p.sup_id,
        chr_cnt: p.chr_cnt,
        sum_cur_pay: p.cur_pay,
        sum_pay: p.sum_for_pay_total
      });
    }
 }

  // Расчет агентского вознаграждения
  countAF(cur_pay: number, procent: number){
    this.sumAF = this.round(Number(cur_pay)/100 * Number(procent), 2);
    return this.round(Number(cur_pay)/100*Number(procent), 2);
  }

  // Расчет итоговой суммы платежа вместе с агентским вознаграждением
  countTotal(cur_pay: number){
    this.sumTotal = this.round(Number(cur_pay) + Number(this.sumAF), 2);
    return this.round(Number(cur_pay) + Number(this.sumAF), 2);
  }

  // Расчет остатка
  countRest(sum_for_pay: number, cur_pay: number){
    return this.round(Number(sum_for_pay) - Number(cur_pay), 2);
  }



  // Получить pdf документ с QR-кодом
  getPayDoc(){
  //let w =  window.open("");
    // Получение и вывод pdf
    this.accService.getPdf(this.docId).pipe(first())
      .subscribe(

        (data:any) => {
          // Блокируется браузером и адблоком
         // const fileURL = URL.createObjectURL(data);
          // window.open(fileURL, '_blank');
         // const fileURL = URL.createObjectURL(data);
         // window.location.assign(fileURL);

          //создаем на новой странице iframe и вставляем в него pdf
          // Не работает в Safari, IE, старых версиях Mozilla, Chrome, с мобильного надо зажать кнопку и скачать
        /*  var frame = document.createElement("iframe");
          frame.src = URL.createObjectURL((data));
          frame.width = "100%";
          frame.height = "100%";
          //document.body.appendChild(frame);
          let w = window.open("");
          w.document.write(frame.outerHTML);
*/

          // Просто скачивание документа. Работает в IE, mozilla, chrome, yandex, opera
          const w = window.URL.createObjectURL(data);
          let link = document.createElement('a');
          link.href = w;
          link.download="Информационный документ.pdf";
          link.click();
          setTimeout(function(){
           // For Firefox it is necessary to delay revoking the ObjectURL
            window.URL.revokeObjectURL(w);
          }, 100);

         // let reader = new FileReader();
          //const fileURL = URL.createObjectURL(data);
        //  reader.readAsDataURL(data);

        /*  reader.onloadend = function() {
            let base64data = reader.result;
            console.log(base64data);
            //return;
            let image = new Image();
            image.src = base64data.toString();
            let w = window.open("");
            w.document.write(image.outerHTML);
          };
*/
        },
        error => {
          console.log(error);

        });
  }


  trackByIndex(index: number, obj: any): any {
    return index;
  }

  // Округление
  round(value, precision) {
    let multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }
  //Формирование платежа
  /*
   formingPay(){
   this.pay_json = {
   srv:[]
   };

   for (const {p, index} of this.fba.map((p, index) => ({ p, index }))) {

   if (this.fba[index].srv_id == 99){

   this.fba[index].cur_pay = this.price;
   this.fba[index].sum_af = this.totalAF;
   this.fba[index].sum_for_pay_total = this.totalPay;
   //this.fba[index].debit_e = this.totalRest;
   this.fba[index].rest_b =  this.totalRest;
   }
   else {

   this.fba[index].sum_af = this.countAF(Number(p.cur_pay), Number(p.percent_af));
   this.fba[index].sum_for_pay_total = this.countTotal(Number(p.cur_pay));
   this.fba[index].debit_e = this.countRest(Number(p.sum_for_pay), Number(p.cur_pay));
   this.fba[index].rest_b = this.countRest(Number(p.sum_for_pay), Number(p.cur_pay));

   }

   this.pay_json.srv.push({
   item: index+1,
   ctype: p.cnt_type,
   dt: p.dt,
   ct: p.ct,
   sum_for_pay: p.sum_for_pay,
   sum_af: p.sum_af,
   srv_id: p.srv_id,
   sup_id: p.sup_id,
   chr_cnt: p.chr_cnt,
   sum_cur_pay: p.cur_pay,
   sum_pay: p.sum_for_pay_total
   });
   }

   }
   */
  /*
   sendFbaSrv(){
   this.loading = true;
   this.formingPay();
   return this.accService.sendFbaSrv(this.pay_json).pipe(first())
   .subscribe(
   (data:any) => {

   this.accService.getData("fba_sup").pipe()
   .subscribe(
   (data:any) => {
   this.loading = true;
   this.fbaSuppliers = data;
   },
   error => {
   console.log(error);
   });

   this.accService.getSrv().pipe(first())
   .subscribe(
   (data:any) => {
   this.fba = data;
   this.countCurPay();
   },
   error => {
   console.log(error);

   });
   },
   error => {
   console.log(error);
   });

   }
   */
  // Получить обороты по услугам
  /* showSrv(){
   return this.accService.getSrv().pipe(first())
   .subscribe(
   (data:any) => {

   this.fba = data;
   this.countCurPay();
   // console.log(  this.fba );
   },
   error => {
   console.log(error);
   });
   }

   */
}

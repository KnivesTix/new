import { Component, OnInit } from '@angular/core';
import {AdminService} from "../../_services/admin.service";

@Component({
  selector: 'app-user-acc',
  templateUrl: './user-acc.component.html',
  styleUrls: ['./user-acc.component.css']
})
export class UserAccComponent implements OnInit {

  userAcc = [];
  userAccFilter = [];
  accInfo;
  errorMessage;
  count: number = 10;
  p: number = 1;
  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.adminService.getUserAcc().subscribe((data: any) => {
        this.userAcc = data;
        this.userAcc = this.userAcc.sort(function(a, b) {return a[0] - b[0];});
        this.userAccFilter = this.userAcc;
      },
      error => this.errorMessage = error);
  }
  getUserAcc(acc_id){
    this.filterItems(acc_id);
  }

  filterItems(query) {
    this.userAccFilter = this.userAcc.filter(function(el) {
      return el[1].toString().toLowerCase().indexOf(query.toLowerCase()) > -1;
    })
  }
}

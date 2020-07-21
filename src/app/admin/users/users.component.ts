import { Component, OnInit } from '@angular/core';
import {AdminService} from "../../_services/admin.service";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users = [];
  userFilter = [];
  accInfo;
  p: number = 1;
  count: number = 10;
  errorMessage: any;
  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.adminService.getUsers().subscribe((data:any) => {

        this.users = data;
        this.users = this.users.sort(function (a, b) {
          return b[0] - a[0];
        });

        this.userFilter = this.users;
      },
      error=>this.errorMessage = error

    );

  }

  getUser(user){
    this.filterItems(user);
  }
  getAccInfo(acc_id){
    console.log(acc_id);
    return this.adminService.getAccInfo(acc_id).subscribe(data => this.accInfo = data);
  }
  filterItems(query) {
    this.userFilter = this.users.filter(function(el) {
      //console.log(el[1]);
      return el[1].toString().toLowerCase().indexOf(query.toLowerCase()) > -1;
    })
  }
}

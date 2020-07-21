import {Component, Input, OnInit} from '@angular/core';
import {Router, ChildActivationEnd, ChildActivationStart, NavigationEnd} from "@angular/router";
import {AccountService} from "../../_services/account.service";
import {LoginService} from "../../_services/login.service";
import {UserService} from "../../_services/user.service";

@Component({
  selector: 'app-profile-home',
  templateUrl: './profile-home.component.html',
  styleUrls: ['./profile-home.component.css']
})
export class ProfileHomeComponent implements OnInit{
  private currentAcc: string;
  show: boolean;


  constructor(
    private userService: UserService,
    private router: Router){}


    ngOnInit(){
     /* this.router.events.subscribe(e => {
        if (e instanceof NavigationEnd) {
          console.log(e);
        }
      });
*/

      this.currentAcc = JSON.parse(localStorage.getItem('currentAcc'));
    }

  changeStatusAcc(){
   // this.userService.setStatusAcc(0).subscribe();
    localStorage.removeItem('currentAcc');
}





}

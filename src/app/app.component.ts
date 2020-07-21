import {
  Component,  OnInit,  DoCheck, OnDestroy} from '@angular/core';

import {Router} from "@angular/router";
import {LoginService} from "./_services/login.service";
import {User} from "./_models/user";

import {UserService} from "./_services/user.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, DoCheck, OnDestroy{
  currentUser: User;
  currentAcc: string;

  constructor(private router: Router, private loginService: LoginService, private userService: UserService) {

    this.loginService.currentUser.subscribe(x => this.currentUser = x);

  }
  ngOnInit(){
 //   this.loginService.logout();
  }
  get isAdmin() {
    //console.log(this.currentUser);
  //  console.log(this.currentUser.login);n
    return this.currentUser && this.currentUser.toString() === 'admin';
  }

  logout(){
    this.loginService.logout();
  }
  ngDoCheck(){

    if (this.currentUser != null){
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      this.currentAcc = JSON.parse(localStorage.getItem('currentAcc'));
    }
  }

  ngOnDestroy(){
    console.log("app.component Destroy");
    this.userService.setStatusAcc(0).subscribe();
  }

}


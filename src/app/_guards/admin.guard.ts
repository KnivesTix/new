import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {LoginService} from "../_services/login.service";

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements  CanActivate{
  constructor(private router: Router,
              private loginService: LoginService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.loginService.currentUserValue;
    console.log('12312312312');
    if (currentUser.toString() === 'test') {
      // authorised so return true
      console.log('12312312312');
      this.router.navigate(['/admin']);
      return true;
    }

    // not logged in so redirect to login page with the return url
   // this.router.navigate(['/admin'], {queryParams: {returnUrl: state.url}});
   // return false;
  }
}

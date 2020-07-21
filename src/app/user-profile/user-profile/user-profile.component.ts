import {Component, OnInit, OnChanges} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {first} from "rxjs/internal/operators";
import {AlertService} from "../../_services/alert.service";
import {UserService} from "../../_services/user.service";


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  ngOnInit() {

  }


}

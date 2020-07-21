import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {UserService} from "../../_services/user.service";
import {first} from "rxjs/internal/operators";
import {AlertService} from "../../_services/alert.service";

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.css']
})
export class ProfileSettingsComponent implements OnInit {
  editUserForm: FormGroup;
  user_id: string;
  comparison: string;
  change: boolean;
  changeData: boolean = true;
  loading = false;
  submitted = false;
  changeBtn: boolean = true;
  showBtn = false;
  constructor(private formBuilder: FormBuilder,
  private userService: UserService,
              private alertService: AlertService) { }

  get f() { return this.editUserForm.controls; }

  ngOnInit() {
    this.change = false;

    this.editUserForm = this.formBuilder.group({
      id: [''],
      login: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      password: ['', Validators.required],
      repeatedPassword: ['', Validators.required]
    });

    this.userService.getUser().subscribe(
      data=>{

        this.f.id.setValue(data[0].id);
        this.f.login.setValue(data[0].login);
        this.f.email.setValue(data[0].email);
        this.f.phone.setValue(data[0].phone);
      }
    );

    this.loading  = false;
    this.editUserForm.disable();
  }
  // Редактирование профиля
  changeUser(){
    this.showBtn = true;
    this.changeData = false;
    this.editUserForm.enable();
  }
  // Изменение пароля
  changePass(){
    this.editUserForm.enable();
    this.change = true;
    this.changeBtn = false;
  }
  // Сравнение нового и старого паролей
  comparePassword(){
    if (this.f.password.value !=  this.f.repeatedPassword.value){
    //console.log('no');
      this.comparison = 'Пароли не совпадают!';
      return;
    }
    else this.comparison = 'Пароли совпадают.';
  }

  confirmData(){
    this.showBtn = false;
    this.changeData = true;
    this.change = false;
    this.changeBtn = true;
    if (this.editUserForm.invalid) {
      return;
    }
    this.userService.updateUser(this.editUserForm.value).pipe(first())
      .subscribe(data => {
        if (data.code == '1'){
          this.alertService.success(data.msg);
          // this.router.navigate(['/login']);
        }
        //console.log(data);
      })
  }
}

import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from 'ngx-strongly-typed-forms';
import { Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Location } from '@angular/common';

interface LoginForm {
  email: string,
  password: string
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  form: FormGroup<LoginForm>;
  error: string | undefined;

  constructor(private _userService: UserService, fb: FormBuilder, private _location: Location) {
    this.form = fb.group<LoginForm>({
      email: fb.control("", Validators.email),
      password: fb.control("", Validators.required)
    });
  }

  onSubmit() {
    this._userService.login(this.form.value.email, this.form.value.password).then(() => {
      this._location.back();
    }).catch((err: any) => {
      this.error = err;
    });
  }

}

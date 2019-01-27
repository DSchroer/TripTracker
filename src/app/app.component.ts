import { Component } from '@angular/core';
import { UserService } from './services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  isCollapsed = true;

  constructor(public userService: UserService, private _router: Router) {

  }

  logout() {
    this.userService.logout();
  }

  navigate(url: string) {
    this.isCollapsed = true;
    this._router.navigate([url]);
  }
}

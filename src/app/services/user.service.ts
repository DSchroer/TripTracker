import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  loggedIn = false;
  username: string | undefined;

  constructor(private _fireAuth: AngularFireAuth) {
    _fireAuth.user.subscribe((user) => {
      if (user && user.email) {
        this.loggedIn = true;
        this.username = user.email;
      } else {
        this.loggedIn = false;
        this.username = undefined;
      }
    });
  }

  login(email: string, password: string): Promise<void> {
    return this._fireAuth.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    this._fireAuth.auth.signOut();
  }
}

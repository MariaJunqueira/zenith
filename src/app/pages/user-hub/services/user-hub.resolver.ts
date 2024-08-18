import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { UsersService } from '../../../services/users.service';

@Injectable({
  providedIn: 'root'
})
export class UserHubResolver implements Resolve<any> {

  constructor(private usersService: UsersService) { }

  resolve() {
    return this.usersService.getUsers(1, 5000);
  }
}

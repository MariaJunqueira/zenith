import { Injectable } from '@angular/core';

import { UsersService } from '../../../services/users.service';

@Injectable({
  providedIn: 'root'
})
export class UserHubResolver {

  constructor(private usersService: UsersService) { }

  resolve() {
    return this.usersService.getUsers(1, 50);
  }
}

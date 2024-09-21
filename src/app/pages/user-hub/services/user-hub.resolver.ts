import { Injectable } from '@angular/core';

import { UsersService } from '../../../services/users.service';
import { PAGE_SIZE } from '../../../models/pagination.const';

@Injectable({
  providedIn: 'root'
})
export class UserHubResolver {

  constructor(private usersService: UsersService) { }

  resolve() {
    return this.usersService.getUsers(1, PAGE_SIZE);
  }
}

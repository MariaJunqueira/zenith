import { Component, inject } from '@angular/core';

import { UserListComponent } from '../../components/user-list/user-list.component';
import { User } from '../../models/user.model';
import { UsersService } from '../../services/users.service';
import { UsersServiceStub } from '../../services/users.service.stub';

@Component({
  selector: 'app-user-hub',
  standalone: true,
  imports: [UserListComponent],
  templateUrl: './user-hub.component.html',
  styleUrl: './user-hub.component.scss'
})
export class UserHubComponent {
  usersService = inject(UsersServiceStub)

  users: User[] = []

  ngOnInit(): void {
    this.usersService.getUsers().subscribe(users => {
      this.users = users
    })
  }
}

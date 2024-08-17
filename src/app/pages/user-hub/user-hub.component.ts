import { Component, effect, inject, signal } from '@angular/core';

import { UserListComponent } from '../../components/user-list/user-list.component';
import { User } from '../../models/user.model';
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
  groupedUsers = signal<Record<string, User[]>>({});
  users: User[] = []
  category = 'nat';

  constructor() {
    effect(() => {
      if (this.users.length) {
        this.groupUsers(this.category);
      }
    });
  }

  ngOnInit(): void {
    this.usersService.getUsers().subscribe(users => {
      this.users = users
    })
  }


  private groupUsers(category: string): void {
    if (typeof Worker !== 'undefined') {
      const worker = new Worker(new URL('../../workers/data-categorization.worker', import.meta.url));
      worker.onmessage = ({ data }) => {
        const groupedData = data as Record<string, Partial<User>[]>;

        const groupedUsers = this.mapToUserInstances(groupedData);

        this.groupedUsers.set(groupedUsers);

        worker.terminate();
      };

      worker.postMessage({ items: this.users, category });
    } else {
      this.groupedUsers.set(this.fallbackGrouping(this.users, category));
    }
  }

  private fallbackGrouping(users: User[], category: string): Record<string, User[]> {
    return users.reduce((acc, user) => {
      const key = user[category as keyof User] as string;
      (acc[key] ||= []).push(user);
      return acc;
    }, {} as Record<string, User[]>);
  }

  private mapToUserInstances(groupedData: Record<string, Partial<User>[]>): Record<string, User[]> {
    const result: Record<string, User[]> = {};
    for (const key in groupedData) {
      result[key] = groupedData[key].map(user => new User(user));
    }
    return result;
  }

  getGroupKeys(): string[] {
    return Object.keys(this.groupedUsers());
  }
}

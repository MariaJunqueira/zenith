import { CommonModule } from '@angular/common';
import { Component, effect, input, signal } from '@angular/core';

import { User } from '../../models/user.model';
import { UserItemComponent } from '../user-item/user-item.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
  imports: [
    CommonModule,
    UserItemComponent
  ]
})
export class UserListComponent {
  users = input.required<User[]>();
  groupedUsers = signal<Record<string, User[]>>({});
  category = 'nat';

  constructor() {
    effect(() => {
      if (this.users().length) {
        this.groupUsers(this.category);
      }
    });
  }

  private groupUsers(category: string): void {
    if (typeof Worker !== 'undefined') {
      const worker = new Worker(new URL('./user-grouping.worker', import.meta.url));
      worker.onmessage = ({ data }) => {
        const groupedData = data as Record<string, Partial<User>[]>;

        const groupedUsers = this.mapToUserInstances(groupedData);

        this.groupedUsers.set(groupedUsers);

        worker.terminate();
      };

      worker.postMessage({ users: this.users(), category });
    } else {
      this.groupedUsers.set(this.fallbackGrouping(this.users(), category));
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

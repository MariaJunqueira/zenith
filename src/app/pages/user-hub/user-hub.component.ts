import { Component, inject } from '@angular/core';

import { UserListComponent } from '../../components/user-list/user-list.component';
import { User } from '../../models/user.model';
import { UsersServiceStub } from '../../services/users.service.stub';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-user-hub',
  standalone: true,
  imports: [UserListComponent],
  templateUrl: './user-hub.component.html',
  styleUrl: './user-hub.component.scss'
})
export class UserHubComponent {
  usersService = inject(UsersServiceStub);
  groupedUsers: Record<string, User[]> = {};
  users: User[] = [];
  category = 'nat';
  displayedPages: number[] = [];

  pagination: {
    currentPage: number;
    pageSize: number;
  } = {
      currentPage: 1,
      pageSize: 5000
    };

  ngOnInit(): void {
    this.loadUsers(this.pagination.currentPage);
  }

  private groupUsers(category: string): void {
    if (typeof Worker !== 'undefined') {
      const worker = new Worker(new URL('../../workers/data-categorization.worker', import.meta.url));
      worker.onmessage = ({ data }) => {
        const groupedData = data as Record<string, Partial<User>[]>;

        const groupedUsers = this.mapToUserInstances(groupedData);

        this.groupedUsers = groupedUsers;

        worker.terminate();
      };

      worker.postMessage({ items: this.users, category });
    } else {
      this.groupedUsers = this.fallbackGrouping(this.users, category);
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
    return Object.keys(this.groupedUsers);
  }

  /**
   * Loads users for the given page and updates the current page.
   * @param page The page number to load.
   */
  loadUsers(page: number): void {
    this.usersService.getUsers(page, this.pagination.pageSize).subscribe(users => {
      this.users = users;
      this.pagination.currentPage = page;
      this.groupUsers(this.category);
      this.updateDisplayedPages();
    });
  }

  /**
   * Handles user pagination.
   * @param page The page number to load.
   */
  onPageChange(page: number): void {
    if (page > 0) {
      this.loadUsers(page);
    }
  }

  /**
   * Updates the array of page numbers to be displayed.
   * Assumes that at least three pages are available to display.
   */
  private updateDisplayedPages(): void {
    const currentPage = this.pagination.currentPage;
    const pagesToShow = 3;

    this.displayedPages = Array.from({ length: pagesToShow }, (_, index) => currentPage + index);
  }
}

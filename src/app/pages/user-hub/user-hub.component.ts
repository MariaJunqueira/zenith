import { Component, inject, OnInit } from '@angular/core';
import { UserListComponent } from '../../components/user-list/user-list.component';
import { User } from '../../models/user.model';
import { UsersServiceStub } from '../../services/users.service.stub';
import { UsersService } from '../../services/users.service';
import { ScrollNearEdgeDirective } from '../../directives/scroll-near-end.directive';

@Component({
  selector: 'app-user-hub',
  standalone: true,
  imports: [UserListComponent, ScrollNearEdgeDirective],
  templateUrl: './user-hub.component.html',
  styleUrls: ['./user-hub.component.scss']
})
export class UserHubComponent implements OnInit {
  usersService = inject(UsersServiceStub);
  groupedUsers: Record<string, User[]> = {};
  visibleUsers: Record<string, User[]> = {}; // To hold the currently visible users
  allLoadedUsers: Record<string, User[]> = {}; // To hold all users that have been loaded
  users: User[] = [];
  category = 'nat';
  displayedPages: number[] = [];
  private internalChunkSize = 20;  // Number of users to load initially and on each scroll
  private currentInternalIndex = 0;  // Track how many users have been loaded

  pagination = {
    currentPage: 1,
    pageSize: 5000,
  };

  ngOnInit(): void {
    this.loadUsers(this.pagination.currentPage);
  }

  /**
   * Groups users by a specified category.
   * Uses a web worker for performance, or falls back to a synchronous method.
   * @param category The category to group users by.
   */
  private groupUsers(category: string): void {
    if (typeof Worker !== 'undefined') {
      const worker = new Worker(new URL('../../workers/data-categorization.worker', import.meta.url));
      worker.onmessage = ({ data }) => {
        const groupedData = data as Record<string, Partial<User>[]>;

        const groupedUsers = this.mapToUserInstances(groupedData);
        this.groupedUsers = groupedUsers;

        // Store all grouped users in `allLoadedUsers`
        this.allLoadedUsers = { ...this.groupedUsers };
        this.updateVisibleUsers();
        worker.terminate();
      };

      worker.postMessage({ items: this.users, category });
    } else {
      this.groupedUsers = this.fallbackGrouping(this.users, category);
      this.allLoadedUsers = { ...this.groupedUsers }; // Store all grouped users in `allLoadedUsers`
      this.updateVisibleUsers();
    }
  }

  /**
   * Fallback method to group users by a category without using a web worker.
   * @param users The list of users to group.
   * @param category The category to group users by.
   * @returns A record of grouped users by category.
   */
  private fallbackGrouping(users: User[], category: string): Record<string, User[]> {
    return users.reduce((acc, user) => {
      const key = user[category as keyof User] as string;
      (acc[key] ||= []).push(user);
      return acc;
    }, {} as Record<string, User[]>);
  }

  /**
   * Converts grouped data into instances of the User class.
   * @param groupedData The grouped data from the web worker.
   * @returns A record of User instances grouped by category.
   */
  private mapToUserInstances(groupedData: Record<string, Partial<User>[]>): Record<string, User[]> {
    const result: Record<string, User[]> = {};
    for (const key in groupedData) {
      if (groupedData[key].length > 0) {
        result[key] = groupedData[key].map(user => new User(user));
      }
    }
    return result;
  }

  /**
   * Retrieves the keys of the grouped users that have visible users.
   * @returns An array of keys corresponding to the visible user groups.
   */
  getGroupKeys(): string[] {
    return Object.keys(this.visibleUsers).filter(key => this.visibleUsers[key].length > 0);
  }

  /**
   * Loads users for the given page and updates the current page.
   * @param page The page number to load.
   */
  loadUsers(page: number): void {
    this.usersService.getUsers(page, this.pagination.pageSize).subscribe(users => {
      this.users = users;
      this.pagination.currentPage = page;
      this.currentInternalIndex = 0;
      this.groupUsers(this.category);
      this.updateDisplayedPages();
    });
  }

  /**
   * Updates the visible users based on the current index.
   * This method controls which users are currently visible in the view.
   */
  private updateVisibleUsers(): void {
    const newVisibleUsers: Record<string, User[]> = {};
    let remainingItems = this.internalChunkSize;

    for (const key of Object.keys(this.allLoadedUsers)) {
      const usersInCategory = this.allLoadedUsers[key];
      const visibleInCategory = this.visibleUsers[key]?.length || 0;

      if (usersInCategory.length > 0 && remainingItems > 0) {
        const itemsToLoad = Math.min(usersInCategory.length - visibleInCategory, remainingItems);
        newVisibleUsers[key] = [
          ...(this.visibleUsers[key] || []),
          ...usersInCategory.slice(visibleInCategory, visibleInCategory + itemsToLoad)
        ];
        remainingItems -= itemsToLoad;
      } else {
        newVisibleUsers[key] = this.visibleUsers[key] || [];
      }
    }

    this.visibleUsers = newVisibleUsers;
  }

  /**
   * Handles the near-end scroll event to load more users.
   * @param direction The direction of the scroll, -1 for up, 1 for down.
   */
  onNearEdgeScroll(direction: -1 | 1): void {
    if (this.currentInternalIndex < this.users.length && direction === 1) {
      this.currentInternalIndex += this.internalChunkSize;
      this.updateVisibleUsers();
    }
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

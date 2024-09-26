import { Component, effect, inject, OnInit, signal, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchComponent } from '../../components/search/search.component';
import { SelectDropdownComponent, SelectOption } from '../../components/select-dropdown/select-dropdown.component';
import { UserListComponent } from '../../components/user-list/user-list.component';
import { ScrollNearEdgeDirective } from '../../directives/scroll-near-edge.directive';
import { User } from '../../models/user.model';
import { UsersService } from '../../services/users.service';
import { PAGE_SIZE } from '../../models/pagination.const';

@Component({
  selector: 'app-user-hub',
  standalone: true,
  imports: [UserListComponent, ScrollNearEdgeDirective, SearchComponent, SelectDropdownComponent],
  templateUrl: './user-hub.component.html',
  styleUrl: './user-hub.component.scss'
})
export class UserHubComponent implements OnInit, OnDestroy {
  usersService = inject(UsersService);
  activatedRoute = inject(ActivatedRoute);
  /** Array of all users loaded */
  users: User[] = [];

  /** Object containing users grouped by a specified category */
  groupedUsers: Record<string, User[]> = {};

  /** Signal to hold filtered users based on search input */
  filteredUsers = signal<User[]>([]);

  /** Holds the currently visible users grouped by category */
  visibleUsers: Record<string, User[]> = {};

  /** Holds all users that have been loaded */
  allLoadedUsers: Record<string, User[]> = {};

  /** Web worker for handling user grouping */
  private worker!: Worker;

  /** Tracks the current internal chunk index for lazy loading */
  private currentInternalIndex = 0;

  /** Number of users to load per chunk */
  private readonly internalChunkSize = 20;

  /** Current grouping category */
  category = signal<string>('firstname');

  /** Pagination configuration */
  pagination = { currentPage: 1, pageSize: PAGE_SIZE };

  /** Flag to indicate loading state */
  loading = false;

  /** Pages to be displayed in the pagination */
  displayedPages: number[] = [];

  /** Dropdown options for grouping categories */
  categoryOptions: SelectOption[] = [
    { label: 'Alphabetically', value: 'firstname' },
    { label: 'Age', value: 'dob.age' },
    { label: 'Gender', value: 'gender' },
    { label: 'Nationality', value: 'nat' }
  ];

  constructor() {
    effect(() => this.groupUsers(this.category(), this.filteredUsers()));
  }

  /**
   * Loads users and sets up the worker if available.
   */
  ngOnInit(): void {
    this.users = this.activatedRoute.snapshot.data['users'];

    if (typeof Worker !== 'undefined') {
      this.worker = new Worker(new URL('../../workers/data-categorization.worker', import.meta.url));
    }
  }

  /**
   * Groups users by a specified category.
   * Uses a web worker for performance, or falls back to a synchronous method.
   * @param category The category to group users by.
   * @param users Optional array of users to group. If not provided, defaults to all users.
   */
  private groupUsers(category: string, users: User[] = this.users): void {
    if (typeof Worker !== 'undefined') {
      this.worker.onmessage = ({ data }) => {
        this.groupedUsers = this.mapToUserInstances(data);
        this.allLoadedUsers = { ...this.groupedUsers };
        this.updateVisibleUsers();
      };
      this.worker.postMessage({ items: users, category });
    } else {
      this.groupedUsers = this.fallbackGrouping(users, category);
      this.allLoadedUsers = { ...this.groupedUsers };
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
      result[key] = groupedData[key].map(user => new User(user));
    }
    return result;
  }

  /**
   * Handles the search event and filters users based on the search term.
   * @param searchTerm The search term to filter users by.
   */
  onSearch(searchTerm: string): void {
    this.resetVisibleItems();
    const filtered = searchTerm ? this.users.filter(user =>
      `${user.firstname} ${user.lastname}`.toLowerCase().includes(searchTerm.toLowerCase())) : this.users;
    this.filteredUsers.set(filtered);
    this.updateDisplayedPages();
  }

  /**
   * Updates the visible users based on the current index.
   * This method controls which users are currently visible in the view.
   */
  private updateVisibleUsers(): void {
    const newVisibleUsers: Record<string, User[]> = {};
    let remainingItems = this.internalChunkSize;

    for (const key of Object.keys(this.groupedUsers)) {
      const usersInCategory = this.groupedUsers[key];
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
      this.resetVisibleItems();
      this.loadUsers(page);
    }
  }

  /**
   * Resets the visible users, grouped users, and internal index to prepare for a fresh load.
   */
  resetVisibleItems(): void {
    this.visibleUsers = {};
    this.allLoadedUsers = {};
    this.groupedUsers = {};
    this.currentInternalIndex = 0;
  }

  /**
   * Loads users for the given page and updates the current page.
   * @param page The page number to load.
   */
  private loadUsers(page: number): void {
    this.loading = true;
    this.usersService.getUsers(page, this.pagination.pageSize).subscribe({
      next: (users) => {
        this.users = users;
        this.pagination.currentPage = page;
        this.currentInternalIndex = 0;
        this.groupUsers(this.category());
        this.updateDisplayedPages();
      },
      complete: () => this.loading = false
    });
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

  /**
   * Retrieves the keys of the grouped users that have visible users.
   * @returns An array of keys corresponding to the visible user groups.
   */
  getGroupKeys(): string[] {
    return Object.keys(this.visibleUsers).filter(key => this.visibleUsers[key].length > 0);
  }

  /**
   * Terminates the worker if it exists.
   */
  ngOnDestroy(): void {
    if (this.worker) {
      this.worker.terminate();
    }
  }
}
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { ApiResult } from '../models/api-result.model';
import { User } from '../models/user.model';
import { PAGE_SIZE } from '../models/pagination.const';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = 'https://randomuser.me/api'
  private cache: Record<number, User[]> = {}; // Cache for storing user data by page number

  constructor(private httpClient: HttpClient) { }

  /**
   * Fetches users for the given page and page size.
   * Caches the result to avoid unnecessary requests for already fetched pages.
   * @param { number } page The page number to load.
   * @param { number } pageSize The number of users to load per page.
   * @returns An observable containing a list of users.
   */
  getUsers(page: number, pageSize: number = PAGE_SIZE): Observable<User[]> {
    // Check if the data is already in cache
    if (this.cache[page]) {
      return of(this.cache[page]);
    }

    // If not cached, fetch from the API
    return this.httpClient
      .get<ApiResult>(`${this.apiUrl}?&results=${pageSize}&seed=awork&page=${page}`)
      .pipe(
        map(apiResult => User.mapFromUserResult(apiResult.results)),
        tap(users => {
          // Cache the fetched data
          this.cache[page] = users;
        })
      );
  }
}

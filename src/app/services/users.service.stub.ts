import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { User } from '../models/user.model';
import { UserResult } from '../models/api-result.model';
import { MockResult } from '../mock-data';
import { PAGE_SIZE } from '../models/pagination.const';

@Injectable({
  providedIn: 'root'
})
export class UsersServiceStub {

  /**
   * Fetches N mock users from the api
   * @param {number} page
   * @returns {Observable<User[]>}
   */
  getUsers(page: number = 1, pageSize: number = PAGE_SIZE): Observable<User[]> {
    return of(MockResult).pipe(
      map(apiResult => User.mapFromUserResult(apiResult.results as UserResult[]))
    );
  }
}

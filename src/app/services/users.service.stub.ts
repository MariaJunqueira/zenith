import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { User } from '../models/user.model';
import { UserResult } from '../models/api-result.model';
import { MockResult } from '../mock-data';

@Injectable({
  providedIn: 'root'
})
export class UsersServiceStub {

  /**
   * Fetches 50 mock users from the api
   * @param {number} page
   * @returns {Observable<User[]>}
   */
  getUsers(page: number = 1, pageSize: number = 50): Observable<User[]> {
    return of(MockResult).pipe(
      map(apiResult => User.mapFromUserResult(apiResult.results as UserResult[]))
    );
  }
}

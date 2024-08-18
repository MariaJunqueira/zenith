import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApiResult } from '../models/api-result.model';
import { User } from '../models/user.model';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let httpMock: HttpTestingController;

  const mockApiResult: ApiResult = {
    results: [
      {
        gender: 'female',
        name: { title: 'Mrs', first: 'Marisela', last: 'Fonseca' },
        location: {
          street: { number: 8003, name: 'Peatonal Rosales' },
          city: 'Las Vigas',
          state: 'Guerrero',
          country: 'Mexico',
          postcode: 25269,
          coordinates: { latitude: '28.0796', longitude: '124.2176' },
          timezone: { offset: '+5:00', description: 'Ekaterinburg, Islamabad, Karachi, Tashkent' }
        },
        email: 'marisela.fonseca@example.com',
        login: { uuid: 'a56acc76-24b8-413d-aa94-cf200ab6c8c3', username: 'crazyrabbit958', password: 'merlot', salt: 'rTIhlYPN', md5: '0f1e458f5c42457ffb32d1a28fea4940', sha1: '4ba13a5b2724eea3247e26bd7e0f27f4e7b6bc16', sha256: '04a1eeb4688a8496d0a8e5e5c4043cb0bbf636e0a59a11661b846521d890b08c' },
        dob: { date: '1954-07-06T23:54:44.130Z', age: 69 },
        phone: '(667) 475 7275',
        picture: { large: 'https://randomuser.me/api/portraits/women/5.jpg', medium: 'https://randomuser.me/api/portraits/med/women/5.jpg', thumbnail: 'https://randomuser.me/api/portraits/thumb/women/5.jpg' },
        nat: 'MX'
      }
    ],
    info: { seed: 'seed', results: 1, page: 1 }
  };

  const mockUsers: User[] = User.mapFromUserResult(mockApiResult.results);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        UsersService
      ]
    });
    service = TestBed.inject(UsersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding requests
  });

  it('should fetch users from the API and cache the result', () => {
    service.getUsers(1, 10).subscribe(users => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}?&results=10&seed=awork&page=1`);
    expect(req.request.method).toBe('GET');

    req.flush(mockApiResult); // Provide the mock response to the request

    // Ensure the data is now cached
    expect(service['cache'][1]).toEqual(mockUsers);
  });

  it('should return cached data if available and not make an HTTP request', () => {
    // Pre-fill the cache
    service['cache'][1] = mockUsers;

    service.getUsers(1, 10).subscribe(users => {
      expect(users).toEqual(mockUsers);
    });

    // No request should be made to the HTTP client
    httpMock.expectNone(`${service['apiUrl']}?&results=10&seed=awork&page=1`);
  });

  it('should make a new API request if the page is not cached', () => {
    service.getUsers(2, 10).subscribe(users => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}?&results=10&seed=awork&page=2`);
    expect(req.request.method).toBe('GET');

    req.flush(mockApiResult);

    // Ensure the new data is now cached
    expect(service['cache'][2]).toEqual(mockUsers);
  });

  it('should use a default pageSize of 5000 if not specified', () => {
    service.getUsers(1).subscribe(users => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}?&results=5000&seed=awork&page=1`);
    expect(req.request.method).toBe('GET');

    req.flush(mockApiResult);

    expect(service['cache'][1]).toEqual(mockUsers);
  });
});

import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule, provideHttpClientTesting } from '@angular/common/http/testing';
import { UserHubComponent } from './user-hub.component';
import { UsersService } from '../../services/users.service';
import { of } from 'rxjs';
import { User } from '../../models/user.model';
import { provideHttpClient } from '@angular/common/http';

describe('UserHubComponent', () => {
  let component: UserHubComponent;
  let fixture: ComponentFixture<UserHubComponent>;
  let usersService: UsersService;
  let mockUsers: User[];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        UserHubComponent
      ],
      providers: [
        UsersService,
        provideHttpClient(),
        provideHttpClientTesting()
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserHubComponent);
    component = fixture.componentInstance;
    usersService = TestBed.inject(UsersService);

    // Mock data
    mockUsers = [
      new User({
        firstname: 'Marisela',
        lastname: 'Fonseca',
        email: 'marisela.fonseca@example.com',
        phone: '(667) 475 7275',
        nat: 'MX',
        dob: { date: '1954-07-06T23:54:44.130Z', age: 69 },
        gender: 'female',
        image: 'https://randomuser.me/api/portraits/women/5.jpg',
        location: {
          street: { number: 8003, name: 'Peatonal Rosales' },
          city: 'Las Vigas',
          state: 'Guerrero',
          country: 'Mexico',
          postcode: 25269,
          timezone: { offset: '+5:00', description: 'Ekaterinburg, Islamabad, Karachi, Tashkent' }
        }
      }),
      new User({
        firstname: 'Berardo',
        lastname: 'Nogueira',
        email: 'berardo.nogueira@example.com',
        phone: '(58) 6717-4929',
        nat: 'BR',
        dob: { date: '1997-07-22T05:50:14.179Z', age: 26 },
        gender: 'male',
        image: 'https://randomuser.me/api/portraits/men/67.jpg',
        location: {
          street: { number: 5797, name: 'Rua João Xxiii' },
          city: 'Muriaé',
          state: 'Roraima',
          country: 'Brazil',
          postcode: 46976,
          timezone: { offset: '-3:30', description: 'Newfoundland' }
        }
      })
    ];

    spyOn(usersService, 'getUsers').and.returnValue(of(mockUsers));

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on initialization', () => {
    expect(component.users).toEqual(mockUsers);
    expect(usersService.getUsers).toHaveBeenCalledWith(1, 100);
  });

  it('should group users by category', (done) => {
    (component as any).groupUsers('gender', mockUsers);
    fixture.detectChanges();

    setTimeout(() => {
      expect(Object.keys(component.groupedUsers)).toEqual(['female', 'male']);
      done();
    }, 500);
  });

  it('should fall back to synchronous grouping if Web Worker is not available', () => {
    // Temporarily set Worker to undefined to trigger the fallback logic
    const originalWorker = window.Worker;
    (window as any).Worker = undefined;

    // Spy on fallbackGrouping method
    spyOn<any>(component, 'fallbackGrouping').and.callThrough();

    // Call the groupUsers method
    (component as any).groupUsers('gender', mockUsers);

    // Verify that fallbackGrouping was called
    expect(component['fallbackGrouping']).toHaveBeenCalledWith(mockUsers, 'gender');
    expect(Object.keys(component.groupedUsers)).toEqual(['female', 'male']);

    // Restore Worker to its original value
    (window as any).Worker = originalWorker;
  });

  it('should filter users based on search term', () => {
    component.onSearch('Berardo');
    expect(component.filteredUsers()).toEqual([mockUsers[1]]);
  });

  it('should reset visible users when a new search is performed', () => {
    component.onSearch('Berardo');
    expect(Object.keys(component.visibleUsers).length).toBe(0);
  });

  it('should reset visible items when category changes', () => {
    component.category.set('nat');
    component.resetVisibleItems();
    expect(Object.keys(component.visibleUsers).length).toBe(0);
    expect(Object.keys(component.groupedUsers).length).toBe(0);
  });

  it('should update visible users correctly', (done) => {
    (component as any).groupUsers('gender', mockUsers);
    fixture.detectChanges();

    setTimeout(() => {
      (component as any).updateVisibleUsers();
      fixture.detectChanges();
      expect(Object.keys(component.visibleUsers).length).toBeGreaterThan(0);
      done();
    }, 500);
  });

  it('should handle pagination correctly', () => {
    component.onPageChange(2);
    expect(usersService.getUsers).toHaveBeenCalledWith(2, 100);
  });

  it('should handle near-edge scrolling', () => {
    (component as any).currentInternalIndex = 0;
    component.onNearEdgeScroll(1);
    expect((component as any).currentInternalIndex).toBeGreaterThan(0);
  });
});

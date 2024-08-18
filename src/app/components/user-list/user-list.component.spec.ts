import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { User } from '../../models/user.model';
import { UserListComponent } from './user-list.component';

@Component({
  template: `
    <app-user-list [users]="users"></app-user-list>
  `,
  standalone: true,
  imports: [UserListComponent],
})
class UserListWrapperComponent {
  users: User[] = [];
}

describe('UserListComponent', () => {
  let fixture: ComponentFixture<UserListWrapperComponent>;
  let component: UserListWrapperComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserListWrapperComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(UserListWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display "No users available" when there are no users', () => {
    component.users = [];
    fixture.detectChanges();

    const noUsersText = fixture.debugElement.query(By.css('p')).nativeElement;
    expect(noUsersText.textContent).toBe('No users available');
  });

  it('should display the correct number of users', () => {
    const users: User[] = [
      new User({
        firstname: 'Marisela',
        lastname: 'Fonseca',
        email: 'marisela.fonseca@example.com',
        phone: '(667) 475 7275',
        nat: 'MX',
        image: 'https://randomuser.me/api/portraits/women/5.jpg',
        dob: { date: '1954-07-06T23:54:44.130Z', age: 69 },
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
        image: 'https://randomuser.me/api/portraits/men/67.jpg',
        dob: { date: '1997-07-22T05:50:14.179Z', age: 26 },
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
    component.users = users;
    fixture.detectChanges();

    const userItems = fixture.debugElement.queryAll(By.css('app-user-item'));
    expect(userItems.length).toBe(2);
  });

  it('should display the correct user information in each user item', () => {
    const users: User[] = [
      new User({
        firstname: 'Marisela',
        lastname: 'Fonseca',
        email: 'marisela.fonseca@example.com',
        phone: '(667) 475 7275',
        nat: 'MX',
        image: 'https://randomuser.me/api/portraits/women/5.jpg',
        dob: { date: '1954-07-06T23:54:44.130Z', age: 69 },
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
        image: 'https://randomuser.me/api/portraits/men/67.jpg',
        dob: { date: '1997-07-22T05:50:14.179Z', age: 26 },
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
    component.users = users;
    fixture.detectChanges();

    const userItems = fixture.debugElement.queryAll(By.css('app-user-item'));
    expect(userItems.length).toBe(2);

    // Test that the first user item displays the correct information
    const firstUserItem = userItems[0].nativeElement;
    expect(firstUserItem.textContent).toContain('Marisela Fonseca');
    expect(firstUserItem.textContent).toContain('marisela.fonseca@example.com');

    // Test that the second user item displays the correct information
    const secondUserItem = userItems[1].nativeElement;
    expect(secondUserItem.textContent).toContain('Berardo Nogueira');
    expect(secondUserItem.textContent).toContain('berardo.nogueira@example.com');
  });
});

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { User } from '../../models/user.model';
import { UserItemComponent } from './user-item.component';

@Component({
  template: `
    <app-user-item [user]="user" [allUsers]="allUsers"></app-user-item>
  `,
  standalone: true,
  imports: [UserItemComponent],
})
class UserItemWrapperComponent {
  user = new User({
    firstname: 'Marisela',
    lastname: 'Fonseca',
    email: 'marisela.fonseca@example.com',
    phone: '(667) 475 7275',
    nat: 'MX',
    image: 'https://randomuser.me/api/portraits/women/5.jpg',
    dob: { date: '1954-07-06T06:00:00.130Z', age: 69 },
    location: {
      street: { number: 8003, name: 'Peatonal Rosales' },
      city: 'Las Vigas',
      state: 'Guerrero',
      country: 'Mexico',
      postcode: 25269,
      timezone: { offset: '+5:00', description: 'Ekaterinburg, Islamabad, Karachi, Tashkent' }
    }
  });
  allUsers: User[] = [this.user];
}

describe('UserItemComponent with Wrapper', () => {
  let wrapperFixture: ComponentFixture<UserItemWrapperComponent>;
  let wrapperComponent: UserItemWrapperComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserItemWrapperComponent]
    }).compileComponents();

    wrapperFixture = TestBed.createComponent(UserItemWrapperComponent);
    wrapperComponent = wrapperFixture.componentInstance;
    wrapperFixture.detectChanges();
  });

  it('should create the wrapper wrapperComponent', () => {
    expect(wrapperComponent).toBeTruthy();
  });

  it('should display user\'s basic information', () => {
    wrapperFixture.detectChanges();

    const nameElement = wrapperFixture.debugElement.query(By.css('.user-item__name')).nativeElement;
    const emailElement = wrapperFixture.debugElement.query(By.css('.user-item__email')).nativeElement;
    const phoneElement = wrapperFixture.debugElement.query(By.css('.user-item__phone')).nativeElement;
    const natElement = wrapperFixture.debugElement.query(By.css('.user-item__nat')).nativeElement;
    const imageElement = wrapperFixture.debugElement.query(By.css('.user-item__image')).nativeElement;

    expect(nameElement.textContent).toContain('Marisela Fonseca');
    expect(emailElement.textContent).toBe('marisela.fonseca@example.com');
    expect(phoneElement.textContent).toBe('(667) 475 7275');
    expect(natElement.textContent).toBe('MX');
    expect(imageElement.src).toContain('https://randomuser.me/api/portraits/women/5.jpg');
  });

  it('should toggle expansion when clicked', () => {
    // Get the instance of the component using the debug element
    const userItemDebugElement = wrapperFixture.debugElement.query(By.css('app-user-item'));
    const userItemComponentInstance = userItemDebugElement.componentInstance as UserItemComponent;

    // Get the .user-item element inside the component
    const userItemElement = userItemDebugElement.query(By.css('.user-item')).nativeElement;

    // Initially collapsed, so isExpanded should be false
    expect(userItemComponentInstance.isExpanded).toBeFalse();

    // Click to expand
    userItemElement.click();
    wrapperFixture.detectChanges();

    // After the click, isExpanded should be true
    expect(userItemComponentInstance.isExpanded).toBeTrue();

    // Click to collapse
    userItemElement.click();
    wrapperFixture.detectChanges();

    // After the second click, isExpanded should be false again
    expect(userItemComponentInstance.isExpanded).toBeFalse();
  });

  it('should display extra information when isExpanded', () => {
    const userItemElement = wrapperFixture.debugElement.query(By.css('.user-item'));
    userItemElement.nativeElement.click();
    wrapperFixture.detectChanges();

    const dobElement = wrapperFixture.debugElement.query(By.css('.user-item__dob')).nativeElement;
    const addressElement = wrapperFixture.debugElement.query(By.css('.user-item__address')).nativeElement;

    expect(dobElement.textContent).toContain('Jul 6, 1954');
    expect(dobElement.textContent).toContain('(69)');
    expect(addressElement.textContent).toContain('8003 Peatonal Rosales, Las Vigas, Guerrero, Mexico 25269');
  });

});

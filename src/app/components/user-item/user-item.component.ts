import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-item',
  standalone: true,
  templateUrl: './user-item.component.html',
  styleUrl: './user-item.component.scss',
  imports: [CommonModule]
})
export class UserItemComponent {
  user = input.required<User>()
  allUsers = input.required<User[]>()
  isExpanded = false;

  toggleExpansion(): void {
    this.isExpanded = !this.isExpanded;
  }
}

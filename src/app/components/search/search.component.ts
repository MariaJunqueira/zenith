import { Component, EventEmitter, Output, effect, output, signal } from '@angular/core';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {

  search = signal(''); // Signal to hold the search input value
  searchChange = output<string>();
  private debounceTimeout!: ReturnType<typeof setTimeout>;

  constructor() {
    // Effect to emit the search value whenever it changes
    effect(() => {
      this.searchChange.emit(this.search());
    });
  }

  /**
     * Handles input event and updates the search signal after a debounce delay.
     * @param event The input event.
     */
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;

    // Clear the previous timeout
    clearTimeout(this.debounceTimeout);

    // Set a new timeout to update the signal after 500ms
    this.debounceTimeout = setTimeout(() => {
      this.search.set(input.value); // Update the signal with the new value
    }, 500);
  }
}

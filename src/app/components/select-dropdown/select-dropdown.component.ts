import { Component, input, output } from '@angular/core';

export interface SelectOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-select-dropdown',
  standalone: true,
  templateUrl: './select-dropdown.component.html',
  styleUrls: ['./select-dropdown.component.scss']
})
export class SelectDropdownComponent {
  options = input<SelectOption[]>();

  selectedValue = input<string>('');
  selectedValueChange = output<string>();

  ngOnInit() {
    console.log(this.options());
  }

  onSelectChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedValueChange.emit(target.value);
  }
}

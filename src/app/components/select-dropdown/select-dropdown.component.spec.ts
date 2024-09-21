import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { SelectDropdownComponent, SelectOption } from './select-dropdown.component';

@Component({
  template: `
    <app-select-dropdown 
      [options]="options"
      [(selectedValue)]="selectedValue">
    </app-select-dropdown>
    <p data-testid="txt-selected-value">{{ selectedValue }}</p>
  `,
  standalone: true,
  imports: [SelectDropdownComponent],
})
class SelectDropdownWrapperComponent {
  options: SelectOption[] = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3', value: '3' },
  ];
  selectedValue = '1';
}

describe('SelectDropdownComponent', () => {
  let fixture: ComponentFixture<SelectDropdownWrapperComponent>;
  let component: SelectDropdownWrapperComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectDropdownWrapperComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectDropdownWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the wrapper component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct initial selected value', () => {
    const selectedValueElement: HTMLParagraphElement = fixture.debugElement.query(
      By.css('[data-testid=txt-selected-value]')
    ).nativeElement;
    expect(selectedValueElement.textContent).toBe('1');
  });

  it('should display the correct number of options', () => {
    const selectElement = fixture.debugElement.query(By.css('select')).nativeElement;
    expect(selectElement.options.length).toBe(3);
  });

  it('should display the correct labels for options', () => {
    const optionElements = fixture.debugElement.queryAll(By.css('option'));
    expect(optionElements.length).toBe(3);
    expect(optionElements[0].nativeElement.textContent).toBe('Option 1');
    expect(optionElements[1].nativeElement.textContent).toBe('Option 2');
    expect(optionElements[2].nativeElement.textContent).toBe('Option 3');
  });

  it('should update the selected value when an option is selected', () => {
    const selectElement = fixture.debugElement.query(By.css('select')).nativeElement;

    selectElement.value = '2'; // Select the second option
    selectElement.dispatchEvent(new Event('change'));

    fixture.detectChanges();

    const selectedValueElement: HTMLParagraphElement = fixture.debugElement.query(
      By.css('[data-testid=txt-selected-value]')
    ).nativeElement;

    expect(selectedValueElement.textContent).toBe('2');
  });
});

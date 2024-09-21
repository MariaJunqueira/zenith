import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchComponent } from './search.component';
import { By } from '@angular/platform-browser';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit the search value after a 500ms debounce', (done) => {
    spyOn(component.searchChange, 'emit');

    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;

    inputElement.value = 'test';
    inputElement.dispatchEvent(new Event('input'));

    // Settimeout for 500ms to simulate the debounce delay
    setTimeout(() => {
      expect(component.searchChange.emit).toHaveBeenCalledWith('test');
      done();
    }, 500);
  });

  it('should debounce the input changes', (done) => {
    spyOn(component.searchChange, 'emit');

    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;

    inputElement.value = 'test1';
    inputElement.dispatchEvent(new Event('input'));

    inputElement.value = 'test2';
    inputElement.dispatchEvent(new Event('input'));

    // Settimeout for 500ms to simulate the debounce delay
    setTimeout(() => {
      expect(component.searchChange.emit).toHaveBeenCalledTimes(1);
      expect(component.searchChange.emit).toHaveBeenCalledWith('test2');
      done();
    }, 500);
  });

  it('should not emit the search value immediately', () => {
    spyOn(component.searchChange, 'emit');

    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;

    inputElement.value = 'test';
    inputElement.dispatchEvent(new Event('input'));

    // The value should not be emitted immediately
    expect(component.searchChange.emit).not.toHaveBeenCalled();
  });

  it('should clear the previous timeout when a new input event is fired', (done) => {
    spyOn(component.searchChange, 'emit');

    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;

    inputElement.value = 'first';
    inputElement.dispatchEvent(new Event('input'));

    // Before the debounce time passes, change the input value again
    setTimeout(() => {
      inputElement.value = 'second';
      inputElement.dispatchEvent(new Event('input'));
    }, 300);

    // Check that the first value is not emitted
    setTimeout(() => {
      // The timeout here should be long enough to allow the debounce logic to run completely
      expect(component.searchChange.emit).toHaveBeenCalledTimes(1);
      expect(component.searchChange.emit).toHaveBeenCalledWith('second');
      done();
    }, 1000);
  });

});

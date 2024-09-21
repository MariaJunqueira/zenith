import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ScrollNearEdgeDirective } from './scroll-near-end.directive';

@Component({
  template: `<div appScrollNearEdge (nearEdge)="onNearEdge($event)" style="height: 2000px; overflow: auto;"></div>`,
  standalone: true,
  imports: [ScrollNearEdgeDirective],
})
export class TestWrapperComponent {
  nearEdgeEvent: -1 | 1 | null = null;

  onNearEdge(event: -1 | 1): void {
    this.nearEdgeEvent = event;
  }
}

describe('ScrollNearEdgeDirective', () => {
  let fixture: ComponentFixture<TestWrapperComponent>;
  let component: TestWrapperComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestWrapperComponent], // Import the wrapper component that uses the directive
    }).compileComponents();

    fixture = TestBed.createComponent(TestWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit 1 when scrolling near the bottom', () => {
    // Mock the window properties to simulate scrolling near the bottom
    spyOnProperty(window, 'scrollY').and.returnValue(1800);
    spyOnProperty(window, 'innerHeight').and.returnValue(200);
    spyOnProperty(document.documentElement, 'scrollHeight').and.returnValue(2000);

    // Trigger the scroll event
    window.dispatchEvent(new Event('scroll'));

    expect(component.nearEdgeEvent).toBe(1);
  });

  it('should emit -1 when scrolling near the top', () => {
    // Mock the window properties to simulate scrolling near the top
    spyOnProperty(window, 'scrollY').and.returnValue(800);
    spyOnProperty(window, 'innerHeight').and.returnValue(2000);

    // Trigger the scroll event
    window.dispatchEvent(new Event('scroll'));

    expect(component.nearEdgeEvent).toBe(-1);
  });

  it('should not emit if not near top or bottom', () => {
    // Mock the window properties to simulate scrolling somewhere in the middle
    spyOnProperty(window, 'scrollY').and.returnValue(1500);
    spyOnProperty(window, 'innerHeight').and.returnValue(200);
    spyOnProperty(document.documentElement, 'scrollHeight').and.returnValue(5000);

    // Trigger the scroll event
    window.dispatchEvent(new Event('scroll'));

    expect(component.nearEdgeEvent).toBeNull();
  });

  it('should create an instance of the directive', () => {
    const debugElement = fixture.debugElement.query(By.directive(ScrollNearEdgeDirective));
    expect(debugElement).not.toBeNull();
    const directiveInstance = debugElement.injector.get(ScrollNearEdgeDirective);
    expect(directiveInstance).toBeTruthy();
  });

  it('should emit 1 when the bottom threshold is crossed', () => {
    const directive = new ScrollNearEdgeDirective();

    const spy = spyOn(directive.nearEdge, 'emit');

    spyOnProperty(window, 'scrollY').and.returnValue(1800);
    spyOnProperty(window, 'innerHeight').and.returnValue(200);
    spyOnProperty(document.documentElement, 'scrollHeight').and.returnValue(2000);

    directive.onScroll();

    expect(spy).toHaveBeenCalledWith(1);
  });

  it('should emit -1 when the top threshold is crossed', () => {
    const directive = new ScrollNearEdgeDirective();

    const spy = spyOn(directive.nearEdge, 'emit');

    spyOnProperty(window, 'scrollY').and.returnValue(800);

    directive.onScroll();

    expect(spy).toHaveBeenCalledWith(-1);
  });
});

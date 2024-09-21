import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[appScrollNearEdge]',
  standalone: true,
})
export class ScrollNearEdgeDirective {
  /**
   * Event emitted when the user scrolls near the top or bottom of the page.
   * Emits `-1` when near the top and `1` when near the bottom.
   */
  @Output() nearEdge: EventEmitter<-1 | 1> = new EventEmitter<-1 | 1>();

  /**
   * Threshold in pixels to consider when detecting proximity to the bottom of the page.
   */
  threshold = 200;

  /**
   * HostListener to detect scroll events on the window.
   * Emits the appropriate event when the user is near the top or bottom of the page.
   */
  @HostListener('window:scroll', [])
  onScroll(): void {
    const scrollPosition = window.scrollY + window.innerHeight;
    const thresholdBottom = document.documentElement.scrollHeight - this.threshold;
    const thresholdTop = 1000;

    // Near the bottom
    if (scrollPosition >= thresholdBottom) {
      this.nearEdge.emit(1);
    }

    // Near the top
    if (window.scrollY <= thresholdTop) {
      this.nearEdge.emit(-1);
    }
  }
}

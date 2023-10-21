import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  columns = [
    { id: 'column1', items: ['Card 1', 'Card 2', 'Card 3'] },
    { id: 'column2', items: ['Card A', 'Card B', 'Card C'] },
    { id: 'column3', items: ['Card x', 'Card y', 'Card z'] },
  ];

  drop(event: any) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem( event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }

    const containerElement = event.container.element.nativeElement;
    const containerRect = containerElement.getBoundingClientRect();

    if (event.container.id === 'column2') {
      const relativeX = event.dropPoint.x - containerRect.left;
      const relativeY = event.dropPoint.y - containerRect.top;
      const beforeElement = containerElement.querySelector(':before');

      if (beforeElement) {
        beforeElement.style.left = relativeX + 'px';
        beforeElement.style.top = relativeY + 'px';
      }

      const handleTransitionEnd = (e: TransitionEvent) => {
        if (e.propertyName === 'opacity') {
          containerElement.classList.remove('animated');
          containerElement.removeEventListener('transitionend', handleTransitionEnd);
        }
      };

      containerElement.addEventListener('transitionend', handleTransitionEnd);
      containerElement.classList.add('animated');
    }

    if (
      event.dropPoint.x >= containerRect.left &&
      event.dropPoint.x <= containerRect.right &&
      event.dropPoint.y >= containerRect.top &&
      event.dropPoint.y <= containerRect.bottom
      && event.container.id === 'column3'
    ) {
      this.launchConfetti(event.dropPoint.x, event.dropPoint.y);
    }
  }
  
  launchConfetti(x: any, y: any) {
    const relativeX = x / window.innerWidth;
    const relativeY = y / window.innerHeight;

    confetti({
      particleCount: 150,
      spread: 70,
      origin: { x: relativeX, y: relativeY },
    });
  }
}

import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-winner-modal',
  templateUrl: './winner-modal.component.html',
  styleUrls: ['./winner-modal.component.scss'],
  animations: [
    trigger('modalAnimation', [
      state('void', style({
        opacity: 0,
        transform: 'scale(0.7)'
      })),
      state('*', style({
        opacity: 1,
        transform: 'scale(1)'
      })),
      transition('void => *', animate('300ms ease-out')),
      transition('* => void', animate('200ms ease-in'))
    ])
  ]
})
export class WinnerModalComponent implements OnInit, OnChanges {
  @Input() winner: string | null = null;
  @Input() isDraw: boolean = false;
  showModal: boolean = false;

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['winner'] && changes['winner'].currentValue) || 
        (changes['isDraw'] && changes['isDraw'].currentValue)) {
      this.showModal = true;
    }
  }

  closeModal(): void {
    this.showModal = false;
  }
} 
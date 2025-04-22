import { Component, OnInit } from '@angular/core';
import { TicTacToeService } from 'src/app/services/tic-tac-toe.service';
import { SoundService } from 'src/app/services/sound.service';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-tic-tac-toe',
  templateUrl: './tic-tac-toe.component.html',
  styleUrls: ['./tic-tac-toe.component.scss'],
  animations: [
    trigger('moveAnimation', [
      state('void', style({ 
        opacity: 0,
        transform: 'scale(0.1)'
      })),
      state('*', style({ 
        opacity: 1,
        transform: 'scale(1)'
      })),
      transition('void => *', animate('300ms ease-in')),
    ]),
    trigger('winnerAnimation', [
      state('show', style({
        opacity: 1,
        transform: 'scale(1.2)'
      })),
      transition('* => show', [
        style({ opacity: 0, transform: 'scale(1)' }),
        animate('500ms ease-out')
      ])
    ])
  ]
})
export class TicTacToeComponent implements OnInit {

  constructor(
    public ticTacToeService: TicTacToeService,
    private soundService: SoundService
  ) {}

  ngOnInit(): void {
    this.ticTacToeService.initGame();
  }

  onCellClick(row: number, col: number): void {
    const prevValue = this.ticTacToeService.board[row][col];
    this.ticTacToeService.makeMove(row, col);
    
    // Only play sound if a move was made and sound is enabled
    if (prevValue === '' && this.ticTacToeService.board[row][col] !== '' && this.ticTacToeService.soundEnabled) {
      this.soundService.playSound('move');
      
      // Check if this move resulted in a win or draw
      setTimeout(() => {
        if (this.ticTacToeService.winner) {
          this.soundService.playSound('win');
        } else if (this.ticTacToeService.isDraw) {
          this.soundService.playSound('draw');
        }
      }, 100);
    }
  }

  resetGame(): void {
    this.ticTacToeService.initGame();
  }

  stopGame(): void {
    this.ticTacToeService.stopGame();
  }

  toggleSound(): void {
    this.ticTacToeService.soundEnabled = !this.ticTacToeService.soundEnabled;
    this.soundService.soundEnabled = this.ticTacToeService.soundEnabled;
  }
}

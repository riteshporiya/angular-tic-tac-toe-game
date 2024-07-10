import { Component, OnInit } from '@angular/core';
import { TicTacToeService } from 'src/app/services/tic-tac-toe.service';

@Component({
  selector: 'app-tic-tac-toe',
  templateUrl: './tic-tac-toe.component.html',
  styleUrls: ['./tic-tac-toe.component.scss']
})
export class TicTacToeComponent implements OnInit {
  constructor(public ticTacToeService: TicTacToeService) {}

  ngOnInit(): void {
    this.ticTacToeService.initGame();
  }

  onCellClick(row: number, col: number): void {
    this.ticTacToeService.makeMove(row, col);
  }

  resetGame(): void {
    this.ticTacToeService.initGame();
  }

  stopGame(): void {
    this.ticTacToeService.stopGame();
  }
}

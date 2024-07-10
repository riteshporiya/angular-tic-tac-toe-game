import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TicTacToeService {
  board: string[][] = [];
  currentPlayer: 'X' | 'O' = 'X';
  winner: string | null = null;
  isDraw: boolean = false;
  gameOver: boolean = false;
  xScore: number = 0;
  oScore: number = 0;
  tieScore: number = 0;
  totalGames: number = 0;

  constructor() { }

  initGame(): void {
    this.board = [
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ];
    this.currentPlayer = 'X';
    this.winner = null;
    this.isDraw = false;
    this.gameOver = false;
  }

  makeMove(row: number, col: number): void {
    if (this.board[row][col] === '' && !this.gameOver) {
      this.board[row][col] = this.currentPlayer;
      if (this.checkWinner(row, col)) {
        this.winner = this.currentPlayer;
        this.gameOver = true;
        this.updateScore();
      } else if (this.checkDraw()) {
        this.isDraw = true;
        this.gameOver = true;
        this.updateScore();
      } else {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
      }
    }
  }

  checkWinner(row: number, col: number): boolean {
    const player = this.board[row][col];

    // Check row
    if (this.board[row].every(cell => cell === player)) return true;

    // Check column
    if (this.board.every(r => r[col] === player)) return true;

    // Check diagonals
    if (row === col && this.board.every((r, i) => r[i] === player)) return true;
    if (row + col === 2 && this.board.every((r, i) => r[2 - i] === player)) return true;

    return false;
  }

  checkDraw(): boolean {
    return this.board.every(row => row.every(cell => cell !== ''));
  }

  updateScore(): void {
    this.totalGames++;
    if (this.winner === 'X') {
      this.xScore++;
    } else if (this.winner === 'O') {
      this.oScore++;
    } else {
      this.tieScore++;
    }
  }

  stopGame(): void {
    this.gameOver = true;
  }

}
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
  playAgainstAI: boolean = false;
  aiDifficulty: 'easy' | 'medium' | 'hard' = 'medium';
  boardSize: number = 3;
  soundEnabled: boolean = true;

  constructor() {
    this.loadScoresFromLocalStorage();
    this.loadSettingsFromLocalStorage();
  }

  initGame(): void {
    // Initialize empty board based on current board size
    this.board = Array(this.boardSize).fill(null)
      .map(() => Array(this.boardSize).fill(''));
    
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
        
        // AI makes a move if it's the AI's turn
        if (this.playAgainstAI && this.currentPlayer === 'O' && !this.gameOver) {
          setTimeout(() => {
            const aiMove = this.getAIMove();
            if (aiMove) {
              this.makeMove(aiMove.row, aiMove.col);
            }
          }, 500);
        }
      }
    }
  }

  checkWinner(row: number, col: number): boolean {
    const player = this.board[row][col];
    
    // Check row
    if (this.board[row].every(cell => cell === player)) return true;
    
    // Check column
    if (this.board.every(r => r[col] === player)) return true;
    
    // Check main diagonal (top-left to bottom-right)
    if (row === col) {
      let diagonalWin = true;
      for (let i = 0; i < this.boardSize; i++) {
        if (this.board[i][i] !== player) {
          diagonalWin = false;
          break;
        }
      }
      if (diagonalWin) return true;
    }
    
    // Check anti-diagonal (top-right to bottom-left)
    if (row + col === this.boardSize - 1) {
      let antiDiagonalWin = true;
      for (let i = 0; i < this.boardSize; i++) {
        if (this.board[i][this.boardSize - 1 - i] !== player) {
          antiDiagonalWin = false;
          break;
        }
      }
      if (antiDiagonalWin) return true;
    }
    
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
    this.saveScoresToLocalStorage();
  }

  stopGame(): void {
    this.gameOver = true;
  }

  toggleAI(): void {
    this.playAgainstAI = !this.playAgainstAI;
    this.initGame();
    this.saveSettingsToLocalStorage();
  }

  setAIDifficulty(difficulty: 'easy' | 'medium' | 'hard'): void {
    this.aiDifficulty = difficulty;
    this.saveSettingsToLocalStorage();
  }

  resetScores(): void {
    this.xScore = 0;
    this.oScore = 0;
    this.tieScore = 0;
    this.totalGames = 0;
    this.saveScoresToLocalStorage();
  }

  changeBoardSize(size: number): void {
    if (size >= 3 && size <= 5) {
      this.boardSize = size;
      this.initGame();
      this.saveSettingsToLocalStorage();
    }
  }

  toggleSound(): void {
    this.soundEnabled = !this.soundEnabled;
    this.saveSettingsToLocalStorage();
  }

  private saveScoresToLocalStorage(): void {
    const scores = {
      xScore: this.xScore,
      oScore: this.oScore,
      tieScore: this.tieScore,
      totalGames: this.totalGames
    };
    localStorage.setItem('ticTacToeScores', JSON.stringify(scores));
  }

  private loadScoresFromLocalStorage(): void {
    const scoresJson = localStorage.getItem('ticTacToeScores');
    if (scoresJson) {
      try {
        const scores = JSON.parse(scoresJson);
        this.xScore = scores.xScore || 0;
        this.oScore = scores.oScore || 0;
        this.tieScore = scores.tieScore || 0;
        this.totalGames = scores.totalGames || 0;
      } catch (e) {
        console.error('Error parsing scores from localStorage', e);
      }
    }
  }

  private saveSettingsToLocalStorage(): void {
    const settings = {
      playAgainstAI: this.playAgainstAI,
      aiDifficulty: this.aiDifficulty,
      boardSize: this.boardSize,
      soundEnabled: this.soundEnabled
    };
    localStorage.setItem('ticTacToeSettings', JSON.stringify(settings));
  }

  private loadSettingsFromLocalStorage(): void {
    const settingsJson = localStorage.getItem('ticTacToeSettings');
    if (settingsJson) {
      try {
        const settings = JSON.parse(settingsJson);
        this.playAgainstAI = settings.playAgainstAI || false;
        this.aiDifficulty = settings.aiDifficulty || 'medium';
        this.boardSize = settings.boardSize || 3;
        this.soundEnabled = settings.soundEnabled !== undefined ? settings.soundEnabled : true;
      } catch (e) {
        console.error('Error parsing settings from localStorage', e);
      }
    }
  }

  private getAIMove(): { row: number, col: number } | null {
    // Check if there are any available moves
    const availableMoves: { row: number, col: number }[] = [];
    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        if (this.board[i][j] === '') {
          availableMoves.push({ row: i, col: j });
        }
      }
    }

    if (availableMoves.length === 0) return null;

    // Based on difficulty, choose strategy
    switch (this.aiDifficulty) {
      case 'easy':
        // Random move
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
      case 'medium':
        // Try to win first, then block, then random
        return this.getMediumAIMove(availableMoves);
      case 'hard':
        // For hard difficulty, we'll use minimax for 3x3 board only
        // and medium strategy for larger boards for performance reasons
        if (this.boardSize === 3) {
          return this.getHardAIMove();
        } else {
          return this.getMediumAIMove(availableMoves);
        }
      default:
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
  }

  private getMediumAIMove(availableMoves: { row: number, col: number }[]): { row: number, col: number } {
    // Try to win - look for a winning move
    for (const move of availableMoves) {
      this.board[move.row][move.col] = 'O';
      if (this.checkWinner(move.row, move.col)) {
        this.board[move.row][move.col] = '';
        return move;
      }
      this.board[move.row][move.col] = '';
    }

    // Try to block - look for opponent's winning move
    for (const move of availableMoves) {
      this.board[move.row][move.col] = 'X';
      if (this.checkWinner(move.row, move.col)) {
        this.board[move.row][move.col] = '';
        return move;
      }
      this.board[move.row][move.col] = '';
    }

    // Take center if available (strategic advantage)
    const centerCoord = Math.floor(this.boardSize / 2);
    const centerMove = availableMoves.find(move => move.row === centerCoord && move.col === centerCoord);
    if (centerMove) return centerMove;
    
    // Take corners if available (better strategic positions)
    const cornerMoves = availableMoves.filter(move => 
      (move.row === 0 && move.col === 0) || 
      (move.row === 0 && move.col === this.boardSize - 1) ||
      (move.row === this.boardSize - 1 && move.col === 0) ||
      (move.row === this.boardSize - 1 && move.col === this.boardSize - 1)
    );
    
    if (cornerMoves.length > 0) {
      return cornerMoves[Math.floor(Math.random() * cornerMoves.length)];
    }
    
    // Look for fork opportunities (setup two winning paths)
    const forkMove = this.findForkMove('O', availableMoves);
    if (forkMove) return forkMove;
    
    // Block opponent's fork opportunities
    const blockForkMove = this.findForkMove('X', availableMoves);
    if (blockForkMove) return blockForkMove;
    
    // Play a side if available
    const sideMoves = availableMoves.filter(move => 
      (move.row === 0 && move.col > 0 && move.col < this.boardSize - 1) || // top edge
      (move.row === this.boardSize - 1 && move.col > 0 && move.col < this.boardSize - 1) || // bottom edge
      (move.col === 0 && move.row > 0 && move.row < this.boardSize - 1) || // left edge
      (move.col === this.boardSize - 1 && move.row > 0 && move.row < this.boardSize - 1) // right edge
    );
    
    if (sideMoves.length > 0) {
      return sideMoves[Math.floor(Math.random() * sideMoves.length)];
    }
    
    // If all else fails, play randomly
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  // Method to find potential fork moves (setup two winning paths)
  private findForkMove(player: string, availableMoves: { row: number, col: number }[]): { row: number, col: number } | null {
    for (const move of availableMoves) {
      this.board[move.row][move.col] = player;
      
      // Count how many ways the player can win after making this move
      let winningPathsCount = 0;
      
      // Check each empty cell to see if it can be a winning move
      for (let i = 0; i < this.boardSize; i++) {
        for (let j = 0; j < this.boardSize; j++) {
          if (this.board[i][j] === '') {
            this.board[i][j] = player;
            if (this.checkWinner(i, j)) {
              winningPathsCount++;
            }
            this.board[i][j] = '';
          }
        }
      }
      
      this.board[move.row][move.col] = '';
      
      // If this move creates two or more winning paths, it's a fork
      if (winningPathsCount >= 2) {
        return move;
      }
    }
    
    return null;
  }

  private getHardAIMove(): { row: number, col: number } {
    // For 3x3 board, use minimax with alpha-beta pruning for optimal performance
    if (this.boardSize === 3) {
      return this.minimaxMove();
    } 
    // For larger boards, use a heuristic approach to avoid performance issues
    else {
      return this.getHeuristicMove();
    }
  }

  private minimaxMove(): { row: number, col: number } {
    let bestScore = -Infinity;
    let bestMove: { row: number, col: number } = { row: 0, col: 0 };
    
    // Use Alpha-Beta pruning to improve performance
    const alpha = -Infinity;
    const beta = Infinity;

    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        if (this.board[i][j] === '') {
          this.board[i][j] = 'O';
          // Start with depth 0, not maximizing (player's turn)
          const score = this.minimax(this.board, 0, false, alpha, beta);
          this.board[i][j] = '';
          
          if (score > bestScore) {
            bestScore = score;
            bestMove = { row: i, col: j };
          }
        }
      }
    }
    
    return bestMove;
  }

  private minimax(board: string[][], depth: number, isMaximizing: boolean, alpha: number = -Infinity, beta: number = Infinity): number {
    // Check terminal states
    if (this.checkWinnerForBoard(board, 'O')) return 10 - depth; // AI win
    if (this.checkWinnerForBoard(board, 'X')) return depth - 10; // Player win
    if (this.isBoardFull(board)) return 0; // Draw

    if (isMaximizing) {
      // AI's turn (O)
      let bestScore = -Infinity;
      for (let i = 0; i < this.boardSize; i++) {
        for (let j = 0; j < this.boardSize; j++) {
          if (board[i][j] === '') {
            board[i][j] = 'O';
            const score = this.minimax(board, depth + 1, false, alpha, beta);
            board[i][j] = '';
            bestScore = Math.max(score, bestScore);
            
            // Alpha-Beta pruning
            alpha = Math.max(alpha, bestScore);
            if (beta <= alpha) break; // Beta cutoff
          }
        }
        if (beta <= alpha) break; // Beta cutoff
      }
      return bestScore;
    } else {
      // Player's turn (X)
      let bestScore = Infinity;
      for (let i = 0; i < this.boardSize; i++) {
        for (let j = 0; j < this.boardSize; j++) {
          if (board[i][j] === '') {
            board[i][j] = 'X';
            const score = this.minimax(board, depth + 1, true, alpha, beta);
            board[i][j] = '';
            bestScore = Math.min(score, bestScore);
            
            // Alpha-Beta pruning
            beta = Math.min(beta, bestScore);
            if (beta <= alpha) break; // Alpha cutoff
          }
        }
        if (beta <= alpha) break; // Alpha cutoff
      }
      return bestScore;
    }
  }

  private checkWinnerForBoard(board: string[][], player: string): boolean {
    // Check rows
    for (let i = 0; i < this.boardSize; i++) {
      let rowWin = true;
      for (let j = 0; j < this.boardSize; j++) {
        if (board[i][j] !== player) {
          rowWin = false;
          break;
        }
      }
      if (rowWin) return true;
    }

    // Check columns
    for (let i = 0; i < this.boardSize; i++) {
      let colWin = true;
      for (let j = 0; j < this.boardSize; j++) {
        if (board[j][i] !== player) {
          colWin = false;
          break;
        }
      }
      if (colWin) return true;
    }

    // Check main diagonal
    let diagonalWin = true;
    for (let i = 0; i < this.boardSize; i++) {
      if (board[i][i] !== player) {
        diagonalWin = false;
        break;
      }
    }
    if (diagonalWin) return true;

    // Check anti-diagonal
    let antiDiagonalWin = true;
    for (let i = 0; i < this.boardSize; i++) {
      if (board[i][this.boardSize - 1 - i] !== player) {
        antiDiagonalWin = false;
        break;
      }
    }
    if (antiDiagonalWin) return true;

    return false;
  }

  private isBoardFull(board: string[][]): boolean {
    return board.every(row => row.every(cell => cell !== ''));
  }

  // Heuristic evaluation for larger boards
  private getHeuristicMove(): { row: number, col: number } {
    // Start with the medium AI logic for larger boards
    const availableMoves: { row: number, col: number }[] = [];
    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        if (this.board[i][j] === '') {
          availableMoves.push({ row: i, col: j });
        }
      }
    }
    
    // Try to win first
    for (const move of availableMoves) {
      this.board[move.row][move.col] = 'O';
      if (this.checkWinner(move.row, move.col)) {
        this.board[move.row][move.col] = '';
        return move;
      }
      this.board[move.row][move.col] = '';
    }
    
    // Block opponent
    for (const move of availableMoves) {
      this.board[move.row][move.col] = 'X';
      if (this.checkWinner(move.row, move.col)) {
        this.board[move.row][move.col] = '';
        return move;
      }
      this.board[move.row][move.col] = '';
    }
    
    // For larger boards, evaluate positions by heuristic value
    let bestMove: { row: number, col: number } | null = null;
    let bestScore = -Infinity;
    
    for (const move of availableMoves) {
      // Calculate the score for this position based on heuristics
      const score = this.evaluatePosition(move.row, move.col);
      
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }
    
    if (bestMove) return bestMove;
    
    // Fallback to center or random
    const centerCoord = Math.floor(this.boardSize / 2);
    const centerMove = availableMoves.find(move => move.row === centerCoord && move.col === centerCoord);
    if (centerMove) return centerMove;
    
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  // Evaluate position for heuristic-based AI
  private evaluatePosition(row: number, col: number): number {
    // Calculate position score based on:
    // 1. Distance from center (closer is better)
    // 2. How many potential winning lines go through this position
    // 3. How many friendly pieces are already on those lines
    
    const centerCoord = Math.floor(this.boardSize / 2);
    let score = 0;
    
    // Prefer positions closer to center
    const distanceFromCenter = Math.abs(row - centerCoord) + Math.abs(col - centerCoord);
    const normalizedDistance = 1 - (distanceFromCenter / (this.boardSize * 2));
    score += normalizedDistance * 2; // Weight: 2
    
    // For 'O', check how close we are to winning in various lines
    // 'O' is the AI
    score += this.evaluateLine(row, -1, col, 0, 'O'); // Check vertical line
    score += this.evaluateLine(row, 0, col, -1, 'O'); // Check horizontal line
    
    // Check diagonals if on a diagonal
    if (row === col) {
      score += this.evaluateLine(row, -1, col, -1, 'O'); // Main diagonal
    }
    if (row + col === this.boardSize - 1) {
      score += this.evaluateLine(row, -1, col, 1, 'O'); // Anti-diagonal
    }
    
    // Subtract opponent's potential in the same lines
    score -= this.evaluateLine(row, -1, col, 0, 'X') * 1.5; // Block vertical (higher weight)
    score -= this.evaluateLine(row, 0, col, -1, 'X') * 1.5; // Block horizontal (higher weight)
    
    if (row === col) {
      score -= this.evaluateLine(row, -1, col, -1, 'X') * 1.5; // Block main diagonal
    }
    if (row + col === this.boardSize - 1) {
      score -= this.evaluateLine(row, -1, col, 1, 'X') * 1.5; // Block anti-diagonal
    }
    
    return score;
  }

  // Evaluate a line for the heuristic function
  private evaluateLine(row: number, rowDelta: number, col: number, colDelta: number, player: string): number {
    let score = 0;
    let emptyCount = 0;
    let playerCount = 0;
    
    // Check the line in both directions
    for (let i = 0; i < this.boardSize; i++) {
      const r = row + (rowDelta * i);
      const c = col + (colDelta * i);
      
      // Make sure we don't go out of bounds
      if (r >= 0 && r < this.boardSize && c >= 0 && c < this.boardSize) {
        if (this.board[r][c] === player) {
          playerCount++;
        } else if (this.board[r][c] === '') {
          emptyCount++;
        }
      }
    }
    
    // Score is higher for more player pieces and available empty spaces
    if (playerCount > 0 && emptyCount > 0) {
      score = playerCount * 0.5 + emptyCount * 0.1;
      
      // Bonus for having more of our pieces in the line
      if (playerCount > 1) {
        score *= (playerCount / 2);
      }
    }
    
    return score;
  }
}
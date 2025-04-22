import { Component, OnInit } from '@angular/core';
import { TicTacToeService } from 'src/app/services/tic-tac-toe.service';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-game-settings',
  templateUrl: './game-settings.component.html',
  styles: [`
    .settings-container {
      width: 100%;
    }
    .settings-panel {
      background-color: #f8f9fa;
    }
    .setting-item {
      margin-bottom: 1rem;
    }
    .btn-group .btn {
      min-width: 70px;
    }
  `],
  animations: [
    trigger('settingsAnimation', [
      state('void', style({
        opacity: 0,
        transform: 'translateY(-20px)'
      })),
      state('*', style({
        opacity: 1,
        transform: 'translateY(0)'
      })),
      transition('void => *', animate('300ms ease-out')),
      transition('* => void', animate('200ms ease-in'))
    ])
  ]
})
export class GameSettingsComponent implements OnInit {
  showSettings: boolean = false;
  boardSizes: number[] = [3, 4, 5];

  constructor(public ticTacToeService: TicTacToeService) { }

  ngOnInit(): void {
  }

  toggleSettings(): void {
    this.showSettings = !this.showSettings;
  }

  changeBoardSize(size: number): void {
    this.ticTacToeService.changeBoardSize(size);
  }
} 
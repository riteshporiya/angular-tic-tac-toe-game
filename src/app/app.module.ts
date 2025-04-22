import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TicTacToeComponent } from './components/tic-tac-toe/tic-tac-toe.component';
import { WinnerModalComponent } from './components/winner-modal/winner-modal.component';
import { GameSettingsComponent } from './components/game-settings/game-settings.component';
import { SoundService } from './services/sound.service';

@NgModule({
  declarations: [
    AppComponent,
    TicTacToeComponent,
    WinnerModalComponent,
    GameSettingsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule
  ],
  providers: [SoundService],
  bootstrap: [AppComponent]
})
export class AppModule { }

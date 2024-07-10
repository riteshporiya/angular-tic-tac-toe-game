import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicTacToeComponent } from './tic-tac-toe.component';

describe('TicTacToeComponent', () => {
  let component: TicTacToeComponent;
  let fixture: ComponentFixture<TicTacToeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TicTacToeComponent]
    });
    fixture = TestBed.createComponent(TicTacToeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

# Angular Tic-Tac-Toe Game 🎮

Welcome to the Angular Tic-Tac-Toe Game repository! This project showcases a modern, responsive Tic-Tac-Toe game built with Angular. Dive into the world of front-end development with this classic game, featuring clean code, modular components, and a sleek user interface. ��✨

## Features 🌟

### Gameplay
- Implements a score tracking system for X wins, O wins, ties, and total games played
- Displays the current player's turn with visual indicators
- Shows the winner or if it's a draw with an animated celebration modal
- Allows for different board sizes (3x3, 4x4, 5x5)
- The game board is centered and fully responsive for all devices

### AI Opponent
- Play against an AI with three difficulty levels:
  - **Easy**: Makes random moves for beginners
  - **Medium**: Uses strategy to win when possible, block opponent's winning moves, and make strategic positional plays
  - **Hard**: Implements the Minimax algorithm with Alpha-Beta pruning for optimal play on 3x3 boards, and advanced heuristics for larger boards

### Visual & Audio Enhancements
- Beautiful animations for placing X's and O's
- Smooth win/draw animations with celebration effects
- Sound effects for moves, wins, and draws
- Toggleable sound option with preferences saved between sessions
- Responsive design with a modern UI
- Winner celebration modal with trophy and confetti animations

### User Experience
- Local storage to persist scores and settings between sessions
- Settings menu to customize game options (board size, AI difficulty, sound)
- Visual feedback for moves with distinctive colors (X in blue, O in red)
- The ability to stop the game at any point or reset the board

## Getting Started 🛠️

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

- Node.js and npm installed on your machine.

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/riteshporiya/angular-tic-tac-toe-game.git

    cd angular-tic-tac-toe-game
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Run the application:
    ```bash
    ng serve
    ```

4. Open your browser and navigate to `http://localhost:4200`.

## Usage 📖

- Click on a cell to place your move (X or O)
- Toggle the "Play against AI" option to play against the computer
- Select the AI difficulty level (Easy, Medium, Hard)
- Adjust the board size through the settings panel
- Toggle sound effects on/off as desired
- The score tracking system updates automatically
- Use the "Reset" button to start a new game
- Use the "Stop" button to stop the current game
- Enjoy playing!

## Future Enhancements 🌠

- Multiplayer support for playing against friends online
- User accounts to track stats across devices
- More themes and visual customization options
- Additional game modes with different winning conditions
- Undo move functionality

## Contributing 🤝

Contributions are welcome! Please open an issue or submit a pull request for any changes or enhancements you would like to see.

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments 🙏

- Inspired by classic Tic-Tac-Toe games
- Built with Angular and Bootstrap
- Sound effects implemented using Web Audio API

Happy gaming! 🎮

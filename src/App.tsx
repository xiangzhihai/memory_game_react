import { useState } from 'react';
import './App.css';

enum GameState {
  PLAYING,
  FINISHED,
}

enum CardState {
  HIDDEN = 'HIDDEN',
  REVEALED = 'REVEALED',
  REMOVED = 'REMOVED',
}

interface CardObject {
  num: number;
  cardState: CardState;
}

const NUM_ROW = 6;
const NUM_COL = 6;

function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.PLAYING);

  const cards2dArray: CardObject[][] = [];
  for (let row = 0; row < NUM_ROW; row++) {
    const current_row: CardObject[] = [];
    for (let col = 0; col < NUM_COL; col++) {
      current_row.push({
        num: Math.floor((col + NUM_COL * row) / 2) + 1,
        cardState: CardState.HIDDEN,
      });
    }
    cards2dArray.push(current_row);
  }

  const [cardsState, setCardsState] = useState<CardObject[][]>(cards2dArray);

  const handleCardClick = (row: number, col: number) => {
    if (cardsState[row][col].cardState === CardState.HIDDEN) {
      const newCardsState = cardsState.slice();
      newCardsState[row][col].cardState = CardState.REVEALED;
      setCardsState(newCardsState);
    }
  };

  const renderGame = () => {
    switch (gameState) {
      case GameState.PLAYING:
        return (
          <div className="card-board">
            {cardsState.map((row, rowIndex) => (
              <div className="card-board-row" key={rowIndex}>
                {row.map((card, colIndex) => (
                  <button
                    key={colIndex}
                    className={`card ${card.cardState
                      .toString()
                      .toLowerCase()}`}
                    onClick={() => handleCardClick(rowIndex, colIndex)}
                    disabled={card.cardState === CardState.REMOVED}
                  >
                    {card.cardState === CardState.REVEALED ? (
                      <span>{card.num}</span>
                    ) : (
                      ''
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>
        );
      case GameState.FINISHED:
        return <h1>Finished</h1>;
    }
  };

  return (
    <div className="App">
      <header className="App-header">{renderGame()}</header>
    </div>
  );
}

export default App;

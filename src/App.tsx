import { useRef, useState } from 'react';
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
  row: number;
  col: number;
}

const NUM_ROW = 6;
const NUM_COL = 6;
const COMPARE_TIMEOUT_IN_MS = 1000;

function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.PLAYING);
  const [cardToCompare, setCardToCompare] = useState<CardObject | null>(null);
  const timeoutRef: React.MutableRefObject<NodeJS.Timeout | null> =
    useRef(null);
  const hiddenPairRef = useRef<number>((NUM_ROW * NUM_COL) / 2);

  const initializeCards = (): CardObject[][] => {
    const numbers = Array.from(
      { length: (NUM_ROW * NUM_COL) / 2 },
      (_, i) => i + 1
    ).flatMap((num) => [num, num]); // Create pairs of numbers from 1 to 18
    // Shuffle the numbers array
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    // Generate the 2D array of CardObjects with shuffled numbers
    const shuffledCards2dArray: CardObject[][] = [];
    let index = 0;
    for (let row = 0; row < NUM_ROW; row++) {
      const current_row: CardObject[] = [];
      for (let col = 0; col < NUM_COL; col++) {
        current_row.push({
          num: numbers[index++], // Assign shuffled number
          cardState: CardState.HIDDEN,
          row,
          col,
        });
      }
      shuffledCards2dArray.push(current_row);
    }

    return shuffledCards2dArray;
  };

  const [cardsState, setCardsState] = useState<CardObject[][]>(
    initializeCards()
  );

  const updateCardToState = (row: number, col: number, state: CardState) => {
    const newCardsState = cardsState.slice();
    newCardsState[row][col].cardState = state;
    setCardsState(newCardsState);
  };

  const handleCardClick = (row: number, col: number) => {
    if (
      timeoutRef.current === null &&
      cardsState[row][col].cardState === CardState.HIDDEN
    ) {
      updateCardToState(row, col, CardState.REVEALED);

      if (!cardToCompare) {
        // First selection
        setCardToCompare(cardsState[row][col]);
      } else {
        // Second selection. Apply compare logic
        if (cardToCompare.num === cardsState[row][col].num) {
          // Match
          timeoutRef.current = setTimeout(() => {
            updateCardToState(row, col, CardState.REMOVED);
            updateCardToState(
              cardToCompare.row,
              cardToCompare.col,
              CardState.REMOVED
            );
            timeoutRef.current = null;
            setCardToCompare(null);
            hiddenPairRef.current -= 1;
            if (hiddenPairRef.current <= 0) {
              setGameState(GameState.FINISHED);
            }
          }, COMPARE_TIMEOUT_IN_MS);
        } else {
          // Don't match
          timeoutRef.current = setTimeout(() => {
            updateCardToState(row, col, CardState.HIDDEN);
            updateCardToState(
              cardToCompare.row,
              cardToCompare.col,
              CardState.HIDDEN
            );
            timeoutRef.current = null;
            setCardToCompare(null);
          }, COMPARE_TIMEOUT_IN_MS);
        }
      }
    }
  };

  const resetGame = () => {
    setCardsState(initializeCards());
    setCardToCompare(null);
    hiddenPairRef.current = (NUM_ROW * NUM_COL) / 2;
    setGameState(GameState.PLAYING);
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
                    className={`card ${card.cardState.toLowerCase()}`}
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
        return (
          <div>
            <button className="play-again-button" onClick={resetGame}>
              Play Again
            </button>
          </div>
        );
    }
  };

  return (
    <div className="App">
      <h1 className="finished-title">Memory Game</h1>
      <header className="App-header">{renderGame()}</header>
    </div>
  );
}

export default App;

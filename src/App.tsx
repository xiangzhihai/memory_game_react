import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

enum GameState {
  PLAYING,
  FINISHED,
}

enum CardState {
  HIDDEN,
  REVALED,
  REMOVCED,
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
        num: (Math.floor(col / 2) + 1) + (NUM_COL / 2 * row),
        cardState: CardState.HIDDEN
      })
    }
    cards2dArray.push(current_row);
  }

  const [cardsState, setCardsState] = useState<CardObject[][]>(cards2dArray);

  const renderGame = () => {
    switch (gameState) {
      case GameState.PLAYING:
        return (<ul className='card-board'>{
          cardsState.map((row, row_index) => (
            <ul className='card_board_row' key={row_index}>{
              row.map((card, col_index) => (
                <button key={col_index}>{card.num}</button>
              ))
            }</ul>
          ))
          }</ul>);
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

import { useState } from 'react';
import './App.css'; // 引入CSS样式文件

const BOARD_SIZE = 20;

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value && <span className={`piece ${value === 'X' ? 'black' : 'white'}`}></span>}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = (
      <div className="winning-status">
        恭喜! {winner === 'X' ? 'Black' : 'White'} 获胜! 对方为臭棋篓子一枚.
      </div>
    );
  } else {
    status = 'Next player: ' + (xIsNext ? 'Black' : 'White');
  }

  const renderSquare = (i) => (
    <Square key={i} value={squares[i]} onSquareClick={() => handleClick(i)} />
  );

  const boardRows = [];
  for (let i = 0; i < BOARD_SIZE; i++) {
    const rowSquares = [];
    for (let j = 0; j < BOARD_SIZE; j++) {
      rowSquares.push(renderSquare(i * BOARD_SIZE + j));
    }
    boardRows.push(
      <div className="board-row" key={i}>
        {rowSquares}
      </div>
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {boardRows}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(BOARD_SIZE * BOARD_SIZE).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = '第 ' + move + ' 手';
    } else {
      description = '开始游戏';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const directions = [
    [1, 0], // horizontal
    [0, 1], // vertical
    [1, 1], // diagonal
    [1, -1], // anti-diagonal
  ];

  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      const player = squares[i * BOARD_SIZE + j];
      if (!player) continue;

      for (const [dx, dy] of directions) {
        let count = 0;
        for (let step = 0; step < 5; step++) {
          const x = i + step * dx;
          const y = j + step * dy;
          if (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE && squares[x * BOARD_SIZE + y] === player) {
            count++;
          } else {
            break;
          }
        }
        if (count === 5) return player;
      }
    }
  }
  return null;
}

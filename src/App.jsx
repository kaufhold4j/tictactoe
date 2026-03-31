import { useState, useEffect } from 'react'

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isVsCpu, setIsVsCpu] = useState(false);

  function handleClick(i) {
    if (calculateWinner(squares) || squares[i] || (!xIsNext && isVsCpu)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else if (squares.every(Boolean)) {
    status = 'Draw!';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  function handleReset() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  useEffect(() => {
    if (!xIsNext && isVsCpu && !calculateWinner(squares) && isMovesLeft(squares)) {
      const timer = setTimeout(() => {
        const move = getBestMove(squares);
        if (move !== -1) {
          // Internal call to move (bypass turn hijacking check)
          const nextSquares = squares.slice();
          nextSquares[move] = 'O';
          setSquares(nextSquares);
          setXIsNext(true);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [xIsNext, isVsCpu, squares]);

  return (
    <>
      <div className="controls">
        <button
          className={`cpu-toggle ${isVsCpu ? 'active' : ''}`}
          onClick={() => setIsVsCpu(!isVsCpu)}
        >
          {isVsCpu ? 'Vs Computer: ON' : 'Vs Computer: OFF'}
        </button>
      </div>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
      <button className="reset-button" onClick={handleReset}>Reset Game</button>
    </>
  );
}

export default function App() {
  return (
    <div className="App">
      <h1>Tic Tac Toe</h1>
      <Board />
    </div>
  )
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function evaluate(squares) {
  const winner = calculateWinner(squares);
  if (winner === 'O') return 10;
  if (winner === 'X') return -10;
  return 0;
}

function isMovesLeft(squares) {
  return squares.some(s => s === null);
}

function minimax(squares, depth, isMax) {
  const score = evaluate(squares);

  if (score === 10) return score - depth;
  if (score === -10) return score + depth;
  if (!isMovesLeft(squares)) return 0;

  if (isMax) {
    let best = -1000;
    for (let i = 0; i < 9; i++) {
      if (squares[i] === null) {
        squares[i] = 'O';
        best = Math.max(best, minimax(squares, depth + 1, !isMax));
        squares[i] = null;
      }
    }
    return best;
  } else {
    let best = 1000;
    for (let i = 0; i < 9; i++) {
      if (squares[i] === null) {
        squares[i] = 'X';
        best = Math.min(best, minimax(squares, depth + 1, !isMax));
        squares[i] = null;
      }
    }
    return best;
  }
}

function getBestMove(squares) {
  let bestVal = -1000;
  let bestMove = -1;
  const squaresCopy = squares.slice();

  for (let i = 0; i < 9; i++) {
    if (squaresCopy[i] === null) {
      squaresCopy[i] = 'O';
      let moveVal = minimax(squaresCopy, 0, false);
      squaresCopy[i] = null;

      if (moveVal > bestVal) {
        bestMove = i;
        bestVal = moveVal;
      }
    }
  }
  return bestMove;
}

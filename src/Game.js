import React, { useEffect, useState } from 'react';
import './Game.css';

const defaultBoard = Array(9).fill(null);

const Game = () => {
  const [board, setBoard] = useState(defaultBoard);
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('tic-tac-toe'));
    if (saved) {
      setBoard(saved.board);
      setIsXNext(saved.isXNext);
    }
  }, []);

  // Save to localStorage on update
  useEffect(() => {
    localStorage.setItem('tic-tac-toe', JSON.stringify({ board, isXNext }));
  }, [board, isXNext]);

  const handleClick = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
    setWinner(calculateWinner(newBoard));
  };

  const handleReset = () => {
    setBoard(defaultBoard);
    setIsXNext(true);
    setWinner(null);
    localStorage.removeItem('tic-tac-toe');
  };

  const renderSquare = (index) => (
    <button className="square" onClick={() => handleClick(index)}>
      {board[index]}
    </button>
  );

  const status = winner
    ? `🎉 Player ${winner} wins!`
    : board.every(Boolean)
    ? '😐 It’s a draw!'
    : `Next: Player ${isXNext ? 'X' : 'O'}`;

  return (
    <div className="game">
      <h1>Tic Tac Toe</h1>
      <div className="status">{status}</div>
      <div className="board">
        <div className="row">{[0, 1, 2].map(renderSquare)}</div>
        <div className="row">{[3, 4, 5].map(renderSquare)}</div>
        <div className="row">{[6, 7, 8].map(renderSquare)}</div>
      </div>
      <button className="reset" onClick={handleReset}>
        🔁 Reset Game
      </button>
    </div>
  );
};

// Win condition checker
function calculateWinner(board) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];
  for (let [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

export default Game;

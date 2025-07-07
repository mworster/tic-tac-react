import React, { useEffect, useState } from 'react';
import './Game.css';

const defaultBoard = Array(9).fill(null);

const Game = () => {
  const [board, setBoard] = useState(defaultBoard);
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]);

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
    const result = calculateWinner(newBoard);
    if (result) {
      setWinner(result.winner);
      setWinningLine(result.line);
    }
  };

  const handleReset = () => {
    setBoard(defaultBoard);
    setIsXNext(true);
    setWinner(null);
    setWinningLine([]);
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
    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(renderSquare)}
    {winner && <WinningLine line={winningLine} />}
  </div>
  <button className="reset" onClick={handleReset}>
    🔁 Reset Game
  </button>
</div>

  );
};

const WinningLine = ({ line }) => {
  const positions = {
    '0,1,2': 'horizontal top',
    '3,4,5': 'horizontal middle',
    '6,7,8': 'horizontal bottom',
    '0,3,6': 'vertical left',
    '1,4,7': 'vertical center',
    '2,5,8': 'vertical right',
    '0,4,8': 'diagonal main',
    '2,4,6': 'diagonal anti'
  };

  const className = `winning-line ${positions[line.sort((a, b) => a - b).join(',')]}`;

  return <div className={className}></div>;
};


// Win condition checker
function calculateWinner(board) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a, b, c] };
    }
  }
  return null;
}

export default Game;

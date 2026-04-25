import type { Board, CellValue, Direction } from '../types/game';

export function createEmptyBoard(): Board {
  return Array.from({ length: 4 }, () => Array(4).fill(0) as CellValue[]);
}

function deepCopyBoard(board: Board): Board {
  return board.map((row) => [...row] as CellValue[]);
}

function getEmptyCells(board: Board): Array<{ row: number; col: number }> {
  const cells: Array<{ row: number; col: number }> = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (board[row][col] === 0) {
        cells.push({ row, col });
      }
    }
  }
  return cells;
}

export function addRandomTile(board: Board): Board {
  const emptyCells = getEmptyCells(board);
  if (emptyCells.length === 0) return deepCopyBoard(board);

  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const { row, col } = emptyCells[randomIndex];
  const newBoard = deepCopyBoard(board);
  newBoard[row][col] = Math.random() < 0.9 ? 2 : 4;
  return newBoard;
}

export function initBoard(): Board {
  let board = createEmptyBoard();
  board = addRandomTile(board);
  board = addRandomTile(board);
  return board;
}

/**
 * Slide a single row to the left, merging tiles.
 * Returns the new row and the score gained.
 */
function slideRowLeft(row: CellValue[]): { row: CellValue[]; score: number } {
  // Filter out zeros
  const filtered = row.filter((v) => v !== 0) as CellValue[];
  const result: CellValue[] = [];
  let score = 0;
  let i = 0;

  while (i < filtered.length) {
    if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
      // Merge
      const merged = (filtered[i] * 2) as CellValue;
      result.push(merged);
      score += merged;
      i += 2;
    } else {
      result.push(filtered[i]);
      i++;
    }
  }

  // Pad with zeros
  while (result.length < 4) {
    result.push(0);
  }

  return { row: result, score };
}

function slideRowRight(row: CellValue[]): { row: CellValue[]; score: number } {
  const reversed = [...row].reverse() as CellValue[];
  const { row: slid, score } = slideRowLeft(reversed);
  return { row: slid.reverse() as CellValue[], score };
}

export function moveBoard(
  board: Board,
  direction: Direction,
): { board: Board; score: number; moved: boolean } {
  let workingBoard = deepCopyBoard(board);
  let totalScore = 0;
  let moved = false;

  if (direction === 'left') {
    for (let row = 0; row < 4; row++) {
      const { row: newRow, score } = slideRowLeft(workingBoard[row]);
      if (newRow.some((v, i) => v !== workingBoard[row][i])) moved = true;
      workingBoard[row] = newRow;
      totalScore += score;
    }
  } else if (direction === 'right') {
    for (let row = 0; row < 4; row++) {
      const { row: newRow, score } = slideRowRight(workingBoard[row]);
      if (newRow.some((v, i) => v !== workingBoard[row][i])) moved = true;
      workingBoard[row] = newRow;
      totalScore += score;
    }
  } else if (direction === 'up') {
    // Transpose, slide left, transpose back
    for (let col = 0; col < 4; col++) {
      const column = workingBoard.map((row) => row[col]) as CellValue[];
      const { row: newCol, score } = slideRowLeft(column);
      if (newCol.some((v, i) => v !== workingBoard[i][col])) moved = true;
      for (let row = 0; row < 4; row++) {
        workingBoard[row][col] = newCol[row];
      }
      totalScore += score;
    }
  } else if (direction === 'down') {
    // Transpose, slide right, transpose back
    for (let col = 0; col < 4; col++) {
      const column = workingBoard.map((row) => row[col]) as CellValue[];
      const { row: newCol, score } = slideRowRight(column);
      if (newCol.some((v, i) => v !== workingBoard[i][col])) moved = true;
      for (let row = 0; row < 4; row++) {
        workingBoard[row][col] = newCol[row];
      }
      totalScore += score;
    }
  }

  return { board: workingBoard, score: totalScore, moved };
}

export function removeTile(board: Board, row: number, col: number): Board {
  const newBoard = deepCopyBoard(board);
  newBoard[row][col] = 0;
  return newBoard;
}

export function checkWin(board: Board): boolean {
  return board.some((row) => row.some((cell) => cell === 2048));
}

export function checkGameOver(board: Board): boolean {
  // If there are empty cells, game is not over
  if (getEmptyCells(board).length > 0) return false;

  // Check if any horizontal merge is possible
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 3; col++) {
      if (board[row][col] === board[row][col + 1]) return false;
    }
  }

  // Check if any vertical merge is possible
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 4; col++) {
      if (board[row][col] === board[row + 1][col]) return false;
    }
  }

  return true;
}

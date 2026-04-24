import { describe, expect, it } from 'vitest';
import type { Board } from '../types/game';
import {
  addRandomTile,
  checkGameOver,
  checkWin,
  createEmptyBoard,
  initBoard,
  moveBoard,
} from './gameLogic';

describe('createEmptyBoard', () => {
  it('returns a 4x4 grid of zeros', () => {
    const board = createEmptyBoard();
    expect(board).toHaveLength(4);
    for (const row of board) {
      expect(row).toHaveLength(4);
      for (const cell of row) {
        expect(cell).toBe(0);
      }
    }
  });
});

describe('addRandomTile', () => {
  it('adds exactly one non-zero tile to an empty board', () => {
    const board = createEmptyBoard();
    const newBoard = addRandomTile(board);
    const nonZeroCells = newBoard.flat().filter((v) => v !== 0);
    expect(nonZeroCells).toHaveLength(1);
  });

  it('adds a tile with value 2 or 4', () => {
    const board = createEmptyBoard();
    const newBoard = addRandomTile(board);
    const nonZeroCells = newBoard.flat().filter((v) => v !== 0);
    expect([2, 4]).toContain(nonZeroCells[0]);
  });

  it('does not modify the original board', () => {
    const board = createEmptyBoard();
    addRandomTile(board);
    const allZero = board.flat().every((v) => v === 0);
    expect(allZero).toBe(true);
  });

  it('returns the same board (copied) if no empty cells', () => {
    // Build a full board with no zeros
    const full: Board = [
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, 2048, 2],
      [4, 8, 16, 32],
    ];
    const result = addRandomTile(full);
    // Values should be identical, just a copy
    expect(result).toEqual(full);
  });
});

describe('initBoard', () => {
  it('returns a 4x4 board with exactly 2 non-zero tiles', () => {
    const board = initBoard();
    const nonZero = board.flat().filter((v) => v !== 0);
    expect(nonZero).toHaveLength(2);
  });
});

describe('moveBoard – left', () => {
  it('merges two equal tiles to the left and scores correctly', () => {
    const board: Board = [
      [2, 2, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const { board: result, score, moved } = moveBoard(board, 'left');
    expect(result[0]).toEqual([4, 0, 0, 0]);
    expect(score).toBe(4);
    expect(moved).toBe(true);
  });

  it('slides tiles left without merging when values differ', () => {
    const board: Board = [
      [0, 2, 0, 4],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const { board: result, score } = moveBoard(board, 'left');
    expect(result[0]).toEqual([2, 4, 0, 0]);
    expect(score).toBe(0);
  });

  it('prevents double-merge: [2,2,2,0] left → [4,2,0,0]', () => {
    const board: Board = [
      [2, 2, 2, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const { board: result, score } = moveBoard(board, 'left');
    expect(result[0]).toEqual([4, 2, 0, 0]);
    expect(score).toBe(4);
  });

  it('merges two pairs: [2,2,2,2] left → [4,4,0,0]', () => {
    const board: Board = [
      [2, 2, 2, 2],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const { board: result, score } = moveBoard(board, 'left');
    expect(result[0]).toEqual([4, 4, 0, 0]);
    expect(score).toBe(8);
  });

  it('reports moved=false when nothing changes', () => {
    const board: Board = [
      [2, 4, 8, 16],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const { moved } = moveBoard(board, 'left');
    expect(moved).toBe(false);
  });
});

describe('moveBoard – right', () => {
  it('merges two equal tiles to the right and scores correctly', () => {
    const board: Board = [
      [0, 0, 2, 2],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const { board: result, score, moved } = moveBoard(board, 'right');
    expect(result[0]).toEqual([0, 0, 0, 4]);
    expect(score).toBe(4);
    expect(moved).toBe(true);
  });

  it('prevents double-merge right: [0,2,2,2] right → [0,0,2,4]', () => {
    const board: Board = [
      [0, 2, 2, 2],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const { board: result, score } = moveBoard(board, 'right');
    expect(result[0]).toEqual([0, 0, 2, 4]);
    expect(score).toBe(4);
  });
});

describe('moveBoard – up', () => {
  it('merges equal tiles upward', () => {
    const board: Board = [
      [2, 0, 0, 0],
      [2, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const { board: result, score, moved } = moveBoard(board, 'up');
    expect(result[0][0]).toBe(4);
    expect(result[1][0]).toBe(0);
    expect(score).toBe(4);
    expect(moved).toBe(true);
  });
});

describe('moveBoard – down', () => {
  it('merges equal tiles downward', () => {
    const board: Board = [
      [2, 0, 0, 0],
      [2, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const { board: result, score, moved } = moveBoard(board, 'down');
    expect(result[3][0]).toBe(4);
    expect(result[2][0]).toBe(0);
    expect(score).toBe(4);
    expect(moved).toBe(true);
  });
});

describe('checkWin', () => {
  it('returns false when no 2048 tile exists', () => {
    const board = createEmptyBoard();
    expect(checkWin(board)).toBe(false);
  });

  it('returns true when a 2048 tile is present', () => {
    const board: Board = [
      [2048, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    expect(checkWin(board)).toBe(true);
  });

  it('detects 2048 anywhere on the board', () => {
    const board: Board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 2048],
    ];
    expect(checkWin(board)).toBe(true);
  });
});

describe('checkGameOver', () => {
  it('returns false when board has empty cells', () => {
    const board: Board = [
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, 2048, 2],
      [4, 8, 16, 0],
    ];
    expect(checkGameOver(board)).toBe(false);
  });

  it('returns false when board is full but merges are possible horizontally', () => {
    const board: Board = [
      [2, 2, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, 2048, 4],
      [4, 8, 16, 32],
    ];
    expect(checkGameOver(board)).toBe(false);
  });

  it('returns false when board is full but merges are possible vertically', () => {
    const board: Board = [
      [2, 4, 8, 16],
      [2, 64, 128, 256],
      [512, 1024, 2048, 4],
      [4, 8, 16, 32],
    ];
    expect(checkGameOver(board)).toBe(false);
  });

  it('returns true when board is full with no possible merges', () => {
    // Checkerboard-style alternating values — no adjacent equals
    const board: Board = [
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2],
    ];
    expect(checkGameOver(board)).toBe(true);
  });

  it('returns false on an empty board', () => {
    expect(checkGameOver(createEmptyBoard())).toBe(false);
  });
});

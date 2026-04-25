import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useGame } from './useGame';

// Stable board so tests don't depend on random tile placement
vi.mock('../utils/gameLogic', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../utils/gameLogic')>();
  return {
    ...actual,
    initBoard: () => [
      [2, 4, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    addRandomTile: (board: unknown) => board,
  };
});

describe('bomb milestone awards', () => {
  it('awards correct bombs when score crosses one or more 500pt bands', () => {
    const { state, move } = useGame();
    // Manually set score near threshold
    state.score = 496;
    // Simulate internal move gaining 8 points (crosses 500)
    // We test the milestone formula directly via move() triggering it
    // Since addRandomTile is mocked to no-op, simulate a merge by using
    // the composable's move() with a board that will merge
    state.board = [
      [256, 256, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    state.bombCount = 0;
    move('left'); // merges 256+256=512, score 496+512=1008, crosses 500 and 1000 → 2 bombs
    expect(state.bombCount).toBe(2);
  });

  it('awards 2 bombs when score crosses two 500pt bands in one move', () => {
    const { state, move } = useGame();
    state.score = 0;
    state.board = [
      [512, 512, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    state.bombCount = 0;
    move('left'); // gains 1024, crosses bands at 500 and 1000
    expect(state.bombCount).toBe(2);
  });

  it('does not double-award when score stays within same 500pt band', () => {
    const { state, move } = useGame();
    state.score = 100;
    state.board = [
      [2, 2, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    state.bombCount = 0;
    move('left'); // gains 4, score=104, stays in [0,500) band
    expect(state.bombCount).toBe(0);
  });

  it('starts with 0 bombs on new game', () => {
    const { state } = useGame();
    expect(state.bombCount).toBe(0);
  });

  it('resets bomb count to 0 on newGame', () => {
    const { state, newGame } = useGame();
    state.bombCount = 5;
    newGame();
    expect(state.bombCount).toBe(0);
  });
});

describe('toggleBombMode', () => {
  it('toggles bombMode on when bombs are available', () => {
    const { state, toggleBombMode } = useGame();
    state.bombCount = 1;
    toggleBombMode();
    expect(state.bombMode).toBe(true);
  });

  it('does nothing when bombCount is 0', () => {
    const { state, toggleBombMode } = useGame();
    state.bombCount = 0;
    toggleBombMode();
    expect(state.bombMode).toBe(false);
  });

  it('does nothing when game is over', () => {
    const { state, toggleBombMode } = useGame();
    state.bombCount = 3;
    state.isGameOver = true;
    toggleBombMode();
    expect(state.bombMode).toBe(false);
  });

  it('cancels bomb mode when toggled again', () => {
    const { state, toggleBombMode } = useGame();
    state.bombCount = 1;
    toggleBombMode();
    toggleBombMode();
    expect(state.bombMode).toBe(false);
  });
});

describe('useBomb', () => {
  beforeEach(() => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
  });

  it('removes the target tile and decrements bombCount on confirm', () => {
    const { state, useBomb } = useGame();
    state.bombCount = 2;
    state.bombMode = true;
    state.board[0][0] = 64;
    useBomb(0, 0);
    expect(state.board[0][0]).toBe(0);
    expect(state.bombCount).toBe(1);
    expect(state.bombMode).toBe(false);
  });

  it('does nothing when bombCount is 0', () => {
    const { state, useBomb } = useGame();
    state.bombCount = 0;
    state.bombMode = true;
    state.board[0][0] = 64;
    useBomb(0, 0);
    expect(state.board[0][0]).toBe(64);
  });

  it('does nothing when not in bomb mode', () => {
    const { state, useBomb } = useGame();
    state.bombCount = 2;
    state.bombMode = false;
    state.board[0][0] = 64;
    useBomb(0, 0);
    expect(state.board[0][0]).toBe(64);
  });

  it('does not remove an empty tile', () => {
    const { state, useBomb } = useGame();
    state.bombCount = 2;
    state.bombMode = true;
    state.board[2][2] = 0;
    useBomb(2, 2);
    expect(state.bombCount).toBe(2);
  });

  it('does nothing when user cancels confirmation', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    const { state, useBomb } = useGame();
    state.bombCount = 2;
    state.bombMode = true;
    state.board[0][0] = 128;
    useBomb(0, 0);
    expect(state.board[0][0]).toBe(128);
    expect(state.bombCount).toBe(2);
    // bomb mode stays active so player can pick a different tile
    expect(state.bombMode).toBe(true);
  });

  it('does nothing when game is over', () => {
    const { state, useBomb } = useGame();
    state.bombCount = 2;
    state.bombMode = true;
    state.isGameOver = true;
    state.board[0][0] = 64;
    useBomb(0, 0);
    expect(state.board[0][0]).toBe(64);
  });
});

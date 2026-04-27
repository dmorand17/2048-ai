import { reactive } from 'vue';
import type { Direction, GameState } from '../types/game';
import { addRandomTile, checkGameOver, checkWin, initBoard, moveBoard, removeTile } from '../utils/gameLogic';

const BEST_SCORE_KEY = '2048-best-score';

function loadBestScore(): number {
  try {
    const stored = localStorage.getItem(BEST_SCORE_KEY);
    return stored ? parseInt(stored, 10) : 0;
  } catch {
    return 0;
  }
}

function saveBestScore(score: number): void {
  try {
    localStorage.setItem(BEST_SCORE_KEY, String(score));
  } catch {
    // Ignore storage errors
  }
}

export function useGame() {
  const state = reactive<GameState>({
    board: initBoard(),
    score: 0,
    bestScore: loadBestScore(),
    isGameOver: false,
    hasWon: false,
    bombCount: 0,
    bombMode: false,
  });

  function newGame(): void {
    state.board = initBoard();
    state.score = 0;
    state.isGameOver = false;
    state.hasWon = false;
    state.bombCount = 0;
    state.bombMode = false;
  }

  function move(direction: Direction): void {
    if (state.isGameOver) return;

    const { board: newBoard, score: gained, moved } = moveBoard(state.board, direction);

    if (!moved) return;

    state.score += gained;

    if (state.score > state.bestScore) {
      state.bestScore = state.score;
      saveBestScore(state.bestScore);
    }

    const oldMilestone = Math.floor((state.score - gained) / 500);
    const newMilestone = Math.floor(state.score / 500);
    state.bombCount += newMilestone - oldMilestone;

    // Add a random tile after a successful move
    state.board = addRandomTile(newBoard);

    // Check win (only trigger once)
    if (!state.hasWon && checkWin(state.board)) {
      state.hasWon = true;
    }

    // Check game over
    if (checkGameOver(state.board)) {
      state.isGameOver = true;
    }
  }

  function handleKeydown(event: KeyboardEvent): void {
    const keyMap: Record<string, Direction> = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right',
      w: 'up',
      W: 'up',
      s: 'down',
      S: 'down',
      a: 'left',
      A: 'left',
      d: 'right',
      D: 'right',
    };

    const direction = keyMap[event.key];
    if (direction) {
      event.preventDefault();
      move(direction);
    }
  }

  function handleSwipe(startX: number, startY: number, endX: number, endY: number): void {
    const dx = endX - startX;
    const dy = endY - startY;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    const minSwipeDistance = 30;

    if (Math.max(absDx, absDy) < minSwipeDistance) return;

    if (absDx > absDy) {
      move(dx > 0 ? 'right' : 'left');
    } else {
      move(dy > 0 ? 'down' : 'up');
    }
  }

  function toggleBombMode(): void {
    if (state.isGameOver || state.hasWon || state.bombCount === 0) return;
    state.bombMode = !state.bombMode;
  }

  function useBomb(row: number, col: number): void {
    if (!state.bombMode || state.bombCount === 0 || state.isGameOver || state.hasWon) return;
    if (state.board[row][col] === 0) return;

    let confirmed = false;
    try {
      confirmed = window.confirm(`Detonate bomb on tile ${state.board[row][col]}?`);
    } catch {
      return;
    }
    if (!confirmed) return;

    state.board = removeTile(state.board, row, col);
    state.bombCount -= 1;
    state.bombMode = false;

    if (checkGameOver(state.board)) {
      state.isGameOver = true;
    }
  }

  return { state, move, newGame, handleKeydown, handleSwipe, toggleBombMode, useBomb };
}

/**
 * GameContext — Central state management for Dare or Drop
 *
 * Manages the entire game lifecycle:
 *  - Sequence generation & playback
 *  - Player input validation
 *  - Score / level tracking
 *  - Screen navigation (home → game → gameOver)
 */

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';
import { TIMING, GAME_PADS } from '../constants/theme';

// ─── Types ──────────────────────────────────────────────────────────
export type Screen = 'home' | 'game' | 'gameOver';

export interface GameState {
  screen: Screen;
  sequence: number[];
  playerInput: number[];
  level: number;
  score: number;
  highScore: number;
  isShowingSequence: boolean;
  activePad: number | null;
  canPlayerInput: boolean;
  lastResult: 'none' | 'correct' | 'wrong';
}

type GameAction =
  | { type: 'START_GAME' }
  | { type: 'SET_SCREEN'; screen: Screen }
  | { type: 'EXTEND_SEQUENCE'; padId: number }
  | { type: 'START_SHOWING_SEQUENCE' }
  | { type: 'SET_ACTIVE_PAD'; padId: number | null }
  | { type: 'STOP_SHOWING_SEQUENCE' }
  | { type: 'PLAYER_INPUT'; padId: number }
  | { type: 'PLAYER_CORRECT_STEP' }
  | { type: 'PLAYER_COMPLETED_LEVEL' }
  | { type: 'PLAYER_FAILED' }
  | { type: 'RESET' };

interface GameContextType {
  state: GameState;
  startGame: () => void;
  handlePlayerInput: (padId: number) => void;
  goHome: () => void;
}

// ─── Initial State ──────────────────────────────────────────────────
const initialState: GameState = {
  screen: 'home',
  sequence: [],
  playerInput: [],
  level: 1,
  score: 0,
  highScore: 0,
  isShowingSequence: false,
  activePad: null,
  canPlayerInput: false,
  lastResult: 'none',
};

// ─── Reducer ────────────────────────────────────────────────────────
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...state,
        screen: 'game',
        sequence: [],
        playerInput: [],
        level: 1,
        score: 0,
        isShowingSequence: false,
        activePad: null,
        canPlayerInput: false,
        lastResult: 'none',
      };

    case 'SET_SCREEN':
      return { ...state, screen: action.screen };

    case 'EXTEND_SEQUENCE':
      return {
        ...state,
        sequence: [...state.sequence, action.padId],
        playerInput: [],
      };

    case 'START_SHOWING_SEQUENCE':
      return {
        ...state,
        isShowingSequence: true,
        canPlayerInput: false,
        activePad: null,
      };

    case 'SET_ACTIVE_PAD':
      return { ...state, activePad: action.padId };

    case 'STOP_SHOWING_SEQUENCE':
      return {
        ...state,
        isShowingSequence: false,
        canPlayerInput: true,
        activePad: null,
      };

    case 'PLAYER_INPUT':
      return {
        ...state,
        playerInput: [...state.playerInput, action.padId],
      };

    case 'PLAYER_CORRECT_STEP':
      return {
        ...state,
        score: state.score + 10,
        lastResult: 'correct',
      };

    case 'PLAYER_COMPLETED_LEVEL':
      return {
        ...state,
        level: state.level + 1,
        score: state.score + 50, // Bonus for completing level
        lastResult: 'correct',
        canPlayerInput: false,
      };

    case 'PLAYER_FAILED':
      return {
        ...state,
        lastResult: 'wrong',
        canPlayerInput: false,
        highScore: Math.max(state.highScore, state.score),
      };

    case 'RESET':
      return {
        ...initialState,
        highScore: state.highScore,
      };

    default:
      return state;
  }
}

// ─── Context ────────────────────────────────────────────────────────
const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  /** Clear any pending timeouts (used when resetting) */
  const clearTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  /** Generate a random pad id */
  const randomPad = () => Math.floor(Math.random() * GAME_PADS.length);

  /** Play the current sequence visually (flash each pad) */
  const playSequence = useCallback(
    (sequence: number[]) => {
      dispatch({ type: 'START_SHOWING_SEQUENCE' });

      sequence.forEach((padId, index) => {
        // Turn pad ON
        const onTimeout = setTimeout(() => {
          dispatch({ type: 'SET_ACTIVE_PAD', padId });
        }, index * (TIMING.padFlashDuration + TIMING.padGapDuration));

        // Turn pad OFF
        const offTimeout = setTimeout(() => {
          dispatch({ type: 'SET_ACTIVE_PAD', padId: null });
        }, index * (TIMING.padFlashDuration + TIMING.padGapDuration) + TIMING.padFlashDuration);

        timeoutsRef.current.push(onTimeout, offTimeout);
      });

      // Allow player input after sequence finishes
      const finishTimeout = setTimeout(() => {
        dispatch({ type: 'STOP_SHOWING_SEQUENCE' });
      }, sequence.length * (TIMING.padFlashDuration + TIMING.padGapDuration) + 200);

      timeoutsRef.current.push(finishTimeout);
    },
    []
  );

  /** Start a new round — extend the sequence by one, then play it */
  const startNextRound = useCallback(
    (currentSequence: number[]) => {
      const newPad = randomPad();
      const newSequence = [...currentSequence, newPad];

      dispatch({ type: 'EXTEND_SEQUENCE', padId: newPad });

      const delay = setTimeout(() => {
        playSequence(newSequence);
      }, TIMING.sequenceStartDelay);

      timeoutsRef.current.push(delay);
    },
    [playSequence]
  );

  /** Kick off the game */
  const startGame = useCallback(() => {
    clearTimeouts();
    dispatch({ type: 'START_GAME' });

    // Start the first round after a brief pause
    const delay = setTimeout(() => {
      startNextRound([]);
    }, TIMING.sequenceStartDelay);

    timeoutsRef.current.push(delay);
  }, [clearTimeouts, startNextRound]);

  /** Handle a player tapping a pad */
  const handlePlayerInput = useCallback(
    (padId: number) => {
      if (!state.canPlayerInput || state.isShowingSequence) return;

      const currentStep = state.playerInput.length;
      dispatch({ type: 'PLAYER_INPUT', padId });

      // Flash the pressed pad briefly
      dispatch({ type: 'SET_ACTIVE_PAD', padId });
      const flashOff = setTimeout(() => {
        dispatch({ type: 'SET_ACTIVE_PAD', padId: null });
      }, 200);
      timeoutsRef.current.push(flashOff);

      // Check if the input matches the sequence
      if (padId !== state.sequence[currentStep]) {
        // ❌ Wrong — game over!
        dispatch({ type: 'PLAYER_FAILED' });
        const goOver = setTimeout(() => {
          dispatch({ type: 'SET_SCREEN', screen: 'gameOver' });
        }, TIMING.gameOverDelay);
        timeoutsRef.current.push(goOver);
        return;
      }

      // ✅ Correct step
      dispatch({ type: 'PLAYER_CORRECT_STEP' });

      // Check if the player has completed the full sequence
      if (currentStep + 1 === state.sequence.length) {
        dispatch({ type: 'PLAYER_COMPLETED_LEVEL' });

        // Start the next round
        const nextRound = setTimeout(() => {
          startNextRound(state.sequence);
        }, TIMING.levelUpDelay);
        timeoutsRef.current.push(nextRound);
      }
    },
    [state.canPlayerInput, state.isShowingSequence, state.playerInput.length, state.sequence, startNextRound]
  );

  /** Return to home screen */
  const goHome = useCallback(() => {
    clearTimeouts();
    dispatch({ type: 'RESET' });
  }, [clearTimeouts]);

  return (
    <GameContext.Provider value={{ state, startGame, handlePlayerInput, goHome }}>
      {children}
    </GameContext.Provider>
  );
}

/** Custom hook to consume game context */
export function useGame(): GameContextType {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

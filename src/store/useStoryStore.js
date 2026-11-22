import { create } from "zustand";
import storyData from "../utils/data";

const COUNTDOWN_SECONDS = 15;
const DEFAULT_TOTAL_VOTERS = 100;
const INITIAL_COLUMN_SHARE = 1 / 3.1;
const VOTE_KEYS = ["red", "green", "blue"];

export const VOTE_COLOR_MAP = {
  red: "var(--color-red)",
  green: "var(--color-green)",
  blue: "var(--color-blue)",
};

const createInitialRowStates = () =>
  storyData.map((_, index) => (index === 0 ? "active" : "incomplete"));

const createInitialSelectedOptions = () => storyData.map(() => 0);

const createInitialVotes = (totalVoters = DEFAULT_TOTAL_VOTERS) => {
  const perColumn = totalVoters * INITIAL_COLUMN_SHARE;
  return {
    red: perColumn,
    green: perColumn,
    blue: perColumn,
    unassigned: totalVoters - perColumn * 3,
  };
};

const getNextRowStates = (rowStates, activeIdx) =>
  rowStates.map((status, index) => {
    if (index === activeIdx) return "filled-in";
    if (index === activeIdx + 1) return "active";
    return status;
  });

const pickRandomMatchingOptionIndex = (options, color) => {
  const matchingIndices = [];
  options.forEach((option, index) => {
    if (option.color === color) matchingIndices.push(index);
  });

  if (matchingIndices.length === 0) return 0;

  return matchingIndices[Math.floor(Math.random() * matchingIndices.length)];
};

const createRowColumnOptionIndices = (rowIndex) => {
  const options = storyData[rowIndex]?.options ?? [];
  return {
    red: pickRandomMatchingOptionIndex(options, VOTE_COLOR_MAP.red),
    green: pickRandomMatchingOptionIndex(options, VOTE_COLOR_MAP.green),
    blue: pickRandomMatchingOptionIndex(options, VOTE_COLOR_MAP.blue),
  };
};

const getLeadingColorKeys = (votes) => {
  const maxVotes = Math.max(votes.red, votes.green, votes.blue);
  return VOTE_KEYS.filter((key) => Math.abs(votes[key] - maxVotes) < 1e-6);
};

let countdownTimerId = null;

const stopCountdownTimer = () => {
  if (countdownTimerId) {
    clearInterval(countdownTimerId);
    countdownTimerId = null;
  }
};

export const useStoryStore = create((set, get) => ({
  rowStates: createInitialRowStates(),
  selectedOptions: createInitialSelectedOptions(),
  columnOptionIndices: createRowColumnOptionIndices(0),
  countdown: COUNTDOWN_SECONDS,
  hoveredColor: null,
  isCountingDown: false,
  totalVoters: DEFAULT_TOTAL_VOTERS,
  votes: createInitialVotes(DEFAULT_TOTAL_VOTERS),

  setTotalVoters: (newTotal) =>
    set((state) => {
      const clampedTotal = Math.max(5, Math.round(newTotal));
      const ratio =
        state.totalVoters > 0 ? clampedTotal / state.totalVoters : 1;
      return {
        totalVoters: clampedTotal,
        votes: {
          red: state.votes.red * ratio,
          green: state.votes.green * ratio,
          blue: state.votes.blue * ratio,
          unassigned: state.votes.unassigned * ratio,
        },
      };
    }),

  castVote: (colorKey) => {
    const state = get();
    const activeIdx = state.rowStates.indexOf("active");
    if (activeIdx === -1 || !VOTE_COLOR_MAP[colorKey]) return;

    const currentVal = state.votes[colorKey];
    const nextVal = Math.min(state.totalVoters, currentVal + 1);
    const remainingBefore = state.totalVoters - currentVal;
    const remainingAfter = state.totalVoters - nextVal;
    const scale = remainingBefore > 0 ? remainingAfter / remainingBefore : 0;

    const nextVotes = {
      red: colorKey === "red" ? nextVal : state.votes.red * scale,
      green: colorKey === "green" ? nextVal : state.votes.green * scale,
      blue: colorKey === "blue" ? nextVal : state.votes.blue * scale,
      unassigned: state.votes.unassigned * scale,
    };

    const leaders = getLeadingColorKeys(nextVotes);
    const leadingKey = leaders.includes(colorKey) ? colorKey : leaders[0];

    set({
      votes: nextVotes,
      hoveredColor: VOTE_COLOR_MAP[leadingKey],
    });

    if (!state.isCountingDown) {
      stopCountdownTimer();
      set({
        countdown: COUNTDOWN_SECONDS,
        isCountingDown: true,
      });

      countdownTimerId = setInterval(() => {
        const current = get();
        if (current.countdown > 1) {
          set({ countdown: current.countdown - 1 });
        } else {
          stopCountdownTimer();
          const finalLeaders = getLeadingColorKeys(current.votes);
          const winnerKey =
            finalLeaders[Math.floor(Math.random() * finalLeaders.length)];
          get().voteColor(VOTE_COLOR_MAP[winnerKey]);
        }
      }, 1000);
    }
  },

  voteColor: (color) => {
    stopCountdownTimer();
    set((state) => {
      const activeIdx = state.rowStates.indexOf("active");
      if (activeIdx === -1) {
        return {
          countdown: COUNTDOWN_SECONDS,
          hoveredColor: null,
          isCountingDown: false,
          votes: createInitialVotes(state.totalVoters),
        };
      }

      const options = storyData[activeIdx]?.options ?? [];
      const matchingKey = VOTE_KEYS.find((k) => VOTE_COLOR_MAP[k] === color);
      const chosenOptionIndex = matchingKey
        ? state.columnOptionIndices[matchingKey]
        : pickRandomMatchingOptionIndex(options, color);
      const nextRowStates = getNextRowStates(state.rowStates, activeIdx);
      const nextActiveIdx = nextRowStates.indexOf("active");

      return {
        rowStates: nextRowStates,
        selectedOptions: state.selectedOptions.map((selected, index) =>
          index === activeIdx ? chosenOptionIndex : selected,
        ),
        columnOptionIndices:
          nextActiveIdx !== -1
            ? createRowColumnOptionIndices(nextActiveIdx)
            : state.columnOptionIndices,
        countdown: COUNTDOWN_SECONDS,
        hoveredColor: null,
        isCountingDown: false,
        votes: createInitialVotes(state.totalVoters),
      };
    });
  },

  advanceRow: () => {
    stopCountdownTimer();
    set((state) => {
      const activeIdx = state.rowStates.indexOf("active");
      if (activeIdx === -1) {
        return {
          rowStates: createInitialRowStates(),
          selectedOptions: createInitialSelectedOptions(),
          columnOptionIndices: createRowColumnOptionIndices(0),
          countdown: COUNTDOWN_SECONDS,
          hoveredColor: null,
          isCountingDown: false,
          votes: createInitialVotes(state.totalVoters),
        };
      }

      const nextRowStates = getNextRowStates(state.rowStates, activeIdx);
      const nextActiveIdx = nextRowStates.indexOf("active");

      return {
        rowStates: nextRowStates,
        columnOptionIndices:
          nextActiveIdx !== -1
            ? createRowColumnOptionIndices(nextActiveIdx)
            : state.columnOptionIndices,
        countdown: COUNTDOWN_SECONDS,
        hoveredColor: null,
        isCountingDown: false,
        votes: createInitialVotes(state.totalVoters),
      };
    });
  },

  resetRows: () => {
    stopCountdownTimer();
    set((state) => ({
      rowStates: createInitialRowStates(),
      selectedOptions: createInitialSelectedOptions(),
      columnOptionIndices: createRowColumnOptionIndices(0),
      countdown: COUNTDOWN_SECONDS,
      hoveredColor: null,
      isCountingDown: false,
      votes: createInitialVotes(state.totalVoters),
    }));
  },
}));

export default useStoryStore;

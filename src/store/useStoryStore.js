import { create } from "zustand";
import storyData from "../utils/data";

const COUNTDOWN_SECONDS = 15;

const createInitialRowStates = () =>
  storyData.map((_, index) => (index === 0 ? "active" : "incomplete"));

const createInitialSelectedOptions = () => storyData.map(() => 0);

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
  countdown: COUNTDOWN_SECONDS,
  hoveredColor: null,
  isCountingDown: false,

  hoverColor: (color) => {
    const state = get();
    const activeIdx = state.rowStates.indexOf("active");
    if (activeIdx === -1) return;

    if (state.isCountingDown) {
      set({ hoveredColor: color });
      return;
    }

    stopCountdownTimer();
    set({
      hoveredColor: color,
      countdown: COUNTDOWN_SECONDS,
      isCountingDown: true,
    });

    countdownTimerId = setInterval(() => {
      const current = get();
      if (current.countdown > 1) {
        set({ countdown: current.countdown - 1 });
      } else {
        stopCountdownTimer();
        const targetColor = current.hoveredColor ?? color;
        get().voteColor(targetColor);
      }
    }, 1000);
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
        };
      }

      const options = storyData[activeIdx]?.options ?? [];
      const chosenOptionIndex = pickRandomMatchingOptionIndex(options, color);

      return {
        rowStates: getNextRowStates(state.rowStates, activeIdx),
        selectedOptions: state.selectedOptions.map((selected, index) =>
          index === activeIdx ? chosenOptionIndex : selected,
        ),
        countdown: COUNTDOWN_SECONDS,
        hoveredColor: null,
        isCountingDown: false,
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
          countdown: COUNTDOWN_SECONDS,
          hoveredColor: null,
          isCountingDown: false,
        };
      }

      return {
        rowStates: getNextRowStates(state.rowStates, activeIdx),
        countdown: COUNTDOWN_SECONDS,
        hoveredColor: null,
        isCountingDown: false,
      };
    });
  },

  resetRows: () => {
    stopCountdownTimer();
    set({
      rowStates: createInitialRowStates(),
      selectedOptions: createInitialSelectedOptions(),
      countdown: COUNTDOWN_SECONDS,
      hoveredColor: null,
      isCountingDown: false,
    });
  },
}));

export default useStoryStore;

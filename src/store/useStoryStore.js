import { create } from "zustand";
import storyData from "../utils/data";

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

export const useStoryStore = create((set) => ({
  rowStates: createInitialRowStates(),
  selectedOptions: createInitialSelectedOptions(),
  voteColor: (color) =>
    set((state) => {
      const activeIdx = state.rowStates.indexOf("active");
      if (activeIdx === -1) return state;

      const options = storyData[activeIdx]?.options ?? [];
      const chosenOptionIndex = pickRandomMatchingOptionIndex(options, color);

      return {
        rowStates: getNextRowStates(state.rowStates, activeIdx),
        selectedOptions: state.selectedOptions.map((selected, index) =>
          index === activeIdx ? chosenOptionIndex : selected,
        ),
      };
    }),
  advanceRow: () =>
    set((state) => {
      const activeIdx = state.rowStates.indexOf("active");
      if (activeIdx === -1) {
        return {
          rowStates: createInitialRowStates(),
          selectedOptions: createInitialSelectedOptions(),
        };
      }

      return {
        rowStates: getNextRowStates(state.rowStates, activeIdx),
      };
    }),
  resetRows: () =>
    set({
      rowStates: createInitialRowStates(),
      selectedOptions: createInitialSelectedOptions(),
    }),
}));

export default useStoryStore;

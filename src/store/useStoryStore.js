import { create } from "zustand";
import storyData from "../utils/data";

const createInitialRowStates = () =>
  storyData.map((_, index) => (index === 0 ? "active" : "incomplete"));

export const useStoryStore = create((set) => ({
  rowStates: createInitialRowStates(),
  advanceRow: () =>
    set((state) => {
      const activeIdx = state.rowStates.indexOf("active");
      if (activeIdx === -1) {
        return { rowStates: createInitialRowStates() };
      }

      return {
        rowStates: state.rowStates.map((status, index) => {
          if (index === activeIdx) return "filled-in";
          if (index === activeIdx + 1) return "active";
          return status;
        }),
      };
    }),
  resetRows: () => set({ rowStates: createInitialRowStates() }),
}));

export default useStoryStore;

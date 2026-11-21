import Dragon from "../Components/svgs/Dragon";
import Forest from "../Components/svgs/Forest";
import FallingMoon from "../Components/svgs/FallingMoon";
import FlyingBike from "../Components/svgs/FlyingBike";
import Stars from "../Components/svgs/Stars";

export const storyData = [
  {
    type: "who",
    shape: "circle",
    icon: Dragon,
    chosenIconSize: "h-14",
    slotText: "een draak",
    label: "draak",
    text: "Er was eens",
  },
  {
    type: "where",
    shape: "square",
    icon: Forest,
    chosenIconSize: "h-13",
    slotText: "een donker bos.",
    label: "bos",
    text: "In",
  },
  {
    type: "what",
    shape: "diamond",
    icon: FallingMoon,
    chosenIconSize: "h-17",
    slotText: "viel de man uit de lucht.",
    label: "vallende maan",
    text: "Op een dag,",
  },
  {
    type: "with",
    shape: "hexagon",
    icon: FlyingBike,
    chosenIconSize: "h-16.5 mt-1.5",
    slotText: "een vliegende fiets",
    label: "Vliegende Fiets",
    text: "Gelukkig, was er",
  },
  {
    type: "ending",
    shape: "long-rectangle",
    icon: Stars,
    chosenIconSize: "h-17",
    slotText: "en werd het feest tot diep in de nacht.",
    label: "Feest",
    text: "En toen kwam jij,",
  },
];

export default storyData;

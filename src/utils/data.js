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

export const badgeShapes = [
  {
    shape: "circle",
    width: "w-25",
    aspectClass: "aspect-square",
    viewBox: "0 0 952 952",
    clip: { tag: "circle", props: { cx: "0.5", cy: "0.5", r: "0.4937" } },
    stroke: {
      tag: "circle",
      props: { cx: "475.582", cy: "475.501", r: "470" },
    },
  },
  {
    shape: "square",
    width: "w-22",
    aspectClass: "aspect-square",
    viewBox: "0 0 956 955",
    clip: {
      tag: "rect",
      props: {
        x: "0.00802",
        y: "0.00794",
        width: "0.98326",
        height: "0.98429",
        rx: "0.11715",
        ry: "0.11728",
      },
    },
    stroke: {
      tag: "rect",
      props: {
        x: "7.67188",
        y: "7.58696",
        width: "940",
        height: "940",
        rx: "112",
      },
    },
  },
  {
    shape: "diamond",
    width: "w-30",
    aspectClass: "aspect-square",
    viewBox: "0 0 1086 1081",
    clip: {
      tag: "path",
      props: {
        d: "M0.57016 0.07325L0.92155 0.42626A0.10313 0.10361 0 0 1 0.92155 0.57279L0.57016 0.92580A0.10313 0.10361 0 0 1 0.42431 0.92580L0.07292 0.57279A0.10313 0.10361 0 0 1 0.07292 0.42626L0.42431 0.07325A0.10313 0.10361 0 0 1 0.57016 0.07325Z",
      },
    },
    stroke: {
      tag: "rect",
      props: {
        x: "158.162",
        y: "158.151",
        width: "763.675",
        height: "763.675",
        rx: "112",
        transform: "rotate(45 540 539.989)",
      },
    },
  },
  {
    shape: "hexagon",
    width: "w-28",
    aspectClass: "aspect-[1086/951]",
    viewBox: "0 0 1086 951",
    clip: {
      tag: "path",
      props: {
        d: "M0.95727 0.42577A0.12891 0.14721 0 0 1 0.95727 0.57299L0.78306 0.91755A0.12891 0.14721 0 0 1 0.67142 0.99115L0.32306 0.99115A0.12891 0.14721 0 0 1 0.21142 0.91755L0.03721 0.57299A0.12891 0.14721 0 0 1 0.03722 0.42577L0.21141 0.08126A0.12891 0.14721 0 0 1 0.32306 0.00765L0.67142 0.00765A0.12891 0.14721 0 0 1 0.78307 0.08126Z",
      },
    },
    stroke: {
      tag: "path",
      props: {
        d: "M1039.592 404.912A140.000 140.000 0 0 1 1039.595 544.910L850.408 872.587A140.000 140.000 0 0 1 729.164 942.587L350.841 942.587A140.000 140.000 0 0 1 229.598 872.587L40.414 544.910A140.000 140.000 0 0 1 40.417 404.912L229.595 77.276A140.000 140.000 0 0 1 350.841 7.277L729.164 7.277A140.000 140.000 0 0 1 850.411 77.275Z",
      },
    },
  },
  {
    shape: "long-rectangle",
    width: "w-32",
    aspectClass: "aspect-[1096/816]",
    viewBox: "0 0 1096 816",
    clip: {
      tag: "rect",
      props: {
        x: "0.00700",
        y: "0.00939",
        width: "0.98540",
        height: "0.98039",
        rx: "0.10219",
        ry: "0.13725",
      },
    },
    stroke: {
      tag: "rect",
      props: {
        x: "7.67188",
        y: "7.66504",
        width: "1080",
        height: "800",
        rx: "112",
      },
    },
  },
];

export default storyData;

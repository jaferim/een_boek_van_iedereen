import Dragon from "../Components/svgs/greyed/circle/red/Dragon";
import Robot from "../Components/svgs/greyed/circle/red/Robot";
import Knight from "../Components/svgs/greyed/circle/blue/Knight";
import Witch from "../Components/svgs/greyed/circle/blue/Witch";
import Pirate from "../Components/svgs/greyed/circle/green/Pirate";
import Rabbit from "../Components/svgs/greyed/circle/green/Rabbit";

import Forest from "../Components/svgs/greyed/square/green/Forest";
import Bookshelf from "../Components/svgs/greyed/square/green/Bookshelf";
import Moon from "../Components/svgs/greyed/square/blue/Moon";
import Ocean from "../Components/svgs/greyed/square/blue/Ocean";
import Castle from "../Components/svgs/greyed/square/red/Castle";
import City from "../Components/svgs/greyed/square/red/City";

import FallingMoon from "../Components/svgs/greyed/diamond/blue/FallingMoon";
import Snowflake from "../Components/svgs/greyed/diamond/blue/Snowflake";
import RainingCandy from "../Components/svgs/greyed/diamond/green/RainingCandy";
import UnknownRoad from "../Components/svgs/greyed/diamond/green/UnknownRoad";
import LettersGone from "../Components/svgs/greyed/diamond/red/LettersGone";
import Music from "../Components/svgs/greyed/diamond/red/Music";

import FlyingBike from "../Components/svgs/greyed/hexagon/red/FlyingBike";
import Lantern from "../Components/svgs/greyed/hexagon/red/Lantern";
import SpellBook from "../Components/svgs/greyed/hexagon/blue/SpellBook";
import Umbrella from "../Components/svgs/greyed/hexagon/blue/Umbrella";
import Key from "../Components/svgs/greyed/hexagon/green/Key";
import Map from "../Components/svgs/greyed/hexagon/green/Map";

import Stars from "../Components/svgs/greyed/long-rect/blue/Stars";
import Sleep from "../Components/svgs/greyed/long-rect/blue/Sleep";
import Home from "../Components/svgs/greyed/long-rect/green/Home";
import QuestionMarks from "../Components/svgs/greyed/long-rect/green/QuestionMarks";
import Hearts from "../Components/svgs/greyed/long-rect/red/Hearts";
import Pen from "../Components/svgs/greyed/long-rect/red/Pen";

import DragonOriginal from "../Components/svgs/original/circle/red/Dragon";
import RobotOriginal from "../Components/svgs/original/circle/red/Robot";
import KnightOriginal from "../Components/svgs/original/circle/blue/Knight";
import WitchOriginal from "../Components/svgs/original/circle/blue/Witch";
import PirateOriginal from "../Components/svgs/original/circle/green/Pirate";
import RabbitOriginal from "../Components/svgs/original/circle/green/Rabbit";

import ForestOriginal from "../Components/svgs/original/square/green/Forest";
import BookshelfOriginal from "../Components/svgs/original/square/green/Bookshelf";
import MoonOriginal from "../Components/svgs/original/square/blue/Moon";
import OceanOriginal from "../Components/svgs/original/square/blue/Ocean";
import CastleOriginal from "../Components/svgs/original/square/red/Castle";
import CityOriginal from "../Components/svgs/original/square/red/City";

import FallingMoonOriginal from "../Components/svgs/original/diamond/blue/FallingMoon";
import SnowflakeOriginal from "../Components/svgs/original/diamond/blue/Snowflake";
import RainingCandyOriginal from "../Components/svgs/original/diamond/green/RainingCandy";
import UnknownRoadOriginal from "../Components/svgs/original/diamond/green/UnknownRoad";
import LettersGoneOriginal from "../Components/svgs/original/diamond/red/LettersGone";
import MusicOriginal from "../Components/svgs/original/diamond/red/Music";

import FlyingBikeOriginal from "../Components/svgs/original/hexagon/red/FlyingBike";
import LanternOriginal from "../Components/svgs/original/hexagon/red/Lantern";
import SpellBookOriginal from "../Components/svgs/original/hexagon/blue/SpellBook";
import UmbrellaOriginal from "../Components/svgs/original/hexagon/blue/Umbrella";
import KeyOriginal from "../Components/svgs/original/hexagon/green/Key";
import MapOriginal from "../Components/svgs/original/hexagon/green/Map";

import StarsOriginal from "../Components/svgs/original/long-rect/blue/Stars";
import SleepOriginal from "../Components/svgs/original/long-rect/blue/Sleep";
import HomeOriginal from "../Components/svgs/original/long-rect/green/Home";
import QuestionMarksOriginal from "../Components/svgs/original/long-rect/green/QuestionMarks";
import HeartsOriginal from "../Components/svgs/original/long-rect/red/Hearts";
import PenOriginal from "../Components/svgs/original/long-rect/red/Pen";

export const storyData = [
  {
    type: "who",
    shape: "circle",
    chosenIconSize: "h-14",
    options: [
      {
        icon: Dragon,
        progressIcon: DragonOriginal,
        color: "var(--color-red)",
        slotText: "een draak",
        label: "draak",
        text: "Er was eens",
      },
      {
        icon: Robot,
        progressIcon: RobotOriginal,
        color: "var(--color-red)",
        slotText: "een robot",
        label: "robot",
        text: "Er was eens",
      },
      {
        icon: Knight,
        progressIcon: KnightOriginal,
        color: "var(--color-blue)",
        slotText: "een ridder",
        label: "ridder",
        text: "Er was eens",
      },
      {
        icon: Witch,
        progressIcon: WitchOriginal,
        color: "var(--color-blue)",
        slotText: "een heks",
        label: "heks",
        text: "Er was eens",
      },
      {
        icon: Pirate,
        progressIcon: PirateOriginal,
        color: "var(--color-green)",
        slotText: "een piraat",
        label: "piraat",
        text: "Er was eens",
      },
      {
        icon: Rabbit,
        progressIcon: RabbitOriginal,
        color: "var(--color-green)",
        slotText: "een konijn",
        label: "konijn",
        text: "Er was eens",
      },
    ],
  },
  {
    type: "where",
    shape: "square",
    chosenIconSize: "h-13",
    options: [
      {
        icon: Forest,
        progressIcon: ForestOriginal,
        color: "var(--color-green)",
        slotText: "een donker bos.",
        label: "bos",
        text: "In",
      },
      {
        icon: Bookshelf,
        progressIcon: BookshelfOriginal,
        color: "var(--color-green)",
        slotText: "een oude bibliotheek.",
        label: "boekenkast",
        text: "In",
      },
      {
        icon: Moon,
        progressIcon: MoonOriginal,
        color: "var(--color-blue)",
        slotText: "op de maan.",
        label: "maan",
        text: "Ver weg",
      },
      {
        icon: Ocean,
        progressIcon: OceanOriginal,
        color: "var(--color-blue)",
        slotText: "een diepe oceaan.",
        label: "oceaan",
        text: "In",
      },
      {
        icon: Castle,
        progressIcon: CastleOriginal,
        color: "var(--color-red)",
        slotText: "een groot kasteel.",
        label: "kasteel",
        text: "In",
      },
      {
        icon: City,
        progressIcon: CityOriginal,
        color: "var(--color-red)",
        slotText: "een drukke stad.",
        label: "stad",
        text: "In",
      },
    ],
  },
  {
    type: "what",
    shape: "diamond",
    chosenIconSize: "h-17",
    options: [
      {
        icon: FallingMoon,
        progressIcon: FallingMoonOriginal,
        color: "var(--color-blue)",
        slotText: "viel de man uit de lucht.",
        label: "vallende maan",
        text: "Op een dag,",
      },
      {
        icon: Snowflake,
        progressIcon: SnowflakeOriginal,
        color: "var(--color-blue)",
        slotText: "begon het plots te sneeuwen.",
        label: "sneeuwvlok",
        text: "Op een dag,",
      },
      {
        icon: RainingCandy,
        progressIcon: RainingCandyOriginal,
        color: "var(--color-green)",
        slotText: "regende het snoepjes.",
        label: "snoepregen",
        text: "Op een dag,",
      },
      {
        icon: UnknownRoad,
        progressIcon: UnknownRoadOriginal,
        color: "var(--color-green)",
        slotText: "verscheen een geheim pad.",
        label: "onbekend pad",
        text: "Op een dag,",
      },
      {
        icon: LettersGone,
        progressIcon: LettersGoneOriginal,
        color: "var(--color-red)",
        slotText: "waren alle letters verdwenen.",
        label: "letters weg",
        text: "Op een dag,",
      },
      {
        icon: Music,
        progressIcon: MusicOriginal,
        color: "var(--color-red)",
        slotText: "klonk er vrolijke muziek.",
        label: "muziek",
        text: "Op een dag,",
      },
    ],
  },
  {
    type: "with",
    shape: "hexagon",
    chosenIconSize: "h-16.5 mt-1.5",
    options: [
      {
        icon: FlyingBike,
        progressIcon: FlyingBikeOriginal,
        color: "var(--color-red)",
        slotText: "een vliegende fiets",
        label: "Vliegende Fiets",
        text: "Gelukkig, was er",
      },
      {
        icon: Lantern,
        progressIcon: LanternOriginal,
        color: "var(--color-red)",
        slotText: "een stralende lantaarn",
        label: "Lantaarn",
        text: "Gelukkig, was er",
      },
      {
        icon: SpellBook,
        progressIcon: SpellBookOriginal,
        color: "var(--color-blue)",
        slotText: "een magisch toverboek",
        label: "Toverboek",
        text: "Gelukkig, was er",
      },
      {
        icon: Umbrella,
        progressIcon: UmbrellaOriginal,
        color: "var(--color-blue)",
        slotText: "een grote paraplu",
        label: "Paraplu",
        text: "Gelukkig, was er",
      },
      {
        icon: Key,
        progressIcon: KeyOriginal,
        color: "var(--color-green)",
        slotText: "een gouden sleutel",
        label: "Sleutel",
        text: "Gelukkig, was er",
      },
      {
        icon: Map,
        progressIcon: MapOriginal,
        color: "var(--color-green)",
        slotText: "een schatkaart",
        label: "Kaart",
        text: "Gelukkig, was er",
      },
    ],
  },
  {
    type: "ending",
    shape: "long-rectangle",
    chosenIconSize: "h-17",
    options: [
      {
        icon: Stars,
        progressIcon: StarsOriginal,
        color: "var(--color-blue)",
        slotText: "en werd het feest tot diep in de nacht.",
        label: "Feest",
        text: "En toen kwam jij,",
      },
      {
        icon: Sleep,
        progressIcon: SleepOriginal,
        color: "var(--color-blue)",
        slotText: "en viel iedereen heerlijk in slaap.",
        label: "Slapen",
        text: "En toen kwam jij,",
      },
      {
        icon: Home,
        progressIcon: HomeOriginal,
        color: "var(--color-green)",
        slotText: "en keerde iedereen veilig naar huis.",
        label: "Thuis",
        text: "En toen kwam jij,",
      },
      {
        icon: QuestionMarks,
        progressIcon: QuestionMarksOriginal,
        color: "var(--color-green)",
        slotText: "en begon een nieuw mysterie.",
        label: "Vraagtekens",
        text: "En toen kwam jij,",
      },
      {
        icon: Hearts,
        progressIcon: HeartsOriginal,
        color: "var(--color-red)",
        slotText: "en leefde iedereen nog lang en gelukkig.",
        label: "Harten",
        text: "En toen kwam jij,",
      },
      {
        icon: Pen,
        progressIcon: PenOriginal,
        color: "var(--color-red)",
        slotText: "en werd het verhaal verder geschreven.",
        label: "Pen",
        text: "En toen kwam jij,",
      },
    ],
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

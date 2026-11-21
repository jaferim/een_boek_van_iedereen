import { useId } from "react";
import { useGSAP } from "@gsap/react";
import LineDivider from "./svgs/LineDivider";
import storyData from "../utils/data";

export const BookSpreadHtml = ({ side, opacity = 1 }) => {
  useGSAP(() => {});

  const sharedStyle = {
    width: "800px",
    height: "1136px",
    opacity,
    transition: "opacity 120ms linear",
    pointerEvents: "none",
  };

  if (side === "left") {
    return (
      <article
        style={{ width: sharedStyle.width, height: sharedStyle.height }}
        className="left-page-container"
      >
        <header className="annotation-wrapper">
          <LineDivider strokeColor={"stroke-gray"} />
          <h1 className="book-annotation">Eeen Drak in een Donker Bos</h1>
          <LineDivider strokeColor={"stroke-gray"} />
        </header>
        <article className="h-3/4 flex flex-col gap-6">
          {/* {storyData
            .filter(({ icon }) => icon)
            .map(({ type, icon: Icon, chosenIconSize, slotText, text }) => (
              <PageRow
                key={type}
                icon={
                  <Icon
                    fillColor={"fill-bg"}
                    innerColor={"fill-gray-dark"}
                    strokeColor={"stroke-gray-dark"}
                  />
                }
                type={type}
                slotText={slotText}
                text={text}
                iconSize={chosenIconSize}
              />
            ))} */}
          <ActiveSlot />
        </article>
        <footer className="annotation-wrapper">
          <h2 className="book-annotation">Het Boek van iedereen</h2>
          <LineDivider strokeColor={"stroke-gray"} />
          <h2 className="book-annotation">128</h2>
        </footer>
      </article>
    );
  }

  return <article></article>;
};

const PageRow = ({ icon, text, slotText, iconSize, type }) => {
  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex gap-3 items-center flex-wrap">
        <p className="filled-row-p shrink-0">{text}</p>
        <Slot icon={icon} type={type} slotText={slotText} iconSize={iconSize} />
      </div>
      <LineDivider strokeColor={"stroke-gray-dark"} />
    </div>
  );
};

const Slot = ({ icon, slotText, iconSize, type }) => {
  return (
    <div className="flex gap-2 items-center shrink-0">
      <div
        className={`${iconSize} aspect-square ${type === "ending" ? "flex items-center" : ""} relative z-1`}
      >
        {icon}
      </div>
      <div className="slot-border inline-block -ml-12 pl-6.5 relative z-0">
        <p className="filled-row-p">{slotText}</p>
      </div>
    </div>
  );
};

const ActiveSlot = () => {
  const clipId = useId();

  return (
    <div className="flex flex-col gap-5">
      <svg width="0" height="0" aria-hidden="true" className="absolute">
        <defs>
          <clipPath id={clipId} clipPathUnits="objectBoundingBox">
            <path d="M 0.00343 0.83026 C 0.00308 0.74795 0.00335 0.66565 0.00425 0.58335 C 0.00516 0.50104 0.00519 0.41874 0.00436 0.33643 C 0.00353 0.25413 0.00490 0.18180 0.00847 0.11945 C 0.01203 0.05711 0.01929 0.02844 0.03024 0.03344 C 0.04119 0.03845 0.05213 0.04106 0.06308 0.04128 C 0.07403 0.04151 0.08497 0.03931 0.09592 0.03468 C 0.10687 0.03006 0.11781 0.02866 0.12876 0.03047 C 0.13971 0.03229 0.15066 0.03700 0.16160 0.04462 C 0.17255 0.05224 0.18350 0.05076 0.19444 0.04018 C 0.20539 0.02960 0.21634 0.02601 0.22728 0.02942 C 0.23823 0.03283 0.24918 0.03243 0.26012 0.02822 C 0.27107 0.02401 0.28202 0.02583 0.29297 0.03369 C 0.30391 0.04155 0.31486 0.04442 0.32581 0.04231 C 0.33675 0.04020 0.34770 0.03810 0.35865 0.03603 C 0.36959 0.03395 0.38054 0.03092 0.39149 0.02692 C 0.40244 0.02292 0.41338 0.02661 0.42433 0.03800 C 0.43528 0.04939 0.44622 0.04943 0.45717 0.03813 C 0.46812 0.02683 0.47906 0.02421 0.49001 0.03028 C 0.50096 0.03635 0.51190 0.03764 0.52285 0.03417 C 0.53380 0.03069 0.54474 0.03356 0.55569 0.04278 C 0.56664 0.05199 0.57758 0.05063 0.58853 0.03868 C 0.59948 0.02673 0.61043 0.02244 0.62137 0.02580 C 0.63232 0.02916 0.64327 0.03153 0.65421 0.03292 C 0.66516 0.03430 0.67611 0.03446 0.68705 0.03339 C 0.69800 0.03232 0.70895 0.03578 0.71989 0.04378 C 0.73084 0.05178 0.74179 0.05284 0.75274 0.04696 C 0.76368 0.04107 0.77463 0.03788 0.78558 0.03739 C 0.79652 0.03690 0.80747 0.04030 0.81842 0.04759 C 0.82936 0.05488 0.84031 0.05368 0.85126 0.04401 C 0.86221 0.03433 0.87315 0.03107 0.88410 0.03422 C 0.89505 0.03738 0.90599 0.04079 0.91694 0.04447 C 0.92789 0.04814 0.93883 0.04738 0.94978 0.04217 C 0.96073 0.03697 0.97167 0.03415 0.98262 0.03372 C 0.99357 0.03328 0.99446 0.05245 0.98531 0.09123 C 0.97615 0.13000 0.96732 0.17592 0.95881 0.22899 C 0.95030 0.28205 0.94101 0.32564 0.93095 0.35976 C 0.92089 0.39388 0.91543 0.43570 0.91457 0.48521 C 0.91371 0.53473 0.91838 0.57520 0.92858 0.60664 C 0.93878 0.63807 0.94866 0.67390 0.95821 0.71411 C 0.96776 0.75433 0.97701 0.79856 0.98597 0.84679 C 0.99493 0.89503 0.99778 0.92498 0.99453 0.93664 C 0.99128 0.94830 0.98418 0.95430 0.97323 0.95464 C 0.96228 0.95499 0.95134 0.95428 0.94039 0.95253 C 0.92944 0.95077 0.91850 0.94922 0.90755 0.94787 C 0.89660 0.94652 0.88566 0.94476 0.87471 0.94259 C 0.86376 0.94041 0.85282 0.94362 0.84187 0.95220 C 0.83092 0.96079 0.81998 0.96350 0.80903 0.96034 C 0.79808 0.95719 0.78713 0.95821 0.77619 0.96342 C 0.76524 0.96863 0.75429 0.96754 0.74335 0.96015 C 0.73240 0.95276 0.72145 0.94998 0.71051 0.95181 C 0.69956 0.95365 0.68861 0.95462 0.67767 0.95474 C 0.66672 0.95486 0.65577 0.95650 0.64482 0.95967 C 0.63388 0.96283 0.62293 0.96378 0.61198 0.96253 C 0.60104 0.96127 0.59009 0.95998 0.57914 0.95865 C 0.56820 0.95732 0.55725 0.95628 0.54630 0.95552 C 0.53535 0.95475 0.52441 0.95549 0.51346 0.95772 C 0.50251 0.95996 0.49157 0.96213 0.48062 0.96424 C 0.46967 0.96634 0.45873 0.96718 0.44778 0.96675 C 0.43683 0.96632 0.42589 0.96551 0.41494 0.96432 C 0.40399 0.96312 0.39305 0.95882 0.38210 0.95140 C 0.37115 0.94398 0.36021 0.94105 0.34926 0.94260 C 0.33831 0.94416 0.32736 0.94826 0.31642 0.95491 C 0.30547 0.96156 0.29452 0.96493 0.28358 0.96504 C 0.27263 0.96515 0.26168 0.96292 0.25074 0.95836 C 0.23979 0.95380 0.22884 0.95054 0.21789 0.94860 C 0.20695 0.94665 0.19600 0.94512 0.18505 0.94402 C 0.17411 0.94291 0.16316 0.94175 0.15221 0.94055 C 0.14127 0.93935 0.13032 0.93987 0.11937 0.94211 C 0.10843 0.94436 0.09748 0.94505 0.08653 0.94420 C 0.07559 0.94334 0.06464 0.94152 0.05369 0.93874 C 0.04274 0.93595 0.03180 0.93834 0.02085 0.94590 C 0.00990 0.95347 0.00435 0.95666 0.00420 0.95548 C 0.00404 0.95430 0.00379 0.91256 0.00343 0.83026 Z" />
          </clipPath>
        </defs>
      </svg>
      <p className="active-row-p">Er was eens...</p>
      <div className="flex items-center">
        <div className="shrink-0 aspect-square w-22 border-3 border-red flex items-center justify-center rounded-lg">
          <p className="text-lg font-bold text-red">10</p>
        </div>
        <div
          className="bg-red w-full flex items-center justify-center"
          style={{ clipPath: `url(#${clipId})` }}
        >
          <p className="text-bg text-lg">...</p>
        </div>
      </div>
    </div>
  );
};

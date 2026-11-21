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
          {storyData
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
            ))}
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

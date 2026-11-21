import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import LineDivider from "./svgs/LineDivider";
import Dragon from "./svgs/Dragon";

export const BookSpreadHtml = ({ side, opacity = 1, replayKey = 0 }) => {
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
        <article className="h-3/4">
          <PageRow
            icon={
              <Dragon
                fillColor={"fill-gray-dark"}
                innerColor={"fill-bg"}
                strokeColor={"stroke-bg"}
              />
            }
            slotText={"een draak"}
            text={"Er was eens"}
          />
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

const PageRow = ({ icon, text, slotText }) => {
  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex gap-4 items-center">
        <p className="filled-row-p">{text}</p>
        <Slot icon={icon} slotText={slotText} />
      </div>
      <LineDivider strokeColor={"stroke-gray-dark"} />
    </div>
  );
};

const Slot = ({ icon, slotText }) => {
  return (
    <div className="flex gap-2 items-center">
      <div className="w-16 aspect-square relative z-1">{icon}</div>
      <div className="slot-border inline-block -ml-6 relative z-0">
        <p className="filled-row-p">{slotText}</p>
      </div>
    </div>
  );
};

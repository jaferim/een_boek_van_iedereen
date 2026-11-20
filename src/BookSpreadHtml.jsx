import gsap from "gsap";
import { useEffect, useRef } from "react";

/**
 * Simple HTML/Tailwind + GSAP spread layout rendered via drei's <Html transform>.
 * Sized at 800x1136 (1 : 1.42) to match PAGE_WIDTH x PAGE_HEIGHT at distanceFactor={0.5}.
 */
export const BookSpreadHtml = ({
  side,
  chapterTitle = "Hoofdstuk I",
  opacity = 1,
  replayKey = 0,
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      tl.fromTo(
        ".anim-heading",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
      )
        .fromTo(
          ".anim-text",
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 },
          "-=0.3",
        )
        .fromTo(
          ".anim-bar",
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.8,
            stagger: 0.12,
            transformOrigin: "left center",
          },
          "-=0.3",
        );
    }, containerRef);

    return () => ctx.revert();
  }, [side, replayKey]);

  const sharedStyle = {
    width: "800px",
    height: "1136px",
    fontFamily: '"AVEstiana", Georgia, serif',
    opacity,
    transition: "opacity 120ms linear",
    pointerEvents: "none",
  };

  if (side === "left") {
    return (
      <article
        ref={containerRef}
        style={sharedStyle}
        className="flex flex-col justify-between p-16 text-stone-900 select-none"
      >
        <div>
          <h1 className="anim-heading text-7xl font-bold leading-tight text-stone-950">
            {chapterTitle || "Hoofdstuk I"}
          </h1>
          <div className="anim-bar w-24 h-1 bg-stone-900 my-8" />

          <p className="anim-text text-2xl leading-relaxed text-stone-800">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris.
          </p>

          <p className="anim-text mt-6 text-2xl leading-relaxed text-stone-800">
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident.
          </p>
        </div>

        <footer className="text-base font-bold text-stone-700 text-right">
          22
        </footer>
      </article>
    );
  }

  return (
    <article
      ref={containerRef}
      style={sharedStyle}
      className="flex flex-col justify-between p-16 text-stone-900 select-none"
    >
      <div>
        <h2 className="anim-heading text-5xl font-bold leading-tight text-stone-950">
          Sectie II
        </h2>
        <div className="anim-bar w-20 h-1 bg-stone-900 my-8" />

        <p className="anim-text text-2xl leading-relaxed text-stone-800">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec
          odio. Praesent libero. Sed cursus ante dapibus diam.
        </p>

        {/* Simple GSAP-animated bars */}
        <div className="mt-12 space-y-5">
          <div className="h-3 w-full rounded-full bg-stone-900/15 overflow-hidden">
            <div className="anim-bar h-full w-4/5 rounded-full bg-stone-900" />
          </div>
          <div className="h-3 w-full rounded-full bg-stone-900/15 overflow-hidden">
            <div className="anim-bar h-full w-3/5 rounded-full bg-amber-700" />
          </div>
          <div className="h-3 w-full rounded-full bg-stone-900/15 overflow-hidden">
            <div className="anim-bar h-full w-2/3 rounded-full bg-stone-700" />
          </div>
        </div>

        <p className="anim-text mt-12 text-2xl leading-relaxed text-stone-800">
          Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis
          ipsum. Praesent mauris.
        </p>
      </div>

      <footer className="text-base font-bold text-stone-700">23</footer>
    </article>
  );
};

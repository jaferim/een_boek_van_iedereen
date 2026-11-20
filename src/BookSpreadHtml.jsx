import gsap from "gsap";
import { useEffect, useRef } from "react";

/**
 * Real HTML/Tailwind + GSAP spread pages rendered inside drei's <Html transform>.
 * Sized at 800x1136 (1 : 1.42 ratio) to match PAGE_WIDTH x PAGE_HEIGHT at distanceFactor={0.5}.
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

      if (side === "left") {
        tl.fromTo(
          ".anim-title",
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 },
        )
          .fromTo(
            ".anim-rule",
            { scaleX: 0 },
            { scaleX: 1, duration: 0.5, transformOrigin: "left center" },
            "-=0.4",
          )
          .fromTo(
            ".anim-body",
            { y: 16, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, stagger: 0.12 },
            "-=0.3",
          )
          .fromTo(
            ".anim-highlight",
            { scaleX: 0 },
            { scaleX: 1, duration: 0.9, transformOrigin: "left center" },
            "-=0.2",
          );
      } else {
        tl.fromTo(
          ".anim-body",
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.65, stagger: 0.12 },
        )
          .fromTo(
            ".anim-card",
            { y: 28, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
            "-=0.35",
          )
          .fromTo(
            ".anim-tile",
            { y: 18, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 },
            "-=0.4",
          )
          .fromTo(
            ".anim-progress",
            { scaleX: 0 },
            {
              scaleX: 0.78,
              duration: 1.0,
              ease: "power2.inOut",
              transformOrigin: "left center",
            },
            "-=0.3",
          );
      }
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
          <header className="flex items-center justify-between border-b border-stone-900/20 pb-4 text-xs tracking-[0.25em] uppercase text-stone-600">
            <span>Een Boek van Iedereen</span>
            <span>Deel Een</span>
          </header>

          <div className="mt-20">
            <p className="anim-title text-xs font-bold tracking-[0.3em] uppercase text-amber-800/90 mb-3">
              Eerste Verhaal
            </p>
            <h1 className="anim-title text-7xl font-bold leading-tight tracking-tight text-stone-950">
              {chapterTitle || "Hoofdstuk I"}
            </h1>
            <div className="anim-rule w-20 h-0.5 bg-stone-900/50 my-9" />
          </div>

          <p className="anim-body text-2xl leading-relaxed text-stone-800">
            <span className="float-left mr-3 mt-1 text-7xl font-bold leading-none text-stone-950">
              I
            </span>
            n het midden van een stil plein, waar het ochtendlicht langs de
            oude gevels gleed, lag een opengeslagen boek te wachten op iemand
            die de bladzijden verder zou omslaan. Elke regel droeg het spoor van
            een andere hand.
          </p>

          <blockquote className="anim-body relative mt-8 text-2xl leading-relaxed italic text-stone-900">
            <span className="relative inline-block">
              <span className="anim-highlight absolute inset-0 -mx-1.5 bg-amber-400/30 rounded-sm" />
              <span className="relative">
                “Zelfs een digitaal vel papier komt pas tot leven zodra het
                licht er overheen strijkt en elke bladzijde zijn verhaal deelt.”
              </span>
            </span>
          </blockquote>
        </div>

        <footer className="flex justify-between items-center pt-6 border-t border-stone-900/15 text-base text-stone-600">
          <span>Amsterdam • 2026</span>
          <span className="font-bold text-stone-900">22</span>
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
        <header className="flex items-center justify-between border-b border-stone-900/20 pb-4 text-xs tracking-[0.25em] uppercase text-stone-600">
          <span>{chapterTitle || "Hoofdstuk I"}</span>
          <span>Live HTML + GSAP</span>
        </header>

        <p className="anim-body mt-14 text-2xl leading-relaxed text-stone-800">
          Deze bladzijde is echte{" "}
          <strong className="font-bold">HTML &amp; Tailwind</strong> via{" "}
          <code className="px-1.5 py-0.5 rounded bg-stone-900/10 text-lg font-mono">
            &lt;Html transform&gt;
          </code>
          , rechtstreeks geanimeerd met GSAP over het 3D-papier.
        </p>

        <div className="anim-card my-10 p-7 rounded-xl border border-stone-900/20 bg-stone-900/5">
          <div className="text-xs font-bold tracking-[0.25em] uppercase text-stone-500">
            Live HTML Spread • GSAP
          </div>

          <div className="grid grid-cols-3 gap-4 text-center mt-5">
            <div className="anim-tile p-4 rounded-lg bg-stone-900 text-stone-100">
              <div className="text-3xl font-bold">DOM</div>
              <div className="text-xs uppercase tracking-wider opacity-75 mt-1">
                Tailwind
              </div>
            </div>
            <div className="anim-tile p-4 rounded-lg border border-stone-900/25">
              <div className="text-3xl font-bold">GSAP</div>
              <div className="text-xs uppercase tracking-wider text-stone-600 mt-1">
                60fps
              </div>
            </div>
            <div className="anim-tile p-4 rounded-lg border border-stone-900/25">
              <div className="text-3xl font-bold">1:1.42</div>
              <div className="text-xs uppercase tracking-wider text-stone-600 mt-1">
                Ratio
              </div>
            </div>
          </div>

          <div className="mt-7">
            <div className="flex justify-between text-sm text-stone-700 mb-2">
              <span>Leesvoortgang</span>
              <span className="font-bold">78%</span>
            </div>
            <div className="h-3 w-full rounded-full bg-stone-900/15 overflow-hidden">
              <div className="anim-progress h-full w-full rounded-full bg-amber-700" />
            </div>
          </div>
        </div>

        <p className="anim-body text-2xl leading-relaxed text-stone-800">
          Omdat de twee leespagina’s vlak liggen bij{" "}
          <strong className="font-bold">Open = 1</strong>, sluit de HTML-laag
          strak aan en vervaagt deze zodra het boek dichtklapt.
        </p>
      </div>

      <footer className="flex justify-between items-center pt-6 border-t border-stone-900/15 text-base text-stone-600">
        <span className="font-bold text-stone-900">23</span>
        <span>Leesstand</span>
      </footer>
    </article>
  );
};

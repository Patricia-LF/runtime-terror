"use client";

import Image from "next/image";
import { useState } from "react";
import type { CSSProperties } from "react";
import SpiderAnimation from "@/components/effects/SpiderAnimation";
import DoorTransition from "@/components/shared/DoorTransition";
import SpiderDrop from "@/components/effects/SpiderDrop";
import GhostLoop from "@/components/effects/GhostLoop";

type SpiderStyle = CSSProperties & {
  "--spider-duration": string;
  "--spider-duration-medium": string;
  "--spider-duration-large": string;
  "--spider-delay": string;
  "--spider-start-x"?: string;
  "--spider-end-x"?: string;
  "--spider-scale"?: string;
};

export default function Spiders() {
  const spiderwebs = [
    {
      id: 1,
      src: "/assets/images/spiderWeb3.png",
      className: "top-0 right-0 z-20",
    },
    {
      id: 2,
      src: "/assets/images/spiderWeb2.png",
      className: "bottom-0 left-0 z-30",
    },
    {
      id: 3,
      src: "/assets/images/spiderWeb1.png",
      className: "bottom-0 right-0 z-40",
    },
  ];

  const spiders = [
    // Each spider can control start position (top/left), movement start offset (enter-from side), speed and visual scale
    { id: 1, style: { top: "20%", left: "30%", duration: "2s", durationMedium: "3s", durationLarge: "5s", delay: "0s",  startX: "0vw", endX: "-120vw", scale: "0.6" } },
    { id: 2, style: { top: "50%", left: "20%", duration: "3s", durationMedium: "5s", durationLarge: "7s", delay: "0.6s", startX: "-15vw", endX: "-120vw", scale: "0.6" } },
    { id: 3, style: { top: "35%", left: "60%", duration: "4s", durationMedium: "5s", durationLarge: "10s", delay: "0.2s", startX: "20vw", endX: "120vw", scale: "0.8" } },
  ];

  const [visibleWebs, setVisibleWebs] = useState<number[]>([1, 2, 3]);

  const removeWeb = (id: number) => {
    setVisibleWebs((prev) => prev.filter((w) => w !== id));
  };

  const allWebsRemoved = visibleWebs.length === 0;

  const [hasClickedWeb, setHasClickedWeb] = useState<boolean>(false);

  const [hasClickedGhost, setHasClickedGhost] = useState<boolean>(false);

  return (
    <div className="absolute inset-0 bg-[url('/assets/images/eerie-hospital.png')] bg-cover bg-bottom">
      <GhostLoop onGhostClick={() => setHasClickedGhost(true)} />

      {hasClickedGhost && (
        <DoorTransition
          buttonText="This way"
          doorImage=""
          animated={false}
          positionClass="bottom-1/3 right-15"
        />
      )}
      {spiderwebs.map((web) =>
        visibleWebs.includes(web.id) ? (
          <div
            key={web.id}
            className={`
            absolute
            w-[80vh] h-[80vh]
            lg:w-[70vw] lg:h-[70vw]
            ${web.className}`}
          >
            <Image
              src={web.src}
              alt="Spider web"
              width={800}
              height={800}
              className="pointer-events-none h-full w-auto"
            />

            <button
              aria-label="Remove spider web"
              onClick={() => {
                setHasClickedWeb(true);
                removeWeb(web.id);
              }}
              className="absolute top-[20%] left-[20%] h-120 w-120 cursor-pointer"
            />
          </div>
        ) : null,
      )}
        {spiders.map((spider) => {
          const spiderStyle: SpiderStyle = {
            top: spider.style.top,
            left: spider.style.left,
            "--spider-duration": spider.style.duration,
            "--spider-duration-medium": spider.style.durationMedium,
            "--spider-duration-large": spider.style.durationLarge,
            "--spider-delay": spider.style.delay,
            "--spider-start-x": spider.style.startX,
            "--spider-end-x": spider.style.endX,
            "--spider-scale": spider.style.scale,
          };

          return (
          <SpiderAnimation
            key={spider.id}
            isActive={hasClickedWeb}
            style={spiderStyle}
          />
        );})}
      <SpiderDrop allWebsRemoved={allWebsRemoved} />
    </div>
  );
}

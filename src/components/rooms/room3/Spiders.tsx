"use client";

import Image from "next/image";
import { useState } from "react";
import SpiderAnimation from "@/components/effects/SpiderAnimation";
import DoorTransition from "@/components/shared/DoorTransition";
import SpiderDrop from "@/components/effects/SpiderDrop";
import GhostLoop from "@/components/effects/GhostLoop";

export default function Spiders() {
  const spiderwebs = [
    {
      id: 1,
      src: "/assets/images/spiderWeb3.png",
      className: "top-0 right-0",
    },
    {
      id: 2,
      src: "/assets/images/spiderWeb2.png",
      className: "bottom-0 left-0 ",
    },
    {
      id: 3,
      src: "/assets/images/spiderWeb1.png",
      className: "bottom-0 right-0",
    },
  ];

      const spiders = [
        { id: 1, style: { top: "10%", left: "30%" } },
        { id: 2, style: { top: "20%", left: "60%" } },
        { id: 3, style: { top: "50%", left: "40%" } },
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
            absolute z-40
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
      {spiders.map((spider) => (
          <SpiderAnimation
          key={spider.id}
          style={{ top: spider.style.top, left: spider.style.left }}
          isActive={hasClickedWeb}
          />
      ))}
      <SpiderDrop allWebsRemoved={allWebsRemoved} />
    </div>
  );
}

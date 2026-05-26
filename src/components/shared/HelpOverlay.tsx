"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function HelpOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const isTivoliMode = process.env.NEXT_PUBLIC_TIVOLI_MODE === "true";

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === "Escape") setIsOpen(false);
    };

    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Help button */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Help"
        className="absolute top-0 right-0 w-11 h-11 px-5 rounded-full border border-grey text-grey text-xl font-fell flex items-center justify-center cursor-pointer z-50"
      >
        ?
      </button>

      {/* Overlay */}
      {/* Uses AnimatePresence to wait for exit animation to finish before unmounting */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 bg-black/80 flex items-start md:items-center justify-center p-8 pt-22 md:pt-8"
            role="dialog"
            aria-modal="true"
            aria-labelledby="help-title"
          >
            <div className="relative max-w-md w-full bg-brown-dark border border-grey p-8 rounded max-h-[80vh] overflow-y-auto">
              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close help"
                className="absolute top-0 right-0 p-4 text-grey text-xl font-fell cursor-pointer"
              >
                ✕
              </button>

              <h2
                id="help-title"
                className="font-glitch text-grey text-xl mb-4"
              >
                How to play
              </h2>
              <div className="flex flex-col gap-3">
                {isTivoliMode ? (
                  <div className="flex flex-col gap-3">
                    <p className="font-fell text-grey">
                      If you don't want to enter the house, click on the Back to
                      Loopland button up to the left.
                    </p>
                    <p className="font-fell text-grey">
                      Click on the Pay Entry Fee button to use your token to
                      enter the haunted house.
                    </p>
                    <p className="font-fell text-grey">
                      You will get your stamp at the end before you leave
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <p className="font-fell text-grey">
                      Click on the Enter if you dare button to enter the haunted
                      house.
                    </p>
                  </div>
                )}
                <div className="flex flex-col gap-3">
                  <p className="font-fell text-grey">
                    Make your way through each room by following the
                    instructions.
                  </p>

                  <p className="font-fell text-grey">
                    Click on objects to interact with them and to unlock the
                    doors.
                  </p>

                  <p className="font-fell text-grey">
                    If you can't handle the horror you can always leave by
                    clicking on the exit button at the bottom of the page.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

"use client";

import Link from "next/link";
import { ModalBase } from "./ModalBase";

type UnauthorizedModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function UnauthorizedModal({ isOpen, onClose }: UnauthorizedModalProps) {
  return (
    <ModalBase isOpen={isOpen} onClose={onClose} ariaLabelledBy="unauthorized-title">
      <h2
        id="unauthorized-title"
        className="font-glitch text-grey text-xl mb-4"
      >
        Payment not authorized
      </h2>
      <div className="flex flex-col gap-3">
        <p className="font-fell text-grey">
          Your identity token is expired or invalid. Please return to the main tivoli site and try again.
        </p>
      </div>
      <Link
        href="https://frontend-main-1ac7.up.railway.app/"
        className="mt-6 font-fell bg-red-dark text-white px-4 py-2 inline-block cursor-pointer rounded border border-white focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4"
      >
        Return to tivoli
      </Link>
    </ModalBase>
  );
}



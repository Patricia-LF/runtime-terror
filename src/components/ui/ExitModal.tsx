import Link from "next/link";
import { ModalBase } from "../shared/ModalBase";
import { LinkButton } from "../shared/LinkButton";

type ExitModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export function ExitModal({ isOpen, onClose }: ExitModalProps) {
    return (
        <ModalBase 
        isOpen={isOpen} 
        onClose={onClose}
        >
                <h2 className="font-eater text-red-800 text-2xl mb-4">Exit Runtime Terror</h2>
                <p className="text-white font-fell mb-4">Are you sure you want to exit the haunted house? You will not be able to re-enter once you exit.</p>
                <div className="flex justify-evenly">
                    <LinkButton
                        href="/haunted-house"
                        linkText="Cancel"
                        ariaLabel="Cancel exit and return to the haunted house"
                        onClick={onClose}
                        />
                    <LinkButton 
                        href="/haunted-house/end"
                        linkText="Exit"
                        ariaLabel="Exit the haunted house"
                        onClick={onClose}
                    />
                </div>
        </ModalBase>
    );
}
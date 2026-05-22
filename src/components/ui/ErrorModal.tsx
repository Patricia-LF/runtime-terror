import { ModalBase } from "../shared/ModalBase";
import { CloseTivoliButton } from "../shared/CloseTivoliButton";

type ErrorModalProps = {
    message: string;
    isOpen: boolean;
    onClose: () => void;
};

export function ErrorModal({ message, isOpen, onClose }: ErrorModalProps) {
    return (
        <ModalBase isOpen={isOpen} onClose={onClose}>
            <h2 className="font-glitch text-grey text-xl mb-4">Error</h2>
            <p className="font-fell text-grey">{message}</p>
            <div>
                <button
                    onClick={onClose}
                    className="mt-4 border border-white rounded px-4 py-2 min-h-11 min-w-11 w-full text-white cursor-pointer bg-red-dark transition focus:ring-2 focus:ring-red-dark focus:outline-none md:bg-transparent hover:bg-red-dark"
                >
                    Close
                </button>
                <CloseTivoliButton />
            </div>
        </ModalBase>
    );
}

import { AnimatePresence, motion } from "framer-motion";

type ModalBaseProps = {
    ariaLabelledBy?: string;
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
};

export function ModalBase({ children, isOpen, onClose, ariaLabelledBy }: ModalBaseProps) {

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-8"
                role="dialog"
                aria-modal="true"
                aria-labelledby={ariaLabelledBy}
                >
                <div className="relative max-w-md w-full bg-brown-dark border border-grey p-8 rounded">
                    <button
                    onClick={onClose}
                    aria-label="Close modal"
                    className="absolute top-4 right-4 text-grey hover:text-white transition"
                    >
                    ✕
                    </button>

                    {children}

                </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
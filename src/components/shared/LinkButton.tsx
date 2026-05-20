import Link from "next/link";

type LinkButtonProps = {
    href: string;
    linkText: string;
    onClick?: () => void;

    ariaLabel?: string;
    ariaDescribedBy?: string;

};

export function LinkButton({ href, linkText, onClick, ariaLabel, ariaDescribedBy }: LinkButtonProps) {
    return (
        <Link 
        href={href} 
        onClick={onClick}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        className="mt-6 font-fell bg-red-dark text-white px-4 py-2 inline-block cursor-pointer rounded border border-white focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4">
            {linkText}
        </Link>
    )
}
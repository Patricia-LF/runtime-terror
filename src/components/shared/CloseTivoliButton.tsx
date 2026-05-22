
export function CloseTivoliButton() {
    return (
        <button
        onClick={() =>
            window.parent.postMessage({ type: "AMUSEMENT_CLOSE" }, "")
        }
        className="mt-4 border border-white rounded px-4 py-2 min-h-11 min-w-11 w-full text-white cursor-pointer bg-red-dark transition focus:ring-2 focus:ring-red-dark focus:outline-none md:bg-transparent hover:bg-red-dark"
        >
        Back to Loopland
        </button>
    )
};
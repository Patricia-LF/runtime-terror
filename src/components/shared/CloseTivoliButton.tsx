
export function CloseTivoliButton() {
    return (
        <button
            onClick={() =>
            window.parent.postMessage({ type: "AMUSEMENT_CLOSE" }, "")
        }
        >
        Back to Loopland
        </button>
    )
};
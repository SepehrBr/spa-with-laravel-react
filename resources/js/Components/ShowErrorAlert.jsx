import { XMarkIcon } from "@heroicons/react/16/solid";

export default function ShowErrorAlert({ onClickHandler, error }) {
    return (
        <div className="relative w-1/2 place-self-center text-center bg-red-500 py-2 px-4 mb-4 text-white rounded">
            <span>{error}</span>
            <button
                onClick={onClickHandler}
                className="absolute top-1 right-2 text-white hover:text-gray-200"
            >
                <XMarkIcon className="w-5 h-5" />
            </button>
        </div>
    )
}

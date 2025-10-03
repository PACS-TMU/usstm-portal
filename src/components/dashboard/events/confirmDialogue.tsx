"use client";

import { useRef, useEffect } from "react";
import { FiAlertTriangle } from "react-icons/fi";

export default function ConfirmDialog({
    message,
    onConfirm,
}: {
    message: string;
    onConfirm: () => void;
}) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    const open = () => dialogRef.current?.showModal();
    const close = () => dialogRef.current?.close();

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        const handleClick = (event: MouseEvent) => {
            if (dialog.open && event.target === dialog) {
                close();
            }
        };

        dialog.addEventListener("click", handleClick);
        return () => {
            dialog.removeEventListener("click", handleClick);
        };
    }, []);

    return (
        <>
            <button
                onClick={open}
                className="bg-red-500 hover:bg-red-600 hover:cursor-pointer ease-in-out transition-colors duration-200 text-background px-3 py-1 rounded text-sm"
            >
                Delete
            </button>

            <dialog
                ref={dialogRef}
                className="rounded-lg p-0 backdrop:bg-black/50 w-[90vw] max-w-sm open:flex open:items-center open:justify-center m-auto"
            >
                <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-4">
                        <FiAlertTriangle className="text-red-500 w-5 h-5" />
                        <h3 className="font-semibold text-gray-800">
                            Confirm Delete
                        </h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                        {message}
                    </p>
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={close}
                            className="px-3 py-1 rounded text-sm border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 transition-colors duration-300 ease-in-out hover:cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                close();
                                onConfirm();
                            }}
                            className="px-3 py-1 rounded text-sm text-background bg-red-500 hover:bg-red-600 transition-colors duration-300 ease-in-out hover:cursor-pointer"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </dialog>
        </>
    );
}
